import React, { useState, useEffect } from "react";
import FeatherIcon from "feather-icons-react";
import {
    Button,
    Card,
    Col,
    Collapse,
    Container,
    Form,
    Row
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import { FilterComponent } from "../../../shared/components/FilterComponent";
import { CustomLoader } from "../../../shared/components/CustomLoader";
import { DirectionDetails } from "./DirectionDetails"
import { DirectionEdit } from "./DirectionEdit";
import * as yup from "yup";
import axios from "../../../shared/plugins/axios";
import { useFormik } from "formik";
import Alert, { msjConfirmacion, titleConfirmacion, titleError, msjError, msjExito, titleExito } from "../../../shared/plugins/alert";
import { AlertData } from "../../../shared/components/alertData"
//iconos de fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faInfo, faTrash } from '@fortawesome/free-solid-svg-icons'


export const DirectionList = () => {

    const [filterText, setFilterText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [directives, setDirectives] = useState([]);
    const [values, setValues] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [isOpenDetails, setIsOpenDetails] = useState(false);

    const filteredItems = directives.filter(
        (item) => item.person.name && item.person.name.toLowerCase().includes(filterText.toLowerCase()) ||
            item.person.surname && item.person.surname.toLowerCase().includes(filterText.toLowerCase()) ||
            item.person.secondSurname && item.person.secondSurname.toLowerCase().includes(filterText.toLowerCase())
    );

    const getDirectives = () => {
        axios({ url: "/user/", method: "GET" })
            .then((response) => {
                let data = response.data;
                let directivesTemp = data.filter(item => item.person.profession.description === "Directivo")
                setDirectives(directivesTemp);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const onDelete = (idDelete) => {
        Alert.fire({
            title: titleConfirmacion,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "grey",
            showCancelButton: true,
            reverseButtons: true,
            showLoaderOnConfirm: true,
            icon: "warning",
            preConfirm: () => {
                return axios({ url: "/user/" + idDelete, method: "DELETE" })
                    .then((response) => {
                        if (!response.error) {
                            getDirectives();
                            Alert.fire({
                                title: "Directivo eliminado correctamente",
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
            backdrop: true,
            allowOutsideClick: !Alert.isLoading
        });
    }

    const formik = useFormik({
        initialValues: {
            name: "",
            surname: "",
            secondSurname: "",
            email: ""
        },
        validationSchema: yup.object().shape({
            name: yup.string().required("Campo obligatorio"),
            surname: yup.string().required("Campo obligatorio"),
            secondSurname: yup.string().required("Campo obligatorio"),
            email: yup.string().email("Ingresa un correo válido").required("Campo obligatorio"),
        }),
        onSubmit: (values) => {
            const person = {
                password: values.email,
                person: {
                    name: values.name,
                    surname: values.surname,
                    secondSurname: values.secondSurname,
                    email: values.email,
                    profession: {
                        id: 3,
                        description: "Directivo"
                    },
                    status: {
                        id: 1,
                        description: "Activo"
                    }
                },
                authorities: [
                    {
                        id: 1,
                        description: "Directivo"
                    }
                ],
                status: {
                    id: 1,
                    description: "Activo"
                }
            };
            return axios({ url: "/user/", method: "POST", data: JSON.stringify(person) })
                .then((response) => {
                    if (!response.error) {
                        getDirectives();
                        Alert.fire({
                            title: "Directivo registrado correctamente",
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
        setIsOpen(false);
    };

    useEffect(() => {
        setIsLoading(true);
        getDirectives();
    }, []);

    const columns = [
        {
            name: <h6 >#</h6>,
            cell: (row, index) => <div><h6>{index + 1}</h6></div>,
            width: "5%"
        },
        {
            name: <h6>Nombre completo</h6>,
            cell: (row) => <div className="txt4">{row.person.name + " "}{row.person.surname + " "}{row.person.secondSurname}</div>,
            width: "40%"
        },
        {
            name: <h6>Detalles</h6>,
            cell: (row) => (
                <div>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => {
                            setValues({
                                "name": row.person.name,
                                "surname": row.person.surname,
                                "secondSurname": row.person.secondSurname,
                                "username": row.username,
                            });
                            setIsOpenDetails(true);
                        }}>
                        <FontAwesomeIcon className="btnS" icon={faInfo} size="lg" />
                    </Button>
                </div>
            ),
        },
        {
            name: <div><h6>Modificar</h6></div>,
            cell: (row) => (
                <div>
                    <Button variant="warning" size="md"
                        onClick={() => {
                            setValues({
                                "id": row.id,
                                "username": row.username,
                                "status": row.status.id,
                                "idPerson": row.person.id,
                                "name": row.person.name,
                                "surname": row.person.surname,
                                "secondSurname": row.person.secondSurname,
                                "statusPerson": row.person.status.id
                            })
                            setIsOpenUpdate(true)
                        }}
                    >
                        <FontAwesomeIcon icon={faEdit} size="lg" />
                    </Button>
                </div>
            ),
        },
        {
            name: <div><h6>Eliminar</h6></div>,
            cell: (row) => (
                <div>
                    <Button
                        variant="danger"
                        size="md"
                        onClick={() => {
                            onDelete(row.id);
                        }}
                    >
                        <FontAwesomeIcon icon={faTrash} size="lg" />
                    </Button>
                </div>
            ),
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
        };
        return (
            <FilterComponent
                filterText={filterText}
                onFilter={(e) => setFilterText(e.target.value)}
                onSearch={search}
            />
        );
    }, [filterText]);

    return (
        <div className="content-wrapper screenHeight">
            <Container fluid>
                <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-12">
                                <h1 className="font-weight-bold">Gestión de usuarios de alta dirección</h1>
                            </div>
                        </div>
                    </div>
                </section>
                <Row>
                    <Col>
                        <Card className="mb-0">
                            <Card.Header
                                onClick={() => setIsOpen(!isOpen)}
                                aria-controls="example-collapse-text"
                                aria-expanded={isOpen}
                                className="backgroundHeadCard"
                                type="button"
                            >
                                <Row>
                                    <Col as="h6">Registrar directivo</Col>
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
                                    <Card.Body>
                                        <Form className="row" onSubmit={formik.handleSubmit}>
                                            <Form.Group className="col-md-4 mt-3">
                                                <Form.Label className="font-weight-normal">Nombre(s)<span className="text-danger">*</span></Form.Label>
                                                <Form.Control type="text" placeholder="Ejemplo: Emmanuel" name="name" value={formik.values.name}
                                                    onChange={formik.handleChange} />
                                                {formik.errors.name ? (
                                                    <span className='text-danger'>{formik.errors.name}</span>
                                                ) : null}
                                            </Form.Group>
                                            <Form.Group className="col-md-4 mt-3">
                                                <Form.Label className="font-weight-normal">Primer apellido<span className="text-danger">*</span></Form.Label>
                                                <Form.Control type="text" placeholder="Ejemplo: Herrera" name="surname" value={formik.values.surname}
                                                    onChange={formik.handleChange} />
                                                {formik.errors.surname ? (
                                                    <span className='text-danger'>{formik.errors.surname}</span>
                                                ) : null}
                                            </Form.Group>
                                            <Form.Group className="col-md-4 mt-3">
                                                <Form.Label className="font-weight-normal">Segundo apellido<span className="text-danger">*</span></Form.Label>
                                                <Form.Control type="text" placeholder="Ejemplo: Ibarra" name="secondSurname" value={formik.values.secondSurname}
                                                    onChange={formik.handleChange} />
                                                {formik.errors.secondSurname ? (
                                                    <span className='text-danger'>{formik.errors.secondSurname}</span>
                                                ) : null}
                                            </Form.Group>
                                            <Form.Group className="col-md-6 mt-3">
                                                <Form.Label className="font-weight-normal">Correo electrónico<span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    placeholder="Ejemplo: utez@utez.edu.mx" name="email" value={formik.values.email}
                                                    onChange={formik.handleChange} />
                                                {formik.errors.email ? (
                                                    <span className='text-danger'>{formik.errors.email}</span>
                                                ) : null}
                                            </Form.Group>
                                            <Form.Group className="col-md-6 mt-5">
                                                <Form.Text muted>
                                                    La contraseña del usuario será la misma que su correo
                                                </Form.Text>
                                            </Form.Group>
                                            <div className="d-grid gap-2 mt-3">
                                                <Button type="submit" style={{ background: "#042B61", borderColor: "#042B61" }}
                                                    disabled={!(formik.isValid && formik.dirty)}>
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
                                    <Col as="h6">Directivos registrados</Col>
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
                                <DirectionEdit
                                    isOpenUpdate={isOpenUpdate}
                                    handleClose={setIsOpenUpdate}
                                    setDirectives={setDirectives}
                                    getDirectives={getDirectives}
                                    {...values}
                                />
                                <DirectionDetails
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
    );
};
