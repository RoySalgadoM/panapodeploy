import React, { useState, useEffect } from "react";
import { Button, Row, Col, Container, Form, Card, InputGroup, FormControl, Collapse } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import DataTable from "react-data-table-component";
import "../../../assets/css/main.css";
import "../../../assets/css/util.css";
import { PersonalDetails } from "./PersonalDetails";
import { PersonalEdit } from "./PersonalEdit"
import { CustomLoader } from "../../../shared/components/CustomLoader";
import { FilterComponent } from "../../../shared/components/FilterComponent";
import * as yup from "yup";
import axios from "../../../shared/plugins/axios";
import { useFormik } from "formik";
import Alert, { msjConfirmacion, titleConfirmacion, titleError, msjError, msjExito, titleExito } from "../../../shared/plugins/alert";
import { AlertData } from "../../../shared/components/alertData"

//iconos de fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEdit, faFile, faInfo, faPlay } from '@fortawesome/free-solid-svg-icons'


export const PersonalList = () => {
    const [personal, setPersonal] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [values, setValues] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [isOpenDetails, setIsOpenDetails] = useState(false);

    const filteredItems = personal.filter(
        (item) => item.name && item.name.toLowerCase().includes(filterText.toLowerCase()) ||
            item.surname && item.surname.toLowerCase().includes(filterText.toLowerCase()) ||
            item.secondSurname && item.secondSurname.toLowerCase().includes(filterText.toLowerCase()) ||
            item.email && item.email.toLowerCase().includes(filterText.toLowerCase())
    );

    //Obtener todos los registros
    const getPersonal = () => {
        axios({ url: "/person/", method: "GET" })
            .then((response) => {
                //filtrar que no aparezcan los directivos
                let data = response.data;
                let personalTemp = data.filter(item => item.profession.description != "Directivo")
                setPersonal(personalTemp);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    //consultar las profesiones (se hace en el front directamente)
    const formik = useFormik({
        initialValues: {
            name: "",
            surname: "",
            secondSurname: "",
            email: "",
            dateBirth: "",
            phone: "",
            profession: "",
        },
        validationSchema: yup.object().shape({
            name: yup.string().required("Campo obligatorio"),
            surname: yup.string().required("Campo obligatorio"),
            secondSurname: yup.string().required("Campo obligatorio"),
            email: yup.string().email("Ingresa un correo correcto").required("Campo obligatorio"),
            dateBirth: yup.string().required("Campo obligatorio"),
            phone: yup.string().required("Campo obligatorio"),
            profession: yup.number().required("Campo obligatorio"),
        }),
        onSubmit: (values) => {
            const person = {
                ...values,
                profession: {
                    id: parseInt(values.profession)
                },
            };
            return axios({ url: "/person/", method: "POST", data: JSON.stringify(person) })
                .then((response) => {
                    if (!response.error) {
                        getPersonal();
                        Alert.fire({
                            title: "Personal registrado correctamente",
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
        getPersonal();
        document.title = "PANAPO | Personal";
    }, []);

    const statusChange = (personal) => {
        Alert.fire({
            title: titleConfirmacion,
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "grey",
            showCancelButton: true,
            reverseButtons: true,
            showLoaderOnConfirm: true,
            icon: "warning",
            backdrop: true,
            allowOutsideClick: !Alert.isLoading,
            preConfirm: () => {
                let personalUpdate = {};
                if (personal.status.description === 'Activo') {
                    personalUpdate = {
                        ...personal,
                        status: { id: 2, description: "Inactivo" }
                    };
                } else {
                    personalUpdate = {
                        ...personal,
                        status: { id: 1, description: "Activo" }
                    };
                }
                return axios({
                    url: "/person/",
                    method: 'PUT',
                    data: JSON.stringify(personalUpdate)
                })
                    .then((response => {
                        if (!response.error) {
                            getPersonal();
                            Alert.fire({
                                title: "Estado modificado correctamente",
                                icon: "success",
                                confirmButtonText: "Aceptar",
                                confirmButtonColor: "#198754",
                            });
                        } else {
                            Alert.fire({
                                title: titleError,
                                text: msjError,
                                icon: "error",
                                confirmButtonText: "Aceptar",
                                confirmButtonColor: "#198754",
                            });
                        }
                        return response;
                    }))
                    .catch((error) => {
                        console.log(error);
                    })
            }
        });
    }

    const columns = [
        {
            name: <h6>#</h6>,
            cell: (row, index) => <div><h6>{index + 1}</h6></div>,
            width: "6%"
        },
        {
            name: <h6>Nombre</h6>,
            cell: (row) => <div className="txt4">{row.name + " "} {row.surname + " "} {row.secondSurname}</div>,
            width: "25%"
        },
        {
            name: <h6>Correo</h6>,
            cell: (row) => <div className="txt4">{row.email}</div>,
            width: "25%"
        },
        ,
        {
            name: <h6>Rol</h6>,
            cell: (row) => <div className="txt4">{row.profession.description}</div>,
            width: "10%"
        },
        {
            name: <div><h6>Detalles</h6></div>,
            cell: (row) => <div>
                <Button variant="primary" size="md"
                    onClick={() => {
                        setValues({
                            ...row,
                            "profession": row.profession.description
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
                        setValues({
                            ...row,
                            "profession": row.profession.id, "status": row.status.id
                        })
                        setIsOpenUpdate(true)
                    }}>
                    <FontAwesomeIcon icon={faEdit} size="lg" />
                </Button>
            </div>
        },
        {
            name: <div><h6>Cambiar estado</h6></div>,
            cell: (row) => <div>
                {row.status.description === "Activo" ? (
                    <Button variant="danger" size="md"
                        onClick={() => statusChange(row)}>
                        <FeatherIcon icon="slash" />
                    </Button>
                ) : (
                    <Button variant="success" size="md"
                        onClick={() => statusChange(row)}>
                        <FeatherIcon icon="check-circle" />
                    </Button>
                )}
            </div>

        }
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
                                <h1 className="font-weight-bold">Gestión de personal</h1>
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
                                    <Col as="h6">Registrar personal</Col>
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
                                            <Form.Group className="col-md-4" >
                                                <Form.Label className="font-weight-normal">Nombre<span className="text-danger">*</span></Form.Label>
                                                <Form.Control type="text" placeholder="Ejemplo: Thayli" name="name" value={formik.values.name}
                                                    onChange={formik.handleChange} />
                                                {formik.errors.name ? (
                                                    <span className='text-danger'>{formik.errors.name}</span>
                                                ) : null}
                                            </Form.Group>
                                            <Form.Group className="col-md-4" >
                                                <Form.Label className="font-weight-normal">Primer apellido<span className="text-danger">*</span></Form.Label>
                                                <Form.Control type="text" placeholder="Ejemplo: Villegas" name="surname" value={formik.values.surname}
                                                    onChange={formik.handleChange} />
                                                {formik.errors.surname ? (
                                                    <span className='text-danger'>{formik.errors.surname}</span>
                                                ) : null}
                                            </Form.Group>
                                            <Form.Group className="col-md-4" >
                                                <Form.Label className="font-weight-normal">Segundo apellido<span className="text-danger">*</span></Form.Label>
                                                <Form.Control type="text" placeholder="Ejemplo: García" name="secondSurname" value={formik.values.secondSurname}
                                                    onChange={formik.handleChange} />
                                                {formik.errors.secondSurname ? (
                                                    <span className='text-danger'>{formik.errors.secondSurname}</span>
                                                ) : null}
                                            </Form.Group>
                                            <Form.Group className="col-md-6" >
                                                <Form.Label className="font-weight-normal">Fecha de nacimiento<span className="text-danger">*</span></Form.Label>
                                                <Form.Control type="date" name="dateBirth" value={formik.values.dateBirth}
                                                    onChange={formik.handleChange} />
                                                {formik.errors.dateBirth ? (
                                                    <span className='text-danger'>{formik.errors.dateBirth}</span>
                                                ) : null}
                                            </Form.Group>
                                            <Form.Group className="col-md-6 mb-4" >
                                                <Form.Label className="font-weight-normal">Correo eléctronico<span className="text-danger">*</span></Form.Label>
                                                <Form.Control type="email" placeholder="Ejemplo: utez@utez.edu.mx" name="email" value={formik.values.email}
                                                    onChange={formik.handleChange} />
                                                {formik.errors.email ? (
                                                    <span className='text-danger'>{formik.errors.email}</span>
                                                ) : null}
                                            </Form.Group>
                                            <Form.Group className="col-md-6 mb-4" >
                                                <Form.Label className="font-weight-normal">Teléfono<span className="text-danger">*</span></Form.Label>
                                                <Form.Control type="tel" name="phone" placeholder="Ejemplo: 7771888263" value={formik.values.phone}
                                                    onChange={formik.handleChange} />
                                                {formik.errors.phone ? (
                                                    <span className='text-danger'>{formik.errors.phone}</span>
                                                ) : null}
                                            </Form.Group>
                                            <Form.Group className="col-md-6 mb-4" >
                                                <Form.Label className="font-weight-normal">Rol<span className="text-danger">*</span></Form.Label>
                                                <Form.Select aria-label="Seleccionar rol" name="profession"
                                                    value={formik.values.profession}
                                                    onChange={formik.handleChange}>
                                                    <option value="">Seleccione una opción</option>
                                                    <option value="1">Docente</option>
                                                    <option value="2">Becario</option>
                                                </Form.Select>
                                                {formik.errors.profession ? (
                                                    <span className='text-danger'>{formik.errors.profession}</span>
                                                ) : null}
                                            </Form.Group>
                                            <div className="d-grid gap-2">
                                                <Button type="submit" style={{ background: "#042B61", borderColor: "#042B61" }} size="lg"
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
                            <Card.Header
                                className="backgroundHeadCard">
                                <Row>
                                    <Col as="h6">Personal registrado</Col>
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
                                <PersonalEdit
                                    isOpenUpdate={isOpenUpdate}
                                    handleClose={setIsOpenUpdate}
                                    getPersonal={getPersonal}
                                    {...values}
                                />
                                <PersonalDetails
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