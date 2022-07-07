import { View, RefreshControl } from 'react-native'
import React, { useState, useEffect } from 'react'
import TableComponent from '../../components/TableComponent'
import { Center, ScrollView, Input, Stack, FormControl, Modal, Button, Select, CheckIcon, AddIcon, Text } from "native-base";
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
import * as yup from "yup";
import { useFormik } from "formik";

export default function ProjectsRape(props) {
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
  const [dataProjects, setDataProjects] = useState([])
  const [isLoadingRegister, setIsLoadingRegister] = useState(false)
  const [isOpenAlertRegister, setIsOpenAlertRegister] = useState(false)
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getAll()
    getAllProyectos()
    getAllProspecto()
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

  useEffect(() => {
    getAllPersonal()
    getAllRAPE()
    getAllRD()
  }, [idRape, idRd])
  const formikRegister = useFormik({
    initialValues: {
      phasePlanned: "",
      phaseReal: "",
      stagePlanned: "",
      stageReal: "",
      percentage: "",
      cost: "",
      daysDeviation: ""
    },
    validationSchema: yup.object().shape({
      phasePlanned: yup.string().required("Campo obligatorio"),
      phaseReal: yup.string().required("Campo obligatorio"),
      percentage: yup.string().required("Campo obligatorio"),
      cost: yup.string().required("Campo obligatorio"),
      daysDeviation: yup.string().required("Campo obligatorio")
    }),
    onSubmit: async (values) => {
      await getToken()
      setIsLoadingRegister(true)
      let dateFormat = new Date(new Date());
      let year = dateFormat.getFullYear();
      let day = dateFormat.getDate();
      if (day < 10) day = `0${day}`
      let month = dateFormat.getMonth();
      month = month + 1;
      if (month < 10) month = `0${month}`
      let finalDate = `${year}-${month}-${day}`
      if (values.phasePlanned == 1) {
        values.phasePlanned = "Inicio"
      } else if (values.phasePlanned == 2) {
        values.phasePlanned = "Requerimientos"
      } else if (values.phasePlanned == 3) {
        values.phasePlanned = "Análisis y diseño"
      } else if (values.phasePlanned == 4) {
        values.phasePlanned = "Construcción"
      } else if (values.phasePlanned == 5) {
        values.phasePlanned = "Integración y pruebas"
      } else if (values.phasePlanned == 6) {
        values.phasePlanned = "Cierre"
      }

      if (values.phaseReal == 1) {
        values.phaseReal = "Inicio"
      } else if (values.phaseReal == 2) {
        values.phaseReal = "Requerimientos"
      } else if (values.phaseReal == 3) {
        values.phaseReal = "Análisis y diseño"
      } else if (values.phaseReal == 4) {
        values.phaseReal = "Construcción"
      } else if (values.phaseReal == 5) {
        values.phaseReal = "Integración y pruebas"
      } else if (values.phaseReal == 6) {
        values.phaseReal = "Cierre"
      }

      if (values.stagePlanned == 1) {
        values.stagePlanned = "Planeación"
      } else if (values.stagePlanned == 2) {
        values.stagePlanned = "Realización"
      } else if (values.stagePlanned == 3) {
        values.stagePlanned = "Control y evaluación"
      } else if (values.stagePlanned == 4) {
        values.stagePlanned = "Cierre"
      }

      if (values.stageReal == 1) {
        values.stageReal = "Planeación"
      } else if (values.stageReal == 2) {
        values.stageReal = "Realización"
      } else if (values.stageReal == 3) {
        values.stageReal = "Control y evaluación"
      } else if (values.stageReal == 4) {
        values.stageReal = "Cierre"
      }

      let registerData = {
        ...values,
        project: {
          id: objectModify
        },
        date: finalDate
      }
      console.log(registerData)
      fetch(`http://${ipServer}/api/report/`, {
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
          console.log(responseJson)
          formikInsert.values.report = responseJson.data.id;

          formikInsert.handleSubmit()
        })
    },
  });
  const formikInsert = useFormik({
    initialValues: {
      inicio: "",
      requerimientos: "",
      analisis: "",
      construccion: "",
      integracion: "",
      cierre: "",
      report: ""
    },
    onSubmit: async (values) => {
      await getToken()
      let data = {
        report: {
          id: values.report
        },
        phases: {
          id: 1
        },
        porcentaje: values.inicio
      }
      fetch(`http://${ipServer}/api/reportphases/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "Authorization": `Bearer${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),

      })
        .then((response) => response.json())
        .then(async (responseJson) => {

        })

      data = {
        report: {
          id: values.report
        },
        phases: {
          id: 2
        },
        porcentaje: values.requerimientos
      }
      fetch(`http://${ipServer}/api/reportphases/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "Authorization": `Bearer${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),

      })
        .then((response) => response.json())
        .then(async (responseJson) => {

        })
      data = {
        report: {
          id: values.report
        },
        phases: {
          id: 3
        },
        porcentaje: values.analisis
      }
      fetch(`http://${ipServer}/api/reportphases/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "Authorization": `Bearer${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),

      })
        .then((response) => response.json())
        .then(async (responseJson) => {

        })
      data = {
        report: {
          id: values.report
        },
        phases: {
          id: 4
        },
        porcentaje: values.construccion
      }
      fetch(`http://${ipServer}/api/reportphases/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "Authorization": `Bearer${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),

      })
        .then((response) => response.json())
        .then(async (responseJson) => {

        })
      data = {
        report: {
          id: values.report
        },
        phases: {
          id: 5
        },
        porcentaje: values.integracion
      }
      fetch(`http://${ipServer}/api/reportphases/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "Authorization": `Bearer${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),

      })
        .then((response) => response.json())
        .then(async (responseJson) => {

        })
      data = {
        report: {
          id: values.report
        },
        phases: {
          id: 6
        },
        porcentaje: values.cierre
      }
      fetch(`http://${ipServer}/api/reportphases/`, {
        method: 'POST',
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
          setIsOpenAlertRegister(true)
          getAll()
          formikRegister.resetForm();
          formikInsert.resetForm();
          setIsLoadingRegister(false)
          setShowModal(false)
        })

    },
  });

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

  const getAllProyectos = async () => {
    await getToken()
    fetch(`http://${ipServer}/api/project/`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        "Authorization": `Bearer${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        let proyects = []
        for (let i = 0; i < responseJson.data.length; i++) {
          if (responseJson.data[i].statusProject.id == 4 || responseJson.data[i].statusProject.id == 5) {
            let proyectTemp = [
              <Select.Item label={`${responseJson.data[i].name}`} value={`${responseJson.data[i].id}`} />
            ]
            proyects.push(proyectTemp)
          }
        }
        setDataProjects(proyects)
      })
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
              if (responseJson.data[i].team[m].person.email === username && responseJson.data[i].team[m].rolProject.id == 2) {
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
                <ActionsButtons name={"plus"} action={() => {
                  setObjectModify(responseJson.data[i].id)
                  setShowModal(true)
                }} color={"black"} bgColor={"#ffc107"} />,
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
    getAllProyectos()
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
        {isOpenAlertRegister ? <AlertComponent isOpen={setIsOpenAlertRegister} status={"success"} title={"Reporte realizado correctamente"} /> : null}
        <TableComponent isLoadingTable={isLoadingTable} setisLoadingTable={setisLoadingTable} isOpen={true} title={"Proyectos"}
          isSearch={true}
          tableHead={['#', 'Identificador', 'Avance real del proyecto', 'Estado', 'Prioridad', 'Detalles', 'Hacer reporte', 'Reportes']}
          widthArr={[40, 180, 200, 180, 180, 120, 120, 120]}
          data={data}
        />
      </ScrollView>

      <ModalComponent formik={formikRegister} content={
        <Modal.Body>
          <FormControl isRequired>
            <FormControl.Label>Etapa planeada (APE)</FormControl.Label>
            <Select selectedValue={formikRegister.values.stagePlanned}
              onBlur={formikRegister.handleBlur('stagePlanned')}
              onValueChange={formikRegister.handleChange('stagePlanned')} accessibilityLabel="Eco" placeholder="Seleccione una opción" _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />
              }} mt={1} >
              <Select.Item label="Planeación" value="1" />
              <Select.Item label="Realización" value="2" />
              <Select.Item label="Control y evaluación" value="3" />
              <Select.Item label="Cierre" value="4" />
            </Select>
            {formikRegister.errors.stagePlanned ? (
              <Text color={"#FF0000"}>{formikRegister.errors.stagePlanned}</Text>
            ) : null}
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label>Etapa real (APE)</FormControl.Label>
            <Select selectedValue={formikRegister.values.stageReal}
              onBlur={formikRegister.handleBlur('stageReal')}
              onValueChange={formikRegister.handleChange('stageReal')} accessibilityLabel="Eco" placeholder="Seleccione una opción" _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />
              }} mt={1} >
              <Select.Item label="Planeación" value="1" />
              <Select.Item label="Realización" value="2" />
              <Select.Item label="Control y evaluación" value="3" />
              <Select.Item label="Cierre" value="4" />
            </Select>
            {formikRegister.errors.stageReal ? (
              <Text color={"#FF0000"}>{formikRegister.errors.stageReal}</Text>
            ) : null}
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label>Fase planeada (DMS)</FormControl.Label>
            <Select selectedValue={formikRegister.values.phasePlanned}
              onBlur={formikRegister.handleBlur('phasePlanned')}
              onValueChange={formikRegister.handleChange('phasePlanned')} accessibilityLabel="Eco" placeholder="Seleccione una opción" _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />
              }} mt={1} >
              <Select.Item label="Inicio" value="1" />
              <Select.Item label="Requerimientos" value="2" />
              <Select.Item label="Análisis y diseño" value="3" />
              <Select.Item label="Construcción" value="4" />
              <Select.Item label="Integración y pruebas" value="5" />
              <Select.Item label="Cierre" value="6" />
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label>Fase real (DMS)</FormControl.Label>
            <Select selectedValue={formikRegister.values.phaseReal}
              onBlur={formikRegister.handleBlur('phaseReal')}
              onValueChange={formikRegister.handleChange('phaseReal')} accessibilityLabel="Eco" placeholder="Seleccione una opción" _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />
              }} mt={1} >
              <Select.Item label="Inicio" value="1" />
              <Select.Item label="Requerimientos" value="2" />
              <Select.Item label="Análisis y diseño" value="3" />
              <Select.Item label="Construcción" value="4" />
              <Select.Item label="Integración y pruebas" value="5" />
              <Select.Item label="Cierre" value="6" />
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label>Porcentaje de avance total (%)</FormControl.Label>
            <Input keyboardType='number-pad' type='text'
              onChangeText={formikRegister.handleChange('percentage')}
              onBlur={formikRegister.handleBlur('percentage')}
              value={formikRegister.values.percentage}
              placeholder='Ejemplo: 20' />
            {formikRegister.errors.percentage ? (
              <Text color={"#FF0000"}>{formikRegister.errors.percentage}</Text>
            ) : null}
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label>Costo total de inversión</FormControl.Label>
            <Input keyboardType='number-pad' type='text'
              onChangeText={formikRegister.handleChange('cost')}
              onBlur={formikRegister.handleBlur('cost')}
              value={formikRegister.values.cost}
              placeholder='Ejemplo: 6000' />
            {formikRegister.errors.cost ? (
              <Text color={"#FF0000"}>{formikRegister.errors.cost}</Text>
            ) : null}
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label>Días de desviación</FormControl.Label>
            <Input keyboardType='number-pad' type='text'
              onChangeText={formikRegister.handleChange('daysDeviation')}
              onBlur={formikRegister.handleBlur('daysDeviation')}
              value={formikRegister.values.daysDeviation}
              placeholder='Ejemplo: 6' />
            {formikRegister.errors.daysDeviation ? (
              <Text color={"#FF0000"}>{formikRegister.errors.daysDeviation}</Text>
            ) : null}
          </FormControl>
          <Text style={{ fontWeight: "bold" }}>Porcentaje de avance por fase</Text>
          <FormControl isRequired>
            <FormControl.Label>Inicio</FormControl.Label>
            <Input keyboardType='number-pad' type='text'
              onChangeText={formikInsert.handleChange('inicio')}
              onBlur={formikInsert.handleBlur('inicio')}
              value={formikInsert.values.inicio}
              placeholder='Ejemplo: 20' />
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label>Requerimientos</FormControl.Label>
            <Input keyboardType='number-pad' type='text'
              onChangeText={formikInsert.handleChange('requerimientos')}
              onBlur={formikInsert.handleBlur('requerimientos')}
              value={formikInsert.values.requerimientos}
              placeholder='Ejemplo: 20' />
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label>Análisis y diseño</FormControl.Label>
            <Input keyboardType='number-pad' type='text'
              onChangeText={formikInsert.handleChange('analisis')}
              onBlur={formikInsert.handleBlur('analisis')}
              value={formikInsert.values.analisis}
              placeholder='Ejemplo: 20' />
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label>Construcción</FormControl.Label>
            <Input keyboardType='number-pad' type='text'
              onChangeText={formikInsert.handleChange('construccion')}
              onBlur={formikInsert.handleBlur('construccion')}
              value={formikInsert.values.construccion}
              placeholder='Ejemplo: 20' />
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label>Integración y pruebas</FormControl.Label>
            <Input keyboardType='number-pad' type='text'
              onChangeText={formikInsert.handleChange('integracion')}
              onBlur={formikInsert.handleBlur('integracion')}
              value={formikInsert.values.integracion}
              placeholder='Ejemplo: 20' />
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label>Integración y pruebas</FormControl.Label>
            <Input keyboardType='number-pad' type='text'
              onChangeText={formikInsert.handleChange('cierre')}
              onBlur={formikInsert.handleBlur('cierre')}
              value={formikInsert.values.cierre}
              placeholder='Ejemplo: 20' />
          </FormControl>

          {isLoadingRegister ? <Loading /> : null}
        </Modal.Body>
      } showModal={showModal} header={"Modificar directivo"} setShowModal={setShowModal} />


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