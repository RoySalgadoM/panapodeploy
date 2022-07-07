import React, { useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from './authContext';
import Alert, { msjConfirmacion, titleConfirmacion, titleError, msjError, msjExito, titleExito } from "../../shared/plugins/alert";
import axios from "../../shared/plugins/axios";
import { useFormik } from 'formik';
import * as yup from "yup";
import { Button, Row, Card, Container, Form, FormControl, Breadcrumb, InputGroup, FormGroup } from "react-bootstrap";
import img from "../../assets/img/logo-cds.png";
import FeatherIcon from "feather-icons-react";
import '../../assets/css/util.css'
import '../../assets/css/Styles.css'

export const RecoverPassword = () => {

    const navigation = useNavigate();
    const { dispatch } = useContext(AuthContext);

    useEffect(() => {
        document.title = "PANAPO | Recuperar contraseña";
    }, []);

    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
            code: ""
        },
        validationSchema: yup.object().shape({
            password: yup.string().required("Campo obligatorio"),
            confirmPassword: yup.string().required("Campo obligatorio"),
            code: yup.string().required("Campo obligatorio"),
        }),
        onSubmit: (values) => {
            if (values.password !== values.confirmPassword) {
                Alert.fire({
                    title: "Verifique los datos",
                    text: "Las contraseñas no coinciden",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#3085D6",
                });
            } else {
                return axios({ url: "/user/confir/", method: "POST", data: JSON.stringify(values) })
                    .then((response) => {
                        if (!response.error) {
                            Alert.fire({
                                title: "Cambio de contraseña exitoso",
                                text: "Se ha cambiado la contraseña correctamente ahora puede iniciar sesión",
                                confirmButtonColor: "#198754",
                                icon: "success",
                                confirmButtonText: "Aceptar",
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    handleCloseForm();
                                }
                                navigation("/");
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

    const handleCloseForm = () => {
        formik.resetForm();
    };

    return (
        <header className="App-header">
            <Container className="py-5 h-100">
                <Row className='d-flex justify-content-center align-items-center h-100'>
                    <Card style={{ width: "22rem" }}>
                        <div className='text-center'>
                            <Card.Img
                                variant="top"
                                style={{
                                    width: "60%",
                                }}
                                className="rounded"
                                alt="logo-cds"
                                src={img}
                            />
                        </div>
                        <hr />
                        <Card.Body>
                            <Card.Text>
                                <div className='text-center'>
                                    <p>Ingresa el código que llegó a tu correo electrónico</p>
                                </div>
                                <Form onSubmit={formik.handleSubmit}>
                                    <FormGroup>
                                        <InputGroup className='mb-3'>
                                            <FormControl
                                                id="code"
                                                type="number"
                                                placeholder='Código'
                                                aria-label='Code...'
                                                name='code' value={formik.values.code} onChange={formik.handleChange}
                                            />

                                            <InputGroup.Text>
                                                <FeatherIcon icon="mail" />
                                            </InputGroup.Text>
                                        </InputGroup>
                                    </FormGroup>
                                    <div className='text-center'>
                                        <p>Ingrese su nueva contraseña en los siguientes campos</p>
                                    </div>
                                    <InputGroup className='mb-3'>
                                        <FormControl
                                            id="newPassword"
                                            type="password"
                                            placeholder='Nueva Contraseña'
                                            aria-label='constraseña'
                                            autoComplete='off'
                                            name='password' value={formik.values.password} onChange={formik.handleChange}
                                        />
                                        <InputGroup.Text>
                                            <FeatherIcon icon="lock" />
                                        </InputGroup.Text>
                                    </InputGroup>
                                    <InputGroup className='mb-3'>
                                        <FormControl
                                            id="confNewPassword"
                                            type="password"
                                            placeholder='Confirmar Contraseña'
                                            aria-label='constraseña'
                                            autoComplete='off'
                                            name='confirmPassword' value={formik.values.confirmPassword} onChange={formik.handleChange}
                                        />
                                        <InputGroup.Text>
                                            <FeatherIcon icon="lock" />
                                        </InputGroup.Text>
                                    </InputGroup>
                                    <Form.Group className='form-outline mb-4'>
                                        <div className='d-grid gap-2 text-center pt-1 pb-1'>
                                            <Button
                                                style={{ background: "#042B61", borderColor: "#042B61", }}
                                                type="submit" disabled={!(formik.isValid && formik.dirty)}
                                            >
                                                Cambiar Contraseña
                                            </Button>
                                        </div>
                                    </Form.Group>
                                </Form>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Row>
                <script src="../../plugins/jquery/jquery.min.js"></script>
                <script src="../../plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
                <script src="../../dist/js/adminlte.min.js"></script>
            </Container>
        </header>

    )
}