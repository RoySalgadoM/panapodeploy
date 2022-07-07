import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import Alert, { msjConfirmacion, titleConfirmacion, titleError, msjError, msjExito, titleExito } from "../../../shared/plugins/alert";
import * as yup from "yup";
import axios from "../../../shared/plugins/axios";
import { useFormik } from "formik";

export const ClientEdit = ({
    isOpenUpdate,
    handleClose,
    getClients,
    id,
    name,
    surname,
    secondSurname,
    company,
    typeClient,
    phoneClient,
    emailClient,
    nameRepre,
    surnameRepre,
    secondSurnameRepre,
    phoneRepre,
    emailRepre,
    extension
}) => {

    const [values, setValues] = useState({
        id: id,
        name: name,
        surname: surname,
        secondSurname: secondSurname,
        company: company,
        typeClient: typeClient,
        phoneClient: phoneClient,
        emailClient: emailClient,
        nameRepre: nameRepre,
        surnameRepre: surnameRepre,
        secondSurnameRepre: secondSurnameRepre,
        phoneRepre: phoneRepre,
        emailRepre: emailRepre,
        extension: extension
    });

    const formikModify = useFormik({
        initialValues: {
            company: "",
            phoneClient: "",
            emailClient: "",
            extension: "",
            typeClient: 1,
            name: "",
            nameRepre: "",
            surname: "",
            surnameRepre: "",
            secondSurname: "",
            secondSurnameRepre: "",
            phoneRepre: "",
            emailRepre: ""
        },
        validationSchema: yup.object().shape({
            phoneClient: yup.string().required("Campo obligatorio"),
            emailClient: yup.string().email("Ingresa un correo correcto").required("Campo obligatorio"),
            extension: yup.number().min(3, "Mínimo 3 caracteres").required("Campo obligatorio"),
            nameRepre: yup.string().required("Campo obligatorio"),
            surnameRepre: yup.string().required("Campo obligatorio"),
            secondSurnameRepre: yup.string().required("Campo obligatorio"),
            phoneRepre: yup.string().required("Campo obligatorio"),
            emailRepre: yup.string().email("Ingresa un correo correcto").required("Campo obligatorio"),
        }),
        onSubmit: (valuesFormik) => {
            const cliente = {
                ...valuesFormik,
                id: id,
                typeClient: {
                    id: parseInt(valuesFormik.typeClient)
                },
            };
            return axios({
                url: "/client/",
                method: "PUT",
                data: JSON.stringify(cliente),
            })
                .then((response) => {
                    if (!response.error) {
                        handleCloseForm();
                        getClients();
                        Alert.fire({
                            title: "Cliente modificado correctamente",
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
            name: name,
            surname: surname,
            secondSurname: secondSurname,
            company: company,
            typeClient: typeClient,
            phoneClient: phoneClient,
            emailClient: emailClient,
            nameRepre: nameRepre,
            surnameRepre: surnameRepre,
            secondSurnameRepre: secondSurnameRepre,
            phoneRepre: phoneRepre,
            emailRepre: emailRepre,
            extension: extension
        })
        formikModify.values.id = id
        formikModify.values.name = name
        formikModify.values.surname = surname
        formikModify.values.secondSurname = secondSurname
        formikModify.values.company = company
        formikModify.values.typeClient = typeClient
        formikModify.values.phoneClient = phoneClient
        formikModify.values.emailClient = emailClient
        formikModify.values.nameRepre = nameRepre
        formikModify.values.surnameRepre = surnameRepre
        formikModify.values.secondSurnameRepre = secondSurnameRepre
        formikModify.values.phoneRepre = phoneRepre
        formikModify.values.emailRepre = emailRepre
        formikModify.values.extension = extension
    }, [isOpenUpdate]);

    return (
        <>
            <Modal show={isOpenUpdate} onHide={handleCloseForm} size="lg">
                <Modal.Header closeButton className="backgroundHeadModal" closeVariant="white">
                    <Modal.Title>Modificar cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="row" onSubmit={formikModify.handleSubmit}>
                        <Form.Group className="col-md-6 mb-4">
                            <Form.Label className="font-weight-normal">Correo electrónico<span className="text-danger">*</span> </Form.Label>
                            <Form.Control name="emailClient" type="email" placeholder="Email"
                                value={formikModify.values.emailClient} onChange={formikModify.handleChange} />
                            {formikModify.errors.emailClient ? (
                                <span className="text-danger">{formikModify.errors.emailClient}</span>
                            ) : null}
                        </Form.Group>
                        <Form.Group className="col-md-4 mb-4">
                            <Form.Label className="font-weight-normal">Teléfono<span className="text-danger">*</span></Form.Label>
                            <Form.Control name="phoneClient" type="tel" placeholder="7778895412"
                                value={formikModify.values.phoneClient} onChange={formikModify.handleChange} />
                            {formikModify.errors.phoneClient ? (
                                <span className="text-danger">{formikModify.errors.phoneClient}</span>
                            ) : null}
                        </Form.Group>
                        <Form.Group className="col-md-2 mb-4">
                            <Form.Label className="font-weight-normal">Extensión<span className="text-danger">*</span></Form.Label>
                            <Form.Control name="extension" type="tel" placeholder="123"
                                value={formikModify.values.extension} onChange={formikModify.handleChange} />
                            {formikModify.errors.extension ? (
                                <span className="text-danger">{formikModify.errors.extension}</span>
                            ) : null}
                        </Form.Group>
                        <Form.Group className="col-md-12 mb-3">
                            <h5 className="text-bold">Información del representante del cliente</h5>
                        </Form.Group>
                        <Form.Group className="col-md-4 mb-4">
                            <Form.Label className="font-weight-normal">Nombre<span className="text-danger">*</span></Form.Label>
                            <Form.Control name="nameRepre" type="text" placeholder="María"
                                value={formikModify.values.nameRepre} onChange={formikModify.handleChange} />
                            {formikModify.errors.nameRepre ? (
                                <span className="text-danger">{formikModify.errors.nameRepre}</span>
                            ) : null}
                        </Form.Group>
                        <Form.Group className="col-md-4 mb-4">
                            <Form.Label className="font-weight-normal">Primer apellido<span className="text-danger">*</span></Form.Label>
                            <Form.Control name="surnameRepre" type="text" placeholder="Valdez"
                                value={formikModify.values.surnameRepre} onChange={formikModify.handleChange} />
                            {formikModify.errors.surnameRepre ? (
                                <span className="text-danger">{formikModify.errors.surnameRepre}</span>
                            ) : null}
                        </Form.Group>
                        <Form.Group className="col-md-4 mb-4">
                            <Form.Label className="font-weight-normal">Segundo apellido<span className="text-danger">*</span></Form.Label>
                            <Form.Control name="secondSurnameRepre" type="text" placeholder="Díaz"
                                value={formikModify.values.secondSurnameRepre} onChange={formikModify.handleChange} />
                            {formikModify.errors.secondSurnameRepre ? (
                                <span className="text-danger">{formikModify.errors.secondSurnameRepre}</span>
                            ) : null}
                        </Form.Group>
                        <Form.Group className="col-md-6 mb-4">
                            <Form.Label className="font-weight-normal">Teléfono<span className="text-danger">*</span></Form.Label>
                            <Form.Control name="phoneRepre" type="tel" placeholder=""
                                value={formikModify.values.phoneRepre} onChange={formikModify.handleChange} />
                            {formikModify.errors.phoneRepre ? (
                                <span className="text-danger">{formikModify.errors.phoneRepre}</span>
                            ) : null}
                        </Form.Group>
                        <Form.Group className="col-md-6 mb-4">
                            <Form.Label className="font-weight-normal">Correo electrónico<span className="text-danger">*</span></Form.Label>
                            <Form.Control name="emailRepre" type="email" placeholder="Email"
                                value={formikModify.values.emailRepre} onChange={formikModify.handleChange} />
                            {formikModify.errors.emailRepre ? (
                                <span className="text-danger">{formikModify.errors.emailRepre}</span>
                            ) : null}
                        </Form.Group>

                        <Form.Group className="mb-4 mt-3">
                            <Row>
                                <Col className="text-end">
                                    <Button variant="secondary" type="button" onClick={handleCloseForm} >
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