import { View, RefreshControl } from 'react-native'
import React, { useState, useEffect } from 'react'
import TableComponent from '../components/TableComponent'
import { Center, ScrollView, Input, Stack, FormControl, Button, Modal, Text, Select, CheckIcon } from "native-base";
import BoxHeaderComponent from '../components/BoxHeaderComponent'
import ActionsButtons from '../components/ActionsButtons'
import ModalComponent from '../components/ModalComponent'
import AlertDialogComponent from '../components/AlertDialogComponent'
import AlertComponent from '../components/AlertComponent'
import { ipServer } from "../config/Config"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../components/Loading';
import * as yup from "yup";
import { insert, useFormik } from "formik";
import BoxHeaderComponentInit from '../components/BoxHeaderComponentInit';

export default function Users() {
    const [showModal, setShowModal] = useState(false);
    const [showAlertDelete, setShowAlertDelete] = useState(false);
    const [isOpenAlertDelete, setisOpenAlertDelete] = useState(false)
    const [isOpenAlertRegister, setIsOpenAlertRegister] = useState(false)
    const [isOpenAlertModify, setIsOpenAlertModify] = useState(false)
    const [isOpenAlertErrorRegister, setIsOpenAlertErrorRegister] = useState(false)
    const [data, setData] = useState([])
    const [isLoadingTable, setisLoadingTable] = useState(true)
    const [object, setObject] = useState([])
    const [objectModify, setObjectModify] = useState([])
    const [isLoadingRegister, setIsLoadingRegister] = useState(false)
    const [isLoadingModify, setIsLoadingModify] = useState(false)
    const [errorModify, setErrorModify] = useState(false)
    const [equalsPassword, setEqualsPassword] = useState(false)
    const [showModalInfo, setShowModalInfo] = useState(false)
    const [refreshing, setRefreshing] = React.useState(false);
    const [dataPersonal, setDataPersonal] = useState([])
    const [dataRole, setDataRole] = useState([])
    const [showAlertEnable, setShowAlertEnable] = useState(false)

    const getAllPersonal = async () => {
        await getToken()
        fetch(`http://${ipServer}/api/person/`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                "Authorization": `Bearer${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then(async (responseJson) => {
                let personal = []
                for (let i = 0; i < responseJson.data.length; i++) {
                    let personalTemp = [
                        <Select.Item label={`${responseJson.data[i].email}`} value={`${responseJson.data[i].id}`} />
                    ]
                    personal.push(personalTemp)
                }
                setDataPersonal(personal)
            })
    }
    const getAllRole = async () => {
        await getToken()
        fetch(`http://${ipServer}/api/rol/`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                "Authorization": `Bearer${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then(async (responseJson) => {
                let personal = []
                for (let i = 0; i < responseJson.data.length; i++) {
                    if (responseJson.data[i].acronym != "Directivo") {
                        let personalTemp = [
                            <Select.Item label={`${responseJson.data[i].acronym}`} value={`${responseJson.data[i].id}`} />
                        ]
                        personal.push(personalTemp)
                    }

                }
                setDataRole(personal)
            })
    }
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getAll()
        getAllPersonal()
        getAllRole()
        setRefreshing(false)
    }, []);
    const formikRegister = useFormik({
        initialValues: {
            username: "",
            authorities: ""
        },
        validationSchema: yup.object().shape({
            username: yup.string().required("Campo obligatorio"),
            authorities: yup.string().required("Campo obligatorio")
        }),
        onSubmit: async (values) => {
            setIsLoadingRegister(true)
            await getToken()
            console.log(values.username)
            console.log(values.authorities)
            fetch(`http://${ipServer}/api/user/`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    "Authorization": `Bearer${token}`,
                    'Content-Type': 'application/json',
                }

            })
                .then((response) => response.json())
                .then(async (responseJson) => {
                    let exist = false;
                    let id;
                    let auth = [];
                    let error = false;
                    let data = []
                    for (let i = 0; i < responseJson.data.length; i++) {
                        if (responseJson.data[i].person.id == values.username) {
                            for (let m = 0; m < responseJson.data[i].authorities.length; m++) {
                                if (responseJson.data[i].authorities[m].id == values.authorities) {
                                    error = true;
                                } else {
                                    exist = true;
                                    auth = responseJson.data[i].authorities;
                                    id = responseJson.data[i].person.id;
                                    data = responseJson.data[i]
                                }
                            }

                        }
                    }
                    if (error) {
                        setIsOpenAlertErrorRegister(true)
                        setIsLoadingRegister(false)
                    } else if (exist) {
                        auth.push({
                            id: values.authorities,
                            description: "Directivo",
                            acronym: "Directivo"
                        })
                        data = {
                            ...data,
                            authorities: auth
                        }
                        fetch(`http://${ipServer}/api/user/rol/`, {
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
                                console.log(responseJson)
                                setIsLoadingRegister(false)
                                setIsOpenAlertRegister(true)
                                setIsOpenAlertErrorRegister(false)
                                formikRegister.resetForm();
                                getAll()
                            })
                    } else {
                        fetch(`http://${ipServer}/api/person/${values.username}`, {
                            method: 'GET',
                            headers: {
                                Accept: 'application/json',
                                "Authorization": `Bearer${token}`,
                                'Content-Type': 'application/json',
                            }

                        })
                            .then((response) => response.json())
                            .then(async (responseJson) => {
                                let insert = {
                                    authorities: [{
                                        id: values.authorities,
                                        "description": "Directivo"
                                    }],
                                    username: responseJson.data.email
                                }
                                fetch(`http://${ipServer}/api/user/save`, {
                                    method: 'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        "Authorization": `Bearer${token}`,
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(insert),

                                })
                                    .then((response) => response.json())
                                    .then(async (responseJson) => {
                                        console.log(responseJson)
                                        setIsLoadingRegister(false)
                                        setIsOpenAlertRegister(true)
                                        setIsOpenAlertErrorRegister(false)
                                        formikRegister.resetForm();
                                        getAll()
                                    })
                            })


                    }
                })
        },
    });

    const formikModify = useFormik({
        initialValues: {
            id: "",
            password: "",
            confirmPassword: ""
        },
        validationSchema: yup.object().shape({
            password: yup.string().required("Campo obligatorio"),
            confirmPassword: yup.string().required("Campo obligatorio")
        }),
        onSubmit: async (values) => {
            setIsLoadingModify(true)
            await getToken()

            if (values.password === values.confirmPassword) {
                setEqualsPassword(false)
                setIsLoadingModify(true)
                setErrorModify(false)
                setShowModal(false)

                let data = {
                    id: values.id,
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

            } else {
                setEqualsPassword(true)
            }
            setIsLoadingModify(false)
        }
    });

    let token = ""
    const onDelete = async () => {
        await getToken()
        let data = {
            ...objectModify,
            status: {
                description: "Inactivo",
                id: 2,
            }
        }
        console.log(data)
        fetch(`http://${ipServer}/api/user/`, {
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
                console.log(responseJson)
                setisOpenAlertDelete(true)
                getAll()
                setObjectModify([])
            })
    }
    const onEnable = async () => {
        await getToken()
        setisOpenAlertDelete(true)
        let data = {
            ...objectModify,
            status: {
                description: "Activo",
                id: 1,
            }
        }
        console.log(data)
        fetch(`http://${ipServer}/api/user/`, {
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
                setisOpenAlertDelete(true)
                getAll()
                setObjectModify([])
            })
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
                let cont = 0;
                for (let i = 0; i < responseJson.data.length; i++) {
                    for (let r = 0; r < responseJson.data[i].authorities.length; r++) {
                        cont++;
                        let newData = [
                            cont, `${responseJson.data[i].person.name} ${responseJson.data[i].person.surname} ${responseJson.data[i].person.secondSurname}`, responseJson.data[i].authorities[r].description
                            ,
                            <ActionsButtons name={"info"} action={() => {
                                setShowModalInfo(true)
                                setObjectModify({
                                    ...responseJson.data[i],
                                    authorities: responseJson.data[i].authorities[r].description
                                })
                            }} color={"white"} bgColor={"#0b5ed7"} />,
                            <ActionsButtons action={() => {
                                setShowModal(true)
                                setObjectModify(responseJson.data[i])
                                formikModify.resetForm
                                formikModify.values.id = responseJson.data[i].id
                                formikModify.handleChange
                            }} name={"edit"} color={"black"} bgColor={"#ffc107"} />,

                            responseJson.data[i].status.id == 1 ? <ActionsButtons name={"ban"} action={() => {
                                setShowAlertDelete(true)
                                setObjectModify(responseJson.data[i])
                            }} color={"white"} bgColor={"#dc3545"} /> : <ActionsButtons name={"check-circle"} action={() => {
                                setShowAlertEnable(true)
                                setObjectModify(responseJson.data[i])
                            }} color={"white"} bgColor={"#218838"} />
                        ];
                        await tempData.push(newData)
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
        getAllPersonal()
        getAllRole()
    }, [])

    return (
        <View>
            {isOpenAlertDelete ? <AlertComponent isOpen={setisOpenAlertDelete} status={"success"} title={"Usuario eliminado correctamente"} /> : null}
            {isOpenAlertRegister ? <AlertComponent isOpen={setIsOpenAlertRegister} status={"success"} title={"Usuario registrado correctamente"} /> : null}
            {isOpenAlertErrorRegister ? <AlertComponent isOpen={setIsOpenAlertErrorRegister} status={"error"} title={"El usuario ya tiene este rol"} /> : null}
            <ScrollView refreshControl={<RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
            />}
                _contentContainerStyle={{
                    minW: "100%"
                }}>

                <BoxHeaderComponentInit fontColor={"#ffffff"} bgColor={"#049474"} isButton={true} isOpen={false} title={"Registrar usuarios"} showIcon={true} Form={
                    <Center>
                        <Stack mt={3} space={4} w="100%">
                            <FormControl isRequired>
                                <FormControl.Label>Rol</FormControl.Label>
                                <Select
                                    selectedValue={formikRegister.values.authorities} onBlur={formikRegister.handleBlur('authorities')} onValueChange={formikRegister.handleChange('authorities')}
                                    accessibilityLabel="Eco" placeholder="Seleccione una opción" _selectedItem={{
                                        bg: "teal.600",
                                        endIcon: <CheckIcon size="5" />
                                    }} mt={1} >
                                    {dataRole}
                                </Select>
                            </FormControl>

                            <FormControl isRequired>
                                <FormControl.Label>Correo</FormControl.Label>
                                <Select
                                    selectedValue={formikRegister.values.username} onBlur={formikRegister.handleBlur('username')} onValueChange={formikRegister.handleChange('username')}
                                    accessibilityLabel="Eco" placeholder="Seleccione una opción" _selectedItem={{
                                        bg: "teal.600",
                                        endIcon: <CheckIcon size="5" />
                                    }} mt={1} >
                                    {dataPersonal}
                                </Select>
                            </FormControl>
                            {isLoadingRegister ? <Loading /> : null}
                            <Button onPress={formikRegister.handleSubmit} disabled={!(formikRegister.isValid && formikRegister.dirty)} mt="4" bg="#042b61" >
                                Registrar
                            </Button>
                        </Stack>
                    </Center>
                } />
                {isOpenAlertModify ? <AlertComponent isOpen={setIsOpenAlertModify} status={"success"} title={"Usuario modificado correctamente"} /> : null}
                <TableComponent isLoadingTable={isLoadingTable} setisLoadingTable={setisLoadingTable} isOpen={true} title={"Usuarios registrados"}
                    isSearch={true}
                    tableHead={['#', 'Nombre del usuario', 'Rol', 'Detalles', 'Modificar', 'Desactivar']}
                    widthArr={[40, 180, 200, 120, 120, 120]}
                    data={data}
                />
            </ScrollView>
            <ModalComponent formik={formikModify} content={
                <Modal.Body>
                    {equalsPassword ? <AlertComponent isOpen={setEqualsPassword} status={"error"} title={"Las contraseñas no son iguales"} /> : null}
                    <FormControl isRequired>
                        <FormControl.Label>Contraseña</FormControl.Label>
                        <Input
                            onChangeText={formikModify.handleChange('password')}
                            onBlur={formikModify.handleBlur('password')}
                            value={formikModify.values.password}
                            type='password' placeholder='************' />
                        {formikModify.errors.password ? (
                            <Text color={"#FF0000"}>{formikModify.errors.password}</Text>
                        ) : null}
                    </FormControl>

                    <FormControl isRequired>
                        <FormControl.Label>Confirmar contraseña</FormControl.Label>
                        <Input
                            onChangeText={formikModify.handleChange('confirmPassword')}
                            onBlur={formikModify.handleBlur('confirmPassword')}
                            value={formikModify.values.confirmPassword}
                            placeholder='************' type='password' />
                        {formikModify.errors.confirmPassword ? (
                            <Text color={"#FF0000"}>{formikModify.errors.confirmPassword}</Text>
                        ) : null}
                    </FormControl>
                    {isLoadingModify ? <Loading /> : null}
                </Modal.Body>
            } showModal={showModal} header={"Modificar usuario"} setShowModal={setShowModal} />

            <ModalComponent showButtonConfirm={true} content={
                <Modal.Body>
                    <FormControl isDisabled isRequired>
                        <FormControl.Label>Nombre</FormControl.Label>
                        <Input type='text'
                            value={objectModify.person?.name} />
                    </FormControl>
                    <FormControl isDisabled isRequired>
                        <FormControl.Label>Primer apellido</FormControl.Label>
                        <Input type='text'
                            value={objectModify.person?.surname} />
                    </FormControl>
                    <FormControl isDisabled isRequired>
                        <FormControl.Label>Segundo apellido</FormControl.Label>
                        <Input type='text'
                            value={objectModify.person?.secondSurname} />
                    </FormControl>
                    <FormControl isDisabled isRequired>
                        <FormControl.Label>Correo</FormControl.Label>
                        <Input type='text'
                            value={objectModify.person?.email} />
                    </FormControl>
                    <FormControl isDisabled isRequired>
                        <FormControl.Label>Integración y pruebas</FormControl.Label>
                        <Input type='text'
                            value={objectModify.authorities} />
                    </FormControl>
                </Modal.Body>
            } showModal={showModalInfo} header={"Detalles del usuario"} setShowModal={setShowModalInfo} />
            <AlertDialogComponent isOpen={showAlertDelete} setIsOpen={setShowAlertDelete} header={"Desactivar personal"} body={"¿Está seguro de realizar la acción solicitada?"} action={onDelete} />
            <AlertDialogComponent isOpen={showAlertEnable} setIsOpen={setShowAlertEnable} header={"Activar personal"} body={"¿Está seguro de realizar la acción solicitada?"} action={onEnable} />
        </View>
    )
}