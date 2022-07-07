import { View, RefreshControl } from 'react-native'
import React, { useState, useEffect } from 'react'
import TableComponent from '../components/TableComponent'
import { Center, ScrollView, Input, Stack, FormControl, WarningOutlineIcon, Modal, Text, Select, Button, CheckIcon } from "native-base";
import BoxHeaderComponent from '../components/BoxHeaderComponent'
import ActionsButtons from '../components/ActionsButtons'
import ModalComponent from '../components/ModalComponent'
import AlertDialogComponent from '../components/AlertDialogComponent'
import AlertComponent from '../components/AlertComponent'
import { ipServer } from "../config/Config"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../components/Loading';
import EnableAlertDialogComponent from '../components/EnableAlertDialogComponent';
import * as yup from "yup";
import { useFormik } from "formik";
import RNDateTimePicker from '@react-native-community/datetimepicker';
import BoxHeaderComponentInit from '../components/BoxHeaderComponentInit';


export default function Personal() {
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
    const [showAlertEnable, setShowAlertEnable] = useState(false)
    const [refreshing, setRefreshing] = React.useState(false);
    const [dateRegister, setDateRegister] = useState(false)
    const [dateModify, setDateModify] = useState(false)
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
            dateBirth: "",
            email: "",
            phone: "",
            profession: ""
        },
        validationSchema: yup.object().shape({
            name: yup.string().required("Campo obligatorio"),
            surname: yup.string().required("Campo obligatorio"),
            secondSurname: yup.string().required("Campo obligatorio"),
            dateBirth: yup.string().required("Campo obligatorio"),
            email: yup.string().required("Campo obligatorio"),
            phone: yup.string().required("Campo obligatorio"),
            profession: yup.string().required("Campo obligatorio")
        }),
        onSubmit: async (values) => {
            setIsLoadingRegister(true)
            await getToken()
            let registerData = {
                ...values,
                profession: {
                    id: values.profession,
                }
            }
            console.log(registerData)
            fetch(`http://${ipServer}/api/person/`, {
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
                    setIsLoadingRegister(false)
                    formikRegister.resetForm();
                })
        },
    });

    const showDateRegister = () => {
        setDateRegister(true)
    }
    const setDateR = (event, date) => {
        if (date === undefined) {
            setDateRegister(false)
        } else {
            let dateFormat = new Date(date);
            let year = dateFormat.getFullYear();
            let day = dateFormat.getDate();
            if (day < 10) day = `0${day}`
            let month = dateFormat.getMonth();
            month = month+1;
            if (month < 10) month = `0${month}`
            let finalDate = `${year}-${month}-${day}`
            formikRegister.values.dateBirth = finalDate;
            formikRegister.handleChange
            formikRegister.handleBlur
            setDateRegister(false)
        }

    }

    const showDateModify = () => {
        setDateModify(true)
    }
    const setDateM = (event, date) => {
        if (date === undefined) {
            setDateModify(false)
        } else {
            let dateFormat = new Date(date);
            let year = dateFormat.getFullYear();
            let day = dateFormat.getDate();
            if (day < 10) day = `0${day}`
            let month = dateFormat.getMonth();
            month = month+1;
            if (month < 10) month = `0${month}`
            let finalDate = `${year}-${month}-${day}`
            formikModify.values.dateBirth = finalDate;
            formikModify.handleChange
            formikModify.handleBlur
            setDateModify(false)
        }

    }
    const formikModify = useFormik({
        initialValues: {
            name: "",
            surname: "",
            secondSurname: "",
            dateBirth: "",
            phone: "",
            profession: ""
        },
        validationSchema: yup.object().shape({
            name: yup.string().required("Campo obligatorio"),
            surname: yup.string().required("Campo obligatorio"),
            secondSurname: yup.string().required("Campo obligatorio"),
            dateBirth: yup.string().required("Campo obligatorio"),
            phone: yup.string().required("Campo obligatorio"),
            profession: yup.string().required("Campo obligatorio")
        }),
        onSubmit: async (values) => {
            let data = {
                ...objectModify,
                name: values.name,
                secondSurname: values.secondSurname,
                surname: values.surname,
                dateBirth: values.dateBirth,
                phone: values.phone,
                profession: {
                    id: values.profession
                }
            }
            console.log(data)
            setIsLoadingModify(true)
            setShowModal(false)
            await getToken()
            fetch(`http://${ipServer}/api/person/`, {
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
                    setShowModal(false)
                    setIsLoadingModify(false)
                })
            setIsLoadingModify(false)

        }
    });

    let token = ""
    const onDelete = async() => {

        await getToken()
        let data = {
            ...objectModify,
            status: {
                description: "Inactivo",
                id: 2,
            }
        }
        fetch(`http://${ipServer}/api/person/`, {
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
    const onEnable = async() => {
        await getToken()
        setisOpenAlertDelete(true)
        let data = {
            ...objectModify,
            status: {
                description: "Activo",
                id: 1,
            }
        }

        fetch(`http://${ipServer}/api/person/`, {
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

        fetch(`http://${ipServer}/api/person/`, {
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
                    if (responseJson.data[i].profession.description != "Directivo") {
                        cont++;
                        let newData = [
                            cont, `${responseJson.data[i].name} ${responseJson.data[i].surname} ${responseJson.data[i].secondSurname}`, responseJson.data[i].email,responseJson.data[i].profession.description
                            , <ActionsButtons name={"info"} action={() => {
                                setShowModalInfo(true)
                                setObjectModify(responseJson.data[i])
                            }} color={"white"} bgColor={"#0b5ed7"} />,
                            <ActionsButtons action={() => {
                                setObjectModify(responseJson.data[i])
                                formikModify.values.profession = responseJson.data[i].profession.id
                                formikModify.resetForm
                                formikModify.values.name = responseJson.data[i].name
                                formikModify.values.surname = responseJson.data[i].surname
                                formikModify.values.secondSurname = responseJson.data[i].secondSurname
                                formikModify.values.phone = responseJson.data[i].phone
                                formikModify.values.dateBirth = responseJson.data[i].dateBirth
                                formikModify.handleChange
                                formikModify.handleBlur
                                setShowModal(true)
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
    }, [])

    return (
        <View>
            {isOpenAlertDelete ? <AlertComponent isOpen={setisOpenAlertDelete} status={"success"} title={"Estado cambiado correctamente"} /> : null}
            {isOpenAlertRegister ? <AlertComponent isOpen={setIsOpenAlertRegister} status={"success"} title={"Personal registrado correctamente"} /> : null}
            {isOpenAlertErrorRegister ? <AlertComponent isOpen={setIsOpenAlertErrorRegister} status={"error"} title={"Rellene todos los campos primero"} /> : null}
            <ScrollView refreshControl={<RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
            />}
                _contentContainerStyle={{
                    minW: "100%"
                }}>

                <BoxHeaderComponentInit fontColor={"#ffffff"} bgColor={"#049474"} isButton={true} formik={formikRegister} isOpen={false} title={"Registrar personal"} showIcon={true} Form={

                    <Stack mt={3} space={4} w="100%">
                        <FormControl isRequired>
                            <FormControl.Label>Nombre</FormControl.Label>
                            <Input
                                onChangeText={formikRegister.handleChange('name')}
                                onBlur={formikRegister.handleBlur('name')}
                                value={formikRegister.values.name}
                                type='text' placeholder='Ejemplo: María' />
                            {formikRegister.errors.name ? (
                                <Text color={"#FF0000"}>{formikRegister.errors.name}</Text>
                            ) : null}
                        </FormControl>
                        <FormControl isRequired>
                            <FormControl.Label>Primer apellido</FormControl.Label>
                            <Input
                                onChangeText={formikRegister.handleChange('surname')}
                                onBlur={formikRegister.handleBlur('surname')}
                                value={formikRegister.values.surname}
                                placeholder='Ejemplo: Valdez' />
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
                                placeholder='Ejemplo: Díaz' />
                            {formikRegister.errors.secondSurname ? (
                                <Text color={"#FF0000"}>{formikRegister.errors.secondSurname}</Text>
                            ) : null}
                        </FormControl>
                        <FormControl isRequired>
                            <FormControl.Label>Fecha de nacimiento</FormControl.Label>
                            <Input type='date'
                                onChangeText={formikRegister.handleChange('dateBirth')}
                                onBlur={formikRegister.handleBlur('dateBirth')}
                                value={formikRegister.values.dateBirth}
                                placeholder='Ejemplo: 2002-06-21' />
                            {dateRegister ? <RNDateTimePicker mode='datetime' onChange={setDateR} value={formikRegister.values.dateBirth != "" ? new Date(formikRegister.values.dateBirth)  : new Date()} /> : null}
                            <Button bg="#042b61" onPress={showDateRegister}>Elegir fecha</Button>

                            {formikRegister.errors.dateBirth ? (
                                <Text color={"#FF0000"}>{formikRegister.errors.dateBirth}</Text>
                            ) : null}
                        </FormControl>
                        <FormControl isRequired>
                            <FormControl.Label>Correo eléctronico</FormControl.Label>
                            <Input keyboardType='email-address' type='email'
                                onChangeText={formikRegister.handleChange('email')}
                                onBlur={formikRegister.handleBlur('email')}
                                value={formikRegister.values.email}
                                placeholder='Ejemplo: Email' />
                            {formikRegister.errors.email ? (
                                <Text color={"#FF0000"}>{formikRegister.errors.email}</Text>
                            ) : null}
                        </FormControl>
                        <FormControl isRequired>
                            <FormControl.Label>Teléfono</FormControl.Label>
                            <Input keyboardType='phone-pad' type='number'
                                onChangeText={formikRegister.handleChange('phone')}
                                onBlur={formikRegister.handleBlur('phone')}
                                value={formikRegister.values.phone}
                                placeholder='Ejemplo: 7775698741' />
                            {formikRegister.errors.phone ? (
                                <Text color={"#FF0000"}>{formikRegister.errors.phone}</Text>
                            ) : null}
                        </FormControl>
                        <FormControl isRequired>
                            <FormControl.Label>Rol</FormControl.Label>
                            <Select selectedValue={formikRegister.values.profession} onBlur={formikRegister.handleBlur('profession')} onValueChange={formikRegister.handleChange('profession')} accessibilityLabel="Eco" placeholder="Seleccione una opción" _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />
                            }} mt={1}>
                                <Select.Item label="Docente" value="1" />
                                <Select.Item label="Becario" value="2" />
                            </Select>
                            {formikRegister.errors.profession ? (
                                <Text color={"#FF0000"}>{formikRegister.errors.profession}</Text>
                            ) : null}
                        </FormControl>
                        {isLoadingRegister ? <Loading /> : null}
                        <Button onPress={formikRegister.handleSubmit} disabled={!(formikRegister.isValid && formikRegister.dirty)} mt="4" bg="#042b61" >
                            Registrar
                        </Button>
                    </Stack>


                } />
                {isOpenAlertModify ? <AlertComponent isOpen={setIsOpenAlertModify} status={"success"} title={"Personal modificado correctamente"} /> : null}
                <TableComponent isLoadingTable={isLoadingTable} setisLoadingTable={setisLoadingTable} isOpen={true} title={"Personal registrado"}
                    isSearch={true}
                    tableHead={['#', 'Nombre completo', 'Correo', 'Rol', 'Detalles', 'Modificar', 'Acción']}
                    widthArr={[40, 180, 200, 180, 150, 120, 120]}
                    data={data}
                />
            </ScrollView>
            <ModalComponent formik={formikModify} content={
                <Modal.Body>
                    {errorModify ? <AlertComponent isOpen={setErrorModify} status={"error"} title={"Rellene todos los campos primero"} /> : null}
                    {equalsPassword ? <AlertComponent isOpen={setEqualsPassword} status={"error"} title={"Las contraseñas no son iguales"} /> : null}
                    <FormControl isRequired>
                        <FormControl.Label>Nombre</FormControl.Label>
                        <Input
                            onChangeText={formikModify.handleChange('name')}
                            onBlur={formikModify.handleBlur('name')}
                            value={formikModify.values.name}
                            type='text' placeholder='Ejemplo: María' />
                        {formikModify.errors.name ? (
                            <Text color={"#FF0000"}>{formikModify.errors.name}</Text>
                        ) : null}
                    </FormControl>
                    <FormControl isRequired>
                        <FormControl.Label>Primer apellido</FormControl.Label>
                        <Input
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
                    <FormControl isRequired>
                        <FormControl.Label>Fecha de nacimiento</FormControl.Label>
                        <Input isDisabled type='date'
                            onChangeText={formikModify.handleChange('dateBirth')}
                            onBlur={formikModify.handleBlur('dateBirth')}
                            value={formikModify.values.dateBirth}
                            placeholder='Ejemplo: 2002-06-21' />
                            {dateModify ? <RNDateTimePicker mode='datetime' onChange={setDateM} value={formikModify.values.dateBirth != "" ? new Date(formikModify.values.dateBirth)  : new Date()} /> : null}
                            <Button bg="#042b61" onPress={showDateModify}>Elegir fecha</Button>
                        {formikModify.errors.dateBirth ? (
                            <Text color={"#FF0000"}>{formikModify.errors.dateBirth}</Text>
                        ) : null}
                    </FormControl>
                    <FormControl isRequired>
                        <FormControl.Label>Teléfono</FormControl.Label>
                        <Input keyboardType='phone-pad' type='number'
                            onChangeText={formikModify.handleChange('phone')}
                            onBlur={formikModify.handleBlur('phone')}
                            value={formikModify.values.phone}
                            placeholder='Ejemplo: 7775698741' />
                        {formikModify.errors.phone ? (
                            <Text color={"#FF0000"}>{formikModify.errors.phone}</Text>
                        ) : null}
                    </FormControl>
                    <FormControl isRequired>
                        <FormControl.Label>Rol</FormControl.Label>
                        <Select onBlur={formikModify.handleBlur('profession')} onValueChange={formikModify.handleChange('profession')} accessibilityLabel="Eco" placeholder="Seleccione una opción" _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon size="5" />
                        }} mt={1} selectedValue={`${formikModify.values.profession}`}>
                            <Select.Item label="Docente" value="1" />
                            <Select.Item label="Becario" value="2" />
                        </Select>
                        {formikModify.errors.profession ? (
                            <Text color={"#FF0000"}>{formikModify.errors.profession}</Text>
                        ) : null}
                    </FormControl>
                    {isLoadingModify ? <Loading /> : null}
                </Modal.Body>
            } showModal={showModal} header={"Modificar personal"} setShowModal={setShowModal} />


            <ModalComponent showButtonConfirm={true} content={
                <Modal.Body>
                    <FormControl isDisabled isRequired>
                        <FormControl.Label>Nombre</FormControl.Label>
                        <Input value={objectModify.name} onChangeText={value => setObjectModify({ ...objectModify, ["name"]: value })} type='text' placeholder='Ejemplo: María' />
                    </FormControl>
                    <FormControl isDisabled isRequired>
                        <FormControl.Label>Primer apellido</FormControl.Label>
                        <Input value={objectModify.surname} type='text' onChangeText={value => setObjectModify({ ...objectModify, ["surname"]: value })} placeholder='Ejemplo: Valdez' />
                    </FormControl>
                    <FormControl isDisabled isRequired>
                        <FormControl.Label>Segundo apellido</FormControl.Label>
                        <Input type='text' value={objectModify.secondSurname} onChangeText={value => setObjectModify({ ...objectModify, ["secondSurname"]: value })} placeholder='Ejemplo: Díaz' />
                    </FormControl>
                    <FormControl isDisabled isRequired>
                        <FormControl.Label>Correo electrónico</FormControl.Label>
                        <Input type='text' value={objectModify.email} onChangeText={value => setObjectModify({ ...objectModify, ["secondSurname"]: value })} placeholder='Ejemplo: Díaz' />
                    </FormControl>
                    <FormControl isDisabled isRequired>
                        <FormControl.Label>Fecha de nacimiento</FormControl.Label>
                        <Input type='date' value={objectModify.dateBirth} onChangeText={value => setObjectModify({ ...objectModify, ["dateBirth"]: value })} placeholder='Ejemplo: 2002-06-21' />
                    </FormControl>
                    <FormControl isDisabled isRequired>
                        <FormControl.Label>Teléfono</FormControl.Label>
                        <Input type='number' value={objectModify.phone} onChangeText={value => setObjectModify({ ...objectModify, ["phone"]: value })} placeholder='Ejemplo: 7775698741' />
                    </FormControl>
                    <FormControl isDisabled isRequired>
                        <FormControl.Label>Rol</FormControl.Label>
                        <Select selectedValue={showModalInfo ? `${objectModify.profession.id}` : ""} accessibilityLabel="Eco" placeholder="Seleccione una opción" _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon size="5" />
                        }} mt={1} onValueChange={value => setObjectModify({ ...objectModify, "profession": { ...objectModify.profession, "id": value } })}>
                            <Select.Item label="Docente" value="1" />
                            <Select.Item label="Becario" value="2" />
                        </Select>
                    </FormControl>
                    {isLoadingModify ? <Loading /> : null}
                </Modal.Body>
            } showModal={showModalInfo} header={"Detalles del personal"} setShowModal={setShowModalInfo} />
            <AlertDialogComponent isOpen={showAlertDelete} setIsOpen={setShowAlertDelete} header={"Desactivar personal"} body={"¿Está seguro de realizar la acción solicitada?"} action={onDelete} />
            <AlertDialogComponent isOpen={showAlertEnable} setIsOpen={setShowAlertEnable} header={"Activar personal"} body={"¿Está seguro de realizar la acción solicitada?"} action={onEnable} />
        </View>
    )
}