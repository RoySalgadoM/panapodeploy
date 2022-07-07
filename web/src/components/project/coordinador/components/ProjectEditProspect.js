import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Card, Collapse } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import Alert, { msjConfirmacion, titleConfirmacion, titleError, msjError, msjExito, titleExito } from "../../../../shared/plugins/alert";
import axios from "../../../../shared/plugins/axios";
import * as yup from "yup";
import { useFormik } from "formik";

export const ProjectEditProspect = ({
  isOpenUpdateP,
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
  status
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
    status: status
  });

  const [isOpenData, setIsOpenData] = useState(false);
  const [isOpenClient, setIsOpenClient] = useState(false);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenCotizacion, setIsOpenCotizacion] = useState(true);

  const formikModify = useFormik({
    initialValues: {
      cotizacion: "",
      description: "",
      months: "",
      name: "",
      numberBeca: "",
      client: "",
      project: "",
      priceClient: "",
    },
    validationSchema: yup.object().shape({
      cotizacion: yup.number().required("Campo obligatorio").min(1, "El valor tiene que ser mayor a cero"),
      description: yup.string().required("Campo obligatorio"),
      months: yup.number().required("Campo obligatorio").min(1, "El valor tiene que ser mayor a cero"),
      name: yup.string().required("Campo obligatorio"),
      numberBeca: yup.number().required("Campo obligatorio").min(1, "El valor tiene que ser mayor a cero").max(10, "El valor máximo de becarios es de 10"),
      client: yup.string().required("Campo obligatorio"),
      priceClient: yup.number().required("Campo obligatorio").min(1, "El valor tiene que ser mayor a cero"),
    }),
    onSubmit: (valuesFormik) => {
      let prospect = {
        ...valuesFormik,
      }
      if (valuesFormik.project !== "") {
        prospect = {
          ...valuesFormik,
          id: id,
          client: {
            id: parseInt(valuesFormik.client),
          },
          project: {
            id: parseInt(valuesFormik.project),
          }
        };
      } else {
        prospect = {
          ...valuesFormik,
          id: id,
          client: {
            id: parseInt(valuesFormik.client),
          },
          project: null
        };
      }
      return axios({
        url: "/project/",
        method: "PUT",
        data: JSON.stringify(prospect),
      })
        .then((response) => {
          if (!response.error) {
            getProspectProject();
            getProyectos();
            Alert.fire({
              title: "Proyecto modificado correctamente",
              icon: "success",
              confirmButtonText: "Aceptar",
            }).then((result) => {
              if (result.isConfirmed) {
                handleCloseForm();
              }
            });
          }
          return response;
        })
        .catch((error) => {
          Alert.fire({
            title: titleError,
            confirmButtonColor: "#198754",
            text: msjError,
            icon: "error",
            confirmButtonText: "Aceptar",
          }).then((result) => {
            if (result.isConfirmed) {
              handleCloseForm();
            }
          });
        });
    },
  });

  const getClients = () => {
    axios({ url: "/client/", method: "GET" })
      .then((response) => {
        setClients(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getProjects = () => {
    axios({ url: "/project/", method: "GET" })
      .then((response) => {
        let data = response.data;
        let prospectTemp = data.filter(item => item.statusProject.description === "Cancelado" || item.statusProject.description === "Cerrado")
        setProjects(prospectTemp);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCloseForm = () => {
    formikModify.resetForm();
    setValues({});
    handleClose(false);
  };

  useEffect(() => {
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
      status: status
    });
    formikModify.values.cotizacion = cotizacion;
    formikModify.values.description = description;
    formikModify.values.months = months;
    formikModify.values.name = name;
    formikModify.values.numberBeca = numberBeca;
    formikModify.values.client = client?.id;
    formikModify.values.project = project !== null ? project?.id : "";
    formikModify.values.statusProject = statusProject;
    formikModify.values.priceClient = priceClient;
    getProjects();
    getClients();
  }, [isOpenUpdateP]);

  return (
    <>
      <Modal show={isOpenUpdateP} onHide={handleCloseForm} size="lg">
        <Modal.Header closeButton className="backgroundHeadModal" closeVariant="white">
          <Modal.Title>Modificar proyecto prospecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* DATOS DEL PROYECTO */}
          <Form onSubmit={formikModify.handleSubmit}>
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
                      <Form.Group className="col-md-6 mb-4" >
                        <Form.Label className="font-weight-normal">Proyecto anterior</Form.Label>
                        <Form.Select name="project" value={formikModify.values.project} onChange={formikModify.handleChange}>
                          <option value="">No aplica</option>
                          {
                            projects.map((proyecto) => <option key={proyecto.id} value={proyecto.id} >{proyecto.acronym}</option>)
                          }
                        </Form.Select>
                        {formikModify.errors.project ? (
                          <span className="text-danger">{formikModify.errors.project}</span>
                        ) : null}
                      </Form.Group>
                      <Form.Group className="col-md-6 mb-4" >
                        <Form.Label className="font-weight-normal">Nombre<span className="text-danger">*</span></Form.Label>
                        <Form.Control name="name" value={formikModify.values.name} onChange={formikModify.handleChange} type="text" />
                        {formikModify.errors.name ? (
                          <span className='text-danger'>{formikModify.errors.name}</span>
                        ) : null}
                      </Form.Group>
                      <Form.Group className="col-md-6 mb-4" >
                        <Form.Label className="font-weight-normal">Estado del proyecto<span className="text-danger">*</span></Form.Label>
                        <Form.Control name="statusProject" value={formikModify.values.statusProject?.description} onChange={formikModify.handleChange} type="text" disabled />
                        {formikModify.errors.statusProject ? (
                          <span className='text-danger'>{formikModify.errors.statusProject}</span>
                        ) : null}
                      </Form.Group>
                      <Form.Group className="col-md-12 mb-4" >
                        <Form.Label className="font-weight-normal">Descripción del proyecto<span className="text-danger">*</span></Form.Label>
                        <Form.Control name="description" value={formikModify.values.description} onChange={formikModify.handleChange} as="textarea" />
                        {formikModify.errors.description ? (
                          <span className='text-danger'>{formikModify.errors.description}</span>
                        ) : null}
                      </Form.Group>
                    </div>
                  </Card.Body>
                </div>
              </Collapse>
            </Card>
            {/* DATOS DEL CLIENTE */}
            <Card className="mb-3" bg="white">
              <Card.Header onClick={() => setIsOpenClient(!isOpenClient)}
                aria-controls="example-collapse-text"
                aria-expanded={isOpenClient}
                type="button">
                <Row>
                  <Col as="h6" className="text-bold">Cliente</Col>
                  <Col className="text-end">
                    <Col>
                      {isOpenClient ? (
                        <FeatherIcon icon="minus" color="grey" />
                      ) : (
                        <FeatherIcon icon="plus" color="grey" />
                      )}
                    </Col>
                  </Col>
                </Row>
              </Card.Header>
              <Collapse in={isOpenClient}>
                <div id="example-collapse-text">
                  <Card.Body>
                    <div className="row">
                      <Form.Group className="col-md-6 mb-4"  >
                      <Form.Label className="font-weight-normal">Seleccionar un cliente<span className="text-danger">*</span></Form.Label>
                        <Form.Select name="client" value={formikModify.values.client} onChange={formikModify.handleChange}>{
                            clients.map((cliente) => (
                              <option key={cliente.id} value={cliente.id}>{cliente.name + " " + cliente.surname + " " + cliente.secondSurname}</option>
                            ))
                          }
                        </Form.Select>
                        {formikModify.errors.client ? (
                          <span className='text-danger'>{formikModify.errors.client}</span>
                        ) : null}
                      </Form.Group>
                    </div>
                  </Card.Body>
                </div>
              </Collapse>
            </Card>
            {/* COTIZACION */}
            <Card className="mb-3" bg="white">
              <Card.Header onClick={() => setIsOpenCotizacion(!isOpenCotizacion)}
                aria-controls="example-collapse-text"
                aria-expanded={isOpenCotizacion}
                type="button">
                <Row>
                  <Col as="h6" className="text-bold">Cotización</Col>
                  <Col className="text-end">
                    <Col>
                      {isOpenClient ? (
                        <FeatherIcon icon="minus" color="grey" />
                      ) : (
                        <FeatherIcon icon="plus" color="grey" />
                      )}
                    </Col>
                  </Col>
                </Row>
              </Card.Header>
              <Collapse in={isOpenCotizacion}>
                <div id="example-collapse-text">
                  <Card.Body>
                    <div className="row">
                      <Form.Group className="col-md-6 mb-4" >
                        <Form.Label className="font-weight-normal">Presupuesto<span className="text-danger">*</span></Form.Label>
                        <Form.Control name="cotizacion" value={formikModify.values.cotizacion} onChange={formikModify.handleChange} type="text" />
                        {formikModify.errors.cotizacion ? (
                          <span className='text-danger'>{formikModify.errors.cotizacion}</span>
                        ) : null}
                      </Form.Group>
                      <Form.Group className="col-md-6 mb-4" >
                        <Form.Label className="font-weight-normal">Precio al cliente<span className="text-danger">*</span></Form.Label>
                        <Form.Control name="priceClient" value={formikModify.values.priceClient} onChange={formikModify.handleChange} type="text" />
                        {formikModify.errors.priceClient ? (
                          <span className='text-danger'>{formikModify.errors.priceClient}</span>
                        ) : null}
                      </Form.Group>
                      <Form.Group className="col-md-6 mb-4" >
                        <Form.Label className="font-weight-normal">Tiempo estimado (meses)<span className="text-danger">*</span></Form.Label>
                        <Form.Control name="months" value={formikModify.values.months} onChange={formikModify.handleChange} type="text" />
                        {formikModify.errors.months ? (
                          <span className='text-danger'>{formikModify.errors.months}</span>
                        ) : null}
                      </Form.Group>
                      <Form.Group className="col-md-6 mb-4" >
                        <Form.Label className="font-weight-normal">Cantidad de becarios<span className="text-danger">*</span></Form.Label>
                        <Form.Control name="numberBeca" value={formikModify.values.numberBeca} onChange={formikModify.handleChange} type="text" />
                        {formikModify.errors.numberBeca ? (
                          <span className='text-danger'>{formikModify.errors.numberBeca}</span>
                        ) : null}
                      </Form.Group>
                    </div>
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
                    type="submit"
                    disabled={!(formikModify.isValid && formikModify.dirty)}
                  >
                    Confirmar
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