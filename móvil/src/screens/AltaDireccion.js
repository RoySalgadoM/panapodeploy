import { View, RefreshControl } from 'react-native'
import React, { useState, useEffect } from 'react'
import TableComponent from '../components/TableComponent'
import { Center, ScrollView, Input, Stack, FormControl, WarningOutlineIcon, Modal, Text, Button } from "native-base";
import BoxHeaderComponent from '../components/BoxHeaderComponent'
import ActionsButtons from '../components/ActionsButtons'
import ModalComponent from '../components/ModalComponent'
import AlertDialogComponent from '../components/AlertDialogComponent'
import AlertComponent from '../components/AlertComponent'
import { ipServer } from "../config/Config"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../components/Loading';
import * as yup from "yup";
import { useFormik } from "formik";
import { LogBox } from 'react-native';
import BoxHeaderComponentInit from '../components/BoxHeaderComponentInit';
export default function AltaDireccion() {
    const [showModal, setShowModal] = useState(false);
    const [showAlertDelete, setShowAlertDelete] = useState(false);
    const [isOpenAlertDelete, setisOpenAlertDelete] = useState(false)
    const [isOpenAlertRegister, setIsOpenAlertRegister] = useState(false)
    const [isOpenAlertModify, setIsOpenAlertModify] = useState(false)
    const [data, setData] = useState([])
    const [isLoadingTable, setisLoadingTable] = useState(true)
    const [object, setObject] = useState([])
    const [objectModify, setObjectModify] = useState([])
    const [isLoadingRegister, setIsLoadingRegister] = useState(false)
    const [isLoadingModify, setIsLoadingModify] = useState(false)
    const [errorModify, setErrorModify] = useState(false)
    const [equalsPassword, setEqualsPassword] = useState(false)
    LogBox.ignoreLogs(['Warning: ...']); //Hide warnings
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getAll()
        setRefreshing(false)
    }, []);
    const formikRegister = useFormik({
        initialValues: {
            name: "",
            surname: "",
            secondSurname: "",
            email: ""
        },
        validationSchema: yup.object().shape({
            email: yup.string().email('Ingresa un correo válido').required("Campo obligatorio"),
            name: yup.string().required("Campo obligatorio"),
            surname: yup.string().required("Campo obligatorio"),
            secondSurname: yup.string().required("Campo obligatorio")
        }),
        onSubmit: (values) => {
            setIsLoadingRegister(true)
            let registerData = {
                "password": values.email,
                "person": {
                    "name": values.name,
                    "surname": values.surname,
                    "secondSurname": values.secondSurname,
                    "email": values.email,
                    "profession": {
                        "id": 3,
                        "description": "Directivo"
                    },
                    "status": {
                        "id": 1,
                        "description": "Activo"
                    }
                },
                "authorities": [
                    {
                        "id": 1,
                        "description": "Directivo"
                    }
                ],
                "status": {
                    "id": 1,
                    "description": "Activo"
                }
            }
            fetch(`http://${ipServer}/api/user/`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    "Authorization": `Bearer${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),

            })
                .then((response) => response.json())
                .then(async (responseJson) => {
                    setObject([])
                    setIsOpenAlertRegister(true)
                    getAll()
                    formikRegister.resetForm();
                    setIsLoadingRegister(false)
                })
        },
    });

    const formikModify = useFormik({
        initialValues: {
            name: "",
            surname: "",
            secondSurname: "",
            password: "",
            confirmPassword: ""
        },
        validationSchema: yup.object().shape({
            name: yup.string().required("Campo obligatorio"),
            surname: yup.string().required("Campo obligatorio"),
            secondSurname: yup.string().required("Campo obligatorio")
        }),
        onSubmit: async (values) => {
            await getToken()
            let dataPerson = {
                ...objectModify,
                person: {
                    ...objectModify.person,
                    name: values.name,
                    surname: values.surname,
                    secondSurname: values.secondSurname
                }
            }
            setObjectModify(dataPerson)
            if (values.password != "" && values.confirmPassword != "") {
                if (values.password === values.confirmPassword) {
                    setEqualsPassword(false)
                    setIsLoadingModify(true)
                    setErrorModify(false)
                    setShowModal(false)

                    let data = {
                        ...dataPerson,
                        password: values.password
                    }
                    fetch(`http://${ipServer}/api/user/update`, {
                        method: 'PUT',
                        headers: {
                            Accept: 'application/json',
                            "Authorization": `Bearer${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),

                    })
                        .then((response) => response.json())
                        .then(async (responseJson) => {
                            setObjectModify([])
                            setIsOpenAlertModify(true)
                            getAll()
                            setIsLoadingModify(false)
                            formikModify.resetForm()
                        })

                    fetch(`http://${ipServer}/api/person/`, {
                        method: 'PUT',
                        headers: {
                            Accept: 'application/json',
                            "Authorization": `Bearer${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(dataPerson.person),

                    })
                        .then((response) => response.json())
                        .then(async (responseJson) => {
                            setObjectModify([])
                            setIsOpenAlertModify(true)
                            getAll()
                            setIsLoadingModify(false)
                        })
                    setIsLoadingModify(false)
                } else {
                    setEqualsPassword(true)
                }


            } else {
                setIsLoadingModify(true)
                setEqualsPassword(false)
                setErrorModify(false)
                setShowModal(false)
                fetch(`http://${ipServer}/api/person/`, {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        "Authorization": `Bearer${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataPerson.person),

                })
                    .then((response) => response.json())
                    .then(async (responseJson) => {
                        setObjectModify([])
                        setIsOpenAlertModify(true)
                        getAll()
                        setIsLoadingModify(false)
                    })
            }
        }
    });

    let token = ""
    const onDelete = () => {
        fetch(`http://${ipServer}/api/user/` + object.id, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                "Authorization": `Bearer${token}`,
                'Content-Type': 'application/json',
            },

        })
            .then((response) => response.json())
            .then(async (responseJson) => {
                setObject([])
                setisOpenAlertDelete(true)
                getAll()
                setIsLoadingModify(false)
            })
        setIsLoadingModify(false)
    }



    const getToken = async () => {
        try {
            token = await AsyncStorage.getItem('token')

        } catch (e) {
            console.log(e)
            // error reading value
        }
    }

    const getAll = async () => {
        setisLoadingTable(true);
        await getToken()

        fetch(`http://${ipServer}/api/user/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer${token}`
            }
        })
            .then(async (response) => await response.json(response))
            .then(async (responseJson) => {
                let tempData = []
                let cont=0;
                for (let i = 0; i < responseJson.data.length; i++) {
                    for (let r = 0; r < responseJson.data[i].authorities.length; r++) {
                        if (responseJson.data[i].authorities[r].description === "Directivo") {
                            cont++;
                            let newData = [
                                cont, `${responseJson.data[i].person.name} ${responseJson.data[i].person.surname} ${responseJson.data[i].person.secondSurname}`, responseJson.data[i].person.email
                                , <ActionsButtons action={() => {
                                    setShowModal(true)
                                    setObjectModify(responseJson.data[i])
                                    formikModify.resetForm
                                    formikModify.values.name = responseJson.data[i].person.name
                                    formikModify.values.surname = responseJson.data[i].person.surname
                                    formikModify.values.secondSurname = responseJson.data[i].person.secondSurname
                                    formikModify.handleChange
                                }} name={"edit"} color={"black"} bgColor={"#ffc107"} />, <ActionsButtons name={"trash"} action={() => {
                                    setShowAlertDelete(true)
                                    setObject({
                                        "id": responseJson.data[i].id
                                    })
                                }} color={"white"} bgColor={"#dc3545"} />
                            ];
                            await tempData.push(newData)
                        }
                    }

                }
                await setData(tempData)
                setisLoadingTable(false)
            })
            .catch((error) => {
                console.log(error)
                setisLoadingTable(false)
            });
    }
    useEffect(() => {
        getAll()
    }, [])

    return (
        <View>
            {isOpenAlertDelete ? <AlertComponent isOpen={setisOpenAlertDelete} status={"success"} title={"Directivo eliminado correctamente"} /> : null}
            {isOpenAlertRegister ? <AlertComponent isOpen={setIsOpenAlertRegister} status={"success"} title={"Directivo registrado correctamente"} /> : null}
            <ScrollView refreshControl={<RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
            />}
                _contentContainerStyle={{
                    minW: "100%"
                }}>
                <BoxHeaderComponentInit fontColor={"#ffffff"} bgColor={"#049474"} isButton={true} isOpen={false} title={"Registrar directivo"} showIcon={true} Form={
                    <Center>
                        <Stack mt={3} space={4} w="100%">
                            <FormControl isRequired>
                                <FormControl.Label>Nombre(s)</FormControl.Label>
                                <Input
                                    onChangeText={formikRegister.handleChange('name')}
                                    onBlur={formikRegister.handleBlur('name')}
                                    value={formikRegister.values.name} type='text'
                                    placeholder='Ejemplo: Emmanuel' />
                                {formikRegister.errors.name ? (
                                    <Text color={"#FF0000"}>{formikRegister.errors.name}</Text>
                                ) : null}
                            </FormControl>
                            <FormControl isRequired>
                                <FormControl.Label>Primer apellido</FormControl.Label>
                                <Input
                                    onChangeText={formikRegister.handleChange('surname')}
                                    onBlur={formikRegister.handleBlur('surname')}
                                    value={formikRegister.values.surname} type='text'
                                    placeholder='Ejemplo: Herrera' />
                                {formikRegister.errors.surname ? (
                                    <Text color={"#FF0000"}>{formikRegister.errors.surname}</Text>
                                ) : null}
                            </FormControl>
                            <FormControl isRequired>
                                <FormControl.Label>Segundo apellido</FormControl.Label>
                                <Input type='text'
                                    onChangeText={formikRegister.handleChange('secondSurname')}
                                    onBlur={formikRegister.handleBlur('secondSurname')}
                                    value={formikRegister.values.secondSurname}
                                    placeholder='Ejemplo: Ibarra' />
                                {formikRegister.errors.secondSurname ? (
                                    <Text color={"#FF0000"}>{formikRegister.errors.secondSurname}</Text>
                                ) : null}
                            </FormControl>
                            <FormControl isRequired>
                                <FormControl.Label>Correo electrónico</FormControl.Label>
                                <Input keyboardType='email-address' type='email'
                                    onChangeText={formikRegister.handleChange('email')}
                                    onBlur={formikRegister.handleBlur('email')}
                                    value={formikRegister.values.email}
                                    placeholder='Ejemplo: utez@utez.edu.mx' />
                                <FormControl.HelperText>
                                    La contraseña del usuario será la misma que su correo
                                </FormControl.HelperText>
                                {formikRegister.errors.email ? (
                                    <Text color={"#FF0000"}>{formikRegister.errors.email}</Text>
                                ) : null}
                            </FormControl>
                            <Button onPress={formikRegister.handleSubmit} disabled={!(formikRegister.isValid && formikRegister.dirty)} mt="4" bg="#042b61" >
                                Registrar
                            </Button>
                            {isLoadingRegister ? <Loading /> : null}
                        </Stack>
                    </Center>


                } />
                {isOpenAlertModify ? <AlertComponent isOpen={setIsOpenAlertModify} status={"success"} title={"Directivo modificado correctamente"} /> : null}
                <TableComponent isLoadingTable={isLoadingTable} setisLoadingTable={setisLoadingTable} isOpen={true} title={"Directivos registrados"}
                    isSearch={true}
                    tableHead={['#', 'Nombre completo', 'Correo electrónico', 'Modificar', 'Eliminar']}
                    widthArr={[40, 180, 200, 120, 120]}
                    data={data}
                />
            </ScrollView>
            <ModalComponent formik={formikModify} content={
                <Modal.Body>
                    {errorModify ? <AlertComponent isOpen={setErrorModify} status={"error"} title={"Rellene todos los campos primero"} /> : null}
                    {equalsPassword ? <AlertComponent isOpen={setEqualsPassword} status={"error"} title={"Las contraseñas no son iguales"} /> : null}
                    <FormControl isRequired>
                        <FormControl.Label>Nombre</FormControl.Label>
                        <Input type='text'
                            onChangeText={formikModify.handleChange('name')}
                            onBlur={formikModify.handleBlur('name')}
                            value={formikModify.values.name}
                            placeholder='Ejemplo: María' />
                        {formikModify.errors.name ? (
                            <Text color={"#FF0000"}>{formikModify.errors.name}</Text>
                        ) : null}
                    </FormControl>
                    <FormControl isRequired>
                        <FormControl.Label>Primer apellido</FormControl.Label>
                        <Input type='text'
                            onChangeText={formikModify.handleChange('surname')}
                            onBlur={formikModify.handleBlur('surname')}
                            value={formikModify.values.surname}
                            placeholder='Ejemplo: Valdez' />
                        {formikModify.errors.surname ? (
                            <Text color={"#FF0000"}>{formikModify.errors.surname}</Text>
                        ) : null}
                    </FormControl>
                    <FormControl isRequired>
                        <FormControl.Label>Segundo apellido</FormControl.Label>
                        <Input type='text'
                            onChangeText={formikModify.handleChange('secondSurname')}
                            onBlur={formikModify.handleBlur('secondSurname')}
                            value={formikModify.values.secondSurname}
                            placeholder='Ejemplo: Díaz' />
                        {formikModify.errors.secondSurname ? (
                            <Text color={"#FF0000"}>{formikModify.errors.secondSurname}</Text>
                        ) : null}
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>Contraseña</FormControl.Label>
                        <Input
                            onChangeText={formikModify.handleChange('password')}
                            onBlur={formikModify.handleBlur('password')}
                            value={formikModify.values.password}
                            type='password' placeholder='************' />
                        <FormControl.HelperText>
                            La contraseña solo se cambiará si ingresa algún valor
                        </FormControl.HelperText>
                    </FormControl>

                    <FormControl>
                        <FormControl.Label>Confirmar contraseña</FormControl.Label>
                        <Input
                            onChangeText={formikModify.handleChange('confirmPassword')}
                            onBlur={formikModify.handleBlur('confirmPassword')}
                            value={formikModify.values.confirmPassword}
                            placeholder='************' type='password' />
                    </FormControl>
                    {isLoadingModify ? <Loading /> : null}
                </Modal.Body>
            } showModal={showModal} header={"Modificar directivo"} setShowModal={setShowModal} />

            <AlertDialogComponent isOpen={showAlertDelete} setIsOpen={setShowAlertDelete} header={"Eliminar directivo"} body={"¿Está seguro de realizar la acción solicitada?"} action={onDelete} />

        </View>
    )
}