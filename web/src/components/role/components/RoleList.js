import React, { useState, useEffect } from "react";
import { Button, Row, Col, Container, Form, Card, InputGroup, FormControl, Collapse } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import DataTable from "react-data-table-component";
import { Formik, useFormik } from "formik";
import * as yup from "yup";
import { RoleEdit } from "./RoleEdit";
import axios from "../../../shared/plugins/axios";
import { CustomLoader } from "../../../shared/components/CustomLoader";
import { FilterComponent } from "../../../shared/components/FilterComponent";
import Alert, { msjConfirmacion, titleConfirmacion, titleError, msjError, msjExito, titleExito } from "../../../shared/plugins/alert";
import { AlertData } from "../../../shared/components/alertData"
//iconos de fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from '@fortawesome/free-solid-svg-icons'

export const RoleList = () => {
    const [roles, setRoles] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const [values, setValues] = useState({});
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);

    const filteredItems = roles.filter(
        (item) => item.description && item.description.toLowerCase().includes(filterText.toLowerCase()) || item.acronym && item.acronym.toLowerCase().includes(filterText.toLowerCase())
    );

    const getRoles = () => {
        axios({ url: "/rol/", method: "GET" })
            .then((response) => {
                setRoles(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const formik = useFormik({
        initialValues: {
            acronym: "",
            description: ""
        },
        validationSchema: yup.object().shape({
            // acronym: yup
            //     .string()
            //     .required("Campo obligatorio")
            //     .min(2, "Minimo 2 caracteres"),
            // description: yup
            //     .string()
            //     .required("Campo obligatorio")
            //     .min(2, "Minimo 2 caracteres"),
        }),
        onSubmit: (values) => {
            const rol = {
                ...values
            };
            Alert.fire({
                title: titleConfirmacion,
                text: msjConfirmacion,
                confirmButtonText: "Aceptar",
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#198754",
                cancelButtonColor: "#dc3545",
                showCancelButton: true,
                reverseButtons: true,
                showLoaderOnConfirm: true,
                icon: "warning",
                preConfirm: () => {
                    return axios({
                        url: "/rol/",
                        method: "POST",
                        data: JSON.stringify(rol)
                    })
                        .then((response) => {
                            if (!response.error) {
                                getRoles();

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
                backdrop: true,
                allowOutsideClick: !Alert.isLoading,
            });
        },
    });

    const handleCloseForm = () => {
        formik.resetForm();
        setIsOpen(false);
    };

    useEffect(() => {
        setIsLoading(true);
        getRoles();
        document.title = "PANAPO | Gestión de Roles";
    }, []);

    const columns = [
        {
            name: <h6>#</h6>,
            cell: (row, index) => <h6>{index + 1}</h6>,
            width: "15%"
        },
        {
            name: <h6>Acrónimo</h6>,
            cell: (row) => <div className="txt4">{row.acronym}</div>,
            width: "25%"
        },
        {
            name: <h6>Descripción</h6>,
            cell: (row) => <div className="txt4">{row.description}</div>,
            width: "40%"
        },
        {
            name: <div><h6>Modificar</h6></div>,
            cell: (row) => <div>
                <Button variant="warning" size="md"
                    onClick={() => {
                        setValues(row)
                        setIsOpenUpdate(true)
                    }}>
                    <FontAwesomeIcon  icon={faEdit} size="lg" />
                </Button>
            </div>,
            align: "center"
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
            <Container fluid >
                <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="font-weight-bold">Gestión de roles</h1>
                            </div>
                        </div>
                    </div>
                </section>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header onClick={() => setIsOpen(!isOpen)}
                                aria-controls="example-collapse-text"
                                aria-expanded={isOpen}
                                className="backgroundHeadCard"
                                type="button">
                                <Row>
                                    <Col as="h6">Registrar roles</Col>
                                    <Col className="text-end">
                                        <Col>
                                            {isOpen ? (
                                                <FeatherIcon icon="minus" onClick={() => setIsOpen(!isOpen)}
                                                    aria-controls="example-collapse-text"
                                                    aria-expanded={isOpen} />
                                            ) : (
                                                <FeatherIcon icon="plus" onClick={() => setIsOpen(!isOpen)}
                                                    aria-controls="example-collapse-text"
                                                    aria-expanded={isOpen} />
                                            )}
                                        </Col>
                                    </Col>
                                </Row>
                            </Card.Header>
                            <Collapse in={isOpen}>
                                <div id="example-collapse-text">
                                    <Card.Body>
                                        <Form className="row" onSubmit={formik.handleSubmit}>
                                            <Form.Group className="col-md-6 mb-4">
                                                <Form.Label className="font-weight-normal">Acrónimo<span className="text-danger">*</span></Form.Label>
                                                <Form.Control name="acronym" value={formik.values.acronym} onChange={formik.handleChange} type="text" placeholder="Ej: RD" />
                                                {formik.errors.acronym ? (
                                                    <span className="text-danger">{formik.errors.acronym}</span>
                                                ) : null}
                                            </Form.Group>
                                            <Form.Group className="col-md-6 mb-4">
                                                <Form.Label className="font-weight-normal">Descripción<span className="text-danger">*</span></Form.Label>
                                                <Form.Control name="description" value={formik.values.description} onChange={formik.handleChange} type="text" placeholder="Ej: Responsable de desarrollo" />
                                                {formik.errors.description ? (
                                                    <span className="text-danger">{formik.errors.description}</span>
                                                ) : null}
                                            </Form.Group>
                                            <div className="d-grid gap-2">
                                                <Button type="submit" style={{ background: "#042B61", borderColor: "#042B61" }} size="lg"
                                                    disabled={true}>
                                                    Registrar
                                                </Button>
                                            </div>
                                        </Form>
                                    </Card.Body>
                                </div>
                            </Collapse>
                        </Card>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <Card>
                            <Card.Header className="backgroundHeadCard">
                                <Row>
                                    <Col as="h6">Roles registrados</Col>
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
                                <RoleEdit
                                    isOpenUpdate={isOpenUpdate}
                                    handleClose={setIsOpenUpdate}
                                    setRoles={setRoles}
                                    getRoles={getRoles}
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