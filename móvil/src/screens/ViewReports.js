import { View, RefreshControl } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Text, ScrollView, Modal, FormControl, Progress } from "native-base";
import TableComponent from '../components/TableComponent';
import ProgressBarComponent from '../components/ProgressBarComponent';
import OvalosTextComponent from '../components/OvalosTextComponent';
import { ipServer } from '../config/Config';
import ModalComponent from '../components/ModalComponent';
import ActionsButtons from '../components/ActionsButtons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ViewReports(props) {
    const [data, setData] = useState([])
    const [isLoadingTable, setIsLoadingTable] = useState(false)
    const [showModalInfo, setShowModalInfo] = useState(false)
    const [refreshing, setRefreshing] = React.useState(false);
    const [object, setObject] = useState(false)
    let token = ""
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getAllReports()
        setRefreshing(false)
    }, []);
    useEffect(() => {
        console.log(props.route.params?.id)

        getAllReports();
    }, [props.route.params?.id])
    const getToken = async () => {
        try {
            token = await AsyncStorage.getItem('token')

        } catch (e) {
            console.log(e)
            // error reading value
        }
    }


    const getAllReports = async () => {
        await getToken()
        setIsLoadingTable(true)
        fetch(`http://${ipServer}/api/report/`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                "Authorization": `Bearer${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then(async (responseJson) => {
                let tempData = []
                let cont = 0;
                for (let i = 0; i < responseJson.data.length; i++) {
                    let temp = {
                        cierre: "",
                        inicio: "",
                        requerimientos: "",
                        construccion: "",
                        analisis: "",
                        integracion: ""
                    }
                    setIsLoadingTable(true)

                    if (responseJson.data[i].project.id == props.route.params?.id) {
                        fetch(`http://${ipServer}/api/reportphases/`, {
                            method: 'GET',
                            headers: {
                                Accept: 'application/json',
                                "Authorization": `Bearer${token}`,
                                'Content-Type': 'application/json',
                            },
                        })
                            .then((response) => response.json())
                            .then(async (response2) => {
                                for (let m = 0; m < response2.data.length; m++) {
                                    if (response2.data[m].report.project.id == props.route.params?.id) {

                                        if (response2.data[m].phases.id == 1) {
                                            temp = {
                                                ...temp,
                                                inicio: response2.data[m].porcentaje
                                            }
                                        }
                                        if (response2.data[m].phases.id == 2) {
                                            temp = {
                                                ...temp,
                                                requerimientos: response2.data[m].porcentaje
                                            }

                                        }
                                        if (response2.data[m].phases.id == 3) {
                                            temp = {
                                                ...temp,
                                                analisis: response2.data[m].porcentaje
                                            }

                                        }
                                        if (response2.data[m].phases.id == 4) {
                                            temp = {
                                                ...temp,
                                                construccion: response2.data[m].porcentaje
                                            }

                                        }
                                        if (response2.data[m].phases.id == 5) {
                                            temp = {
                                                ...temp,
                                                integracion: response2.data[m].porcentaje
                                            }

                                        }
                                        if (response2.data[m].phases.id == 6) {
                                            temp = {
                                                ...temp,
                                                cierre: response2.data[m].porcentaje
                                            }

                                        }

                                    }

                                }
                            })
                        cont++;
                        let start = new Date(responseJson.data[i].project.dateStart).getTime();
                        let end = new Date(responseJson.data[i].project.dateEnd).getTime();
                        let diferencia = end - start;
                        let final = diferencia / (1000 * 60 * 60 * 24)
                        let porcentaje = (final * responseJson.data[i].daysDeviation) / 100;
                        porcentaje = porcentaje * -1;
                        porcentaje = porcentaje * -1;
                        console.log(porcentaje)
                        let newData = [
                            cont, responseJson.data[i].date, responseJson.data[i].stagePlanned, responseJson.data[i].stageReal,
                            responseJson.data[i].phasePlanned, responseJson.data[i].phaseReal,
                            <ProgressBarComponent progress={responseJson.data[i].percentage} text={`${responseJson.data[i].percentage}% Completado`} />,

                            <ActionsButtons name={"bars"} action={() => {

                                setObject(temp)
                                setShowModalInfo(true)
                                console.log(temp)
                            }} color={"white"} bgColor={"#0b5ed7"} />,
                            responseJson.data[i].cost,

                            responseJson.data[i].daysDeviation == undefined ?
                                <OvalosTextComponent text={"No hay reportes"} colorB={"grey"} /> :
                                porcentaje >= 0 && porcentaje <= 10 ?
                                    <OvalosTextComponent text={responseJson.data[i].daysDeviation} colorB={"rgb(40, 167, 69)"} />
                                    : porcentaje >= 10 && porcentaje <= 15 ?
                                        <OvalosTextComponent text={responseJson.data[i].daysDeviation} colorB={"rgb(255, 193, 7)"} />
                                        :
                                        <OvalosTextComponent text={responseJson.data[i].daysDeviation} colorB={"rgb(220, 53, 69)"} />,

                            responseJson.data[i].priority === "Alta"
                                ? <OvalosTextComponent text={responseJson.data[i].priority} colorB={"#dc3545"} />
                                : responseJson.data[i].priority === "Media" ?
                                    <OvalosTextComponent text={responseJson.data[i].priority} colorB={"#ffc107"} />
                                    : responseJson.data[i].priority === "Baja" ?
                                        <OvalosTextComponent text={responseJson.data[i].priority} colorB={"#28a745"} />
                                        : ""

                        ]
                        await tempData.push(newData)
                    }

                }
                await setData(tempData)
                setIsLoadingTable(false)
            })
    }

    return (
        <View style={{ backgroundColor: "#ffffff" }} alignItems={"center"} >
            <ScrollView refreshControl={<RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
            />} _contentContainerStyle={{
                minW: "100%"
            }}>
                <TableComponent isLoadingTable={isLoadingTable} setisLoadingTable={setIsLoadingTable} isOpen={true} title={"Reportes"}
                    isSearch={false}
                    tableHead={['#', 'Fecha', 'Etapa real (APE)', 'Fase real (DMS)', 'Porcentaje de avance total', 'Porcentaje de avance por fase', 'Costo total de inversión', 'Días de desviación']}
                    widthArr={[40, 180, 180, 180, 180, 120, 180, 120]}
                    data={data}
                />
            </ScrollView>

            <ModalComponent showButtonConfirm={true} content={
                <Modal.Body>
                    <FormControl isDisabled>
                        <FormControl.Label>Inicio</FormControl.Label>
                        <Progress colorScheme="emerald" value={object.inicio} mx="4" />
                        <Text style={{ textAlign: "center" }}>
                            {object.inicio}% Completado
                        </Text>
                    </FormControl>
                    <FormControl isDisabled>
                        <FormControl.Label>Requerimientos</FormControl.Label>
                        <Progress colorScheme="emerald" value={object.requerimientos} mx="4" />
                        <Text style={{ textAlign: "center" }}>
                            {object.requerimientos}% Completado
                        </Text>
                    </FormControl>
                    <FormControl isDisabled>
                        <FormControl.Label>Análisis y diseño</FormControl.Label>
                        <Progress colorScheme="emerald" value={object.analisis} mx="4" />
                        <Text style={{ textAlign: "center" }}>
                            {object.analisis}% Completado
                        </Text>
                    </FormControl>
                    <FormControl isDisabled>
                        <FormControl.Label>Construcción</FormControl.Label>
                        <Progress colorScheme="emerald" value={object.construccion} mx="4" />
                        <Text style={{ textAlign: "center" }}>
                            {object.construccion}% Completado
                        </Text>
                    </FormControl>
                    <FormControl isDisabled>
                        <FormControl.Label>Integración y pruebas</FormControl.Label>
                        <Progress colorScheme="emerald" value={object.integracion} mx="4" />
                        <Text style={{ textAlign: "center" }}>
                            {object.integracion}% Completado
                        </Text>
                    </FormControl>
                    <FormControl isDisabled>
                        <FormControl.Label>Cierre</FormControl.Label>
                        <Progress colorScheme="emerald" value={object.cierre} mx="4" />
                        <Text style={{ textAlign: "center" }}>
                            {object.cierre}% Completado
                        </Text>
                    </FormControl>
                </Modal.Body>
            } showModal={showModalInfo} header={"Porcentaje de avances por fases"} setShowModal={setShowModalInfo} />
        </View>
    )
}