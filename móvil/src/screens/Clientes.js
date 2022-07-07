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
import { useFormik } from "formik";
import BoxHeaderComponentInit from '../components/BoxHeaderComponentInit';

export default function Clientes() {
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
            company: "",
            phoneClient: "",
            emailClient: "",
            typeClient: "",
            nameRepre: "",
            surnameRepre: "",
            secondSurnameRepre: "",
            phoneRepre: "",
            emailRepre: "",
            extension: ""
        },
        validationSchema: yup.object().shape({
            name: yup.string().required("Campo obligatorio"),
            surname: yup.string().required("Campo obligatorio"),
            secondSurname: yup.string().required("Campo obligatorio"),
            company: yup.string().required("Campo obligatorio"),
            phoneClient: yup.string().required("Campo obligatorio"),
            emailClient: yup.string().required("Campo obligatorio"),
            typeClient: yup.string().required("Campo obligatorio"),
            nameRepre: yup.string().required("Campo obligatorio"),
            surnameRepre: yup.string().required("Campo obligatorio"),
            secondSurnameRepre: yup.string().required("Campo obligatorio"),
            phoneRepre: yup.string().required("Campo obligatorio"),
            emailRepre: yup.string().required("Campo obligatorio"),
            extension: yup.string().required("Campo obligatorio")
        }),
        onSubmit: async (values) => {
            setIsLoadingRegister(true)
            await getToken()
            let registerData = {
                ...values,
                typeClient: {
                    id: values.typeClient,
                }
            }
            fetch(`http://${ipServer}/api/client/`, {
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

    const formikModify = useFormik({
        initialValues: {
            phoneClient: "",
            emailClient: "",
            nameRepre: "",
            surnameRepre: "",
            secondSurnameRepre: "",
            phoneRepre: "",
            emailRepre: "",
            extension: ""
        },
        validationSchema: yup.object().shape({
            phoneClient: yup.string().required("Campo obligatorio"),
            emailClient: yup.string().required("Campo obligatorio"),
            nameRepre: yup.string().required("Campo obligatorio"),
            surnameRepre: yup.string().required("Campo obligatorio"),
            secondSurnameRepre: yup.string().required("Campo obligatorio"),
            phoneRepre: yup.string().required("Campo obligatorio"),
            emailRepre: yup.string().required("Campo obligatorio"),
            extension: yup.string().required("Campo obligatorio"),
        }),
        onSubmit: async (values) => {
            setIsLoadingModify(true)
            setShowModal(false)
            await getToken()
            let data = {
                ...objectModify,
                emailClient: values.emailClient,
                extension: values.extension,
                phoneClient: values.phoneClient,
                nameRepre: values.nameRepre,
                surnameRepre: values.surnameRepre,
                secondSurnameRepre: values.secondSurnameRepre,
                phoneRepre: values.phoneRepre,
                emailRepre: values.emailRepre
            }
            fetch(`http://${ipServer}/api/client/`, {
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

        fetch(`http://${ipServer}/api/client/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer${token}`
            }
        })
            .then(async (response) => await response.json(response))
            .then(async (responseJson) => {
                let cont = 0;
                let tempData = []
                for (let i = 0; i < responseJson.data.length; i++) {
                    cont++;
                    let newData = [
                        cont, `${responseJson.data[i].name} ${responseJson.data[i].surname} ${responseJson.data[i].secondSurname}`, responseJson.data[i].company, responseJson.data[i].typeClient.description
                        , <ActionsButtons name={"info"} action={() => {
                            setShowModalInfo(true)
                            setObjectModify(responseJson.data[i])
                        }} color={"white"} bgColor={"#0b5ed7"} />,
                        <ActionsButtons action={() => {
                            setShowModal(true)
                            setObjectModify(responseJson.data[i])
                            formikModify.resetForm
                            formikModify.values.extension = responseJson.data[i].extension
                            formikModify.values.phoneClient = responseJson.data[i].phoneClient
                            formikModify.values.emailClient = responseJson.data[i].emailClient
                            formikModify.values.nameRepre = responseJson.data[i].nameRepre
                            formikModify.values.surnameRepre = responseJson.data[i].surnameRepre
                            formikModify.values.secondSurnameRepre = responseJson.data[i].secondSurnameRepre
                            formikModify.values.phoneRepre = responseJson.data[i].phoneRepre
                            formikModify.values.emailRepre = responseJson.data[i].emailRepre
                            formikModify.handleChange
                        }} name={"edit"} color={"black"} bgColor={"#ffc107"} />
                    ];
                    await tempData.push(newData)
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
            {isOpenAlertDelete ? <AlertComponent isOpen={setisOpenAlertDelete} status={"success"} title={"Cliente eliminado correctamente"} /> : null}
            {isOpenAlertRegister ? <AlertComponent isOpen={setIsOpenAlertRegister} status={"success"} title={"Cliente registrado correctamente"} /> : null}
            {isOpenAlertErrorRegister ? <AlertComponent isOpen={setIsOpenAlertErrorRegister} status={"error"} title={"Rellene todos los campos primero"} /> : null}
            <ScrollView refreshControl={<RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
            />}
                _contentContainerStyle={{
                    minW: "100%"
                }}>

                <BoxHeaderComponentInit fontColor={"#ffffff"} bgColor={"#049474"} isButton={true} isOpen={false} title={"Registrar clientes"} showIcon={true} Form={

                    <Center>
                        <Stack mt={3} space={4} w="100%">
                            <BoxHeaderComponent fontColor={"#000"} bgColor={"#ffffff"} isButton={false} isOpen={false} title={"Datos del cliente"} showIcon={true} Form={
                                <Center>
                                    <FormControl isRequired>
                                        <FormControl.Label>Nombre(s)</FormControl.Label>
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
                                        <FormControl.Label>Correo electrónico</FormControl.Label>
                                        <Input keyboardType='email-address' type='email'
                                            onChangeText={formikRegister.handleChange('emailClient')}
                                            onBlur={formikRegister.handleBlur('emailClient')}
                                            value={formikRegister.values.emailClient}
                                            placeholder='Ejemplo: utez@utez.edu.mx' />
                                        {formikRegister.errors.emailClient ? (
                                            <Text color={"#FF0000"}>{formikRegister.errors.emailClient}</Text>
                                        ) : null}
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormControl.Label>Teléfono</FormControl.Label>
                                        <Input keyboardType='phone-pad' type='number'
                                            onChangeText={formikRegister.handleChange('phoneClient')}
                                            onBlur={formikRegister.handleBlur('phoneClient')}
                                            value={formikRegister.values.phoneClient}
                                            placeholder='Ejemplo: 7771265498' />
                                        {formikRegister.errors.phoneClient ? (
                                            <Text color={"#FF0000"}>{formikRegister.errors.phoneClient}</Text>
                                        ) : null}

                                    </FormControl>
                                    <FormControl isRequired>
                                        <FormControl.Label>Extensión</FormControl.Label>
                                        <Input keyboardType='numeric' type='number'
                                            onChangeText={formikRegister.handleChange('extension')}
                                            onBlur={formikRegister.handleBlur('extension')}
                                            value={formikRegister.values.extension}
                                            placeholder='Ejemplo: 416' />
                                        {formikRegister.errors.extension ? (
                                            <Text color={"#FF0000"}>{formikRegister.errors.extension}</Text>
                                        ) : null}

                                    </FormControl>
                                    <FormControl isRequired>
                                        <FormControl.Label>Nombre de la empresa</FormControl.Label>
                                        <Input type='text'
                                            onChangeText={formikRegister.handleChange('company')}
                                            onBlur={formikRegister.handleBlur('company')}
                                            value={formikRegister.values.company}
                                            placeholder='Ejemplo: NISSAN' />
                                        {formikRegister.errors.company ? (
                                            <Text color={"#FF0000"}>{formikRegister.errors.company}</Text>
                                        ) : null}
                                    </FormControl>
                                    
                                    <FormControl isRequired>
                                        <FormControl.Label>Tipo de cliente</FormControl.Label>
                                        <Select selectedValue={formikRegister.values.typeClient} onBlur={formikRegister.handleBlur('typeClient')} onValueChange={formikRegister.handleChange('typeClient')} accessibilityLabel="Eco" placeholder="Seleccione una opción" _selectedItem={{
                                            bg: "teal.600",
                                            endIcon: <CheckIcon size="5" />
                                        }} mt={1} >
                                            <Select.Item label="Externo" value="1" />
                                            <Select.Item label="Interno" value="2" />

                                        </Select>
                                        {formikRegister.errors.typeClient ? (
                                            <Text color={"#FF0000"}>{formikRegister.errors.typeClient}</Text>
                                        ) : null}
                                    </FormControl>
                                </Center>

                            } />
                            <BoxHeaderComponent fontColor={"#000"} bgColor={"#ffffff"} isButton={false} isOpen={false} title={"Datos del representante del cliente"} showIcon={true} Form={
                                <Center>
                                    <FormControl isRequired>
                                        <FormControl.Label>Nombre(s)</FormControl.Label>
                                        <Input
                                            onChangeText={formikRegister.handleChange('nameRepre')}
                                            onBlur={formikRegister.handleBlur('nameRepre')}
                                            value={formikRegister.values.nameRepre}
                                            type='text' placeholder='Ejemplo: María' />
                                        {formikRegister.errors.nameRepre ? (
                                            <Text color={"#FF0000"}>{formikRegister.errors.nameRepre}</Text>
                                        ) : null}
                                    </FormControl>
                                    <FormControl isRequired>
                                        <FormControl.Label>Primer apellido</FormControl.Label>
                                        <Input
                                            onChangeText={formikRegister.handleChange('surnameRepre')}
                                            onBlur={formikRegister.handleBlur('surnameRepre')}
                                            value={formikRegister.values.surnameRepre}
                                            placeholder='Ejemplo: Valdez' />
                                        {formikRegister.errors.surnameRepre ? (
                                            <Text color={"#FF0000"}>{formikRegister.errors.surnameRepre}</Text>
                                        ) : null}
                                    </FormControl>
                                    <FormControl isRequired>
                                        <FormControl.Label>Segundo apellido</FormControl.Label>
                                        <Input type='text'
                                            onChangeText={formikRegister.handleChange('secondSurnameRepre')}
                                            onBlur={formikRegister.handleBlur('secondSurnameRepre')}
                                            value={formikRegister.values.secondSurnameRepre}
                                            placeholder='Ejemplo: Díaz' />
                                        {formikRegister.errors.secondSurnameRepre ? (
                                            <Text color={"#FF0000"}>{formikRegister.errors.secondSurnameRepre}</Text>
                                        ) : null}
                                    </FormControl>
                                    <FormControl isRequired>
                                        <FormControl.Label>Teléfono</FormControl.Label>
                                        <Input keyboardType='phone-pad' type='number'
                                            onChangeText={formikRegister.handleChange('phoneRepre')}
                                            onBlur={formikRegister.handleBlur('phoneRepre')}
                                            value={formikRegister.values.phoneRepre}
                                            placeholder='Ejemplo: 771144520' />
                                        {formikRegister.errors.phoneRepre ? (
                                            <Text color={"#FF0000"}>{formikRegister.errors.phoneRepre}</Text>
                                        ) : null}
                                    </FormControl>
                                    <FormControl isRequired>
                                        <FormControl.Label>Correo electrónico</FormControl.Label>
                                        <Input keyboardType='email-address' type='email'
                                            onChangeText={formikRegister.handleChange('emailRepre')}
                                            onBlur={formikRegister.handleBlur('emailRepre')}
                                            value={formikRegister.values.emailRepre}
                                            placeholder='Ejemplo: utez@utez.edu.mx' />
                                        {formikRegister.errors.emailRepre ? (
                                            <Text color={"#FF0000"}>{formikRegister.errors.emailRepre}</Text>
                                        ) : null}
                                    </FormControl>
                                </Center>



                            } />
                            {isLoadingRegister ? <Loading /> : null}
                            <Button onPress={formikRegister.handleSubmit} disabled={!(formikRegister.isValid && formikRegister.dirty)} mt="4" bg="#042b61" >
                                Registrar
                            </Button>
                        </Stack>



                    </Center>


                } />
                {isOpenAlertModify ? <AlertComponent isOpen={setIsOpenAlertModify} status={"success"} title={"Cliente modificado correctamente"} /> : null}
                <TableComponent isLoadingTable={isLoadingTable} setisLoadingTable={setisLoadingTable} isOpen={true} title={"Clientes registrados"}
                    isSearch={true}
                    tableHead={['#', 'Nombre completo', 'Nombre de la empresa', 'Tipo de cliente', 'Detalles', 'Modificar']}
                    widthArr={[40, 180, 200, 150, 120, 120]}
                    data={data}
                />
            </ScrollView>
            <ModalComponent formik={formikModify} content={
                <Modal.Body>
                    {errorModify ? <AlertComponent isOpen={setErrorModify} status={"error"} title={"Rellene todos los campos primero"} /> : null}
                    {equalsPassword ? <AlertComponent isOpen={setEqualsPassword} status={"error"} title={"Las contraseñas no son iguales"} /> : null}
                    <FormControl isRequired>
                        <FormControl.Label>Correo electrónico</FormControl.Label>
                        <Input keyboardType='email-address' type='email'
                            onChangeText={formikModify.handleChange('emailClient')}
                            onBlur={formikModify.handleBlur('emailClient')}
                            value={formikModify.values.emailClient}
                            placeholder='Ejemplo: Email' />
                        {formikModify.errors.emailClient ? (
                            <Text color={"#FF0000"}>{formikModify.errors.emailClient}</Text>
                        ) : null}
                    </FormControl>
                    <FormControl isRequired>
                        <FormControl.Label>Teléfono</FormControl.Label>
                        <Input keyboardType='phone-pad' type='number'
                            onChangeText={formikModify.handleChange('phoneClient')}
                            onBlur={formikModify.handleBlur('phoneClient')}
                            value={formikModify.values.phoneClient}
                            placeholder='Ejemplo: 7775698741' />
                        {formikModify.errors.phoneClient ? (
                            <Text color={"#FF0000"}>{formikModify.errors.phoneClient}</Text>
                        ) : null}

                    </FormControl>
                    <FormControl isRequired>
                        <FormControl.Label>Extensión</FormControl.Label>
                        <Input keyboardType='numeric' type='number'
                            onChangeText={formikModify.handleChange('extension')}
                            onBlur={formikModify.handleBlur('extension')}
                            value={formikModify.values.extension}
                            placeholder='Ejemplo: 416' />
                        {formikModify.errors.extension ? (
                            <Text color={"#FF0000"}>{formikModify.errors.extension}</Text>
                        ) : null}
                    </FormControl>

                    
                    <Text style={{ fontWeight: "bold" }}>Información del representante del cliente</Text>
                    <FormControl isRequired>
                        <FormControl.Label>Nombre(s)</FormControl.Label>
                        <Input
                            onChangeText={formikModify.handleChange('nameRepre')}
                            onBlur={formikModify.handleBlur('nameRepre')}
                            value={formikModify.values.nameRepre}
                            type='text' placeholder='Ejemplo: María' />
                        {formikModify.errors.nameRepre ? (
                            <Text color={"#FF0000"}>{formikModify.errors.nameRepre}</Text>
                        ) : null}
                    </FormControl>
                    <FormControl isRequired>
                        <FormControl.Label>Primer apellido</FormControl.Label>
                        <Input
                            onChangeText={formikModify.handleChange('surnameRepre')}
                            onBlur={formikModify.handleBlur('surnameRepre')}
                            value={formikModify.values.surnameRepre}
                            placeholder='Ejemplo: Valdez' />
                        {formikModify.errors.surnameRepre ? (
                            <Text color={"#FF0000"}>{formikModify.errors.surnameRepre}</Text>
                        ) : null}
                    </FormControl>
                    <FormControl isRequired>
                        <FormControl.Label>Segundo apellido</FormControl.Label>
                        <Input type='text'
                            onChangeText={formikModify.handleChange('secondSurnameRepre')}
                            onBlur={formikModify.handleBlur('secondSurnameRepre')}
                            value={formikModify.values.secondSurnameRepre}
                            placeholder='Ejemplo: Díaz' />
                        {formikModify.errors.secondSurnameRepre ? (
                            <Text color={"#FF0000"}>{formikModify.errors.secondSurnameRepre}</Text>
                        ) : null}
                    </FormControl>
                    <FormControl isRequired>
                        <FormControl.Label>Teléfono</FormControl.Label>
                        <Input keyboardType='phone-pad' type='number'
                            onChangeText={formikModify.handleChange('phoneRepre')}
                            onBlur={formikModify.handleBlur('phoneRepre')}
                            value={formikModify.values.phoneRepre}
                            placeholder='Ejemplo: 771144520' />
                        {formikModify.errors.phoneRepre ? (
                            <Text color={"#FF0000"}>{formikModify.errors.phoneRepre}</Text>
                        ) : null}
                    </FormControl>
                    <FormControl isRequired>
                        <FormControl.Label>Correo electrónico</FormControl.Label>
                        <Input keyboardType='email-address' type='email'
                            onChangeText={formikModify.handleChange('emailRepre')}
                            onBlur={formikModify.handleBlur('emailRepre')}
                            value={formikModify.values.emailRepre}
                            placeholder='Ejemplo: utez@utez.edu.mx' />
                        {formikModify.errors.emailRepre ? (
                            <Text color={"#FF0000"}>{formikModify.errors.emailRepre}</Text>
                        ) : null}
                    </FormControl>
                    {isLoadingModify ? <Loading /> : null}
                </Modal.Body>
            } showModal={showModal} header={"Modificar cliente"} setShowModal={setShowModal} />



            <ModalComponent showButtonConfirm={true} content={
                <Modal.Body>
                    <FormControl isDisabled isRequired>
                        <FormControl.Label>Nombre(s)</FormControl.Label>
                        <Input value={objectModify.name} onChangeText={value => setObjectModify({ ...objectModify, ["nameRepre"]: value })} type='text' placeholder='Ejemplo: María' />
                    </FormControl>
                    <FormControl isRequired isDisabled>
                        <FormControl.Label>Primer apellido</FormControl.Label>
                        <Input value={objectModify.surname} type='text' onChangeText={value => setObjectModify({ ...objectModify, ["surnameRepre"]: value })} placeholder='Ejemplo: Valdez' />
                    </FormControl>
                    <FormControl isDisabled isRequired>
                        <FormControl.Label>Segundo apellido</FormControl.Label>
                        <Input type='text' value={objectModify.secondSurname} onChangeText={value => setObjectModify({ ...objectModify, ["secondSurnameRepre"]: value })} placeholder='Ejemplo: Díaz' />
                    </FormControl>
                    <FormControl isDisabled isRequired>
                        <FormControl.Label>Correo electrónico</FormControl.Label>
                        <Input type='text' value={objectModify.emailClient} onChangeText={value => setObjectModify({ ...objectModify, ["secondSurnameRepre"]: value })} placeholder='Ejemplo: Díaz' />
                    </FormControl>
                    <FormControl isDisabled isRequired>
                        <FormControl.Label>Teléfono</FormControl.Label>
                        <Input type='number' value={objectModify.phoneClient} onChangeText={value => setObjectModify({ ...objectModify, ["phoneClient"]: value })} placeholder='Ejemplo: 7771144520' />
                    </FormControl>
                    <FormControl isDisabled isRequired>
                        <FormControl.Label>Extensión</FormControl.Label>
                        <Input type='number' value={objectModify.extension} onChangeText={value => setObjectModify({ ...objectModify, ["extension"]: value })} placeholder='Ejemplo: 7771144520' />
                    </FormControl>
                    
                    <FormControl isDisabled isRequired>
                        <FormControl.Label>Empresa</FormControl.Label>
                        <Input type='text' value={objectModify.company} onChangeText={value => setObjectModify({ ...objectModify, ["emailClient"]: value })} placeholder='Ejemplo: Email' />
                    </FormControl>
                    <FormControl isDisabled isRequired>
                        <FormControl.Label>Tipo de cliente</FormControl.Label>
                        <Input type='text' value={ objectModify.typeClient?.description} onChangeText={value => setObjectModify({ ...objectModify, ["phoneClient"]: value })} placeholder='Ejemplo: 7771144520' />
                    </FormControl>
                    <Text style={{ fontWeight: "bold" }}>Información del representante del cliente</Text>
                    <FormControl isDisabled isRequired>
                        <FormControl.Label>Nombre(s)</FormControl.Label>
                        <Input value={objectModify.nameRepre} onChangeText={value => setObjectModify({ ...objectModify, ["nameRepre"]: value })} type='text' placeholder='Ejemplo: María' />
                    </FormControl>
                    <FormControl isRequired isDisabled>
                        <FormControl.Label>Primer apellido</FormControl.Label>
                        <Input value={objectModify.surnameRepre} type='text' onChangeText={value => setObjectModify({ ...objectModify, ["surnameRepre"]: value })} placeholder='Ejemplo: Valdez' />
                    </FormControl>
                    <FormControl isDisabled isRequired>
                        <FormControl.Label>Segundo apellido</FormControl.Label>
                        <Input type='text' value={objectModify.secondSurnameRepre} onChangeText={value => setObjectModify({ ...objectModify, ["secondSurnameRepre"]: value })} placeholder='Ejemplo: Díaz' />
                    </FormControl>
                    <FormControl isDisabled isRequired>
                        <FormControl.Label>Teléfono</FormControl.Label>
                        <Input type='number' value={objectModify.phoneRepre} onChangeText={value => setObjectModify({ ...objectModify, ["phoneRepre"]: value })} placeholder='Ejemplo: 7771144520' />
                    </FormControl>
                    <FormControl isDisabled isRequired>
                        <FormControl.Label>Correo electrónico</FormControl.Label>
                        <Input type='email' value={objectModify.emailRepre} onChangeText={value => setObjectModify({ ...objectModify, ["emailRepre"]: value })} placeholder='Ejemplo: utez@utez.edu.mx' />
                    </FormControl>
                    {isLoadingModify ? <Loading /> : null}
                </Modal.Body>
            } showModal={showModalInfo} header={"Detalles del cliente"} setShowModal={setShowModalInfo} />

        </View>
    )
}