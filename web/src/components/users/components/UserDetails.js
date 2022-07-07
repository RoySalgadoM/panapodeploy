import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

export const UserDetails = ({
  isOpenDetails,
  handleClose,
  person,
  username,
  authority,
}) => {
  const [values, setValues] = useState({
    person: person,
    username: username,
    authority: authority,
  });

  const handleCloseForm = () => {
    handleClose(false);
    setValues({});
  };

  useEffect(() => {
    setValues({
      person: person,
      username: username,
      authority: authority,
    });
  }, [isOpenDetails]);

  return (
    <>
      <Modal show={isOpenDetails} onHide={handleCloseForm} size="lg">
        <Modal.Header
          closeButton
          className="backgroundHeadModal"
          closeVariant="white"
        >
          <Modal.Title>Detalles del Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="row">
            <Form.Group className="col-md-6 mb-4">
              <Form.Label className="font-weight-normal">Nombre<span className="text-danger">*</span></Form.Label>
              <Form.Control
                name="name"
                value={values.person?.name}
                readOnly
              />
            </Form.Group>
            <Form.Group className="col-md-6 mb-4">
              <Form.Label className="font-weight-normal">Primer apellido<span className="text-danger">*</span></Form.Label>
              <Form.Control
                name="name"
                value={values.person?.surname}
                readOnly
              />
            </Form.Group>
            <Form.Group className="col-md-6 mb-4">
              <Form.Label className="font-weight-normal">Segundo apellido<span className="text-danger">*</span></Form.Label>
              <Form.Control
                name="name"
                value={values.person?.secondSurname}
                readOnly
              />
            </Form.Group>
            <Form.Group className="col-md-6 mb-4">
              <Form.Label className="font-weight-normal">Correo<span className="text-danger">*</span></Form.Label>
              <Form.Control
                name="name"
                value={values.username}
                readOnly
              />
            </Form.Group>
            <Form.Group className="col-md-6 topBottom2">
              <Form.Label className="font-weight-normal">Rol<span className="text-danger">*</span></Form.Label>
              <Form.Control
                name="name"
                value={values.authority}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-4 topBottom">
              <Row>
                <Col className="text-end">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={handleCloseForm}
                  >
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
