import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

export const PersonalDetails = ({
    isOpenDetails,
    handleClose,
    id,
    name,
    surname,
    secondSurname,
    email,
    dateBirth,
    phone,
    profession,
    status
}) => {
    const [values, setValues] = useState({
        id: id,
        name: name,
        surname: surname,
        secondSurname: secondSurname,
        email: email,
        dateBirth: dateBirth,
        phone: phone,
        profession: profession,
        status: status,
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
            id: id,
            name: name,
            surname: surname,
            secondSurname: secondSurname,
            email: email,
            dateBirth: dateBirth,
            phone: phone,
            profession: profession,
            status: status,
        });
    }, [isOpenDetails]);

    return (
        <>
            <Modal show={isOpenDetails} onHide={handleCloseForm} size="lg">
                <Modal.Header closeButton className="backgroundHeadModal" closeVariant="white">
                    <Modal.Title>Detalles del personal</Modal.Title>
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
                            <Form.Label className="font-weight-normal">Correo electrónico<span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group className="col-md-6 mb-4">
                            <Form.Label className="font-weight-normal">Fecha de nacimiento<span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                name="dateBirth"
                                value={values.dateBirth}
                                onChange={handleChange}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group className="col-md-6 mb-4">
                            <Form.Label className="font-weight-normal">Teléfono<span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                name="phone"
                                value={values.phone}
                                onChange={handleChange}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group className="col-md-6 mb-4">
                            <Form.Label className="font-weight-normal">Rol<span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                name="profession"
                                value={values.profession}
                                onChange={handleChange}
                                readOnly
                            />
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