import React, { useState, useEffect } from "react";
import {
  Button,
  Row,
  Col,
  Container,
  Card,
  Badge,
  ProgressBar,
} from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import DataTable from "react-data-table-component";
import { AlertData } from "../../../../shared/components/alertData"
import { ProjectDetails } from "../../coordinador/components/ProjectDetails";
import { CustomLoader } from "../../../../shared/components/CustomLoader";
import { FilterComponent } from "../../../../shared/components/FilterComponent";
import { useNavigate } from "react-router-dom";
import { ProjectCreate } from "./ProjectCreate";
import axios from "../../../../shared/plugins/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faFile, faInfo } from '@fortawesome/free-solid-svg-icons'

export const ProjectListRape = () => {
  const [filterText, setFilterText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [projectsRape, setProjectsRape] = useState([]);
  const [values, setValues] = useState({});

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCreateReport, setIsOpenCreateReport] = useState(false);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [isOpenReports, setIsOpenReports] = useState(false);
  const [isOpenData, setIsOpenData] = useState(false);

  let value = "";
  let nameProject = "";
  let end = "";
  let start = "";
  const navigation = useNavigate();
  let username = localStorage.getItem("username")

  const handleReport = () => {
    navigation('/report', { state: { id: value, name: nameProject, end: end, start: start } });
  }

  const setValue = (id, acronym, dateEnd, dateStart) => {
    value = id;
    nameProject = acronym;
    end = dateEnd;
    start = dateStart;
  }

  useEffect(() => {
    setIsLoading(true);
    getProjectsRape();
  }, []);


  const getProjectsRape = async () => {
    await axios({ url: "/project/", method: "GET" })
      .then((response) => {
        let data = response.data;
        let arrTemp = []
        for (let r = 0; r < data.length; r++) {
          for (let m = 0; m < data[r].team.length; m++) {
            let temp = data[r];
            if (data[r].team[m].rolProject.description === "RAPE" && data[r].team[m].person.email === username) {
              arrTemp.push(temp)
            }
          }
        }
        let projectTemp = []
        for (let m = 0; m < arrTemp.length; m++) {
          if (arrTemp[m].priority === "Alta") {
            projectTemp.push(arrTemp[m])
          }

        }
        for (let m = 0; m < arrTemp.length; m++) {
          if (arrTemp[m].priority === "Media") {
            projectTemp.push(arrTemp[m])

          }
        }
        for (let m = 0; m < arrTemp.length; m++) {
          if (arrTemp[m].priority === "Baja") {
            projectTemp.push(arrTemp[m])
          }
        }
        setProjectsRape(projectTemp);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = [
    {
      name: <h6>#</h6>,
      cell: (row, index) => (
        <div>
          <h6>{index + 1}</h6>
        </div>
      ),
      width: "4%",
      center: true,
      compact: true,
    },
    {
      name: <h6 className="text-center">Identificador</h6>,
      cell: (row) => <div className="txt4">{row.acronym}</div>,
    },
    {
      name: <h6>% de avance</h6>,
      cell: (row) => (
        <div className="txt4">
          <ProgressBar now={row.percentage} variant="success" />
          <small>{row.percentage}% completado</small>
        </div>
      ),
    },
    {
      name: <h6>Estado</h6>,
      cell: (row) => (
        <>
          {
            row.statusProject.description === "Activo" ? (
              <h6>
                <Badge bg="success">
                  <div>{row.statusProject.description}</div>
                </Badge>
              </h6>
            ) : (row.statusProject.description === "Cancelado" ?
              <h6>
                <Badge bg="danger">
                  <div>{row.statusProject.description}</div>
                </Badge>
              </h6> : (row.statusProject.description === "Pausado" ?
                <h6>
                  <Badge bg="warning">
                    <div>{row.statusProject.description}</div>
                  </Badge>
                </h6> :
                <h6>
                  <Badge bg="primary">
                    <div>{row.statusProject.description}</div>
                  </Badge>
                </h6>
              )
            )
          }
        </>
      ),
    },
    {
      name: <h6>Prioridad</h6>,
      cell: (row) => (
        <>
          {
            row.priority === "Alta" ? (
              <h6>
                <Badge bg="danger">
                  <div>{row.priority}</div>
                </Badge>
              </h6>
            ) : (row.priority === "Media" ?
              <h6>
                <Badge bg="warning">
                  <div>{row.priority}</div>
                </Badge>
              </h6> :
              <h6>
                <Badge bg="success">
                  <div>{row.priority}</div>
                </Badge>
              </h6>
            )
          }
        </>
      ),
    },
    {
      name: (
        <div>
          <h6>Detalles</h6>
        </div>
      ),
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
      name: <h6>Hacer reporte</h6>,
      cell: (row) => (
        <div>
          <Button
            variant="warning"
            size="md"
            onClick={() => {
              setValues(row);
              setIsOpenCreateReport(true);
            }}
          >
            <FeatherIcon icon="file-plus" />
          </Button>
        </div>
      ),
    },
    {
      name: <h6>Ver reportes</h6>,
      cell: (row) => (
        <div>
          <Button
            variant="success"
            size="md"
            onClick={() => {
              setValue(row.id, row.acronym, row.dateEnd, row.dateStart);
              handleReport();
            }}
          >
            <FontAwesomeIcon icon={faFile} size="lg" className="btnS" />
          </Button>
        </div>
      ),
    },
  ];

  const paginationOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
  };

  const filteredItems = projectsRape.filter(
    (item) => item.acronym && item.acronym.toLowerCase().includes(filterText.toLowerCase())
  );

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
              <div className="col-sm-6">
                <h1 className="font-weight-bold">Gestión de proyectos</h1>
              </div>
            </div>
          </div>
        </section>
        <Row>
          <Col>
            <Card className="mb-0">
              <Card.Header className="backgroundHeadCard">
                <Row>
                  <Col as="h6">Proyectos</Col>
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
                <ProjectDetails
                  isOpenDetails={isOpenDetails}
                  handleClose={setIsOpenDetails}
                  {...values}
                />
                <ProjectCreate
                  isOpenCreateReport={isOpenCreateReport}
                  handleClose={setIsOpenCreateReport}
                  getProjectsRape={getProjectsRape}
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