import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

export const ClientDetails = ({
  isOpenDetails,
  handleClose,
  emailClient,
  name,
  surname,
  secondSurname,
  company,
  typeClient,
  phoneClient,
  nameRepre,
  surnameRepre,
  secondSurnameRepre,
  phoneRepre,
  emailRepre,
  extension,
  status
}) => {

  const [values, setValues] = useState({
    emailClient: emailClient, name: name, surname: surname, secondSurname: secondSurname,
    company: company, typeClient: typeClient, phoneClient: phoneClient, extension: extension, status: status,
    nameRepre: nameRepre, surnameRepre: surnameRepre, secondSurnameRepre: secondSurnameRepre, phoneRepre: phoneRepre, emailRepre: emailRepre
  });

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
      emailClient: emailClient,
      name: name,
      surname: surname,
      secondSurname: secondSurname,
      company: company,
      typeClient: typeClient,
      phoneClient: phoneClient,
      extension: extension,
      nameRepre: nameRepre,
      surnameRepre: surnameRepre,
      secondSurnameRepre: secondSurnameRepre,
      phoneRepre: phoneRepre,
      emailRepre: emailRepre
    });
  }, [isOpenDetails]);

  return (
    <>
      <Modal show={isOpenDetails} onHide={handleCloseForm} size="lg">
        <Modal.Header closeButton className="backgroundHeadModal" closeVariant="white">
          <Modal.Title>Detalles del cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="row">
            <Form.Group className="col-md-4 mb-4">
              <Form.Label className="font-weight-normal">Nombre</Form.Label>
              <Form.Control
                name="name"
                value={values.name}
                onChange={handleChange}
                readOnly
              />
            </Form.Group>
            <Form.Group className="col-md-4 mb-4">
              <Form.Label className="font-weight-normal">Primer apellido</Form.Label>
              <Form.Control
                name="surname"
                value={values.surname}
                onChange={handleChange}
                readOnly
              />
            </Form.Group>
            <Form.Group className="col-md-4 topBottom">
              <Form.Label className="form-label">Segundo apellido</Form.Label>
              <Form.Control
                name="secondSurname"
                value={values.secondSurname}
                onChange={handleChange}
                readOnly
              />
            </Form.Group>
            <Form.Group className="col-md-6 mb-4">
              <Form.Label className="form-label">Correo electrónico</Form.Label>
              <Form.Control
                name="emailClient"
                value={values.emailClient}
                onChange={handleChange}
                readOnly
              />
            </Form.Group>
            <Form.Group className="col-md-4 mb-4">
              <Form.Label className="form-label">Teléfono</Form.Label>
              <Form.Control
                name="phoneClient"
                value={values.phoneClient}
                onChange={handleChange}
                readOnly
              />
            </Form.Group>
            <Form.Group className="col-md-2 mb-4">
              <Form.Label className="form-label">Extensión</Form.Label>
              <Form.Control
                name="extension"
                value={values.extension}
                onChange={handleChange}
                readOnly
              />
            </Form.Group>
            <Form.Group className="col-md-6 mb-4">
              <Form.Label className="form-label">Empresa</Form.Label>
              <Form.Control
                name="company"
                value={values.company}
                onChange={handleChange}
                readOnly
              />
            </Form.Group>
            <Form.Group className="col-md-6 mb-4">
              <Form.Label className="form-label">Tipo de cliente</Form.Label>
              <Form.Control
                name="typeClient"
                value={values.typeClient}
                onChange={handleChange}
                readOnly
              />
            </Form.Group>
            <Form.Group className="col-md-12 mb-3" >
              <h5 className="text-bold">Información del representante del cliente</h5>
            </Form.Group>
            <Form.Group className="col-md-4 mb-4" >
              <Form.Label>Nombre</Form.Label>
              <Form.Control name="nameRepre" value={values.nameRepre} onChange={handleChange} readOnly/>
            </Form.Group>
            <Form.Group className="col-md-4 mb-4" >
              <Form.Label>Primer apellido</Form.Label>
              <Form.Control name="surnameRepre" value={values.surnameRepre} onChange={handleChange} readOnly/>
            </Form.Group>
            <Form.Group className="col-md-4 mb-4" >
              <Form.Label>Segundo apellido</Form.Label>
              <Form.Control name="secondSurnameRepre" value={values.secondSurnameRepre} onChange={handleChange} readOnly/>
            </Form.Group>
            <Form.Group className="col-md-6 mb-4" >
              <Form.Label>Teléfono</Form.Label>
              <Form.Control name="phoneRepre" value={values.phoneRepre} onChange={handleChange} readOnly/>
            </Form.Group>
            <Form.Group className="col-md-6 mb-4" >
              <Form.Label>Correo eléctronico</Form.Label>
              <Form.Control name="emailRepre" placeholder="Email" value={values.emailRepre} onChange={handleChange} readOnly/>
            </Form.Group>
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