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

export default function Roles() {
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
            acronym: "",
            description: ""
        },
        validationSchema: yup.object().shape({
            acronym: yup.string().required("Campo obligatorio"),
            description: yup.string().required("Campo obligatorio")
        }),
        onSubmit: async (values) => {
            setIsLoadingRegister(true)
            await getToken()
            fetch(`http://${ipServer}/api/rol/`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    "Authorization": `Bearer${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),

            })
                .then((response) => response.json())
                .then(async (responseJson) => {
                    setIsOpenAlertRegister(true)
                    getAll()
                    setIsLoadingRegister(false)
                    formikRegister.resetForm();
                })
        },
    });

    const formikModify = useFormik({
        initialValues: {
            id: "",
            description: ""
        },
        validationSchema: yup.object().shape({
            acronym: yup.string().required("Campo obligatorio"),
            description: yup.string().required("Campo obligatorio")
        }),
        onSubmit: async (values) => {
            setIsLoadingModify(true)
            setShowModal(false)
            await getToken()

            fetch(`http://${ipServer}/api/rol/`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    "Authorization": `Bearer${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),

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

        fetch(`http://${ipServer}/api/rol/`, {
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
                    cont++;
                    let newData = [
                        cont, responseJson.data[i].acronym, responseJson.data[i].description
                        ,
                        <ActionsButtons action={() => {
                            setShowModal(true)
                            setObjectModify(responseJson.data[i])
                            formikModify.resetForm
                            formikModify.values.id = responseJson.data[i].id
                            formikModify.values.description = responseJson.data[i].description
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
            {isOpenAlertDelete ? <AlertComponent isOpen={setisOpenAlertDelete} status={"success"} title={"Rol eliminado correctamente"} /> : null}
            {isOpenAlertRegister ? <AlertComponent isOpen={setIsOpenAlertRegister} status={"success"} title={"Rol registrado correctamente"} /> : null}
            {isOpenAlertErrorRegister ? <AlertComponent isOpen={setIsOpenAlertErrorRegister} status={"error"} title={"Rellene todos los campos primero"} /> : null}
            <ScrollView refreshControl={<RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
            />}
                _contentContainerStyle={{
                    minW: "100%"
                }}>

                <BoxHeaderComponentInit fontColor={"#ffffff"} bgColor={"#049474"} isButton={true} isOpen={false} title={"Registrar roles"} showIcon={true} Form={
                    <Center>
                        <Stack mt={3} space={4} w="100%">
                            <FormControl isRequired>
                                <FormControl.Label>Acrónimo</FormControl.Label>
                                <Input
                                    onChangeText={formikRegister.handleChange('acronym')}
                                    onBlur={formikRegister.handleBlur('acronym')}
                                    value={formikRegister.values.acronym}
                                    type='text' placeholder='Ejemplo: RD' />
                                {formikRegister.errors.acronym ? (
                                    <Text color={"#FF0000"}>{formikRegister.errors.acronym}</Text>
                                ) : null}
                            </FormControl>
                            <FormControl isRequired>
                                <FormControl.Label>Descripción</FormControl.Label>
                                <Input
                                    onChangeText={formikRegister.handleChange('description')}
                                    onBlur={formikRegister.handleBlur('description')}
                                    value={formikRegister.values.description}
                                    type='text' placeholder='Ejemplo: Responsable de desarrollo' />
                                {formikRegister.errors.description ? (
                                    <Text color={"#FF0000"}>{formikRegister.errors.description}</Text>
                                ) : null}
                            </FormControl>
                            {isLoadingRegister ? <Loading /> : null}
                            <Button onPress={formikRegister.handleSubmit} disabled={!(formikRegister.isValid && formikRegister.dirty)} mt="4" bg="#042b61" >
                                Registrar
                            </Button>
                        </Stack>



                    </Center>


                } />
                {isOpenAlertModify ? <AlertComponent isOpen={setIsOpenAlertModify} status={"success"} title={"Rol modificado correctamente"} /> : null}
                <TableComponent isLoadingTable={isLoadingTable} setisLoadingTable={setisLoadingTable} isOpen={true} title={"Roles registrados"}
                    isSearch={true}
                    tableHead={['#', 'Acrónimo', 'Descripción', 'Modificar']}
                    widthArr={[40, 180, 200, 120]}
                    data={data}
                />
            </ScrollView>
            <ModalComponent formik={formikModify} content={
                <Modal.Body>
                    <FormControl isRequired>
                        <FormControl.Label>Descripción</FormControl.Label>
                        <Input
                            onChangeText={formikModify.handleChange('description')}
                            onBlur={formikModify.handleBlur('description')}
                            value={formikModify.values.description}
                            type='text' placeholder='Ejemplo: Responsable de desarrollo' />
                        {formikModify.errors.description ? (
                            <Text color={"#FF0000"}>{formikModify.errors.description}</Text>
                        ) : null}
                    </FormControl>
                    {isLoadingModify ? <Loading /> : null}
                </Modal.Body>
            } showModal={showModal} header={"Modificar rol"} setShowModal={setShowModal} />


        </View>
    )
}