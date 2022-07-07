import { View, RefreshControl } from 'react-native'
import React, { useState, useEffect } from 'react'
import TableComponent from '../../components/TableComponent'
import { Center, ScrollView, Input, Stack, FormControl, WarningOutlineIcon, Modal, Button, Text, Select, CheckIcon, AddIcon } from "native-base";
import BoxHeaderComponent from '../../components/BoxHeaderComponent'
import RNDateTimePicker from '@react-native-community/datetimepicker';
import ActionsButtons from '../../components/ActionsButtons'
import ModalComponent from '../../components/ModalComponent'
import AlertDialogComponent from '../../components/AlertDialogComponent'
import AlertComponent from '../../components/AlertComponent'
import { ipServer } from "../../config/Config"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../../components/Loading';
import EnableAlertDialogComponent from '../../components/EnableAlertDialogComponent';
import OvalosTextComponent from '../../components/OvalosTextComponent';
import * as yup from "yup";
import { useFormik } from "formik";
import BoxHeaderComponentInit from '../../components/BoxHeaderComponentInit';
import TableUniqueComponent from '../../components/TableUniqueComponent';
import ProgressBarComponent from '../../components/ProgressBarComponent';

export default function ProjectsCoordinador(props) {
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
    const [showModalInfo, setShowModalInfo] = useState(false)
    const [showAlertEnable, setShowAlertEnable] = useState(false)
    const [dataProspecto, setdataProspecto] = useState([])
    const [showModalInfoProspecto, setShowModalInfoProspecto] = useState(false)
    const [dataClient, setDataClient] = useState([])
    const [dataProjects, setDataProjects] = useState([])
    const [objectModifyProspecto, setObjectModifyProspecto] = useState([])
    const [showModalModifyProspecto, setShowModalModifyProspecto] = useState(false)
    const [modalStart, setModalStart] = useState(false)
    const [personal, setPersonal] = useState([])
    const [isLoadingIniciar, setIsLoadingIniciar] = useState(false)
    const [refreshing, setRefreshing] = React.useState(false);
    const [dateStart, setDateStart] = useState(false)
    const [dateEnd, setDateEnd] = useState(false)
    const [rape, setRape] = useState([])
    const [rd, setRd] = useState([])
    const [addProgrammers, setAddProgrammers] = useState([])
    const [proggrammer, setProggrammer] = useState(0)
    const [isLoadingTableUnique, setIsLoadingTableUnique] = useState(false)
    const [idRape, setIdRape] = useState("")
    const [idRd, setIdRd] = useState("")
    const [initProject, setInitProject] = useState(false)
    const [errorToMuch, setErrorToMuch] = useState(false)
    const [showModalModify, setShowModalModify] = useState(false)

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getAll()
        getAllClients()
        getAllProyectos()
        getAllProspecto()
        getAllPersonal()
        getAllRAPE()
        getAllRD()
        setRefreshing(false)
    }, []);

    useEffect(() => {
        setAddProgrammers([])
    }, [modalStart])

    useEffect(() => {
        setAddProgrammers([])
        setValuesTeam()
    }, [showModalInfo])

    const showDateStart = () => {
        setDateStart(true)
    }
    const setDateS = (event, date) => {
        if (date === undefined) {
            setDateStart(false)
        } else {
            let dateFormat = new Date(date);
            let year = dateFormat.getFullYear();
            let day = dateFormat.getDate();
            if (day < 10) day = `0${day}`
            let month = dateFormat.getMonth();
            month = month + 1;
            if (month < 10) month = `0${month}`
            let finalDate = `${year}-${month}-${day}`
            formikIniciarProspecto.values.dateStart = finalDate;
            for (let i = 0; i < objectModify.months; i++) {
                month++;
            }
            if (month < 10) month = `0${month}`
            finalDate = `${year}-${month}-${day}`
            formikIniciarProspecto.values.dateEnd = finalDate;
            formikIniciarProspecto.handleChange
            formikIniciarProspecto.handleBlur

            setDateStart(false)
        }

    }

    const showDateEnd = () => {
        setDateEnd(true)
    }
    const setDateE = (event, date) => {
        if (date === undefined) {
            setDateEnd(false)
        } else {
            let dateFormat = new Date(date);
            let year = dateFormat.getFullYear();
            let day = dateFormat.getDate();
            if (day < 10) day = `0${day}`
            let month = dateFormat.getMonth();
            month = month + 1;
            if (month < 10) month = `0${month}`
            let finalDate = `${year}-${month}-${day}`
            formikIniciarProspecto.values.dateEnd = finalDate;
            formikIniciarProspecto.handleChange
            formikIniciarProspecto.handleBlur
            setDateEnd(false)
        }

    }
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

    const formikRegister = useFormik({
        initialValues: {
            project: "",
            name: "",
            description: "",
            client: "",
            cotizacion: "",
            priceClient: "",
            months: "",
            numberBeca: "",
        },
        validationSchema: yup.object().shape({
            name: yup.string().required("Campo obligatorio"),
            description: yup.string().required("Campo obligatorio"),
            client: yup.string().required("Campo obligatorio"),
            cotizacion: yup.string().required("Campo obligatorio"),
            priceClient: yup.string().required("Campo obligatorio"),
            months: yup.string().required("Campo obligatorio"),
            numberBeca: yup.string().required("Campo obligatorio")
        }),
        onSubmit: async (values) => {
            setIsLoadingRegister(true)
            await getToken()
            let registerData = {}
            if (values.project != "" && values.project != 0) {
                registerData = {
                    ...values,
                    client: {
                        id: values.client,
                    },
                    statusProject: {
                        id: 1
                    },
                    project: {
                        id: values.project
                    }

                }

            } else if (values.project == 0 || values.project === "") {
                registerData = {
                    ...values,
                    client: {
                        id: values.client,
                    },
                    statusProject: {
                        id: 1
                    }
                }

                delete registerData.project
            }
            fetch(`http://${ipServer}/api/project/`, {
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
                    setIsOpenAlertRegister(true)
                    getAll()
                    getAllClients()
                    getAllProspecto()
                    getAllProyectos()
                    formikRegister.resetForm();
                    setObject([])
                    setIsLoadingRegister(false)
                })
        },
    });

    const formikModifyProspecto = useFormik({
        initialValues: {
            project: "",
            name: "",
            description: "",
            client: "",
            cotizacion: "",
            priceClient: "",
            months: "",
            numberBeca: "",
        },
        validationSchema: yup.object().shape({
            name: yup.string().required("Campo obligatorio"),
            description: yup.string().required("Campo obligatorio"),
            client: yup.string().required("Campo obligatorio"),
            cotizacion: yup.string().required("Campo obligatorio"),
            priceClient: yup.string().required("Campo obligatorio"),
            months: yup.string().required("Campo obligatorio"),
            numberBeca: yup.string().required("Campo obligatorio")
        }),
        onSubmit: async (values) => {
            setIsLoadingModify(true)
            setShowModalModifyProspecto(false)
            await getToken()
            let registerData = {}
            if (values.project != "" && values.project != 0) {
                registerData = {
                    ...objectModify,
                    name: values.name,
                    description: values.description,
                    client: {
                        id: values.client,
                    },
                    project: {
                        id: values.project
                    },
                    cotizacion: values.cotizacion,
                    priceClient: values.priceClient,
                    months: values.months,
                    numberBeca: values.numberBeca

                }
            } else if (values.project == 0 || values.project === "") {
                registerData = {
                    ...objectModify,
                    name: values.name,
                    description: values.description,
                    client: {
                        id: values.client,
                    },
                    cotizacion: values.cotizacion,
                    priceClient: values.priceClient,
                    months: values.months,
                    numberBeca: values.numberBeca
                }

                delete registerData.project
            }
            fetch(`http://${ipServer}/api/project/`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    "Authorization": `Bearer${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),

            })
                .then((response) => response.json())
                .then(async (responseJson) => {
                    setIsOpenAlertModify(true)
                    getAll()
                    getAllClients()
                    getAllProspecto()
                    getAllProyectos()
                    formikModify.resetForm();
                    setObject([])
                    setIsLoadingModify(false)
                })
        }
    });


    const formikModify = useFormik({
        initialValues: {
            priority: "",
            statusProject: ""
        },
        onSubmit: async (values) => {
            setIsLoadingModify(true)
            let priority = ""
            if (values.priority == 1) {
                priority = "Alta"
            } else if (values.priority == 2) {
                priority = "Media"
            } else if (values.priority == 3) {
                priority = "Baja"
            }
            let registerData = {
                ...objectModify,
                statusProject: {
                    id: values.statusProject
                },
                priority: priority
            }
            fetch(`http://${ipServer}/api/project/`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    "Authorization": `Bearer${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),
            })
                .then((response) => response.json())
                .then(async (responseJson) => {
                    setIsOpenAlertModify(true)
                    getAll()
                    getAllClients()
                    getAllProspecto()
                    getAllProyectos()
                    formikModify.resetForm();
                    setObjectModify([])
                    setIsLoadingModify(false)
                    setShowModalModify(false)
                })
        }
    });

    const formikIniciarProspecto = useFormik({
        initialValues: {
            acronym: "",
            priority: "",
            dateStart: "",
            dateEnd: "",
        },
        validationSchema: yup.object().shape({
            acronym: yup.string().required("Campo obligatorio"),
            priority: yup.string().required("Campo obligatorio")
        }),
        onSubmit: async (values) => {
            await getToken()
            setIsLoadingIniciar(true)

            let dataRegister = {
                ...objectModify,
                acronym: values.acronym,
                priority: values.priority,
                dateEnd: values.dateEnd,
                dateStart: values.dateStart,
                statusProject: {
                    id: 2
                }
            }
            await fetch(`http://${ipServer}/api/project/`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    "Authorization": `Bearer${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataRegister),

            })
                .then((response) => response.json())
                .then(async (responseJson) => {
                    console.log(responseJson)
                })
            let dataRd = {
                project: {
                    id: objectModify.id
                },
                person: {
                    id: idRd
                },
                rolProject: {
                    id: 1
                }
            }
            let dataRape = {
                project: {
                    id: objectModify.id
                },
                person: {
                    id: idRape
                },
                rolProject: {
                    id: 2
                }
            }
            await fetch(`http://${ipServer}/api/personteam/`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    "Authorization": `Bearer${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataRape),

            })
                .then((response) => response.json())
                .then(async (responseJson) => {
                    console.log(responseJson)
                })

            await fetch(`http://${ipServer}/api/personteam/`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    "Authorization": `Bearer${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataRd),

            })
                .then((response) => response.json())
                .then(async (responseJson) => {
                })

            for (let i = 0; i < addProgrammers.length; i++) {
                await fetch(`http://${ipServer}/api/person/`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        "Authorization": `Bearer${token}`,
                        'Content-Type': 'application/json',
                    }
                })
                    .then((response) => response.json())
                    .then(async (responseJson) => {
                        let id = 0;
                        for (let m = 0; m < responseJson.data.length; m++) {
                            if (responseJson.data[m].email === addProgrammers[i][1]) {
                                id = responseJson.data[m].id
                            }
                        }
                        if (id != 0) {
                            let dataProg = {
                                project: {
                                    id: objectModify.id
                                },
                                person: {
                                    id: id
                                },
                                rolProject: {
                                    id: 3
                                }
                            }
                            fetch(`http://${ipServer}/api/personteam/`, {
                                method: 'POST',
                                headers: {
                                    Accept: 'application/json',
                                    "Authorization": `Bearer${token}`,
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(dataProg),

                            })
                                .then((response) => response.json())
                                .then(async (responseJson) => {
                                    setModalStart(false)
                                    setInitProject(true)
                                    getAll()
                                    getAllClients()
                                    getAllProspecto()
                                    getAllProyectos()
                                    formikIniciarProspecto.resetForm();
                                    setObjectModify([])
                                    setIdRape("")
                                    setIdRd("")
                                    setAddProgrammers([])
                                    setIsLoadingIniciar(false)
                                })
                        }
                    })

                console.log(addProgrammers[i][1]);
            }

        }
    });

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

    const onDelete = () => {
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
    const onEnable = () => {
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

    const modify = async () => {
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
            body: JSON.stringify(objectModify),

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
                    if (responseJson.data[i]?.statusProject?.description != "Prospecto") {
                        cont++;
                        let newData = [
                            cont, responseJson.data[i]?.acronym, <ProgressBarComponent progress={responseJson.data[i].percentage} text={`${responseJson.data[i].percentage}% Completado`} />,
                            responseJson.data[i].statusProject?.description === "Pausado"
                                ? <OvalosTextComponent text={responseJson.data[i].statusProject?.description} colorB={"#ffc107"} />
                                : responseJson.data[i].statusProject?.description === "Cancelado" ?
                                    <OvalosTextComponent text={responseJson.data[i].statusProject?.description} colorB={"#dc3545"} />
                                    : responseJson.data[i].statusProject?.description === "Activo" ?
                                        <OvalosTextComponent text={responseJson.data[i].statusProject?.description} colorB={"#28a745"} />
                                        : responseJson.data[i].statusProject?.description === "Cerrado" ?
                                            <OvalosTextComponent text={responseJson.data[i].statusProject?.description} colorB={"#007bff"} />
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
                            <ActionsButtons action={() => {
                                setShowModalModify(true)
                                setObjectModify(responseJson.data[i])
                                formikModify.resetForm
                                formikModify.values.priority = responseJson.data[i].priority === "Alta" ? 1 : responseJson.data[i].priority === "Media" ? 2 : 3
                                formikModify.values.statusProject = responseJson.data[i].statusProject.id
                                formikModify.handleChange
                            }} name={"edit"} color={"black"} bgColor={"#ffc107"} />,
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
                setisLoadingTable(false)
            })
            .catch((error) => {
                console.log(error)
                setisLoadingTable(false)
            });

    }

    const getAllProspecto = async () => {
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
                let tempData = []
                let cont = 0;
                for (let i = 0; i < responseJson.data.length; i++) {
                    if (responseJson.data[i].statusProject?.description === "Prospecto") {
                        cont++;
                        let newData = [
                            cont, responseJson.data[i].name, `${responseJson.data[i].client.name} ${responseJson.data[i].client.surname} ${responseJson.data[i].client.secondSurname}`, `${responseJson.data[i].months} meses`, responseJson.data[i].numberBeca
                            , <OvalosTextComponent text={"Prospecto"} colorB={"#6c757d"} />,
                            <ActionsButtons name={"info"} action={() => {
                                setShowModalInfoProspecto(true)
                                setObjectModifyProspecto(responseJson.data[i])
                            }} color={"white"} bgColor={"#0b5ed7"} />,
                            <ActionsButtons action={() => {
                                setShowModalModifyProspecto(true)
                                setObjectModify(responseJson.data[i])
                                formikModifyProspecto.resetForm
                                formikModifyProspecto.values.project = responseJson.data[i].project == null ? 0 : responseJson.data[i].project.id
                                formikModifyProspecto.values.name = responseJson.data[i].name
                                formikModifyProspecto.values.description = responseJson.data[i].description
                                formikModifyProspecto.values.client = responseJson.data[i].client.id
                                formikModifyProspecto.values.cotizacion = responseJson.data[i].cotizacion
                                formikModifyProspecto.values.priceClient = responseJson.data[i].priceClient
                                formikModifyProspecto.values.months = responseJson.data[i].months
                                formikModifyProspecto.values.numberBeca = responseJson.data[i].numberBeca
                                formikModifyProspecto.handleChange
                            }} name={"edit"} color={"black"} bgColor={"#ffc107"} />,
                            <ActionsButtons name={"play"} action={() => {
                                setObjectModify(responseJson.data[i])
                                setModalStart(true)
                            }} color={"white"} bgColor={"#28a745"} />

                        ];
                        await tempData.push(newData)

                    }


                }
                await setdataProspecto(tempData)
                setisLoadingTable(false)
            })
            .catch((error) => {
                console.log(error)
                setisLoadingTable(false)
            });
    }
    useEffect(() => {
        getAll()
        getAllClients()
        getAllProyectos()
        getAllProspecto()
        getAllPersonal()
        getAllRAPE()
        getAllRD()
    }, [])

    return (
        <View>
            {isOpenAlertDelete ? <AlertComponent isOpen={setisOpenAlertDelete} status={"success"} title={"Estado cambiado correctamente"} /> : null}
            {isOpenAlertRegister ? <AlertComponent isOpen={setIsOpenAlertRegister} status={"success"} title={"Proyecto registrado correctamente"} /> : null}
            {initProject ? <AlertComponent isOpen={setInitProject} status={"success"} title={"Proyecto iniciado correctamente"} /> : null}

            {isOpenAlertErrorRegister ? <AlertComponent isOpen={setIsOpenAlertErrorRegister} status={"error"} title={"Rellene todos los campos primero"} /> : null}
            <ScrollView refreshControl={<RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
            />} _contentContainerStyle={{
                minW: "100%"
            }}>

                <BoxHeaderComponentInit fontColor={"#ffffff"} bgColor={"#049474"} isButton={true} formik={formikRegister} isOpen={false} title={"Registrar proyectos"} showIcon={true} Form={
                    <Center>
                        <Stack mt={3} space={4} w="100%">
                            <BoxHeaderComponent fontColor={"#ffffff"} bgColor={"#049474"} isButton={false} isOpen={false} title={"Datos del proyecto"} showIcon={true} Form={
                                <Center>
                                    <FormControl isRequired>
                                        <FormControl.Label>Proyecto anterior</FormControl.Label>
                                        <Select
                                            selectedValue={formikRegister.values.project} onBlur={formikRegister.handleBlur('project')} onValueChange={formikRegister.handleChange('project')}
                                            accessibilityLabel="Eco" placeholder="Seleccione una opción" _selectedItem={{
                                                bg: "teal.600",
                                                endIcon: <CheckIcon size="5" />
                                            }} mt={1} >
                                            <Select.Item label="No aplica" value="0" />
                                            {dataProjects}
                                        </Select>
                                        <FormControl.HelperText>
                                            Solo seleccionar un proyecto si se requiere un nuevo ciclo del mismo
                                        </FormControl.HelperText>
                                    </FormControl>
                                    <FormControl isRequired>
                                        <FormControl.Label>Nombre del proyecto</FormControl.Label>
                                        <Input type='text'
                                            onChangeText={formikRegister.handleChange('name')}
                                            onBlur={formikRegister.handleBlur('name')}
                                            value={formikRegister.values.name}
                                            placeholder='Ejemplo: SIGEH' />
                                        {formikRegister.errors.name ? (
                                            <Text color={"#FF0000"}>{formikRegister.errors.name}</Text>
                                        ) : null}
                                    </FormControl>
                                    <FormControl isDisabled isRequired>
                                        <FormControl.Label>Estado del proyecto</FormControl.Label>
                                        <Input type='text'
                                            placeholder='Prospecto' />
                                    </FormControl>
                                    <FormControl isRequired>
                                        <FormControl.Label>Descripción del proyecto</FormControl.Label>
                                        <Input type='text'
                                            onChangeText={formikRegister.handleChange('description')}
                                            onBlur={formikRegister.handleBlur('description')}
                                            value={formikRegister.values.description}
                                            placeholder='Ejemplo: Sirve para hacer compras' />
                                        {formikRegister.errors.description ? (
                                            <Text color={"#FF0000"}>{formikRegister.errors.description}</Text>
                                        ) : null}
                                    </FormControl>
                                </Center>
                            } />
                            <BoxHeaderComponent fontColor={"#ffffff"} bgColor={"#049474"} isButton={false} isOpen={false} title={"Clientes del proyecto"} showIcon={true} Form={
                                <Center>
                                    <FormControl isRequired>
                                        <FormControl.Label>Seleccionar un cliente</FormControl.Label>
                                        <Select selectedValue={`${formikRegister.values.client}`} onBlur={formikRegister.handleBlur('client')} onValueChange={formikRegister.handleChange('client')} accessibilityLabel="Eco" placeholder="Seleccione una opción" _selectedItem={{
                                            bg: "teal.600",
                                            endIcon: <CheckIcon size="5" />
                                        }} mt={1} >
                                            {dataClient}
                                        </Select>
                                        {formikRegister.errors.client ? (
                                            <Text color={"#FF0000"}>{formikRegister.errors.client}</Text>
                                        ) : null}
                                    </FormControl>
                                </Center>
                            } />
                            <BoxHeaderComponent fontColor={"#ffffff"} bgColor={"#049474"} isButton={false} isOpen={false} title={"Cotización del proyecto"} showIcon={true} Form={

                                <Center>
                                    <FormControl isRequired>
                                        <FormControl.Label>Presupuesto</FormControl.Label>
                                        <Input keyboardType='number-pad'
                                            onChangeText={formikRegister.handleChange('cotizacion')}
                                            onBlur={formikRegister.handleBlur('cotizacion')}
                                            value={formikRegister.values.cotizacion}
                                            type='text' placeholder='Ejemplo: 5000' />
                                        {formikRegister.errors.cotizacion ? (
                                            <Text color={"#FF0000"}>{formikRegister.errors.cotizacion}</Text>
                                        ) : null}
                                    </FormControl>
                                    <FormControl isRequired>
                                        <FormControl.Label>Precio al cliente</FormControl.Label>
                                        <Input keyboardType='number-pad'
                                            onChangeText={formikRegister.handleChange('priceClient')}
                                            onBlur={formikRegister.handleBlur('priceClient')}
                                            value={formikRegister.values.priceClient}
                                            placeholder='Ejemplo: 50000' />
                                        {formikRegister.errors.priceClient ? (
                                            <Text color={"#FF0000"}>{formikRegister.errors.priceClient}</Text>
                                        ) : null}
                                    </FormControl>
                                    <FormControl isRequired>
                                        <FormControl.Label>Tiempo estimado (meses)</FormControl.Label>
                                        <Input keyboardType='number-pad'
                                            onChangeText={formikRegister.handleChange('months')}
                                            onBlur={formikRegister.handleBlur('months')}
                                            value={formikRegister.values.months}
                                            placeholder='Ejemplo: 12' />
                                        {formikRegister.errors.months ? (
                                            <Text color={"#FF0000"}>{formikRegister.errors.months}</Text>
                                        ) : null}
                                    </FormControl>
                                    <FormControl isRequired>
                                        <FormControl.Label>Cantidad de becarios</FormControl.Label>
                                        <Input keyboardType='number-pad'
                                            onChangeText={formikRegister.handleChange('numberBeca')}
                                            onBlur={formikRegister.handleBlur('numberBeca')}
                                            value={formikRegister.values.numberBeca}
                                            placeholder='Ejemplo: 2' />
                                        {formikRegister.errors.numberBeca ? (
                                            <Text color={"#FF0000"}>{formikRegister.errors.numberBeca}</Text>
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
                {isOpenAlertModify ? <AlertComponent isOpen={setIsOpenAlertModify} status={"success"} title={"Proyecto modificado correctamente"} /> : null}
                <TableComponent showIcon={true} isLoadingTable={isLoadingTable} setisLoadingTable={setisLoadingTable} isOpen={false} title={"Proyectos prospecto"}
                    tableHead={['#', 'Nombre del proyecto', 'Cliente', 'Tiempo estimado', 'Cantidad de becarios', 'Estado', 'Detalles', 'Modificar', 'Iniciar']}
                    widthArr={[40, 180, 180, 180, 120, 120, 120, 120, 120]}
                    data={dataProspecto}
                />
                <TableComponent isLoadingTable={isLoadingTable} setisLoadingTable={setisLoadingTable} isOpen={true} title={"Proyectos"}
                    isSearch={true}
                    tableHead={['#', 'Identificador', 'Avance real del proyecto', 'Estado', 'Prioridad', 'Detalles', 'Modificar', 'Reportes']}
                    widthArr={[40, 180, 200, 180, 180, 120, 120, 120]}
                    data={data}
                />

            </ScrollView>

            {/* Normales */}

            <ModalComponent showButtonConfirm={true} action={modify} content={
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

            <ModalComponent showButtonConfirm={false} formik={formikModify} content={
                <Modal.Body>
                    <FormControl isRequired>
                        <FormControl.Label>Estado del proyecto</FormControl.Label>
                        <Select onBlur={formikModify.handleBlur('statusProject')} onValueChange={formikModify.handleChange('statusProject')} accessibilityLabel="Eco" placeholder="Seleccione una opción" _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon size="5" />
                        }} mt={1} selectedValue={`${formikModify.values.statusProject}`}>
                            <Select.Item label="Activo" value="2" />
                            <Select.Item label="Pausado" value="3" />
                            <Select.Item label="Cerrado" value="4" />
                            <Select.Item label="Cancelado" value="5" />

                        </Select>
                    </FormControl>
                    <FormControl isRequired>
                        <FormControl.Label>Prioridad</FormControl.Label>
                        <Select onBlur={formikModify.handleBlur('priority')} onValueChange={formikModify.handleChange('priority')} accessibilityLabel="Eco" placeholder="Seleccione una opción" _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon size="5" />
                        }} mt={1} selectedValue={`${formikModify.values.priority}`}>
                            <Select.Item label="Alta" value="1" />
                            <Select.Item label="Media" value="2" />
                            <Select.Item label="Baja" value="3" />
                        </Select>
                    </FormControl>

                    {isLoadingModify ? <Loading /> : null}
                </Modal.Body>
            } showModal={showModalModify} header={"Modificar del proyecto"} setShowModal={setShowModalModify} />


            {/* Prospectos */}
            <ModalComponent showButtonConfirm={true} action={modify} content={
                <Modal.Body>
                    <Center>
                        <BoxHeaderComponent fontColor={"#ffffff"} bgColor={"#049474"} isButton={false} isOpen={false} title={"Datos del proyecto"} showIcon={true} Form={
                            <Stack mt={3} space={4} w="100%">
                                <FormControl isDisabled isRequired>
                                    <FormControl.Label>Proyecto anterior</FormControl.Label>
                                    <Input type='number' value={showModalInfoProspecto ? objectModifyProspecto.project == null ? "No aplica" : objectModifyProspecto.project.name : ""} onChangeText={value => setObject({ ...object, ["name"]: value })} placeholder='Ejemplo: SIGEH' />
                                </FormControl>
                                <FormControl isDisabled isRequired>
                                    <FormControl.Label>Nombre del proyecto</FormControl.Label>
                                    <Input type='number' value={objectModifyProspecto.name} onChangeText={value => setObject({ ...object, ["name"]: value })} placeholder='Ejemplo: SIGEH' />
                                </FormControl>
                                <FormControl isDisabled isRequired>
                                    <FormControl.Label>Estado del proyecto</FormControl.Label>
                                    <Input type='text' value={`Prospecto`} onChangeText={value => setObject({ ...object, ["statusProject"]: 1 })} placeholder='Prospecto' />
                                </FormControl>
                                <FormControl isDisabled isRequired>
                                    <FormControl.Label>Descripción del proyecto</FormControl.Label>
                                    <Input type='text' value={objectModifyProspecto.description} onChangeText={value => setObject({ ...object, ["description"]: value })} placeholder='Ejemplo: Sirve para hacer compras' />
                                </FormControl>
                            </Stack>

                        } />
                        <BoxHeaderComponent fontColor={"#ffffff"} bgColor={"#049474"} isButton={false} isOpen={false} title={"Clientes del proyecto"} showIcon={true} Form={
                            <Stack mt={3} space={4} w="100%">

                                <FormControl isDisabled isRequired>
                                    <FormControl.Label>Cliente</FormControl.Label>
                                    <Input value={showModalInfoProspecto ? `${objectModifyProspecto.client.name} ${objectModifyProspecto.client.surname}` : ""} onChangeText={value => setObject({ ...object, ["cotizacion"]: value })} type='text' placeholder='Ejemplo: María' />
                                </FormControl>

                            </Stack>

                        } />
                        <BoxHeaderComponent fontColor={"#ffffff"} bgColor={"#049474"} isButton={false} isOpen={false} title={"Cotización del proyecto"} showIcon={true} Form={
                            <Stack mt={3} space={4} w="100%">
                                <FormControl isDisabled isRequired>
                                    <FormControl.Label>Presupuesto</FormControl.Label>
                                    <Input value={objectModifyProspecto.cotizacion} onChangeText={value => setObject({ ...object, ["cotizacion"]: value })} type='text' placeholder='Ejemplo: María' />
                                </FormControl>
                                <FormControl isDisabled isRequired>
                                    <FormControl.Label>Precio al cliente</FormControl.Label>
                                    <Input value={objectModifyProspecto.priceClient} type='text' onChangeText={value => setObject({ ...object, ["priceClient"]: value })} placeholder='Ejemplo: Valdez' />
                                </FormControl>
                                <FormControl isDisabled isRequired>
                                    <FormControl.Label>Tiempo estimado (meses)</FormControl.Label>
                                    <Input type='text' value={objectModifyProspecto.months} onChangeText={value => setObject({ ...object, ["months"]: value })} placeholder='Ejemplo: Díaz' />
                                </FormControl>
                                <FormControl isDisabled isRequired>
                                    <FormControl.Label>Cantidad de becarios</FormControl.Label>
                                    <Input type='date' value={objectModifyProspecto.numberBeca} onChangeText={value => setObject({ ...object, ["numberBeca"]: value })} placeholder='Ejemplo: 2002-06-21' />
                                </FormControl>
                            </Stack>
                        } />
                    </Center>
                    {isLoadingModify ? <Loading /> : null}
                </Modal.Body>
            } showModal={showModalInfoProspecto} header={"Detalles del proyecto prospecto"} setShowModal={setShowModalInfoProspecto} />

            <ModalComponent formik={formikModifyProspecto} content={
                <Modal.Body>
                    <Center>
                        <BoxHeaderComponent fontColor={"#ffffff"} bgColor={"#049474"} isButton={false} isOpen={false} title={"Datos del proyecto"} showIcon={true} Form={
                            <Stack mt={3} space={4} w="100%">
                                <FormControl isRequired>
                                    <FormControl.Label>Proyecto anterior</FormControl.Label>
                                    <Select
                                        selectedValue={formikModifyProspecto.values.project} onBlur={formikModifyProspecto.handleBlur('project')} onValueChange={formikModifyProspecto.handleChange('project')}
                                        accessibilityLabel="Eco" placeholder="Seleccione una opción" _selectedItem={{
                                            bg: "teal.600",
                                            endIcon: <CheckIcon size="5" />
                                        }} mt={1} >
                                        <Select.Item label="No aplica" value="0" />
                                        {dataProjects}
                                    </Select>
                                    <FormControl.HelperText>
                                        Solo seleccionar un proyecto si se requiere un nuevo ciclo del mismo
                                    </FormControl.HelperText>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormControl.Label>Nombre del proyecto</FormControl.Label>
                                    <Input type='text'
                                        onChangeText={formikModifyProspecto.handleChange('name')}
                                        onBlur={formikModifyProspecto.handleBlur('name')}
                                        value={formikModifyProspecto.values.name}
                                        placeholder='Ejemplo: SIGEH' />
                                </FormControl>
                                {formikModifyProspecto.errors.name ? (
                                    <Text color={"#FF0000"}>{formikModifyProspecto.errors.name}</Text>
                                ) : null}
                                <FormControl isDisabled isRequired>
                                    <FormControl.Label>Estado del proyecto</FormControl.Label>
                                    <Input type='text'
                                        placeholder='Prospecto' />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormControl.Label>Descripción del proyecto</FormControl.Label>
                                    <Input type='text'
                                        onChangeText={formikModifyProspecto.handleChange('description')}
                                        onBlur={formikModifyProspecto.handleBlur('description')}
                                        value={formikModifyProspecto.values.description}
                                        placeholder='Ejemplo: Sirve para hacer compras' />
                                    {formikModifyProspecto.errors.description ? (
                                        <Text color={"#FF0000"}>{formikModifyProspecto.errors.description}</Text>
                                    ) : null}
                                </FormControl>
                            </Stack>

                        } />
                        <BoxHeaderComponent fontColor={"#ffffff"} bgColor={"#049474"} isButton={false} isOpen={false} title={"Clientes del proyecto"} showIcon={true} Form={
                            <Stack mt={3} space={4} w="100%">
                                <FormControl isRequired>
                                    <FormControl.Label>Seleccionar un cliente</FormControl.Label>
                                    <Select selectedValue={`${formikModifyProspecto.values.client}`} onBlur={formikModifyProspecto.handleBlur('client')} onValueChange={formikModifyProspecto.handleChange('client')} accessibilityLabel="Eco" placeholder="Seleccione una opción" _selectedItem={{
                                        bg: "teal.600",
                                        endIcon: <CheckIcon size="5" />
                                    }} mt={1} >
                                        {dataClient}
                                    </Select>
                                    {formikModify.errors.client ? (
                                        <Text color={"#FF0000"}>{formikModify.errors.client}</Text>
                                    ) : null}
                                </FormControl>
                            </Stack>
                        } />
                        <BoxHeaderComponent fontColor={"#ffffff"} bgColor={"#049474"} isButton={false} isOpen={false} title={"Cotización del proyecto"} showIcon={true} Form={
                            <Stack mt={3} space={4} w="100%">
                                <FormControl isRequired>
                                    <FormControl.Label>Presupuesto</FormControl.Label>
                                    <Input keyboardType='number-pad'
                                        onChangeText={formikModifyProspecto.handleChange('cotizacion')}
                                        onBlur={formikModifyProspecto.handleBlur('cotizacion')}
                                        value={formikModifyProspecto.values.cotizacion}
                                        type='text' placeholder='Ejemplo: 5000' />
                                    {formikModifyProspecto.errors.cotizacion ? (
                                        <Text color={"#FF0000"}>{formikModifyProspecto.errors.cotizacion}</Text>
                                    ) : null}
                                </FormControl>
                                <FormControl isRequired>
                                    <FormControl.Label>Precio al cliente</FormControl.Label>
                                    <Input keyboardType='number-pad'
                                        onChangeText={formikModifyProspecto.handleChange('priceClient')}
                                        onBlur={formikModifyProspecto.handleBlur('priceClient')}
                                        value={formikModifyProspecto.values.priceClient}
                                        placeholder='Ejemplo: 50000' />
                                    {formikModifyProspecto.errors.priceClient ? (
                                        <Text color={"#FF0000"}>{formikModifyProspecto.errors.priceClient}</Text>
                                    ) : null}
                                </FormControl>
                                <FormControl isRequired>
                                    <FormControl.Label>Tiempo estimado (meses)</FormControl.Label>
                                    <Input keyboardType='number-pad'
                                        onChangeText={formikModifyProspecto.handleChange('months')}
                                        onBlur={formikModifyProspecto.handleBlur('months')}
                                        value={formikModifyProspecto.values.months}
                                        placeholder='Ejemplo: 12' />
                                    {formikModifyProspecto.errors.months ? (
                                        <Text color={"#FF0000"}>{formikModifyProspecto.errors.months}</Text>
                                    ) : null}
                                </FormControl>
                                <FormControl isRequired>
                                    <FormControl.Label>Cantidad de becarios</FormControl.Label>
                                    <Input keyboardType='number-pad'
                                        onChangeText={formikModifyProspecto.handleChange('numberBeca')}
                                        onBlur={formikModifyProspecto.handleBlur('numberBeca')}
                                        value={formikModifyProspecto.values.numberBeca}
                                        placeholder='Ejemplo: 2' />
                                    {formikModifyProspecto.errors.numberBeca ? (
                                        <Text color={"#FF0000"}>{formikModifyProspecto.errors.numberBeca}</Text>
                                    ) : null}
                                </FormControl>
                            </Stack>
                        } />
                    </Center>
                    {isLoadingModify ? <Loading /> : null}
                </Modal.Body>
            } showModal={showModalModifyProspecto} header={"Modificar proyecto prospecto"} setShowModal={setShowModalModifyProspecto} />

            <ModalComponent formik={formikIniciarProspecto} content={
                <Modal.Body>
                    <Center>
                        <BoxHeaderComponent fontColor={"#ffffff"} bgColor={"#049474"} isButton={false} isOpen={false} title={"Datos del proyecto"} showIcon={true} Form={
                            <Stack mt={3} space={4} w="100%">

                                <FormControl isRequired>
                                    <FormControl.Label>Acrónimo del proyecto</FormControl.Label>
                                    <Input type='text'
                                        onChangeText={formikIniciarProspecto.handleChange('acronym')}
                                        onBlur={formikIniciarProspecto.handleBlur('acronym')}
                                        selectedValue={formikIniciarProspecto.values.acronym}
                                        placeholder='Ejemplo: PANAPO' />
                                    {formikIniciarProspecto.errors.acronym ? (
                                        <Text color={"#FF0000"}>{formikIniciarProspecto.errors.acronym}</Text>
                                    ) : null}
                                </FormControl>

                                <FormControl isDisabled isRequired>
                                    <FormControl.Label>Estado del proyecto</FormControl.Label>
                                    <Select selectedValue={`2`} accessibilityLabel="Eco" placeholder="Seleccione una opción" _selectedItem={{
                                        bg: "teal.600",
                                        endIcon: <CheckIcon size="2" />
                                    }} mt={1} >
                                        <Select.Item label="Activo" value="2" />
                                    </Select>
                                    <FormControl.HelperText>
                                        Al iniciar un proyecto su estado por defecto es activo
                                    </FormControl.HelperText>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormControl.Label>Prioridad</FormControl.Label>
                                    <Select placeholder='Selecciona una opción'
                                        onValueChange={formikIniciarProspecto.handleChange('priority')}
                                        onBlur={formikIniciarProspecto.handleBlur('priority')}
                                        selectedValue={formikIniciarProspecto.values.priority}
                                        _selectedItem={{
                                            bg: "teal.600",
                                            endIcon: <CheckIcon size="2" />
                                        }} mt={1} >
                                        <Select.Item label="Alta" value="Alta" />
                                        <Select.Item label="Media" value="Media" />
                                        <Select.Item label="Baja" value="Baja" />
                                    </Select>
                                    {formikIniciarProspecto.errors.priority ? (
                                        <Text color={"#FF0000"}>{formikIniciarProspecto.errors.priority}</Text>
                                    ) : null}
                                </FormControl>
                                <FormControl isRequired>
                                    <FormControl.Label>Fecha de inicio</FormControl.Label>
                                    <Input keyboardType=''
                                        onChangeText={formikIniciarProspecto.handleChange('dateStart')}
                                        onBlur={formikIniciarProspecto.handleBlur('dateStart')}
                                        value={formikIniciarProspecto.values.dateStart}
                                        type='text' placeholder='Ejemplo: 2022-06-21' />
                                    {dateStart ? <RNDateTimePicker mode='datetime' onChange={setDateS} value={formikIniciarProspecto.values.dateStart != "" ? new Date(formikRegister.values.dateStart) : new Date()} /> : null}
                                    <Button bg="#042b61" onPress={showDateStart}>Elegir fecha</Button>

                                </FormControl>
                                <FormControl isRequired>
                                    <FormControl.Label>Fecha de fin</FormControl.Label>
                                    <Input
                                        onChangeText={formikIniciarProspecto.handleChange('dateEnd')}
                                        onBlur={formikIniciarProspecto.handleBlur('dateEnd')}
                                        value={formikIniciarProspecto.values.dateEnd}
                                        type='text' placeholder='Ejemplo: 2022-07-21' />
                                    {dateEnd ? <RNDateTimePicker mode='datetime' onChange={dateEnd && setDateE} value={formikIniciarProspecto.values.dateEnd != "" ? new Date(formikIniciarProspecto.values.dateEnd) : new Date()} /> : null}

                                    <Button bg="#042b61" onPress={showDateEnd}>Elegir fecha</Button>
                                </FormControl>
                            </Stack>
                        } />
                        <BoxHeaderComponent fontColor={"#ffffff"} bgColor={"#049474"} isButton={false} isOpen={false} title={"Equipo de trabajo"} showIcon={true} Form={
                            <Stack mt={3} space={4} w="100%">
                                {isLoadingTableUnique ? <Loading /> : <FormControl isRequired>
                                    <FormControl.Label>Responsable de Proyecto</FormControl.Label>
                                    <Select selectedValue={idRape} onValueChange={setIdRape} accessibilityLabel="Eco" placeholder="Seleccione una opción" _selectedItem={{
                                        bg: "teal.600",
                                        endIcon: <CheckIcon size="5" />
                                    }} mt={1} >
                                        {rape}
                                    </Select>
                                </FormControl>}
                                {isLoadingTableUnique ? <Loading /> : <FormControl isRequired>
                                    <FormControl.Label>Responsable de Desarrollo</FormControl.Label>
                                    <Select selectedValue={idRd} onValueChange={setIdRd} accessibilityLabel="Eco" placeholder="Seleccione una opción" _selectedItem={{
                                        bg: "teal.600",
                                        endIcon: <CheckIcon size="5" />
                                    }} mt={1}>
                                        {rd}
                                    </Select>
                                </FormControl>}


                                <BoxHeaderComponent fontColor={"#ffffff"} bgColor={"#049474"} isButton={false} isOpen={false} title={"Analistas programadores"} showIcon={true} Form={
                                    <Stack mt={3} space={4} w="100%">
                                        {errorToMuch ? <AlertComponent isOpen={setErrorToMuch} status={"error"} title={"Ya se han agregado todos los programadores"} /> : null}

                                        {isLoadingTableUnique ? <Loading /> : <FormControl isRequired>
                                            <Select onValueChange={setProggrammer} accessibilityLabel="Eco" placeholder="Seleccione una opción" _selectedItem={{
                                                bg: "teal.600",
                                                endIcon: <CheckIcon size="5" />
                                            }} mt={1}>
                                                {personal}
                                            </Select>
                                        </FormControl>}

                                        <Button startIcon={<AddIcon on size="4" mt="0.5" color={"#fff"} />} bg={"#042B61"} onPress={addProg}>Agregar</Button>
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
                    {isLoadingIniciar ? <Loading /> : null}
                </Modal.Body>
            } showModal={modalStart} header={"Iniciar proyecto"} setShowModal={setModalStart} />

            <AlertDialogComponent isOpen={showAlertDelete} setIsOpen={setShowAlertDelete} header={"Desactivar personal"} body={"Se desactivará el personal"} action={onDelete} />
            <EnableAlertDialogComponent isOpen={showAlertEnable} setIsOpen={setShowAlertEnable} header={"Activar personal"} body={"Se activará el personal"} action={onEnable} />
        </View>
    )
}