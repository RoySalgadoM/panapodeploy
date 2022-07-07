import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import Alert, {
    msjConfirmacion,
    titleConfirmacion,
    titleError,
    msjError,
    msjExito,
    titleExito,
} from "../../../shared/plugins/alert";
import * as yup from "yup";
import axios from "../../../shared/plugins/axios";
import { useFormik } from "formik";

export const PersonalEdit = ({
    isOpenUpdate,
    handleClose,
    getPersonal,
    id,
    name,
    surname,
    secondSurname,
    email,
    dateBirth,
    phone,
    profession,
    status,
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
        status: status
    });

    const formikModify = useFormik({
        initialValues: {
            name: "",
            surname: "",
            secondSurname: "",
            dateBirth: "",
            phone: "",
            email: "",
            profession: "",
        },
        validationSchema: yup.object().shape({
            name: yup.string().required("Campo obligatorio"),
            surname: yup.string().required("Campo obligatorio"),
            secondSurname: yup.string().required("Campo obligatorio"),
            dateBirth: yup.string().required("Campo obligatorio"),
            phone: yup.string().required("Campo obligatorio"),
            profession: yup.number().required("Campo obligatorio"),
        }),
        onSubmit: (valuesFormik) => {
            const person = {
                ...valuesFormik,
                id: id,
                profession: {
                    id: parseInt(valuesFormik.profession)
                },
                status: {
                    id: status
                }
            };
            return axios({
                url: "/person/",
                method: "PUT",
                data: JSON.stringify(person),
            })
                .then((response) => {
                    if (!response.error) {
                        handleCloseForm();
                        getPersonal();
                        Alert.fire({
                            title: "Personal modificado correctamente",
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

    useEffect(() => {
        setValues({
            id: id,
            status: status,
            name: name,
            surname: surname,
            secondSurname: secondSurname,
            email: email,
            dateBirth: dateBirth,
            phone: phone,
            profession: profession,
        });
        formikModify.values.name = name;
        formikModify.values.email = email;
        formikModify.values.surname = surname;
        formikModify.values.secondSurname = secondSurname;
        formikModify.values.dateBirth = dateBirth;
        formikModify.values.phone = phone;
        formikModify.values.profession = profession;
    }, [isOpenUpdate]);

    return (
        <>
            <Modal show={isOpenUpdate} onHide={handleCloseForm} size="lg">
                <Modal.Header
                    closeButton
                    className="backgroundHeadModal"
                    closeVariant="white"
                >
                    <Modal.Title>Modificar personal</Modal.Title>
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
                            {formikModify.errors.name ? (
                                <span className='text-danger'>{formikModify.errors.name}</span>
                            ) : null}
                        </Form.Group>
                        <Form.Group className="col-md-4 mb-4">
                            <Form.Label className="font-weight-normal">Primer apellido<span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                name="surname"
                                value={formikModify.values.surname}
                                onChange={formikModify.handleChange}
                            />
                            {formikModify.errors.surname ? (
                                <span className='text-danger'>{formikModify.errors.surname}</span>
                            ) : null}
                        </Form.Group>
                        <Form.Group className="col-md-4 mb-4">
                            <Form.Label className="font-weight-normal">Segundo apellido<span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                name="secondSurname"
                                value={formikModify.values.secondSurname}
                                onChange={formikModify.handleChange}
                            />
                            {formikModify.errors.secondSurname ? (
                                <span className='text-danger'>{formikModify.errors.secondSurname}</span>
                            ) : null}
                        </Form.Group>
                        <Form.Group className="col-md-6 mb-4">
                            <Form.Label className="font-weight-normal">Fecha de nacimiento<span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="date"
                                name="dateBirth"
                                value={formikModify.values.dateBirth}
                                onChange={formikModify.handleChange}
                            />
                            {formikModify.errors.dateBirth ? (
                                <span className='text-danger'>{formikModify.errors.dateBirth}</span>
                            ) : null}
                        </Form.Group>
                        <Form.Group className="col-md-6 mb-4">
                            <Form.Label className="font-weight-normal">Teléfono<span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="tel"
                                name="phone"
                                value={formikModify.values.phone}
                                onChange={formikModify.handleChange}
                            />
                            {formikModify.errors.phone ? (
                                <span className='text-danger'>{formikModify.errors.phone}</span>
                            ) : null}
                        </Form.Group>
                        <Form.Group className="col-md-6 mb-4">
                            <Form.Label className="font-weight-normal">Rol<span className="text-danger">*</span></Form.Label>
                            <Form.Select aria-label="Seleccionar una opción"
                                value={formikModify.values.profession} onChange={formikModify.handleChange} name="profession">
                                <option value="1">Docente</option>
                                <option value="2">Becario</option>
                            </Form.Select>
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
