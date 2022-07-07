import React, { useState, useEffect } from 'react'
import { Row, Col, Container, Badge, Card, ProgressBar, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import { CustomLoader } from "../../shared/components/CustomLoader";
import DataTable from "react-data-table-component";
import axios from "../../shared/plugins/axios";
import { AlertData } from "../../shared/components/alertData"


export const DashboardScreen = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [values, setValues] = useState({});
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [contadores, setContadores] = useState({ activos: 0, pausados: 0, cerrados: 0, cancelados: 0 })

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

  const getProjects = () => {
    axios({ url: "/project/", method: "GET" })
      .then((response) => {
        let data = response.data;
        let projectTemp = data.filter(item => item.statusProject.description !== "Prospecto")
        for (let i = 0; i < projectTemp.length; i++) {
          let dateEnd = new Date(projectTemp[i].dateEnd).getTime();
          let dateStart = new Date(projectTemp[i].dateStart).getTime();
          let diferencia = dateEnd - dateStart;
          let final = diferencia / (1000 * 60 * 60 * 24)
          let porcentaje = (final * projectTemp[i].daysDeviation) / 100;

          if (porcentaje < 0) {
            porcentaje = porcentaje * -1;
          }
          let dataTemp = {
            ...projectTemp[i],
            porDias: porcentaje
          }
          projectTemp[i] = dataTemp
        }

        let activos = 0, pausados = 0, cerrados = 0, cancelados = 0;
        for (let i = 0; i < projectTemp.length; i++) {
          switch (projectTemp[i].statusProject.description) {
            case "Activo":
              activos++;
              break;
            case "Pausado":
              pausados++;
              break;
            case "Cerrado":
              cerrados++;
              break;
            case "Cancelado":
              cancelados++;
              break;
          }
        }

        let temp = []
        for (let m = 0; m < projectTemp.length; m++) {
          if (projectTemp[m].priority === "Alta") {
            temp.push(projectTemp[m])
          }

        }
        for (let m = 0; m < projectTemp.length; m++) {
          if (projectTemp[m].priority === "Media") {
            temp.push(projectTemp[m])

          }
        }
        for (let m = 0; m < projectTemp.length; m++) {
          if (projectTemp[m].priority === "Baja") {
            temp.push(projectTemp[m])
          }
        }
        setProjects(temp);
        setContadores({ activos: activos, pausados: pausados, cerrados: cerrados, cancelados: cancelados })
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    getProjects();
    document.title = "PANAPO | Panel de proyectos";
  }, []);

  const columns = [
    {
      name: <h6>#</h6>,
      cell: (row, index) => <div><h6>{index + 1}</h6></div>,
      width: "6%",

    },
    {
      name: <h6>Identificador</h6>,
      cell: (row) => <div className="txt4 text-center">{row.acronym}</div>,
      width: "15%",
      center: true,
    },
    {
      name: <h6 >% avance</h6>,
      cell: (row) => <div className="txt4">
        <ProgressBar now={row.percentage} variant="success" />
        <small>{row.percentage}% completado</small>
      </div>,
      width: "25%"
    },
    {
      name: <h6 title="Si hay números negativos es porque van adelantados en el proyecto">Días de desviación</h6>,
      cell: (row) =>
        <div className='text-center'>
          {
            row.daysDeviation === null || row.daysDeviation === undefined ? (
              <h6>
                <Badge bg="secondary">
                  <div>No hay reportes</div>
                </Badge>
              </h6>
            ) : (row.porDias >= 0 && row.porDias <= 10 ?
              <h6>
                <Badge bg="success">
                  <div>{row.daysDeviation}</div>
                </Badge>
              </h6> : (row.porDias > 10 && row.porDias <= 15 ?
                <h6>
                  <Badge bg="orange">
                    <div>{row.daysDeviation}</div>
                  </Badge>
                </h6> :
                <h6>
                  <Badge bg="danger">
                    <div>{row.daysDeviation}</div>
                  </Badge>
                </h6>
              )
            )
          }
        </div>,
      width: "15%",
    },
    {
      name: <h6>Prioridad</h6>,
      cell: (row) =>
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
    },
    {
      name: <h6>Estado</h6>,
      cell: (row) =>
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
    },
    {
      name: <div><h6>Historial de reportes</h6></div>,
      cell: (row) => <div>
        <Button variant="success" size="md" onClick={() => {
          setValue(row.id, row.acronym, row.dateEnd, row.dateStart)
          handleReport()
        }}
        >
          <FontAwesomeIcon icon={faFile} size="lg" className="btnS"/>
        </Button>
      </div>,
      center: true,
    },
  ];

  const paginationOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
  };

  return (
    <div className="content-wrapper screenHeight">
      <Container fluid>
        <section class="content-header">
          <div class="container-fluid">
            <div class="row mb-2">
              <div class="col-sm-6">
                <h1 class="font-weight-bold">Panel de proyectos</h1>
              </div>
            </div>
          </div>
        </section>
        <Row className="mt-3">
          <Col>
            <Card>
              <Card.Body className='activos'>
                <Col >
                  <h3>{contadores.activos}</h3>
                  <h4>Proyectos activos</h4>
                </Col>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body className='pausados'>
                <Col >
                  <h3>{contadores.pausados}</h3>
                  <h4>Proyectos pausados</h4>
                </Col>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body className='cerrados'>
                <Col >
                  <h3>{contadores.cerrados}</h3>
                  <h4>Proyectos cerrados</h4>
                </Col>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body className='cancelados'>
                <Col >
                  <h3>{contadores.cancelados}</h3>
                  <h4>Proyectos cancelados</h4>
                </Col>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {/* TABLA DE PROYECTOS */}
        <Row className="mt-3">
          <Col>
            <Card>
              <Card.Header className="backgroundHeadCard">
                <Row>
                  <Col as="h6">Proyectos</Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={projects}
                  noDataComponent={<AlertData title={"No hay registros"} />}
                  pagination
                  paginationComponentOptions={paginationOptions}
                  progressPending={isLoading}
                  progressComponent={<CustomLoader />}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}