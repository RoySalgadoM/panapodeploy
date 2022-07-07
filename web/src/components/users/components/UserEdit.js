import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import Alert, { msjConfirmacion, titleConfirmacion, titleError, msjError, msjExito, titleExito } from "../../../shared/plugins/alert";
import axios from "../../../shared/plugins/axios";
import { useFormik } from "formik";
import * as yup from "yup";

export const UserEdit = ({
    isOpenUpdate,
    handleClose, 
    status,
    id
}) => {

    const [values, setValues] = useState({id:id});

    const handleCloseForm = () => {

        formikModify.resetForm();
        setValues({});
        handleClose(false);
    };

    useEffect(() => {
        setValues({
            id:id
        })
        
    }, []);

    const formikModify = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validationSchema: yup.object().shape({
            password: yup.string().required("Campo obligatorio"),
            confirmPassword: yup.string().required("Campo obligatorio"),
        }),
        onSubmit: (valuesFormik) => {
            const pass = {
                ...valuesFormik,
                id: id,
                
            };
            return axios({
                url: "/user/update",
                method: "PUT",
                data: JSON.stringify(pass),
            })
                .then((response) => {
                    if (!response.error) {
                        handleCloseForm();
                        // getPersonal();
                        Alert.fire({
                            title: "Se ha cambiado la contraseña exitosamente",
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

    return (
        <>
            <Modal show={isOpenUpdate} onHide={handleCloseForm}>
                <Modal.Header closeButton className="backgroundHeadModal" closeVariant="white">
                    <Modal.Title>Modificar Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form  className="row" onSubmit={formikModify.handleSubmit}>
                        <Form.Group className="col-md-12 mb-4">
                            <Form.Label className="font-weight-normal">Contraseña <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                name="password"
                                type="password"
                                placeholder="********"
                                value={formikModify.values.password}
                                onChange={formikModify.handleChange}
                            />
                            
                        </Form.Group>
                        <Form.Group className="col-md-12 mb-4">
                            <Form.Label className="font-weight-normal">Confirmar contraseña<span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                name="confirmPassword"
                                type="password"
                                placeholder="********"
                                value={formikModify.values.confirmPassword}
                                onChange={formikModify.handleChange}
                            />
                            <Form.Text muted>
                                La contraseña solo se cambiará si ingresa algún valor
                            </Form.Text>
                            {formikModify.values.confirmPassword !== "" && formikModify.values.password !== "" && formikModify.values.confirmPassword !== formikModify.values.password ? (
                                <span className='text-danger'>Las contraseñas no son iguales</span>
                            ) : null}                           
                        </Form.Group>
                        
                        <Form.Group className="mb-4 topBottom">
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