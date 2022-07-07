import React, { useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./authContext";
import axios from "../../shared/plugins/axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button, Row, Card, Col, Container, Form, FormControl, Breadcrumb, InputGroup, FormGroup, } from "react-bootstrap";
import img from "../../assets/img/logo-cds.png";
import FeatherIcon from "feather-icons-react";
import "../../assets/css/util.css";
import "../../assets/css/Styles.css";
import Alert, { msjConfirmacion, titleConfirmacion, titleError, msjError, msjExito, titleExito } from "../../shared/plugins/alert";


export const ForgotPassword = () => {
    const navigation = useNavigate();
    const { dispatch } = useContext(AuthContext);

    useEffect(() => {
        document.title = "PANAPO | ¿Olvidaste tu contraseña?";
    }, []);

    const formik = useFormik({
        initialValues: {
            username: "",
        },
        validationSchema: yup.object().shape({
            username: yup.string().required("Campo obligatorio"),
        }),
        onSubmit: (values) => {
            return axios({ url: "/user/password/", method: "POST", data: JSON.stringify(values) })
                .then((response) => {
                    if (!response.error) {
                        Alert.fire({
                            title: titleExito,
                            text: "Se ha enviado el código a su correo electrónico",
                            confirmButtonColor: "#198754",
                            icon: "success",
                            confirmButtonText: "Aceptar",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                handleCloseForm();
                            }
                            navigation("/recover");
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
        },
    });

    const handleCloseForm = () => {
        formik.resetForm();
    };
    return (
        <header className="App-header">
            <Container>
                <Row className="d-flex justify-content-center align-items-center">
                    <Card style={{ width: "22rem" }}>
                        <Col className="text-center">
                            <Card.Img
                                variant="top"
                                className="rounded"
                                alt="logo-cds"
                                src={img}
                            />
                        </Col>
                        <hr />
                        <Card.Body>
                            <Card.Text>
                                <div className="text-center">
                                    <p>
                                        ¿Olvidaste tu contraseña? Solicita una nueva ingresando tu
                                        correo a continuación
                                    </p>
                                </div>
                                <Form onSubmit={formik.handleSubmit}>
                                    <FormGroup>
                                        <InputGroup className="mb-3">
                                            <FormControl type="email" value={formik.values.username} onChange={formik.handleChange} placeholder="Correo electrónico" aria-label="Email..." autoComplete="off" name="username" />
                                            <InputGroup.Text>
                                                <FeatherIcon icon="mail" />
                                            </InputGroup.Text>
                                        </InputGroup>
                                        {formik.errors.username ? (
                                            <span className='text-danger'>{formik.errors.username}</span>
                                        ) : null}
                                    </FormGroup>
                                    <Form.Group className="form-outline mb-4">
                                        <div className="d-grid gap-2 text-center pt-1 pb-1">

                                            <Button style={{ background: "#042B61", borderColor: "#042B61", }} type="submit" disabled={!(formik.isValid && formik.dirty)} >
                                                Confirmar

                                            </Button>

                                        </div>
                                    </Form.Group>
                                </Form>
                                <Link to={`/`} className={"breadcrumb-item"}>
                                    Volver al inicio de sesión
                                </Link>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Row>
            </Container>
        </header>
    );
};