import React, { useEffect, useState } from "react";
import { Button, Row, Col, Container, Form, Collapse, Card, Modal } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import Alert, { msjConfirmacion, titleConfirmacion, titleError, msjError, msjExito, titleExito } from "../../../../shared/plugins/alert";
import axios from "../../../../shared/plugins/axios";

export const ProjectDetailsProspect = ({
  isOpenDetailsP,
  handleClose,
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

  const [isOpenData, setIsOpenData] = useState(true);
  const [isOpenClient, setIsOpenClient] = useState(true);
  const [isOpenCotizacion, setIsOpenCotizacion] = useState(true);


  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }

  const handleCloseForm = () => {
    handleClose(false);
    setValues({});
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
  }, [isOpenDetailsP]);

  return (
    <>
      <Modal show={isOpenDetailsP} onHide={handleCloseForm} size="lg">
        <Modal.Header closeButton className="backgroundHeadModal" closeVariant="white">
          <Modal.Title>Detalles del proyecto prospecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* DATOS DEL PROYECTO */}
          <Form>
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
                        <Form.Control name="project" value={values.project === null ||  values.project === undefined ? "No aplica" : values.project?.acronym} onChange={handleChange} type="text" readOnly />
                      </Form.Group>
                      <Form.Group className="col-md-6 mb-4" >
                        <Form.Label className="font-weight-normal">Nombre<span className="text-danger">*</span></Form.Label>
                        <Form.Control name="name" value={values.name} onChange={handleChange} type="text" readOnly />
                      </Form.Group>
                      <Form.Group className="col-md-6 mb-4" >
                        <Form.Label className="font-weight-normal">Estado del proyecto<span className="text-danger">*</span></Form.Label>
                        <Form.Control name="statusProject" value={values.statusProject?.description} onChange={handleChange} type="text" readOnly />
                      </Form.Group>
                      <Form.Group className="col-md-12 mb-4" >
                        <Form.Label className="font-weight-normal">Descripción del proyecto<span className="text-danger">*</span></Form.Label>
                        <Form.Control name="description" value={values.description} onChange={handleChange} as="textarea" readOnly />
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
                        <Form.Label className="font-weight-normal">Nombre completo<span className="text-danger">*</span></Form.Label>
                        <Form.Control name="client" value={values.client?.name+" "+values.client?.surname+" "+values.client?.secondSurname} onChange={handleChange} type="text" readOnly />
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
                        <Form.Control name="cotizacion" value={values.cotizacion} onChange={handleChange} type="text" readOnly />
                      </Form.Group>
                      <Form.Group className="col-md-6 mb-4" >
                        <Form.Label className="font-weight-normal">Precio al cliente<span className="text-danger">*</span></Form.Label>
                        <Form.Control name="priceClient" value={values.priceClient} onChange={handleChange} type="text" readOnly />
                      </Form.Group>
                      <Form.Group className="col-md-6 mb-4" >
                        <Form.Label className="font-weight-normal">Tiempo estimado (meses)<span className="text-danger">*</span></Form.Label>
                        <Form.Control name="months" value={values.months} onChange={handleChange} type="text" readOnly />
                      </Form.Group>
                      <Form.Group className="col-md-6 mb-4" >
                        <Form.Label className="font-weight-normal">Cantidad de becarios<span className="text-danger">*</span></Form.Label>
                        <Form.Control name="numberBeca" value={values.numberBeca} onChange={handleChange} type="text" readOnly />
                      </Form.Group>
                    </div>
                  </Card.Body>
                </div>
              </Collapse>
            </Card>
            <Form.Group className="mb-4 mt-3">
              <Row>
                <Col className="text-end">
                  <Button variant="secondary" type="button" onClick={handleCloseForm}>
                    Cerrar
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