import { View, Text, RefreshControl } from 'react-native'
import React, { useState, useEffect } from 'react'
import TableComponent from '../components/TableComponent'
import { Center, ScrollView, VStack, Divider, HStack } from "native-base";
import { Box } from "native-base";
import ProgressBarComponent from '../components/ProgressBarComponent';
import OvalosTextComponent from '../components/OvalosTextComponent';
import AlertComponent from '../components/AlertComponent';
import { ipServer } from '../config/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActionsButtons from '../components/ActionsButtons';

export default function Dashboard(props) {
  const [changeRol, setChangeRol] = useState(false)
  const [isLoadingTable, setIsLoadingTable] = useState(false)
  const [data, setData] = useState([])
  const [dataCount, setDataCount] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const getAllProyects = async () => {
    await getToken()
    fetch(`http://${ipServer}/api/project/`, {
      method: 'GET',
      headers: {

        'Content-Type': 'application/json',
        "Authorization": `Bearer${token}`
      }
    })
      .then(async (response) => await response.json(response))
      .then(async (responseJson) => {
        let activos = 0;
        let pausados = 0;
        let cerrados = 0;
        let cancelados = 0;
        for (let i = 0; i < responseJson.data.length; i++) {
          if (responseJson.data[i].statusProject.description === "Activo") {
            activos++;
          } else if (responseJson.data[i].statusProject.description === "Cerrado") {
            cerrados++;
          } else if (responseJson.data[i].statusProject.description === "Pausado") {
            pausados++;
          } else if (responseJson.data[i].statusProject.description === "Cancelado") {
            cancelados++;
          }
        }
        setDataCount(
          {
            activos: activos,
            pausados: pausados,
            cerrados: cerrados,
            cancelados: cancelados
          }
        )

      })
  }
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getAll()
    getAllProyects()
    setRefreshing(false)
  }, []);
  useEffect(() => {
    if (props.route.params?.rol != undefined) {
      setChangeRol(true)
    }
  }, [props.route.params])
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
    setIsLoadingTable(true);
    await getToken()
    fetch(`http://${ipServer}/api/project/`, {
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
        let arrTemp = responseJson.data

        responseJson.data = []
        for (let m = 0; m < arrTemp.length; m++) {
          if (arrTemp[m].priority === "Alta") {
            responseJson.data.push(arrTemp[m])
          }

        }
        for (let m = 0; m < arrTemp.length; m++) {
          if (arrTemp[m].priority === "Media") {
            responseJson.data.push(arrTemp[m])

          }
        }
        for (let m = 0; m < arrTemp.length; m++) {
          if (arrTemp[m].priority === "Baja") {
            responseJson.data.push(arrTemp[m])
          }
        }
        for (let i = 0; i < responseJson.data.length; i++) {
          if (responseJson.data[i].statusProject.description != "Prospecto") {
            let start = new Date(responseJson.data[i].dateStart).getTime();
            let end = new Date(responseJson.data[i].dateEnd).getTime();
            let diferencia = end - start;
            let final = diferencia / (1000 * 60 * 60 * 24)
            let porcentaje = (final * responseJson.data[i].daysDeviation) / 100;
            if (porcentaje < 0) {
              porcentaje = porcentaje * -1;
            }


            cont++;
            let newData = [
              cont, responseJson.data[i].acronym, responseJson.data[i].name, <ProgressBarComponent progress={responseJson.data[i].percentage} text={`${responseJson.data[i].percentage}% Completado`} />,
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
                    : "",
              responseJson.data[i].statusProject.description === "Pausado"
                ? <OvalosTextComponent text={responseJson.data[i].statusProject.description} colorB={"#ffc107"} />
                : responseJson.data[i].statusProject.description === "Cancelado" ?
                  <OvalosTextComponent text={responseJson.data[i].statusProject.description} colorB={"#dc3545"} />
                  : responseJson.data[i].statusProject.description === "Activo" ?
                    <OvalosTextComponent text={responseJson.data[i].statusProject.description} colorB={"#28a745"} />
                    : responseJson.data[i].statusProject.description === "Cerrado" ?
                      <OvalosTextComponent text={responseJson.data[i].statusProject.description} colorB={"#007bff"} />
                      : "",
              <ActionsButtons name={"file"} action={() => {
                props.navigation.navigate("reports", {
                  id: responseJson.data[i].id
                })
              }} color={"white"} bgColor={"#28a745"} />

            ];
            await tempData.push(newData)

          }


        }
        await setData(tempData)
        setIsLoadingTable(false)
      })
      .catch((error) => {
        console.log(error)
        setIsLoadingTable(false)
      });

  }
  useEffect(() => {
    getAll()
    getAllProyects()
  }, [])

  return (
    <View style={{ backgroundColor: "#ffffff" }} alignItems={"center"} >

      <ScrollView refreshControl={<RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />} _contentContainerStyle={{
        minW: "100%"
      }}>

        <Center>
          {changeRol ? <AlertComponent isOpen={setChangeRol} status={"success"} title={"Rol cambiado correctamente"} /> : null}
          <VStack space={4} alignItems="center">
            <HStack space={3} justifyContent="center">
              <Center width="50%" >
                <Box bg="#28a745" p="3" alignItems={"center"} shadow={2} _text={{
                  fontSize: "md",
                  fontWeight: "bold",
                  color: "white"
                }}>
                  <Text style={{ fontSize: 20, color: "#ffff", fontWeight: "bold" }}>
                    {dataCount.activos}
                  </Text>
                  <Text style={{ fontSize: 17, textAlign: "center", color: "#ffff" }}>
                    Proyectos  activos
                  </Text>
                </Box>
              </Center>
              <Center width="50%">
                <Box bg="#ffc107" p="3" alignItems={"center"} shadow={2} _text={{
                  fontSize: "md",
                  fontWeight: "bold",
                  color: "white"
                }}>
                  <Text style={{ fontSize: 20, color: "black", fontWeight: "bold" }}>
                    {dataCount.pausados}
                  </Text>
                  <Text style={{ fontSize: 17, textAlign: "center", color: "black" }}>
                    Proyectos pausados
                  </Text>
                </Box>
              </Center>
            </HStack>
            <HStack space={3} justifyContent="center">
              <Center width="50%">
              <Box  bg="#17a2b8" p="3" alignItems={"center"} shadow={2} _text={{
                fontSize: "md",
                fontWeight: "bold",
                color: "white"
              }}>
                <Text style={{ fontSize: 20, color: "#ffff", fontWeight: "bold" }}>
                  {dataCount.cerrados}
                </Text>
                <Text style={{ fontSize: 17, textAlign: "center", color: "#ffff" }}>
                  Proyectos cerrados
                </Text>
              </Box>
            </Center>
            <Center width="50%">
              <Box bg="#dc3545" p="3" alignItems={"center"} shadow={2} _text={{
                fontSize: "md",
                fontWeight: "bold",
                color: "white"
              }}>
                <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>
                  {dataCount.cancelados}
                </Text>
                <Text style={{ fontSize: 17, textAlign: "center", color: "white" }}>
                  Proyectos cancelados
                </Text>
              </Box>
            </Center>
            </HStack>
          </VStack>

        </Center>


        <Divider />
        <TableComponent isOpen={true} title={"Proyectos"} showIcon={false} isLoadingTable={isLoadingTable} setisLoadingTable={setIsLoadingTable}
          tableHead={['#', 'Acrónimo', 'Nombre del proyecto', 'Avance real del proyecto', 'Días de desviación', 'Prioridad', 'Estado', 'Historial de reportes']}
          widthArr={[40, 180, 200, 180, 180, 180, 180, 120]}
          data={data}
        />

      </ScrollView>

    </View>


  )
}