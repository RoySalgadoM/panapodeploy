import { View, RefreshControl } from 'react-native'
import React, { useState, useEffect } from 'react'
import TableComponent from '../../components/TableComponent'
import { Center, ScrollView, Input, Stack, FormControl, Modal, Button, Select, CheckIcon, AddIcon } from "native-base";
import BoxHeaderComponent from '../../components/BoxHeaderComponent'
import ActionsButtons from '../../components/ActionsButtons'
import ModalComponent from '../../components/ModalComponent'
import AlertComponent from '../../components/AlertComponent'
import { ipServer } from "../../config/Config"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../../components/Loading';
import OvalosTextComponent from '../../components/OvalosTextComponent';
import TableUniqueComponent from '../../components/TableUniqueComponent';
import ProgressBarComponent from '../../components/ProgressBarComponent';

export default function ProjectsRD(props) {
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([])
  const [isLoadingTable, setisLoadingTable] = useState(true)
  const [objectModify, setObjectModify] = useState([])
  const [isLoadingModify, setIsLoadingModify] = useState(false)
  const [showModalInfo, setShowModalInfo] = useState(false)
  const [personal, setPersonal] = useState([])
  const [refreshing, setRefreshing] = React.useState(false);
  const [rape, setRape] = useState([])
  const [rd, setRd] = useState([])
  const [addProgrammers, setAddProgrammers] = useState([])
  const [proggrammer, setProggrammer] = useState(0)
  const [isLoadingTableUnique, setIsLoadingTableUnique] = useState(false)
  const [idRape, setIdRape] = useState("")
  const [idRd, setIdRd] = useState("")
  const [errorToMuch, setErrorToMuch] = useState(false)

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getAll()
    getAllPersonal()
    getAllRAPE()
    getAllRD()
    setRefreshing(false)
  }, []);

  useEffect(() => {
    setAddProgrammers([])
    setValuesTeam()
  }, [showModalInfo])

  const deletePrograProspecto = (name) => {

    for (let i = 0; i < addProgrammers.length; i++) {

      if (addProgrammers[i][1] === name) {
        addProgrammers.splice(i, i + 1)
      }
    }
    getAllPersonal()
    getAllRAPE()
    getAllRD()
  }
  let token = ""
  const getAllClients = async () => {
    await getToken()
    fetch(`http://${ipServer}/api/client/`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        "Authorization": `Bearer${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        let client = []
        for (let i = 0; i < responseJson.data.length; i++) {
          let clientTemp = [
            <Select.Item label={`${responseJson.data[i].name} ${responseJson.data[i].surname}`} value={`${responseJson.data[i].id}`} />
          ]
          client.push(clientTemp)
        }
        setDataClient(client)
      })
  }

  useEffect(() => {
    getAllPersonal()
    getAllRAPE()
    getAllRD()
  }, [idRape, idRd])


  const getAllPersonal = async () => {
    setIsLoadingTableUnique(true)
    await getToken()
    let nameRd = ""
    let nameRape = ""
    fetch(`http://${ipServer}/api/person/${idRd}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        "Authorization": `Bearer${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        nameRd = responseJson.data.email
      })
    fetch(`http://${ipServer}/api/person/${idRape}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        "Authorization": `Bearer${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        nameRape = responseJson.data.email
      })
    await fetch(`http://${ipServer}/api/person/`, {
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
          if (responseJson.data[i].profession.description === "Becario") {
            let exist = false;
            let tempName = responseJson.data[i].email
            for (let m = 0; m < addProgrammers.length; m++) {
              if (addProgrammers[m][1] === tempName) {
                exist = true;
              }
            }
            if (tempName === nameRape || tempName === nameRd) {
              exist = true;
            }
            if (exist == false) {
              let personalTemp = [
                <Select.Item label={`${responseJson.data[i].name} ${responseJson.data[i].surname}`} value={`${responseJson.data[i].id}`} />
              ]
              personal.push(personalTemp)
            }

          }

        }
        setPersonal(personal)

      })
    setIsLoadingTableUnique(false)
  }

  const getAllRAPE = async () => {
    setIsLoadingTableUnique(true)
    await getToken()
    let nameRd = ""
    fetch(`http://${ipServer}/api/person/${idRd}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        "Authorization": `Bearer${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        nameRd = responseJson.data.email
      })
    await fetch(`http://${ipServer}/api/user/`, {
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
          for (let r = 0; r < responseJson.data[i].authorities.length; r++) {
            if (responseJson.data[i].authorities[r].acronym === "RAPE") {
              let exist = false;
              let tempName = responseJson.data[i].username
              for (let m = 0; m < addProgrammers.length; m++) {
                if (addProgrammers[m][1] === tempName) {
                  exist = true;
                }
              }
              if (tempName === nameRd) {
                exist = true;
              }
              if (exist == false) {
                console.log(responseJson.data[i].person.id)
                console.log("aaaaaaaaaaaaaaaaa")
                let personalTemp = [
                  <Select.Item label={`${responseJson.data[i].person.name} ${responseJson.data[i].person.surname}`} value={`${responseJson.data[i].person.id}`} />
                ]
                personal.push(personalTemp)
              }

            }
          }

        }
        setRape(personal)

      })
    setIsLoadingTableUnique(false)
  }

  const getAllRD = async () => {
    setIsLoadingTableUnique(true)
    await getToken()
    let nameRape = ""
    fetch(`http://${ipServer}/api/person/${idRape}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        "Authorization": `Bearer${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        nameRape = responseJson.data.email
      })
    await fetch(`http://${ipServer}/api/user/`, {
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
          for (let r = 0; r < responseJson.data[i].authorities.length; r++) {
            if (responseJson.data[i].authorities[r].acronym === "RD") {
              let exist = false;
              let tempName = responseJson.data[i].username
              for (let m = 0; m < addProgrammers.length; m++) {
                if (addProgrammers[m][1] === tempName) {
                  exist = true;
                }
              }
              if (tempName === nameRape) {
                exist = true;
              }
              if (exist == false) {
                let personalTemp = [
                  <Select.Item label={`${responseJson.data[i].person.name} ${responseJson.data[i].person.surname}`} value={`${responseJson.data[i].person.id}`} />
                ]
                personal.push(personalTemp)
              }
            }

          }

        }
        setRd(personal)

      })
    setIsLoadingTableUnique(false)
  }


  const setValuesTeam = async () => {
    setAddProgrammers([])
    let final = []
    setIsLoadingTableUnique(true)
    for (let i = 0; i < objectModify.team.length; i++) {
      if (objectModify.team[i].rolProject.id == 3) {
        let dataAsign = [`${objectModify.team[i].person.name} ${objectModify.team[i].person.surname} ${objectModify.team[i].person.secondSurname}`, objectModify.team[i].person.email, objectModify.team[i].person.profession.description, <ActionsButtons name={"trash"} action={() => {
          deletePrograProspecto(`${objectModify.team[i].person.email}`)
        }} color={"white"} bgColor={"#dc3545"} />]
        await final.push(dataAsign)

      }
      if (objectModify.team[i].rolProject.id == 1) {
        setIsLoadingTableUnique(true)
        setIdRd(objectModify.team[i].person.id)

      }
      if (objectModify.team[i].rolProject.id == 2) {
        setIdRape(objectModify.team[i].person.id)
      }
    }
    await setAddProgrammers(final)
    getAllPersonal()
    getAllRAPE()
    getAllRD()
    setIsLoadingTableUnique(false)

  }
  const addProg = async () => {
    await getToken()
    if (addProgrammers.length < objectModify.numberBeca) {
      setIsLoadingTableUnique(true)
      fetch(`http://${ipServer}/api/person/${proggrammer}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          "Authorization": `Bearer${token}`,
          'Content-Type': 'application/json',
        }

      })
        .then((response) => response.json())
        .then(async (responseJson) => {
          let final = []
          final = addProgrammers;
          let dataAsign = [`${responseJson.data.name} ${responseJson.data.surname} ${responseJson.data.secondSurname}`, responseJson.data.email, responseJson.data.profession.description, <ActionsButtons name={"trash"} action={() => {
            deletePrograProspecto(`${responseJson.data.email}`)
          }} color={"white"} bgColor={"#dc3545"} />]
          await final.push(dataAsign)
          await setAddProgrammers(final)
          getAllPersonal()
          getAllRAPE()
          getAllRD()
          setIsLoadingTableUnique(false)
        })
    } else {
      setErrorToMuch(true)
    }

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
    fetch(`http://${ipServer}/api/project/`, {
      method: 'GET',
      headers: {

        'Content-Type': 'application/json',
        "Authorization": `Bearer${token}`
      }
    })
      .then(async (response) => await response.json(response))
      .then(async (responseJson) => {
        let username = ""
        try {
          username = await AsyncStorage.getItem('username');

        } catch (e) {
          console.log(e)
          // error reading value
        }
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
            let exist = false;
            for (let m = 0; m < responseJson.data[i].team.length; m++) {
              if (responseJson.data[i].team[m].person.email === username && responseJson.data[i].team[m].rolProject.id == 1) {
                exist = true
              }
            }
            if (exist) {
              cont++;
              let newData = [
                cont, responseJson.data[i].acronym, <ProgressBarComponent progress={responseJson.data[i].percentage} text={`${responseJson.data[i].percentage}% Completado`} />,
                responseJson.data[i].statusProject.description === "Pausado"
                  ? <OvalosTextComponent text={responseJson.data[i].statusProject.description} colorB={"#ffc107"} />
                  : responseJson.data[i].statusProject.description === "Cancelado" ?
                    <OvalosTextComponent text={responseJson.data[i].statusProject.description} colorB={"#dc3545"} />
                    : responseJson.data[i].statusProject.description === "Activo" ?
                      <OvalosTextComponent text={responseJson.data[i].statusProject.description} colorB={"#28a745"} />
                      : responseJson.data[i].statusProject.description === "Cerrado" ?
                        <OvalosTextComponent text={responseJson.data[i].statusProject.description} colorB={"#007bff"} />
                        : "",
                responseJson.data[i].priority === "Alta"
                  ? <OvalosTextComponent text={responseJson.data[i].priority} colorB={"#dc3545"} />
                  : responseJson.data[i].priority === "Media" ?
                    <OvalosTextComponent text={responseJson.data[i].priority} colorB={"#ffc107"} />
                    : responseJson.data[i].priority === "Baja" ?
                      <OvalosTextComponent text={responseJson.data[i].priority} colorB={"#28a745"} />
                      : "",
                <ActionsButtons name={"info"} action={() => {
                  setObjectModify(responseJson.data[i])
                  setShowModalInfo(true)
                }} color={"white"} bgColor={"#0b5ed7"} />,
                <ActionsButtons name={"file"} action={() => {
                  props.navigation.navigate("reports", {
                    id: responseJson.data[i].id
                  })
                }} color={"white"} bgColor={"#28a745"} />

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
    getAllPersonal()
    getAllRAPE()
    getAllRD()
  }, [])

  return (
    <View>
      <ScrollView refreshControl={<RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />} _contentContainerStyle={{
        minW: "100%"
      }}>
        <TableComponent isLoadingTable={isLoadingTable} setisLoadingTable={setisLoadingTable} isOpen={true} title={"Proyectos"}
          isSearch={true}
          tableHead={['#', 'Identificador', 'Avance real del proyecto', 'Estado', 'Prioridad', 'Detalles', 'Reportes']}
          widthArr={[40, 180, 200, 180, 180, 120, 120]}
          data={data}
        />
      </ScrollView>

      <ModalComponent showButtonConfirm={true} content={
        <Modal.Body>
          <Center>
            <BoxHeaderComponent fontColor={"#ffffff"} bgColor={"#049474"} isButton={false} isOpen={false} title={"Datos del proyecto"} showIcon={true} Form={
              <Stack mt={3} space={4} w="100%">
                <FormControl isDisabled isRequired>
                  <FormControl.Label>Proyecto anterior</FormControl.Label>
                  <Input type='number' value={showModalInfo ? objectModify.project == null ? "No aplica" : objectModify.project.name : ""} placeholder='Ejemplo: SIGEH' />
                </FormControl>
                <FormControl isDisabled isRequired>
                  <FormControl.Label>Nombre del proyecto</FormControl.Label>
                  <Input type='number' value={objectModify.name} placeholder='Ejemplo: SIGEH' />
                </FormControl>
                <FormControl isDisabled isRequired>
                  <FormControl.Label>Acrónimo del proyecto</FormControl.Label>
                  <Input type='number' value={objectModify.acronym} placeholder='Ejemplo: SIGEH' />
                </FormControl>
                <FormControl isDisabled isRequired>
                  <FormControl.Label>Estado del proyecto</FormControl.Label>
                  <Input type='text' value={objectModify.statusProject?.description} placeholder='Prospecto' />
                </FormControl>
                <FormControl isDisabled isRequired>
                  <FormControl.Label>Prioridad</FormControl.Label>
                  <Input type='text' value={objectModify.priority} placeholder='Prospecto' />
                </FormControl>
                <FormControl isDisabled isRequired>
                  <FormControl.Label>Fecha de inicio</FormControl.Label>
                  <Input type='text' value={objectModify.dateStart} placeholder='Prospecto' />
                </FormControl>
                <FormControl isDisabled isRequired>
                  <FormControl.Label>Fecha de fin</FormControl.Label>
                  <Input type='text' value={objectModify.dateEnd} placeholder='Prospecto' />
                </FormControl>
                <FormControl isDisabled isRequired>
                  <FormControl.Label>Descripción del proyecto</FormControl.Label>
                  <Input type='text' value={objectModify.description} placeholder='Ejemplo: Sirve para hacer compras' />
                </FormControl>
              </Stack>

            } />
            <BoxHeaderComponent fontColor={"#ffffff"} bgColor={"#049474"} isButton={false} isOpen={false} title={"Clientes del proyecto"} showIcon={true} Form={
              <Stack mt={3} space={4} w="100%">
                <FormControl isDisabled isRequired>
                  <FormControl.Label>Cliente</FormControl.Label>
                  <Input value={showModalInfo ? `${objectModify.client.name} ${objectModify.client.surname}` : ""} type='text' placeholder='Ejemplo: María' />
                </FormControl>
              </Stack>
            } />
            <BoxHeaderComponent fontColor={"#ffffff"} bgColor={"#049474"} isButton={false} isOpen={false} title={"Cotización del proyecto"} showIcon={true} Form={
              <Stack mt={3} space={4} w="100%">
                <FormControl isDisabled isRequired>
                  <FormControl.Label>Presupuesto</FormControl.Label>
                  <Input value={objectModify.cotizacion} type='text' placeholder='Ejemplo: María' />
                </FormControl>
                <FormControl isDisabled isRequired>
                  <FormControl.Label>Precio al cliente</FormControl.Label>
                  <Input value={objectModify.priceClient} type='text' placeholder='Ejemplo: Valdez' />
                </FormControl>
                <FormControl isDisabled isRequired>
                  <FormControl.Label>Tiempo estimado (meses)</FormControl.Label>
                  <Input type='text' value={objectModify.months} placeholder='Ejemplo: Díaz' />
                </FormControl>
                <FormControl isDisabled isRequired>
                  <FormControl.Label>Cantidad de becarios</FormControl.Label>
                  <Input type='date' value={objectModify.numberBeca} placeholder='Ejemplo: 2002-06-21' />
                </FormControl>
              </Stack>
            } />
            <BoxHeaderComponent fontColor={"#ffffff"} bgColor={"#049474"} isButton={false} isOpen={false} title={"Equipo de trabajo"} showIcon={true} Form={
              <Stack mt={3} space={4} w="100%">
                {isLoadingTableUnique ? <Loading /> : <FormControl isRequired>
                  <FormControl.Label>Responsable de Proyecto</FormControl.Label>
                  <Select isDisabled selectedValue={`${idRape}`} onValueChange={setIdRape} accessibilityLabel="Eco" placeholder="Seleccione una opción" _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />
                  }} mt={1} >
                    {rape}
                  </Select>
                </FormControl>}
                {isLoadingTableUnique ? <Loading /> : <FormControl isRequired>
                  <FormControl.Label>Responsable de Desarrollo</FormControl.Label>
                  <Select isDisabled selectedValue={`${idRd}`} onValueChange={setIdRd} accessibilityLabel="Eco" placeholder="Seleccione una opción" _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />
                  }} mt={1}>
                    {rd}
                  </Select>
                </FormControl>}
                <BoxHeaderComponent fontColor={"#ffffff"} bgColor={"#049474"} isButton={false} isOpen={false} title={"Analistas programadores"} showIcon={true} Form={
                  <Stack mt={3} space={4} w="100%">
                    <TableUniqueComponent isLoadingTable={isLoadingTableUnique} setisLoadingTable={setIsLoadingTableUnique} isOpen={true} title={""}
                      isSearch={false}
                      tableHead={['Nombre', 'Correo', 'Rol', 'Eliminar']}
                      widthArr={[180, 180, 120, 120]}
                      data={addProgrammers}
                    />
                  </Stack>

                } />
              </Stack>

            } />
          </Center>
          {isLoadingModify ? <Loading /> : null}
        </Modal.Body>
      } showModal={showModalInfo} header={"Detalles del proyecto"} setShowModal={setShowModalInfo} />

    </View>
  )
}