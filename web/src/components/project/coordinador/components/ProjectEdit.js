import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import Alert, { msjConfirmacion, titleConfirmacion, titleError, msjError, msjExito, titleExito } from "../../../../shared/plugins/alert";
import axios from "../../../../shared/plugins/axios";
import * as yup from "yup";
import { useFormik } from "formik";

export const ProjectEdit = ({
  isOpenUpdate,
  handleClose,
  getProjects,
  getProspectProject,
  getSelectProjects,
  name,
  id,
  statusProject,
  priority,
  status
}) => {

  const [values, setValues] = useState({ id: id, name: name, statusProject: statusProject, priority: priority, status: status });

  const formikModify = useFormik({
    initialValues: {
      statusProject: "",
      priority: "",
    },
    validationSchema: yup.object().shape({
      priority: yup.string().required("Campo obligatorio"),
      statusProject: yup.string().required("Campo obligatorio"),
    }),
    onSubmit: (valuesFormik) => {
      const project1 = {
        ...valuesFormik,
        statusProject: {
          id: parseInt(valuesFormik.statusProject),
        }
      };
      return axios({
        url: "/project/update",
        method: "PUT",
        data: JSON.stringify(project1),

      })
        .then((response) => {
          if (!response.error) {
            getProjects();
            getProspectProject();
            getSelectProjects();
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
          });
        });
    },
  });


  const handleCloseForm = () => {
    formikModify.resetForm();
    setValues({});
    handleClose(false);
  };

  useEffect(() => {
    setValues({
      id: id,
      statusProject: statusProject,
      priority: priority,
      status: status
    });
    formikModify.values.id = id
    formikModify.values.statusProject = statusProject?.id;
    formikModify.values.priority = priority;
  }, [isOpenUpdate]);

  return (
    <>
      <Modal show={isOpenUpdate} onHide={handleCloseForm}>
        <Modal.Header closeButton className="backgroundHeadModal" closeVariant="white">
          <Modal.Title>Modificar proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formikModify.handleSubmit}>
            <Form.Group className="col-md-12 mb-4">
              <Form.Label className="font-weight-normal">Estado del proyecto<span className="text-danger">*</span></Form.Label>
              <Form.Select name="statusProject" value={formikModify.values.statusProject} onChange={formikModify.handleChange}>
                <option value="2">Activo</option>
                <option value="5">Cancelado</option>
                <option value="4">Cerrado</option>
                <option value="3">Pausado</option>
              </Form.Select>
              {formikModify.errors.statusProject ? (
                <span className='text-danger'>{formikModify.errors.statusProject}</span>
              ) : null}
            </Form.Group>
            <Form.Group className="col-md-12 mb-4" >
              <Form.Label className="font-weight-normal">Prioridad<span className="text-danger">*</span></Form.Label>
              <Form.Select aria-label="Seleccionar tipo de cliente" name="priority"
                value={formikModify.values.priority}
                onChange={formikModify.handleChange} >
                <option value="">Seleccione una opción</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </Form.Select>
              {formikModify.errors.priority ? (
                <span className='text-danger'>{formikModify.errors.priority}</span>
              ) : null}
            </Form.Group>
            <Form.Group className="mb-4">
              <Row>
                <Col className="text-end">
                  <Button variant="secondary" type="button" onClick={handleCloseForm}>
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