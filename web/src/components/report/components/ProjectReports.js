import React, { useState, useEffect } from 'react'
import { Button, Row, Col, Container, Card, Badge, ProgressBar } from "react-bootstrap";
import { CustomLoader } from "../../../shared/components/CustomLoader";
import FeatherIcon from "feather-icons-react";
import DataTable from "react-data-table-component";
import { ReportDetails } from './ReportDetails';
import axios from "../../../shared/plugins/axios";
import { useNavigate } from 'react-router-dom';
import { AlertData } from "../../../shared/components/alertData"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

export const ProjectReports = ({
  data, name, dateEnd, dateStart
}) => {

  const [values, setValues] = useState({ data: data, name: name, dateEnd: dateEnd, dateStart: dateStart });
  const [isLoading, setIsLoading] = useState(false);
  const [reports, setReports] = useState([]);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setValues({
      data: data, name: name, dateEnd: dateEnd, dateStart: dateStart 
    })
    document.title = "PANAPO | Reportes";
    getReport();
  }, [])

  const getReport = () => {
    axios({ url: "/report/", method: "GET" })
      .then((response) => {
        let temp = response.data;
        let reportTemp = temp.filter(item => item.project?.id === data);
        for (let i = 0; i < reportTemp.length; i++) {
          let end = new Date(dateEnd).getTime();
          let start = new Date(dateStart).getTime();
          let diferencia = end - start;
          let final = diferencia / (1000 * 60 * 60 * 24)
          let porcentaje = (final * reportTemp[i].daysDeviation) / 100;
          if (porcentaje < 0) {
            porcentaje = porcentaje * -1;
          }
          let dataTemp = {
            ...reportTemp[i],
            porDias: porcentaje
          }
          reportTemp[i] = dataTemp
        }
        let report = [];
        for(let i = reportTemp.length-1; i >= 0; i--){
          report.push(reportTemp[i])
        }
        setReports(report);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = [
    {
      name: <h6>#</h6>,
      cell: (row, index) => <div className="txt4">{index + 1}</div>,
      width: "6%",
      center: true,
      compact: true
    },
    {
      name: <h6>Fecha</h6>,
      cell: (row) => <div className="txt4">{row.date}</div>,
      center: true,
      compact: true
    },
    {
      name: <h6>Etapa real (APE)</h6>,
      cell: (row) => <div className="txt4">{row.stageReal}</div>,
      center: true,
      compact: true
    },
    {
      name: <h6>Fase real (DMS)</h6>,
      cell: (row) => <div className="txt4">{row.phaseReal}</div>,
      center: true,
      compact: true
    },
    {
      name: <h6>% de avance</h6>,
      cell: (row) => <Container fluid>
        <ProgressBar now={row.percentage} variant="success" visuallyHidden />
        <div className='text-center'><small>{row.percentage}% completado</small></div>
      </Container>,
      center: true,
      width: "17%",
      compact: true
    },
    {
      name: <div><h6>Detalles</h6></div>,
      cell: (row) => <div>
        <Button variant="primary" size="md"
          onClick={() => {
            setValues(row)
            setIsOpen(true)
          }}>
          <FontAwesomeIcon icon={faBars} size="lg" className="btnS" />
        </Button>
      </div>,
      center: true,
    },
    {
      name: <h6>$ de inversión</h6>,
      cell: (row) => <div className="txt4 align-center-items">${row.cost}</div>,
      right: false,
      compact: true
    },
    {
      name: <h6>Días de desviación</h6>,
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
      compact: true
    }
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
                <h1 class="font-weight-bold">Reportes de {name}</h1>
              </div>
            </div>
          </div>
        </section>
        <Row>
          <Col>
            <Card className="mb-0">
              <Card.Header
                className="backgroundHeadCard">
                <Row>
                  <Col as="h6">Proyectos</Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={reports}
                  noDataComponent={<AlertData title={"No hay registros"} />}
                  pagination
                  paginationComponentOptions={paginationOptions}
                  progressPending={isLoading}
                  progressComponent={<CustomLoader />}
                />
                <ReportDetails
                  isOpen={isOpen}
                  handleClose={setIsOpen}
                  data={data}
                  {...values}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
};