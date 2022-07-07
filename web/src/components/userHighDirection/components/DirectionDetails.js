import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import Alert, {
  msjConfirmacion,
  titleConfirmacion,
  titleError,
  msjError,
  msjExito,
  titleExito,
} from "../../../shared/plugins/alert";
import axios from "../../../shared/plugins/axios";

export const DirectionDetails = ({
  isOpenDetails,
  handleClose,
  name,
  surname,
  secondSurname,
  username
}) => {
  
  const [values, setValues] = useState({ name: name, surname: surname, secondSurname: secondSurname, username: username});

  const handleCloseForm = () => {
    handleClose(false);
    setValues({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
}

  useEffect(() => {
    setValues({
      name: name,
      surname: surname,
      secondSurname: secondSurname,
      username: username,
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
          <Modal.Title>Detalles del usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="row">
            <Form.Group className="col-md-4 mb-4">
              <Form.Label className="font-weight-normal">Nombre<span className="text-danger">*</span></Form.Label>
              <Form.Control
                name="name"
                value={values.name}
                onChange={handleChange}
                readOnly
              />
            </Form.Group>
            <Form.Group className="col-md-4 mb-4">
              <Form.Label className="font-weight-normal">Primer apellido<span className="text-danger">*</span></Form.Label>
              <Form.Control
                name="surname"
                value={values.surname}
                onChange={handleChange}
                readOnly
              />
            </Form.Group>
            <Form.Group className="col-md-4 mb-4">
              <Form.Label className="font-weight-normal">Segundo apellido<span className="text-danger">*</span></Form.Label>
              <Form.Control
                name="secondSurname"
                value={values.secondSurname}
                onChange={handleChange}
                readOnly
              />
            </Form.Group>
            <Form.Group className="col-md-6 mb-4">
              <Form.Label className="font-weight-normal">Correo<span className="text-danger">*</span></Form.Label>
              <Form.Control
                name="username"
                value={values.username}
                onChange={handleChange}
                readOnly
              />
            </Form.Group>
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
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};