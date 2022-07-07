import React, { useState, useEffect } from "react";
import { Button, Row, Col, Container, Form, Collapse, Card, Table, ButtonToolbar, ButtonGroup } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import { ClientEdit } from "./ClientEdit";
import { ClientDetails } from "./ClientDetails"
import DataTable from "react-data-table-component";
import { CustomLoader } from "../../../shared/components/CustomLoader";
import { FilterComponent } from "../../../shared/components/FilterComponent";
import Alert, { msjConfirmacion, titleConfirmacion, titleError, msjError, msjExito, titleExito } from "../../../shared/plugins/alert";
import * as yup from "yup";
import axios from "../../../shared/plugins/axios";
import { useFormik } from "formik";
import "../../../assets/css/main.css";
import { AlertData } from "../../../shared/components/alertData"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEdit, faFile, faInfo, faPlay } from '@fortawesome/free-solid-svg-icons'

export const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [values, setValues] = useState({});

    const [isOpen, setIsOpen] = useState(false);
    const [isOpenData, setIsOpenData] = useState(false);
    const [isOpenClient, setIsOpenClient] = useState(false);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [isOpenDetails, setIsOpenDetails] = useState(false);

    const filteredItems = clients.filter(
        (item) => item.name && item.name.toLowerCase().includes(filterText.toLowerCase()) || 
        item.surname && item.surname.toLowerCase().includes(filterText.toLowerCase()) || 
        item.second_surname && item.second_surname.toLowerCase().includes(filterText.toLowerCase()),
    );

    useEffect(() => {
        setIsLoading(true);
        getClients();
        document.title = "PANAPO | Clientes";
    }, []);

    const getClients = () => {
        axios({ url: "/client/", method: "GET" })
            .then((response) => {
                setClients(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleCloseForm = () => {
        formik.resetForm();
        setIsOpen(false);
    };

    const formik = useFormik({
        initialValues: {
            name: "",
            surname: "",
            secondSurname: "",
            company: "",
            phoneClient: "",
            emailClient: "",
            typeClient: 1,
            nameRepre: "",
            surnameRepre: "",
            secondSurnameRepre: "",
            phoneRepre: "",
            emailRepre: "",
            extension: ""
        },
        validationSchema: yup.object().shape({
            name: yup.string().required("Campo obligatorio"),
            surname: yup.string().required("Campo obligatorio"),
            secondSurname: yup.string().required("Campo obligatorio"),
            company: yup.string().required("Campo obligatorio"),
            phoneClient: yup.string().required("Campo obligatorio"),
            emailClient: yup.string().required("Campo obligatorio"),
            typeClient: yup.number().required("Campo obligatorio"),
            nameRepre: yup.string().required("Campo obligatorio"),
            surnameRepre: yup.string().required("Campo obligatorio"),
            secondSurnameRepre: yup.string().required("Campo obligatorio"),
            phoneRepre: yup.string().required("Campo obligatorio"),
            emailRepre: yup.string().required("Campo obligatorio"),
            extension: yup.string().required("Campo obligatorio")

        }),
        onSubmit: (values) => {
            const cliente = {
                ...values,
                typeClient: {
                    id: parseInt(values.typeClient)
                },
            };
            return axios({ url: "/client/", method: "POST", data: JSON.stringify(cliente) })
                .then((response) => {
                    if (!response.error) {
                        getClients();
                        Alert.fire({
                            title: "Cliente registrado correctamente",
                            confirmButtonColor: "#198754",
                            icon: "success",
                            confirmButtonText: "Aceptar",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                handleCloseForm();
                            }
                        });
                    }
                    return response;
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

    const columns = [
        {
            name: <h6>#</h6>,
            cell: (row, index) => <div><h6>{index + 1}</h6></div>,
            width: "5%"
        },
        {
            name: <h6>Nombre completo</h6>,
            cell: (row) => <div className="txt4">{row.name + " "} {row.surname + " "} {row.secondSurname}</div>,
            width: "30%"
        },
        {
            name: <h6>Nombre de la empresa</h6>,
            cell: (row) => <div className="txt4">{row.company}</div>,
        },
        {
            name: <h6>Tipo de cliente</h6>,
            cell: (row) => <div className="txt4">{row.typeClient.description}</div>,
        },
        {
            name: <div><h6>Detalles</h6></div>,
            cell: (row) => <div>
                <Button variant="primary" size="md"
                    onClick={() => {
                        // setValues(row)
                        setValues({
                            ...row,
                            "typeClient": row.typeClient.description
                        })
                        setIsOpenDetails(true)
                    }}>
                    <FontAwesomeIcon className="btnS" icon={faInfo} size="lg" />
                </Button>
            </div>
        },
        {
            name: <div><h6>Modificar</h6></div>,
            cell: (row) => <div>
                <Button variant="warning" size="md"
                    onClick={() => {
                        // setValues(row)
                        setValues({
                            ...row,
                            "typeClient": row.typeClient.id
                        })
                        setIsOpenUpdate(true)
                    }}>
                    <FontAwesomeIcon icon={faEdit} size="lg" />
                </Button>
            </div>
        },
    ];

    const paginationOptions = {
        rowsPerPageText: "Filas por página",
        rangeSeparatorText: "de",
    };

    const searchComponent = React.useMemo(() => {
        const search = () => {
            if (filterText) {
                setFilterText("");
            }
        }
        return <FilterComponent filterText={filterText} onFilter={e => setFilterText(e.target.value)} onSearch={search} />
    }, [filterText]);

    return (
        <div className="content-wrapper screenHeight">
            <Container fluid>
                <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="font-weight-bold">Gestión de clientes</h1>
                            </div>
                        </div>
                    </div>
                </section>
                <Row>
                    <Col>
                        <Card className="mb-0">
                            <Card.Header onClick={() => setIsOpen(!isOpen)}
                                aria-controls="example-collapse-text"
                                aria-expanded={isOpen}
                                className="backgroundHeadCard"
                                type="button">
                                <Row>
                                    <Col as="h6">Registrar clientes</Col>
                                    <Col className="text-end">
                                        <Col>
                                            {isOpen ? (
                                                <FeatherIcon icon="minus" />
                                            ) : (
                                                <FeatherIcon icon="plus" />
                                            )}
                                        </Col>
                                    </Col>
                                </Row>
                            </Card.Header>
                            <Collapse in={isOpen}>
                                <div id="example-collapse-text">
                                    <Container fluid>
                                        <Form className="row" onSubmit={formik.handleSubmit}>
                                            <Card.Body>
                                                {/* DATOS DEL CLIENTE */}
                                                <Card className="mb-3" bg="white">
                                                    <Card.Header onClick={() => setIsOpenData(!isOpenData)}
                                                        aria-controls="example-collapse-text"
                                                        aria-expanded={isOpenData}
                                                        type="button">
                                                        <Row>
                                                            <Col as="h6" className="text-bold">Datos del cliente</Col>
                                                            <Col className="text-end">
                                                                <Col>
                                                                    {isOpenData ? (
                                                                        <FeatherIcon icon="minus"
                                                                            color="grey" />
                                                                    ) : (
                                                                        <FeatherIcon icon="plus"
                                                                            color="grey" />
                                                                    )}
                                                                </Col>
                                                            </Col>
                                                        </Row>
                                                    </Card.Header>
                                                    <Collapse in={isOpenData}>
                                                        <div id="example-collapse-text">
                                                            <Card.Body>
                                                                {/* <Form className="row" onSubmit={formik.handleSubmit}> */}
                                                                <div className="row">
                                                                    <Form.Group className="col-md-4 mb-4" >
                                                                        <Form.Label className="font-weight-normal">Nombre <span className="text-danger">*</span></Form.Label>
                                                                        <Form.Control name="name" value={formik.values.name} onChange={formik.handleChange} type="text" placeholder="Ejemplo: María" />
                                                                        {formik.errors.name ? (
                                                                            <span className="text-danger">{formik.errors.name}</span>
                                                                        ) : null}
                                                                    </Form.Group>
                                                                    <Form.Group className="col-md-4 mb-4">
                                                                        <Form.Label className="font-weight-normal">Primer apellido<span className="text-danger">*</span></Form.Label>
                                                                        <Form.Control name="surname" value={formik.values.surname} onChange={formik.handleChange} type="text" placeholder="Ejemplo: Valdez" />
                                                                        {formik.errors.surname ? (
                                                                            <span className="text-danger">{formik.errors.surname}</span>
                                                                        ) : null}
                                                                    </Form.Group>
                                                                    <Form.Group className="col-md-4 mb-4" >
                                                                        <Form.Label className="font-weight-normal">Segundo apellido<span className="text-danger">*</span></Form.Label>
                                                                        <Form.Control name="secondSurname" value={formik.values.secondSurname} onChange={formik.handleChange} type="text" placeholder="Ejemplo: Díaz" />
                                                                        {formik.errors.secondSurname ? (
                                                                            <span className="text-danger">{formik.errors.secondSurname}</span>
                                                                        ) : null}
                                                                    </Form.Group>
                                                                    <Form.Group className="col-md-6 mb-4" >
                                                                        <Form.Label className="font-weight-normal">Correo eléctronico<span className="text-danger">*</span></Form.Label>
                                                                        <Form.Control name="emailClient" value={formik.values.emailClient} onChange={formik.handleChange} type="email" placeholder="Ejemplo: utez@utez.edu.mx" />
                                                                        {formik.errors.emailClient ? (
                                                                            <span className="text-danger">{formik.errors.emailClient}</span>
                                                                        ) : null}
                                                                    </Form.Group>
                                                                    <Form.Group className="col-md-4 mb-4" >
                                                                        <Form.Label className="font-weight-normal">Teléfono<span className="text-danger">*</span></Form.Label>
                                                                        <Form.Control name="phoneClient" value={formik.values.phoneClient} onChange={formik.handleChange} type="tel" placeholder="Ejemplo: 7771265498" />
                                                                        {formik.errors.phoneClient ? (
                                                                            <span className="text-danger">{formik.errors.phoneClient}</span>
                                                                        ) : null}
                                                                    </Form.Group>
                                                                    <Form.Group className="col-md-2 mb-4" >
                                                                        <Form.Label className="font-weight-normal">Extensión<span className="text-danger">*</span></Form.Label>
                                                                        <Form.Control name="extension" value={formik.values.extension} onChange={formik.handleChange} type="tel" placeholder="Ejemplo: 416" />
                                                                        {formik.errors.extension ? (
                                                                            <span className="text-danger">{formik.errors.extension}</span>
                                                                        ) : null}
                                                                    </Form.Group>
                                                                    <Form.Group className="col-md-6 mb-4" >
                                                                        <Form.Label className="font-weight-normal">Nombre de la empresa<span className="text-danger">*</span></Form.Label>
                                                                        <Form.Control name="company" value={formik.values.company} onChange={formik.handleChange} type="text" placeholder="Ejemplo: NISSAN" />
                                                                        {formik.errors.company ? (
                                                                            <span className="text-danger">{formik.errors.company}</span>
                                                                        ) : null}
                                                                    </Form.Group>
                                                                    <Form.Group className="col-md-6 mb-4" >
                                                                        <Form.Label className="font-weight-normal">Tipo de cliente<span className="text-danger">*</span></Form.Label>
                                                                        <Form.Select aria-label="Seleccionar tipo de cliente" name="typeClient"
                                                                            value={formik.values.typeClient}
                                                                            onChange={formik.handleChange}>
                                                                            <option value="">Seleccione una opción</option>
                                                                            <option value="2">Interno</option>
                                                                            <option value="1">Externo</option>
                                                                        </Form.Select>
                                                                        {formik.errors.typeClient ? (
                                                                            <span className='text-danger'>{formik.errors.typeClient}</span>
                                                                        ) : null}
                                                                    </Form.Group>
                                                                </div>

                                                                {/* </Form> */}
                                                            </Card.Body>
                                                        </div>
                                                    </Collapse>
                                                </Card>
                                                {/* DATOS DEL REPRESENTANTE DEL CLIENTE CLIENTE */}
                                                <Card className="mb-3" bg="white">
                                                    <Card.Header onClick={() => setIsOpenClient(!isOpenClient)}
                                                        aria-controls="example-collapse-text"
                                                        aria-expanded={isOpenClient}
                                                        type="button">
                                                        <Row>
                                                            <Col as="h6" className="text-bold">Datos del representante del cliente</Col>
                                                            <Col className="text-end">
                                                                <Col>
                                                                    {isOpenClient ? (
                                                                        <FeatherIcon icon="minus" color="grey" />
                                                                    ) : (
                                                                        <FeatherIcon icon="plus" color="grey" />
                                                                    )}
                                                                </Col>
                                                            </Col>
                                                        </Row>
                                                    </Card.Header>
                                                    <Collapse in={isOpenClient}>
                                                        <div id="example-collapse-text">
                                                            <Card.Body>
                                                                {/* <Form className="row"> */}
                                                                <div className="row">
                                                                    <Form.Group className="col-md-4" >
                                                                        <Form.Label className="font-weight-normal">Nombre<span className="text-danger">*</span></Form.Label>
                                                                        <Form.Control name="nameRepre" value={formik.values.nameRepre} onChange={formik.handleChange} type="text" placeholder="Ejemplo: María" />
                                                                        {formik.errors.nameRepre ? (
                                                                            <span className="text-danger">{formik.errors.nameRepre}</span>
                                                                        ) : null}
                                                                    </Form.Group>
                                                                    <Form.Group className="col-md-4" >
                                                                        <Form.Label className="font-weight-normal">Primer apellido<span className="text-danger">*</span></Form.Label>
                                                                        <Form.Control name="surnameRepre" value={formik.values.surnameRepre} onChange={formik.handleChange} type="text" placeholder="Ejemplo: Valdez" />
                                                                        {formik.errors.surnameRepre ? (
                                                                            <span className="text-danger">{formik.errors.surnameRepre}</span>
                                                                        ) : null}
                                                                    </Form.Group>
                                                                    <Form.Group className="col-md-4" >
                                                                        <Form.Label className="font-weight-normal">Segundo apellido<span className="text-danger">*</span></Form.Label>
                                                                        <Form.Control name="secondSurnameRepre" value={formik.values.secondSurnameRepre} onChange={formik.handleChange} type="text" placeholder="Ejemplo: Díaz" />
                                                                        {formik.errors.secondSurnameRepre ? (
                                                                            <span className="text-danger">{formik.errors.secondSurnameRepre}</span>
                                                                        ) : null}
                                                                    </Form.Group>
                                                                    <Form.Group className="col-md-6 mb-4" >
                                                                        <Form.Label className="font-weight-normal">Teléfono<span className="text-danger">*</span></Form.Label>
                                                                        <Form.Control name="phoneRepre" value={formik.values.phoneRepre} onChange={formik.handleChange} type="tel" placeholder="Ejemplo: 7771144520" />
                                                                        {formik.errors.phoneRepre ? (
                                                                            <span className="text-danger">{formik.errors.phoneRepre}</span>
                                                                        ) : null}
                                                                    </Form.Group>
                                                                    <Form.Group className="col-md-6 mb-4" >
                                                                        <Form.Label className="font-weight-normal">Correo eléctronico<span className="text-danger">*</span></Form.Label>
                                                                        <Form.Control name="emailRepre" value={formik.values.emailRepre} onChange={formik.handleChange} type="email" placeholder="Ejemplo: utez@utez.edu.mx" />
                                                                        {formik.errors.emailRepre ? (
                                                                            <span className="text-danger">{formik.errors.emailRepre}</span>
                                                                        ) : null}
                                                                    </Form.Group>
                                                                </div>
                                                                {/* </Form> */}
                                                            </Card.Body>
                                                        </div>
                                                    </Collapse>
                                                </Card>
                                                <div className="d-grid gap-2">
                                                    <Button type="submit" style={{ background: "#042B61", borderColor: "#042B61" }}
                                                        disabled={!(formik.isValid && formik.dirty)} >
                                                        Registrar
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Form>
                                    </Container>
                                </div>
                            </Collapse>
                        </Card>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <Card>
                            <Card.Header
                                className="backgroundHeadCard">
                                <Row>
                                    <Col as="h6">Clientes registrados</Col>
                                </Row>
                            </Card.Header>
                            <Card.Body>
                                <DataTable
                                    columns={columns}
                                    data={filteredItems}
                                    noDataComponent={<AlertData title={"No hay registros"} />}
                                    pagination
                                    paginationComponentOptions={paginationOptions}
                                    progressPending={isLoading}
                                    progressComponent={<CustomLoader />}
                                    subHeader
                                    subHeaderComponent={searchComponent}
                                />
                                <ClientEdit
                                    isOpenUpdate={isOpenUpdate}
                                    handleClose={setIsOpenUpdate}
                                    getClients={getClients}
                                    {...values}
                                />
                                <ClientDetails
                                    isOpenDetails={isOpenDetails}
                                    handleClose={setIsOpenDetails}
                                    {...values}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}