import React, { useEffect, useState } from "react";
import { Button, Row, Col, Container, Form, Collapse, Card, Modal } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import Alert, { msjConfirmacion, titleConfirmacion, titleError, msjError, msjExito, titleExito } from "../../../../shared/plugins/alert";
import DataTable from "react-data-table-component";
import { CustomLoader } from "../../../../shared/components/CustomLoader"
import { AlertData } from "../../../../shared/components/alertData"
import axios from "../../../../shared/plugins/axios";
import * as yup from "yup";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faTrash } from '@fortawesome/free-solid-svg-icons'

export const ProjectStart = ({
  isOpenStart,
  handleClose,
  getProspectProject,
  getProyectos,
  id,
  cotizacion,
  description,
  months,
  name,
  numberBeca,
  client,
  project,
  statusProject,
  priceClient,
}) => {
  const [values, setValues] = useState({
    id: id,
    cotizacion: cotizacion,
    description: description,
    months: months,
    name: name,
    numberBeca: numberBeca,
    client: client,
    project: project,
    statusProject: statusProject,
    priceClient: priceClient,
  });
  let value = "";
  const [isOpenData, setIsOpenData] = useState(true);
  const [isOpenTeam, setIsOpenTeam] = useState(true);
  const [isOpenProg, setIsOpenProg] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRepeat, setIsRepeat] = useState("")
  const [num, setNum] = useState(0)
  const [disponibles, setDisponibles] = useState(0)
  const [clients, setClients] = useState(false);

  const [rd, setRd] = useState([])
  const [rape, setRape] = useState([])
  const [personal, setPersonal] = useState([])
  const [programmers, setProgrammers] = useState([])

  const onDelete = async () => {
    let programadores = [];
    programadores = programmers
    Alert.fire({
      title: titleConfirmacion,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "grey",
      showCancelButton: true,
      reverseButtons: true,
      showLoaderOnConfirm: true,
      icon: "warning",
      preConfirm: () => {
        for (let m = 0; m < programadores.length; m++) {
          if (value === programadores[m].id) {
            let temp = programadores.filter(item => item.id !== value)
            setProgrammers(temp)
            setNum(temp.length)
          }
        }
        setIsLoading(false)
        Alert.fire({
          title: "Programador eliminado correctamente",
          confirmButtonColor: "#198754",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      },
      backdrop: true,
      allowOutsideClick: !Alert.isLoading
    });
  }

  const addProgramador = async () => {
    setIsRepeat("")
    let programadores = [];
    programadores = programmers
    if (num < numberBeca) {
      let exists = false
      if (programadores != "") {
        for (let m = 0; m < programadores.length; m++) {
          if (value == programadores[m].id) {
            exists = true;
          }
        }
      }
      if (!exists) {
        await axios({ url: "/person/" + value, method: "GET" })
          .then(async (response) => {
            let data = [
              {
                id: response.data.id,
                name: response.data.name,
                surname: response.data.surname,
                secondSurname: response.data.secondSurname,
                email: response.data.email,
                rol: response.data.profession.description,
              }
            ];
            programadores = programadores.concat(data)
          })
          .catch((error) => {
            console.log(error);
          });
        setProgrammers(programadores)
        setNum(programadores.length)
        setIsLoading(false)
      } else {
        setIsLoading(false)
        setIsRepeat("No se puede agregar a la misma persona")
      }
    }
  }

  const setId = (id) => {
    value = id;
  }

  const columnsProg = [
    {
      name: <h6 className="text-center">Nombre</h6>,
      cell: (row) => <div className="txt4">{row.name + " "}{row.surname + " "}{row.secondSurname}</div>,
    },
    {
      name: <h6 className="text-center">Correo</h6>,
      cell: (row) => <div className="txt4">{row.email}</div>,
    },
    {
      name: <h6>Rol</h6>,
      cell: (row) => <div className="txt4">{row.rol}</div>,
    },
    {
      name: <div><h6>Eliminar</h6></div>,
      cell: (row) => (
        <div>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              setId(row.id)
              onDelete();
            }}
          >
            <FontAwesomeIcon icon={faTrash} size="lg" />
          </Button>
        </div>
      ),
    },
  ]

  const getRD = () => {
    axios({ url: "/user/", method: "GET" })
      .then((response) => {
        let data = response.data;
        let rds = []
        for (let r = 0; r < data.length; r++) {
          for (let m = 0; m < data[r].authorities.length; m++) {
            let rdTemp = data[r];
            if (data[r].authorities[m].acronym === "RD") {
              rds.push(rdTemp)
            }
          }
        }
        setRd(rds);
        setIsLoading(false);
      })
      .catch((error) => {
      });
  };

  const getRape = () => {
    axios({ url: "/user/", method: "GET" })
      .then((response) => {
        let data = response.data;
        let rapes = []
        for (let r = 0; r < data.length; r++) {
          for (let m = 0; m < data[r].authorities.length; m++) {
            let rapeTemp = data[r];
            if (data[r].authorities[m].acronym === "RAPE") {
              rapes.push(rapeTemp)
            }
          }
        }
        setRape(rapes);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getPersonal = () => {
    axios({ url: "/person/", method: "GET" })
      .then((response) => {
        let data = response.data;
        let becaTemp = data.filter(item => item.profession.description === "Becario")
        setPersonal(becaTemp);
        setDisponibles(becaTemp.length)
        setIsLoading(false);
      })
      .catch((error) => {
      });
  };

  const handleCloseForm = () => {
    formik.resetForm();
    setValues([])
    setProgrammers([])
    setDisponibles(0)
    setNum(0)
    setIsRepeat("")
    handleClose(false);
  };

  useEffect(() => {
    setIsLoading(true)
    setValues({
      id: id,
      cotizacion: cotizacion,
      description: description,
      months: months,
      name: name,
      numberBeca: numberBeca,
      client: client,
      project: project,
      statusProject: statusProject,
      priceClient: priceClient,
    });
    getRD();
    getRape();
    getPersonal();
    // getProspectProject();
  }, [isOpenStart]);

  //iniciar prospecto
  const formik = useFormik({
    initialValues: {
      acronym: "",
      statusProject: {
        id: 2,
        description: "Activo"
      },
      priority: "",
      dateStart: "",
      dateEnd: "",
      rd: "",
      rape: "",
      prog: "",
      numProg: 0,
    },
    validationSchema: yup.object().shape({
      acronym: yup.string().required("Campo obligatorio"),
      priority: yup.string().required("Campo obligatorio"),
      dateStart: yup.string().required("Campo obligatorio"),
      dateEnd: yup.string().required("Campo obligatorio"),
      rd: yup.string().required("Campo obligatorio"),
      rape: yup.string().notOneOf([yup.ref(('rd'))], 'El RD y RAPE deben ser diferentes').required("Campo obligatorio"),
      prog: yup.number().notOneOf([yup.ref(('numProg'))])
    }),
    onSubmit: (valuesFormik) => {
      let project = { ...values };
      if (values.project === "" || values.project === null) {
        project = {
          ...values,
          ...valuesFormik,
          project: null,
          numberBeca: num
        };
      } else {
        project = {
          ...values,
          ...valuesFormik,
          numberBeca: num
        };
      }
      axios({ url: "/project/", method: "PUT", data: JSON.stringify(project) })
        .then((response) => {
          if (!response.error) {
          }
        })
        .catch((error) => {
          console.log(error);
        });

      let rdTemp = {
        project: {
          id: values.id
        },
        person: {
          id: parseInt(valuesFormik.rd)
        },
        rolProject: {
          id: 1
        }
      }
      axios({ url: "/personteam/", method: "POST", data: JSON.stringify(rdTemp) })
        .then(async (response) => {
          if (!response.error) {
            let rapeTemp = {
              project: {
                id: values.id
              },
              person: {
                id: parseInt(valuesFormik.rape)
              },
              rolProject: {
                id: 2
              }
            }
            await axios({ url: "/personteam/", method: "POST", data: JSON.stringify(rapeTemp) })
              .then((response) => {
                if (!response.error) {
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      let programadores = [];
      programadores = programmers
      for (let i = 0; i < programadores.length; i++) {
        let idTemp = programadores[i].id
        let tempProg = {
          project: {
            id: values.id
          },
          person: {
            id: idTemp
          },
          rolProject: {
            id: 3
          }
        }
        axios({ url: "/personteam/", method: "POST", data: JSON.stringify(tempProg) })
          .then((response) => {
            if (!response.error) {
            }
          })
          .catch((error) => {
            console.log(error);
          });
        getProspectProject()
        getProyectos()
        Alert.fire({
          title: "Proyecto iniciado correctamente",
          confirmButtonColor: "#198754",
          icon: "success",
          confirmButtonText: "Aceptar",
        }).then((result) => {
          if (result.isConfirmed) {
            handleCloseForm();
          }
        });
      }
    },
  });

  return (
    <>
      <Modal show={isOpenStart} onHide={handleCloseForm} size="lg">
        <Modal.Header closeButton className="backgroundHeadModal" closeVariant="white">
          <Modal.Title>Iniciar proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* DATOS DEL PROYECTO */}
          <Form onSubmit={formik.handleSubmit}>
            <Card className="mb-3" bg="white">
              <Card.Header onClick={() => setIsOpenData(!isOpenData)}
                aria-controls="example-collapse-text"
                aria-expanded={isOpenData}
                type="button">
                <Row>
                  <Col as="h6" className="text-bold">Datos del proyecto</Col>
                  <Col className="text-end">
                    <Col>
                      {isOpenData ? (
                        <FeatherIcon icon="minus"
                          color="grey" />
                      ) : (
                        <FeatherIcon icon="plus"
                          color="grey" />
                      )}
                    </Col>
                  </Col>
                </Row>
              </Card.Header>
              <Collapse in={isOpenData}>
                <div id="example-collapse-text">
                  <Card.Body>
                    <div className="row">
                      <Form.Group className="col-md-4 mb-4" >
                        <Form.Label className="font-weight-normal">Acrónimo del proyecto<span className="text-danger">*</span></Form.Label>
                        <Form.Control name="acronym" type="text" placeholder="Ejemplo: PANAPO" value={formik.values.acronym}
                          onChange={formik.handleChange} />
                        {formik.errors.acronym ? (
                          <span className="text-danger">{formik.errors.acronym}</span>
                        ) : null}
                      </Form.Group>
                      <Form.Group className="col-md-4 mb-4" >
                        <Form.Label className="font-weight-normal">Estado del proyecto<span className="text-danger">*</span></Form.Label>
                        <Form.Control name="statusProject" type="text" value="Activo" readOnly />
                      </Form.Group>
                      <Form.Group className="col-md-4 mb-4" >
                        <Form.Label className="font-weight-normal">Prioridad<span className="text-danger">*</span></Form.Label>
                        <Form.Select aria-label="Seleccionar tipo de cliente" name="priority"
                          value={formik.values.priority}
                          onChange={formik.handleChange} >
                          <option value="">Seleccione una opción</option>
                          <option value="Alta">Alta</option>
                          <option value="Media">Media</option>
                          <option value="Baja">Baja</option>
                        </Form.Select>
                        {formik.errors.priority ? (
                          <span className='text-danger'>{formik.errors.priority}</span>
                        ) : null}
                      </Form.Group>
                      <Form.Group className="col-md-6 mb-4" >
                        <Form.Label className="font-weight-normal">Fecha de inicio<span className="text-danger">*</span></Form.Label>
                        <Form.Control name="dateStart" type="date" value={formik.values.dateStart}
                          onChange={formik.handleChange} />
                        {formik.errors.dateStart ? (
                          <span className='text-danger'>{formik.errors.dateStart}</span>
                        ) : null}
                      </Form.Group>
                      <Form.Group className="col-md-6 mb-4" >
                        <Form.Label className="font-weight-normal">Fecha de fin<span className="text-danger">*</span></Form.Label>
                        <Form.Control name="dateEnd" type="date" value={formik.values.dateEnd}
                          onChange={formik.handleChange} />
                        {formik.errors.dateEnd ? (
                          <span className='text-danger'>{formik.errors.dateEnd}</span>
                        ) : null}
                      </Form.Group>
                    </div>
                  </Card.Body>
                </div>
              </Collapse>
            </Card>
            {/* EQUIPO DE TRABAJO  */}
            <Card className="mb-3" bg="white">
              <Card.Header onClick={() => setIsOpenTeam(!isOpenTeam)}
                aria-controls="example-collapse-text"
                aria-expanded={isOpenTeam}
                type="button">
                <Row>
                  <Col as="h6" className="text-bold">Equipo de trabajo</Col>
                  <Col className="text-end">
                    <Col>
                      {isOpenTeam ? (
                        <FeatherIcon icon="minus" color="grey" />
                      ) : (
                        <FeatherIcon icon="plus" color="grey" />
                      )}
                    </Col>
                  </Col>
                </Row>
              </Card.Header>
              <Collapse in={isOpenTeam}>
                <div id="example-collapse-text">
                  <Card.Body>
                    <div className="row">
                      <Form.Group className="col-md-6 mb-4"  >
                        <Form.Label className="font-weight-normal">Responsable de proyecto<span className="text-danger">*</span></Form.Label>
                        <Form.Select name="rape" value={formik.values.rape} onChange={formik.handleChange}>
                          <option value="">Seleccione una opción</option>
                          {
                            rape.map((resp) => (
                              <option key={resp.person.id} value={resp.person.id} >{resp.person.name + " " + resp.person.surname + " " + resp.person.secondSurname}</option>
                            ))
                          }
                        </Form.Select>
                        {formik.errors.rape ? (
                          <span className='text-danger'>{formik.errors.rape}</span>
                        ) : null
                        }
                      </Form.Group>
                      <Form.Group className="col-md-6 mb-4"  >
                        <Form.Label className="font-weight-normal">Responsable de desarrollo<span className="text-danger">*</span></Form.Label>
                        <Form.Select name="rd" value={formik.values.rd} onChange={formik.handleChange}>
                          <option value="">Seleccione una opción</option>
                          {
                            rd.map((res) => (
                              <option key={res.person.id} value={res.person.id} >{res.person.name + " " + res.person.surname + " " + res.person.secondSurname}</option>
                            ))
                          }
                        </Form.Select>
                        {formik.errors.rd ? (
                          <span className='text-danger'>{formik.errors.rd}</span>
                        ) : null}
                      </Form.Group>
                    </div>
                    {/* ANALISTAS PROGRAMADORES */}
                    <Card className="mb-3" bg="white">
                      <Card.Header onClick={() => setIsOpenProg(!isOpenProg)}
                        aria-controls="example-collapse-text"
                        aria-expanded={isOpenProg}
                        type="button">
                        <Row>
                          <Col as="h6" className="text-bold">Analistas programadores</Col>
                          <Col className="text-end">
                            <Col>
                              {isOpenProg ? (
                                <FeatherIcon icon="minus" color="grey" />
                              ) : (
                                <FeatherIcon icon="plus" color="grey" />
                              )}
                            </Col>
                          </Col>
                        </Row>
                      </Card.Header>
                      <Collapse in={isOpenProg}>
                        <div id="example-collapse-text">
                          <Card.Body>
                            <div className="row">
                              <Form.Group className="col-md-6 mb-4">
                                <Form.Select name="prog" onChange={formik.handleChange} value={formik.values.prog}>
                                  <option value="">Seleccione una opción</option>
                                  {
                                    personal.map((res) =>
                                      <option key={res.id} value={res.id} >{res.name + " " + res.surname + " " + res.secondSurname}</option>)
                                  }
                                </Form.Select>
                                {
                                  <span className='text-danger'>{isRepeat}</span>
                                }
                              </Form.Group>
                              <Form.Group className="col-md-6 mb-4 text-end">
                                <Button type="button" style={{ background: "#042B61", borderColor: "#042B61" }}
                                  onClick={() => {
                                    setId(formik.values.prog)
                                    addProgramador()
                                  }}>
                                  <FeatherIcon icon="plus" color="white" />Añadir
                                </Button>
                              </Form.Group>
                              <Form.Group>
                                <DataTable
                                  columns={columnsProg}
                                  noDataComponent={<AlertData title={"No hay programadores seleccionados"} />}
                                  pagination
                                  data={programmers}
                                  progressPending={isLoading}
                                  progressComponent={<CustomLoader />}
                                />
                                {
                                  num >= numberBeca ? <span className='text-danger'>Se alcanzó el número de programadores asignados, no se pueden agregar más</span> : null
                                }
                                {
                                  num === disponibles && numberBeca > num ? <span className='text-danger'>Ya no hay más becarios disponibles</span> : null
                                }
                              </Form.Group>
                            </div>
                          </Card.Body>
                        </div>
                      </Collapse>
                    </Card>
                  </Card.Body>
                </div>
              </Collapse>
            </Card>
            <Form.Group className="mb-4 mt-3">
              <Row>
                <Col className="text-end">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={handleCloseForm}
                  >
                    Cerrar
                  </Button>
                  <Button
                    style={{ background: "#042B61", borderColor: "#042B61" }}
                    className="ms-3"
                    type="submit" disabled={!(formik.isValid && formik.dirty && num > 0)}
                  >
                    Iniciar
                  </Button>
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};