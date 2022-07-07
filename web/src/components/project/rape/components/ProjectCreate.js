import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import Alert, { msjConfirmacion, titleConfirmacion, titleError, msjError, msjExito, titleExito } from "../../../../shared/plugins/alert";
import * as yup from "yup";
import axios from "../../../../shared/plugins/axios";
import { useFormik } from "formik";

export const ProjectCreate = ({
    isOpenCreateReport,
    handleClose,
    getProjectsRape,
    id
}) => {

    const formik = useFormik({
        initialValues: {
            phasePlanned: "",
            phaseReal: "",
            stagePlanned: "",
            stageReal: "",
            percentage: "",
            cost: "",
            daysDeviation: "",
        },
        validationSchema: yup.object().shape({
            phasePlanned: yup.string().required("Campo obligatorio"),
            phaseReal: yup.string().required("Campo obligatorio"),
            stagePlanned: yup.string().required("Campo obligatorio"),
            stageReal: yup.string().required("Campo obligatorio"),
            percentage: yup.number().required("Campo obligatorio").min(1, "El valor tiene que ser mayor a cero"),
            cost: yup.number().required("Campo obligatorio").min(1, "El valor tiene que ser mayor a cero"),
            daysDeviation: yup.number().required("Campo obligatorio"),
        }),
        onSubmit: (values) => {
            let dateFormat = new Date(new Date());
            let year = dateFormat.getFullYear();
            let day = dateFormat.getDate();
            if (day < 10) day = `0${day}`
            let month = dateFormat.getMonth();
            month = month + 1;
            if (month < 10) month = `0${month}`
            let finalDate = `${year}-${month}-${day}`
            let report = {
                ...values,
                project: {
                    id: id
                },
                date: finalDate
            };
            axios({ url: "/report/", method: "POST", data: JSON.stringify(report) })
                .then((response) => {
                    if (!response.error) {
                        formikPhases.values.report = response.data.id
                        formikPhases.handleSubmit();
                        Alert.fire({
                            title: "Reporte registrado correctamente",
                            confirmButtonColor: "#198754",
                            icon: "success",
                            confirmButtonText: "Aceptar",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                handleCloseForm();
                            }
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    Alert.fire({
                        title: titleError,
                        text: msjError,
                        cancelButtonColor: "#198754",
                        icon: "error",
                        confirmButtonText: "Aceptar",
                    });
                });
        },
    });

    const formikPhases = useFormik({
        initialValues: {
            cierre: "",
            inicio: "",
            requerimientos: "",
            construccion: "",
            analisis: "",
            integracion: "",
            report: ""
        },
        validationSchema: yup.object().shape({
            report: yup.string().required("Campo obligatorio"),
            inicio: yup.number().min(0, "El valor tiene que ser mayor o igual a cero"),
            requerimientos: yup.number().min(0, "El valor tiene que ser mayor o igual a cero"),
            construccion: yup.number().min(0, "El valor tiene que ser mayor o igual a cero"),
            analisis: yup.number().min(0, "El valor tiene que ser mayor o igual a cero"),
            integracion: yup.number().min(0, "El valor tiene que ser mayor o igual a cero"),
        }),
        onSubmit: (values) => {
            let fase = {
                report: {
                    id: values.report
                },
                phases: {
                    id: 1
                },
                porcentaje: values.inicio
            }
            //1
            axios({ url: "/reportphases/", method: "POST", data: JSON.stringify(fase) })
                .then((response) => {
                    if (!response.error) {
                    }
                })
                .catch((error) => {
                    console.log(error);
                    Alert.fire({
                        title: titleError,
                        text: msjError,
                        cancelButtonColor: "#198754",
                        icon: "error",
                        confirmButtonText: "Aceptar",
                    });
                });
            //2
            fase = {
                report: {
                    id: values.report
                },
                phases: {
                    id: 2
                },
                porcentaje: values.requerimientos
            }
            axios({ url: "/reportphases/", method: "POST", data: JSON.stringify(fase) })
                .then((response) => {
                    if (!response.error) {
                    }
                })
                .catch((error) => {
                    console.log(error);
                    Alert.fire({
                        title: titleError,
                        text: msjError,
                        cancelButtonColor: "#198754",
                        icon: "error",
                        confirmButtonText: "Aceptar",
                    });
                });
            //3
            fase = {
                report: {
                    id: values.report
                },
                phases: {
                    id: 3
                },
                porcentaje: values.analisis
            }
            axios({ url: "/reportphases/", method: "POST", data: JSON.stringify(fase) })
                .then((response) => {
                    if (!response.error) {
                    }
                })
                .catch((error) => {
                    console.log(error);
                    Alert.fire({
                        title: titleError,
                        text: msjError,
                        cancelButtonColor: "#198754",
                        icon: "error",
                        confirmButtonText: "Aceptar",
                    });
                });
            //4
            fase = {
                report: {
                    id: values.report
                },
                phases: {
                    id: 4
                },
                porcentaje: values.construccion
            }
            axios({ url: "/reportphases/", method: "POST", data: JSON.stringify(fase) })
                .then((response) => {
                    if (!response.error) {
                    }
                })
                .catch((error) => {
                    console.log(error);
                    Alert.fire({
                        title: titleError,
                        text: msjError,
                        cancelButtonColor: "#198754",
                        icon: "error",
                        confirmButtonText: "Aceptar",
                    });
                });
            //5
            fase = {
                report: {
                    id: values.report
                },
                phases: {
                    id: 5
                },
                porcentaje: values.integracion
            }
            axios({ url: "/reportphases/", method: "POST", data: JSON.stringify(fase) })
                .then((response) => {
                    if (!response.error) {
                    }
                })
                .catch((error) => {
                    console.log(error);
                    Alert.fire({
                        title: titleError,
                        text: msjError,
                        cancelButtonColor: "#198754",
                        icon: "error",
                        confirmButtonText: "Aceptar",
                    });
                });
            //6
            fase = {
                report: {
                    id: values.report
                },
                phases: {
                    id: 6
                },
                porcentaje: values.cierre
            }
            axios({ url: "/reportphases/", method: "POST", data: JSON.stringify(fase) })
                .then((response) => {
                    if (!response.error) {
                    }
                })
                .catch((error) => {
                    console.log(error);
                    Alert.fire({
                        title: titleError,
                        text: msjError,
                        cancelButtonColor: "#198754",
                        icon: "error",
                        confirmButtonText: "Aceptar",
                    });
                });
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
            getProjectsRape();
        },
    });

    const handleCloseForm = () => {
        formik.resetForm();
        handleClose(false);
    };

    return (
        <>
            <Modal show={isOpenCreateReport} onHide={handleCloseForm} size="lg" >
                <Modal.Header closeButton className="backgroundHeadModal" closeVariant="white">
                    <Modal.Title>Hacer reporte</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="row" onSubmit={formik.handleSubmit}>
                        <Form.Group className="col-md-12 mb-1">
                            <h5>Datos de inversión</h5>
                        </Form.Group>
                        <Form.Group className="col-md-6 mb-4" >
                            <Form.Label className="font-weight-normal">Costo total de inversión<span className="text-danger">*</span></Form.Label>
                            <Form.Control type="number" placeholder="Ejemplo: 60000" name="cost" value={formik.values.cost}
                                onChange={formik.handleChange} />
                            {formik.errors.cost ? (
                                <span className='text-danger'>{formik.errors.cost}</span>
                            ) : null}
                        </Form.Group>
                        <Form.Group className="col-md-6 mb-4" >
                            <Form.Label className="font-weight-normal">Días de desviación<span className="text-danger">*</span></Form.Label>
                            <Form.Control type="number" placeholder="Ejemplo: 10" name="daysDeviation" value={formik.values.daysDeviation}
                                onChange={formik.handleChange} />
                            {formik.errors.daysDeviation ? (
                                <span className='text-danger'>{formik.errors.daysDeviation}</span>
                            ) : null}
                        </Form.Group>
                        <Form.Group className="col-md-12 mb-1">
                            <h5>Estado de avance</h5>
                        </Form.Group>
                        <Form.Group className="col-md-6 mb-4" >
                            <Form.Label className="font-weight-normal">Etapa planeada (APE)<span className="text-danger">*</span></Form.Label>
                            <Form.Select name="stagePlanned" value={formik.values.stagePlanned}
                                onChange={formik.handleChange}>
                                <option value="">Seleccione una opción</option>
                                <option value="Planeación">Planeación</option>
                                <option value="Realización">Realización</option>
                                <option value="Control">Control</option>
                                <option value="Cierre">Cierre</option>
                            </Form.Select>
                            {formik.errors.stagePlanned ? (
                                <span className='text-danger'>{formik.errors.stagePlanned}</span>
                            ) : null}
                        </Form.Group>
                        <Form.Group className="col-md-6 mb-4" >
                            <Form.Label className="font-weight-normal">Etapa real (APE)<span className="text-danger">*</span></Form.Label>
                            <Form.Select name="stageReal" value={formik.values.stageReal}
                                onChange={formik.handleChange}>
                                <option value="">Seleccione una opción</option>
                                <option value="Planeación">Planeación</option>
                                <option value="Realización">Realización</option>
                                <option value="Control">Control</option>
                                <option value="Cierre">Cierre</option>
                            </Form.Select>
                            {formik.errors.stageReal ? (
                                <span className='text-danger'>{formik.errors.stageReal}</span>
                            ) : null}
                        </Form.Group>
                        <Form.Group className="col-md-6 mb-4" >
                            <Form.Label className="font-weight-normal">Fase planeada (DMS)<span className="text-danger">*</span></Form.Label>
                            <Form.Select name="phasePlanned" value={formik.values.phasePlanned}
                                onChange={formik.handleChange}>
                                <option value="">Seleccione una opción</option>
                                <option value="Inicio">Inicio</option>
                                <option value="Requerimientos">Requerimientos</option>
                                <option value="Análisis y diseño">Análisis y diseño</option>
                                <option value="Construcción">Construcción</option>
                                <option value="Integración y pruebas">Integración y pruebas</option>
                                <option value="Cierre">Cierre</option>
                            </Form.Select>
                            {formik.errors.phasePlanned ? (
                                <span className='text-danger'>{formik.errors.phasePlanned}</span>
                            ) : null}
                        </Form.Group>
                        <Form.Group className="col-md-6 mb-4" >
                            <Form.Label className="font-weight-normal">Fase real (DMS)<span className="text-danger">*</span></Form.Label>
                            <Form.Select name="phaseReal" value={formik.values.phaseReal}
                                onChange={formik.handleChange}>
                                <option value="">Seleccione una opción</option>
                                <option value="Inicio">Inicio</option>
                                <option value="Requerimientos">Requerimientos</option>
                                <option value="Análisis y diseño">Análisis y diseño</option>
                                <option value="Construcción">Construcción</option>
                                <option value="Integración y pruebas">Integración y pruebas</option>
                                <option value="Cierre">Cierre</option>
                            </Form.Select>
                            {formik.errors.phaseReal ? (
                                <span className='text-danger'>{formik.errors.phaseReal}</span>
                            ) : null}
                        </Form.Group>
                        <Form.Group className="col-md-6 mb-4" >
                            <Form.Label className="font-weight-normal">Porcentaje de avance total (%)<span className="text-danger">*</span></Form.Label>
                            <Form.Control type="number" placeholder="Ejemplo: 20" name="percentage" value={formik.values.percentage}
                                onChange={formik.handleChange} />
                            {formik.errors.percentage ? (
                                <span className='text-danger'>{formik.errors.percentage}</span>
                            ) : null}
                        </Form.Group>
                        <Form.Group className="col-md-12 mb-1">
                            <h5>Porcentaje de avance por fase</h5>
                        </Form.Group>
                        <Form.Group className="col-md-6 mb-4" >
                            <Form.Label className="font-weight-normal">Inicio</Form.Label>
                            <Form.Control type="number" placeholder="Ejemplo: 20" name="inicio" value={formikPhases.values.inicio}
                                onChange={formikPhases.handleChange} />
                            {formikPhases.errors.inicio ? (
                                <span className='text-danger'>{formikPhases.errors.inicio}</span>
                            ) : null}
                        </Form.Group>
                        <Form.Group className="col-md-6 mb-4" >
                            <Form.Label className="font-weight-normal">Requerimientos</Form.Label>
                            <Form.Control type="number" placeholder="Ejemplo: 20" name="requerimientos" value={formikPhases.values.requerimientos}
                                onChange={formikPhases.handleChange} />
                            {formikPhases.errors.requerimientos ? (
                                <span className='text-danger'>{formikPhases.errors.requerimientos}</span>
                            ) : null}
                        </Form.Group>
                        <Form.Group className="col-md-6 mb-4" >
                            <Form.Label className="font-weight-normal">Análisis y diseño</Form.Label>
                            <Form.Control type="number" placeholder="Ejemplo: 20" name="analisis" value={formikPhases.values.analisis}
                                onChange={formikPhases.handleChange} />
                            {formikPhases.errors.analisis ? (
                                <span className='text-danger'>{formikPhases.errors.analisis}</span>
                            ) : null}
                        </Form.Group>
                        <Form.Group className="col-md-6 mb-4" >
                            <Form.Label className="font-weight-normal">Construcción</Form.Label>
                            <Form.Control type="number" placeholder="Ejemplo: 20" name="construccion" value={formikPhases.values.construccion}
                                onChange={formikPhases.handleChange} />
                            {formikPhases.errors.construccion ? (
                                <span className='text-danger'>{formikPhases.errors.construccion}</span>
                            ) : null}
                        </Form.Group>
                        <Form.Group className="col-md-6 mb-4" >
                            <Form.Label className="font-weight-normal">Integración y pruebas</Form.Label>
                            <Form.Control type="number" placeholder="Ejemplo: 20" name="integracion" value={formikPhases.values.integracion}
                                onChange={formikPhases.handleChange} />
                            {formikPhases.errors.integracion ? (
                                <span className='text-danger'>{formikPhases.errors.integracion}</span>
                            ) : null}
                        </Form.Group>
                        <Form.Group className="col-md-6 mb-4" >
                            <Form.Label className="font-weight-normal">Cierre</Form.Label>
                            <Form.Control type="number" placeholder="Ejemplo: 20" name="cierre" value={formikPhases.values.cierre}
                                onChange={formikPhases.handleChange} />
                            {formikPhases.errors.cierre ? (
                                <span className='text-danger'>{formikPhases.errors.cierre}</span>
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
                                        disabled={!(formik.isValid && formik.dirty)}>
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