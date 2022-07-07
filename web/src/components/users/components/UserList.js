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
import { UserEdit } from "./UserEdit";
import { UserDetails } from "./UserDetails";
import Alert, { msjConfirmacion, titleConfirmacion, titleError, msjError, msjExito, titleExito } from "../../../shared/plugins/alert";
import * as yup from "yup";
import axios from "../../../shared/plugins/axios";
import { useFormik } from "formik";
import "../../../assets/css/main.css";
import { AlertData } from "../../../shared/components/alertData"
//iconos de fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEdit, faFile, faInfo, faPlay } from '@fortawesome/free-solid-svg-icons'

export const UserList = () => {
    const [filterText, setFilterText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [users, setUsers] = useState([]);
    const [person1, setPerson1] = useState([]);
    const [rol, setRol] = useState([]);
    const [values, setValues] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [isOpenDetails, setIsOpenDetails] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        document.title = "PANAPO | Gestión de usuarios";
        getUser();
        getPerson();
        getRol();
    }, []);

    const getPerson = () => {
        axios({ url: "/person/", method: "GET" })
            .then((response) => {
                let data = response.data;
                let tempData = data.filter(item => item.profession.description !== "Directivo" && item.profession.description !== "Becario" )
                setPerson1(tempData);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getRol = () => {
        axios({ url: "/rol/", method: "GET" })
            .then((response) => {
                let data = response.data;
                let rolesTemp = data.filter(item => item.description !== "Directivo" && item.description !== "Coordinador")
                setRol(rolesTemp);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getUser = () => {
        return axios({ url: "/user/", method: "GET" })
            .then((response) => {
                let data = response.data;
                let userTemp = data.filter(item => item.person.profession.description !== "Directivo")
                let tempData = []
                for (let i = 0; i < userTemp.length; i++) {
                    for (let r = 0; r < userTemp[i].authorities.length; r++) {
                        let newData = {
                            ...userTemp[i],
                            authority: userTemp[i].authorities[r].acronym
                        }
                        tempData.push(newData)
                    }
                }
                setUsers(tempData);
                setIsLoading(false);
                return response;
            })
            .catch((error) => {

            });
    };

    const filteredItems = users.filter(
        (item) => item.authority && item.authority.toLowerCase().includes(filterText.toLowerCase()) || 
        item.person.name && item.person.name.toLowerCase().includes(filterText.toLowerCase()) ||
        item.person.surname && item.person.surname.toLowerCase().includes(filterText.toLowerCase()) ||
        item.person.secondSurname && item.person.secondSurname.toLowerCase().includes(filterText.toLowerCase())
    );

    const columns = [
        {
            name: <h6 >#</h6>,
            cell: (row, index) => <div><h6>{index + 1}</h6></div>,
            width: "6%"
        },
        {
            name: <h6 className="text-center">Nombre del usuario</h6>,
            cell: (row) => <div className="txt4">{row.person.name + " " + row.person.surname + " " + row.person.secondSurname}</div>,
            width: "30%"
        },
        {
            name: <h6 className="text-center">Rol</h6>,
            cell: (row) => <div className="txt4">{row.authority}</div>,
        },
        {
            name: (<h6>Detalles</h6>),
            cell: (row) => (
                <div>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => {
                            setValues(row);
                            setIsOpenDetails(true);
                        }}
                    >
                        <FontAwesomeIcon className="btnS" icon={faInfo} size="lg" />
                    </Button>
                </div>
            ),
        },
        {
            name: (<h6>Modificar</h6>),
            cell: (row) => (
                <div>
                    <Button
                        variant="warning"
                        size="md"
                        onClick={() => {
                            setValues(row);
                            setIsOpenUpdate(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faEdit} size="lg" />
                    </Button>
                </div>
            ),
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

    const statusChange = (users) => {
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
            backdrop: true,
            allowOutsideClick: !Alert.isLoading,
            preConfirm: () => {
                let personalUpdate = {};
                if (users.status.description === 'Activo') {
                    personalUpdate = {
                        id: users.id,
                        status: { id: 2 }
                    };
                } else {
                    personalUpdate = {
                        id: users.id,
                        status: { id: 1 }
                    };
                }
                return axios({
                    url: "/user/estado/",
                    method: 'PUT',
                    data: JSON.stringify(personalUpdate)
                })
                    .then((response => {
                        if (!response.error) {
                            getUser();
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

    const formik = useFormik({
        initialValues: {
            username: "",
            authorities: "",
        },
        validationSchema: yup.object().shape({
            username: yup
                .string()
                .required("Campo obligatorio"),
            authorities: yup
                .string()
                .required("Campo obligatorio"),
        }),
        onSubmit: (values) => {
            axios({ url: "/user/", method: "GET" })
                .then((response) => {
                    let exist = false;
                    let id;
                    let auth = [];
                    let error = false;
                    let data = []
                    for (let i = 0; i < response.data.length; i++) {
                        if (response.data[i].person.id === parseInt(values.username)) {
                            for (let m = 0; m < response.data[i].authorities.length; m++) {
                                if (response.data[i].authorities[m].id === parseInt(values.authorities)) {
                                    error = true;
                                } else {
                                    exist = true;
                                    auth = response.data[i].authorities;
                                    id = response.data[i].person.id;
                                    data = response.data[i]
                                }
                            }
                        }
                    }
                    if (error) {
                        Alert.fire({
                            title: "La persona ya tiene este rol",
                            cancelButtonColor: "#198754",
                            icon: "error",
                            confirmButtonText: "Aceptar"
                        });
                        getUser();
                        getPerson();
                        getRol();
                    } else if (exist) {

                        auth.push({
                            id: parseInt(values.authorities),
                        })
                        data = {
                            ...data,
                            authorities: auth
                        }
                        axios({ url: "/user/rol/", method: "PUT", data: JSON.stringify(data) })
                            .then((response) => {
                                if (!response.error) {
                                    getUser();
                                    getPerson();
                                    getRol();
                                    Alert.fire({
                                        title: "Rol asignado correctamente",
                                        confirmButtonColor: "#198754",
                                        icon: "success",
                                        confirmButtonText: "Aceptar",
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            handleCloseForm();
                                        }
                                    });
                                }
                            }).catch((error) => {
                                console.log(error)
                            });
                    } else {
                        axios({ url: "/person/" + values.username, method: "GET" })
                            .then((response) => {
                                if (!response.error) {
                                    let insert = {
                                        authorities: [
                                            ...auth,
                                            {
                                                id: values.authorities,
                                            }
                                        ],
                                        username: response.data.email
                                    }
                                    axios({ url: "/user/save/", method: "POST", data: JSON.stringify(insert) })
                                        .then((response) => {
                                            if (!response.error) {
                                                getUser();
                                                getPerson();
                                                getRol();
                                                Alert.fire({
                                                    title: "Rol asignado correctamente",
                                                    confirmButtonColor: "#198754",
                                                    icon: "success",
                                                    confirmButtonText: "Aceptar",
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        handleCloseForm();
                                                    }
                                                });
                                            }
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
                            }).catch((error) => {
                                console.log(error)
                            });
                    }
                })
                .catch((error) => {

                });
        },
    });

    const handleCloseForm = () => {
        formik.resetForm();
        setIsOpen(false);
    };

    return (
        <div className="content-wrapper screenHeight">
            <Container fluid>
                <section class="content-header">
                    <div class="container-fluid">
                        <div class="row mb-2">
                            <div class="col-sm-6">
                                <h1 class="font-weight-bold">Gestión de usuarios</h1>
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
                                    <Col as="h6">Registrar Usuario</Col>
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
                                <Container fluid>
                                    <Card.Body>
                                        <div id="example-collapse-text">
                                            <Form className="row" onSubmit={formik.handleSubmit}>
                                                <Form.Group className="col-md-6 mb-4" >
                                                    <Form.Label className="font-weight-normal">Rol<span className="text-danger">*</span></Form.Label>
                                                    <Form.Select onChange={formik.handleChange} name="authorities" value={formik.values.authorities}>
                                                        <option value="">Seleccione una opción</option>
                                                        {
                                                            rol.map((rols) => (
                                                                <option key={rols.id} value={rols.id}>{rols.description}</option>
                                                            ))
                                                        }
                                                    </Form.Select>
                                                    {formik.errors.authorities ? (
                                                        <span className="text-danger">{formik.errors.authorities}</span>
                                                    ) : null}
                                                </Form.Group>
                                                <Form.Group className="col-md-6 mb-4" >
                                                    <Form.Label className="font-weight-normal">Correo<span className="text-danger">*</span></Form.Label>
                                                    <Form.Select name="username" value={formik.values.username} onChange={formik.handleChange}>
                                                        <option value="">Seleccione una opción</option>
                                                        {
                                                            person1.map((personemail) => (
                                                                <option key={personemail.id} value={personemail.id} >{personemail.email}</option>
                                                            ))
                                                        }
                                                    </Form.Select>
                                                    {formik.errors.username ? (
                                                        <span className="text-danger">{formik.errors.username}</span>
                                                    ) : null}
                                                </Form.Group>
                                                <br />
                                                <div className="d-grid gap-2">
                                                    <Button type="submit" style={{ background: "#042B61", borderColor: "#042B61", }}
                                                        disabled={!(formik.isValid && formik.dirty)}>
                                                        Registrar
                                                    </Button>
                                                </div>
                                            </Form>
                                        </div>

                                    </Card.Body>
                                </Container>

                            </Collapse>
                        </Card>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <Card>
                            <Card.Header className="backgroundHeadCard">
                                <Row>
                                    <Col as="h6">Usuarios Registrados</Col>
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
                                <UserEdit
                                    isOpenUpdate={isOpenUpdate}
                                    handleClose={() => setIsOpenUpdate(false)}
                                    setUsers={setUsers}
                                    {...values}
                                />
                                <UserDetails
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
