import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Container, ProgressBar } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import { CustomLoader } from "../../../shared/components/CustomLoader"
import axios from "../../../shared/plugins/axios";

export const ReportDetails = ({
  isOpen,
  id,
  handleClose,
  data,
  phasePlanned,
  phaseReal,
  stagePlanned,
  stageReal
}) => {
  const [values, setValues] = useState({
    phasePlanned: phasePlanned,
    phaseReal: phaseReal,
    stagePlanned: stagePlanned,
    stageReal: stageReal
  })
  const [avance, setAvance] = useState([]);

  useEffect(() => {
    setValues({
      phasePlanned: phasePlanned,
      phaseReal: phaseReal,
      stagePlanned: stagePlanned,
      stageReal: stageReal
    })
    getAvances()
  }, [isOpen])

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }
  let temp = {};

  const getAvances = () => {
    axios({ url: "/reportphases/", method: "GET" })
      .then((response2) => {
        temp = {
          cierre: "",
          inicio: "",
          requerimientos: "",
          construccion: "",
          analisis: "",
          integracion: ""
        }
        for (let m = 0; m < response2.data.length; m++) {
          if (id === response2.data[m].report.id) {
            if (response2.data[m].report.project.id === data) {
              if (response2.data[m].phases.id === 1) {
                temp = {
                  ...temp,
                  inicio: response2.data[m].porcentaje
                }
              }
              if (response2.data[m].phases.id === 2) {
                temp = {
                  ...temp,
                  requerimientos: response2.data[m].porcentaje
                }

              }
              if (response2.data[m].phases.id === 3) {
                temp = {
                  ...temp,
                  analisis: response2.data[m].porcentaje
                }

              }
              if (response2.data[m].phases.id === 4) {
                temp = {
                  ...temp,
                  construccion: response2.data[m].porcentaje
                }

              }
              if (response2.data[m].phases.id === 5) {
                temp = {
                  ...temp,
                  integracion: response2.data[m].porcentaje
                }
              }
              if (response2.data[m].phases.id === 6) {
                temp = {
                  ...temp,
                  cierre: response2.data[m].porcentaje
                }
              }
            }
          }
        }
        setAvance(temp)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleCloseForm = () => {
    handleClose(false);
    setAvance([])
    setValues({})
    temp = {}
  };

  return (
    <>
      <Modal show={isOpen} onHide={handleCloseForm} size="md">
        <Modal.Header closeButton className="backgroundHeadModal" closeVariant="white">
          <Modal.Title>Detalles del reporte</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="row">
            <Form.Group className="col-md-12 mb-1">
              <h5>Estado de avance</h5>
            </Form.Group>
            <Form.Group className="col-md-6 mb-4" >
              <Form.Label className="font-weight-normal">Etapa planeada (APE)<span className="text-danger">*</span></Form.Label>
              <Form.Control value={values.stagePlanned} readOnly
                onChange={handleChange} />
            </Form.Group>
            <Form.Group className="col-md-6 mb-4" >
              <Form.Label className="font-weight-normal">Etapa real (APE)<span className="text-danger">*</span></Form.Label>
              <Form.Control value={values.stageReal} readOnly
                onChange={handleChange} />
            </Form.Group>
            <Form.Group className="col-md-6 mb-4" >
              <Form.Label className="font-weight-normal">Fase planeada (DMS)<span className="text-danger">*</span></Form.Label>
              <Form.Control value={values.phasePlanned} readOnly
                onChange={handleChange} />
            </Form.Group>
            <Form.Group className="col-md-6 mb-4" >
              <Form.Label className="font-weight-normal">Fase real (DMS)<span className="text-danger">*</span></Form.Label>
              <Form.Control value={values.phaseReal} readOnly
                onChange={handleChange} />
            </Form.Group>
            {
              avance.inicio > 0 || avance.requerimientos > 0 || avance.analisis > 0 || avance.construccion > 0 || avance.integracion > 0 || avance.cierre > 0 ?
                <Form.Group className="col-md-12 mb-1">
                  <h5>Porcentaje de avance por fase</h5>
                </Form.Group>
                : null
            }
            {
              avance.inicio > 0 ?
                <Form.Group className="mb-4">
                  <Form.Label className="font-weight-normal">Inicio</Form.Label>
                  <ProgressBar now={avance.inicio} variant="success" />
                  <small>{avance.inicio}% completado</small>
                </Form.Group>
                : null
            }
            {
              avance.requerimientos > 0 ?
                <Form.Group className="mb-4">
                  <Form.Label className="font-weight-normal">Requerimientos</Form.Label>
                  <ProgressBar now={avance.requerimientos} variant="success" />
                  <small>{avance.requerimientos}% completado</small>
                </Form.Group>
                : null
            }
            {
              avance.analisis > 0 ?
                <Form.Group className="mb-4">
                  <Form.Label className="font-weight-normal">Análisis y diseño</Form.Label>
                  <ProgressBar now={avance.analisis} variant="success" />
                  <small>{avance.analisis}% completado</small>
                </Form.Group>
                : null
            }
            {
              avance.construccion > 0 ?
                <Form.Group className="mb-4">
                  <Form.Label className="font-weight-normal">Construcción</Form.Label>
                  <ProgressBar now={avance.construccion} variant="success" />
                  <small>{avance.construccion}% completado</small>
                </Form.Group>
                : null
            }
            {
              avance.integracion > 0 ?
                <Form.Group className="mb-4">
                  <Form.Label className="font-weight-normal">Integración y pruebas</Form.Label>
                  <ProgressBar now={avance.integracion} variant="success" />
                  <small>{avance.integracion}% completado</small>
                </Form.Group>
                : null
            }
            {
              avance.cierre > 0 ?
                <Form.Group className="mb-4">
                  <Form.Label className="font-weight-normal">Cierre</Form.Label>
                  <ProgressBar now={avance.cierre} variant="success" />
                  <small>{avance.cierre}% completado</small>
                </Form.Group>
                : null
            }
            <Form.Group className="mb-4">
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
}
