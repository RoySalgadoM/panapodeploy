import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import * as yup from "yup";
import { useFormik } from "formik";
import Alert, { msjConfirmacion, titleConfirmacion, titleError, msjError, msjExito, titleExito } from "../../../shared/plugins/alert";
import axios from "../../../shared/plugins/axios";

export const RoleEdit = ({
  isOpenUpdate,
  handleClose,
  id,
  acronym,
  description,
  status,
  getRoles,
}) => {

  const [values, setValues] = useState({
    id: id,
    acronym: acronym,
    description: description,
    status: status
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }

  useEffect(() => {
    setValues({
      id: id,
      status: status,
      acronym: acronym,
      description: description
    });
    formikModify.values.acronym = acronym;
    formikModify.values.description = description;
  }, [isOpenUpdate]);

  const formikModify = useFormik({
    initialValues: {
      description: "",
    },
    validationSchema: yup.object().shape({
      description: yup.string().required("Campo obligatorio"),
    }),
    onSubmit: (valuesFormik) => {
      const rol = {
        ...valuesFormik,
        id: id,
      };
      return axios({
        url: "/rol/",
        method: "PUT",
        data: JSON.stringify(rol),
      })
        .then((response) => {
          if (!response.error) {
            handleCloseForm();
            getRoles();
            Alert.fire({
              title: "Rol modificado correctamente",
              icon: "success",
              confirmButtonText: "Aceptar",
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


  return (
    <>
      <Modal show={isOpenUpdate} onHide={handleCloseForm}>
        <Modal.Header closeButton className="backgroundHeadModal" closeVariant="white">
          <Modal.Title>Modificar rol</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="row" onSubmit={formikModify.handleSubmit}>
            <Form.Group className="col-md-12 mb-4" >
              <Form.Label className="font-weight-normal">Descripción<span className="text-danger">*</span></Form.Label>
              <Form.Control name="description" type="text" placeholder="" value={formikModify.values.description} onChange={formikModify.handleChange} />
              {formikModify.errors.name ? (
                <span className='text-danger'>{formikModify.errors.description}</span>
              ) : null}
            </Form.Group>
            <Form.Group className="mb-4 mt-3">
              <Row className="topBottom">
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