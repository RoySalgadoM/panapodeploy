import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import Alert, { msjConfirmacion, titleConfirmacion, titleError, msjError, msjExito, titleExito } from "../../../shared/plugins/alert";
import * as yup from "yup";
import axios from "../../../shared/plugins/axios";
import { useFormik } from "formik";

export const DirectionEdit = ({
  isOpenUpdate,
  handleClose,
  id,
  username,
  status,
  idPerson,
  name,
  surname,
  secondSurname,
  statusPerson,
  getDirectives
}) => {
  const [values, setValues] = useState({ id: id, username: username, status: status, idPerson: idPerson, name: name, surname: surname, secondSurname: secondSurname, statusPerson: statusPerson });

  const handleCloseForm = () => {
    formikModify.resetForm();
    setValues({});
    handleClose(false);
  };

  useEffect(() => {
    setValues({
      id: id,
      username: username,
      status: status,
      idPerson: idPerson,
      name: name,
      surname: surname,
      secondSurname: secondSurname,
      statusPerson: statusPerson,
    });
    formikModify.values.name = name;
    formikModify.values.surname = surname;
    formikModify.values.secondSurname = secondSurname;
  }, [isOpenUpdate]);

  const formikModify = useFormik({
    initialValues: {
      name: "",
      surname: "",
      secondSurname: "",
      password: "",
      confirmPassword: ""
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("Campo obligatorio"),
      surname: yup.string().required("Campo obligatorio"),
      secondSurname: yup.string().required("Campo obligatorio"),
    }),
    onSubmit: (valuesFormik) => {
      const dataPerson = {
        id: values.id,
        username: values.username,
        person: {
          id: values.idPerson,
          name: valuesFormik.name,
          surname: valuesFormik.surname,
          secondSurname: valuesFormik.secondSurname,
          email: values.username,
          profession: {
            id: 3,
            description: "Directivo"
          },
          status: {
            id: statusPerson
          }
        },
        authorities: [
          {
            id: 1,
            description: "Directivo",
            acronym: "Directivo"
          }
        ],
        status: {
          id: status
        }
      };
      if (valuesFormik.password !== "" && valuesFormik.confirmPassword !== "") {
        //si manda contraseñas y son iguales
        if (valuesFormik.password === valuesFormik.confirmPassword) {
          let data = {
            ...dataPerson,
            password: valuesFormik.password,
          }
          //modificar usuario
          return axios({ url: "/user/update", method: "PUT", data: JSON.stringify(data) })
            .then((response) => {
              if (!response.error) {
                //modificar persona
                return axios({ url: "/person/", method: "PUT", data: JSON.stringify(dataPerson.person) })
                  .then((response) => {
                    if (!response.error) {
                      getDirectives();
                      Alert.fire({
                        title: titleExito,
                        text: msjExito,
                        confirmButtonColor: "#198754",
                        icon: "success",
                        confirmButtonText: "Aceptar",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          handleCloseForm();
                        }
                      });
                    }
                    return response;
                  }).catch((error) => {
                    console.log(error)
                    Alert.fire({
                      title: titleError,
                      text: msjError,
                      cancelButtonColor: "#198754",
                      icon: "error",
                      confirmButtonText: "Aceptar"
                    });
                  });
              }
              return response;
            }).catch((error) => {
              console.log(error)
              Alert.fire({
                title: titleError,
                text: msjError,
                cancelButtonColor: "#198754",
                icon: "error",
                confirmButtonText: "Aceptar"
              });
            });
        }
      } else {
        //no manda contraseña
        return axios({ url: "/person/", method: "PUT", data: JSON.stringify(dataPerson.person) })
          .then((response) => {
            console.log(response)
            if (!response.error) {
              getDirectives();
              Alert.fire({
                title: "Directivo modificado correctamente",
                confirmButtonColor: "#198754",
                icon: "success",
                confirmButtonText: "Aceptar",
              }).then((result) => {
                if (result.isConfirmed) {
                  handleCloseForm();
                }
              });
            }
            return response;
          }).catch((error) => {
            console.log(error)
            Alert.fire({
              title: titleError,
              text: msjError,
              cancelButtonColor: "#198754",
              icon: "error",
              confirmButtonText: "Aceptar"
            });
          });
      }
    },
  });

  return (
    <>
      <Modal show={isOpenUpdate} onHide={handleCloseForm} size="lg">
        <Modal.Header closeButton className="backgroundHeadModal" closeVariant="white">
          <Modal.Title>Modificar usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="row" onSubmit={formikModify.handleSubmit}>
            <Form.Group className="col-md-4 mb-4">
              <Form.Label className="font-weight-normal">Nombre<span className="text-danger">*</span></Form.Label>
              <Form.Control
                name="name"
                value={formikModify.values.name}
                onChange={formikModify.handleChange}
              />
            </Form.Group>
            <Form.Group className="col-md-4 mb-4">
              <Form.Label className="font-weight-normal">Primer apellido<span className="text-danger">*</span></Form.Label>
              <Form.Control
                name="surname"
                value={formikModify.values.surname}
                onChange={formikModify.handleChange}
              />
            </Form.Group>
            <Form.Group className="col-md-4 mb-4">
              <Form.Label className="font-weight-normal">Segundo apellido<span className="text-danger">*</span></Form.Label>
              <Form.Control
                name="secondSurname"
                value={formikModify.values.secondSurname}
                onChange={formikModify.handleChange}
              />
            </Form.Group>
            <Form.Group className="col-md-6 mb-4">
              <Form.Label className="font-weight-normal">Contraseña</Form.Label>
              <Form.Control
                name="password"
                type="password"
                placeholder="********"
                value={formikModify.values.password}
                onChange={formikModify.handleChange}
              />
              <Form.Text muted>
                La contraseña solo se cambiará si ingresa algún valor
              </Form.Text>
            </Form.Group>
            <Form.Group className="col-md-6 mb-4">
              <Form.Label className="font-weight-normal">Confirmar contraseña</Form.Label>
              <Form.Control
                name="confirmPassword"
                type="password"
                placeholder="********"
                value={formikModify.values.confirmPassword}
                onChange={formikModify.handleChange}
              />
              {formikModify.values.confirmPassword !== "" && formikModify.values.password !== "" && formikModify.values.confirmPassword !== formikModify.values.password ? (
                <span className='text-danger'>Las contraseñas no son iguales</span>
              ) : null}
            </Form.Group>
            <Form.Group className="mb-4 mt-3">
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