import React, { useContext, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/authContext";
import { Row, Col, Container, Card, Button } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import Alert from "../../shared/plugins/alert";
//iconos de fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUser, faFile, faInfo } from '@fortawesome/free-solid-svg-icons'

library.add(faUser, faFile, faInfo);

export const ChangeRol = () => {
  const navigation = useNavigate();
    const { authContext, state } = useContext(AuthContext);

    const logout = () =>{
        authContext.signOut();
        navigation("/", { replace: true });
    }
  let coordinador = state.coordinador
  let rd = state.rd
  let rape = state.rape
  let directivo = state.directivo
  let username = localStorage.getItem("username");

  useEffect(() => {
    document.title = "PANAPO | Mis roles";
  }, []);

  const alert = () => {
    Alert.fire({
      title: "Rol cambiado exitosamente",
      confirmButtonColor: "#198754",
      icon: "success",
      confirmButtonText: "Aceptar",
    });
  }

  return (
    <div className="content-wrapper screenHeight">
      <Container fluid>
        <section class="content-header">
          <div class="container-fluid">
            <div class="row mb-2">
              <div class="col-sm-6">
                <h1 class="font-weight-bold mb-2">Configuración</h1>
                Usuario: {username}
              </div>
              <div class="col-sm-6 text-end">
                <Button className="btn" onClick={logout} style={{ background: "#042B61", borderColor: "#042B61" }}>
                  Cerrar sesión
                </Button>
              </div>
            </div>
          </div>
        </section>
        <Row>
          {
            rd === "true"?
              <Col >
                <Card>
                  <Card.Body className='roles'>
                    <Col >
                      <h3>RD</h3>
                      <div className='mt-4 mb-4'>
                        <FontAwesomeIcon icon={faUser} size="5x" />
                      </div>
                      <Button type="submit" style={{ background: "#042B61", borderColor: "#042B61" }}
                        onClick={() => {
                          authContext.setRoleActive("RD")
                          navigation("/dashboard", { replace: true })
                          alert()
                        }}>
                        Cambiar <FeatherIcon icon="log-out" />
                      </Button>
                    </Col>
                  </Card.Body>
                </Card>
              </Col>
              : null
          }
          {
            rape === "true" ?
              <Col>
                <Card>
                  <Card.Body className='roles'>
                    <Col >
                      <h3>RAPE</h3>
                      <div className='mt-4 mb-4'>
                        <FontAwesomeIcon icon={faUser} size="5x" />
                      </div>
                      <Button type="submit" style={{ background: "#042B61", borderColor: "#042B61" }}
                        onClick={() => {
                          authContext.setRoleActive("RAPE")
                          navigation("/dashboard", { replace: true })
                          alert()
                        }}>
                        Cambiar <FeatherIcon icon="log-out" />
                      </Button>
                    </Col>
                  </Card.Body>
                </Card>
              </Col>
              : null
          }
          {
            directivo === "true" ?
              <Col>
                <Card>
                  <Card.Body className='roles'>
                    <Col >
                      <h3>Directivo</h3>
                      <div className='mt-4 mb-4'>
                        <FontAwesomeIcon icon={faUser} size="5x" />
                      </div>
                      <Button type="submit" style={{ background: "#042B61", borderColor: "#042B61" }}
                        onClick={() => {
                          authContext.setRoleActive("DIRECTIVO")
                          navigation("/dashboard", { replace: true })
                          alert()
                        }}
                      >
                        Cambiar <FeatherIcon icon="log-out" /></Button>
                    </Col>
                  </Card.Body>
                </Card>
              </Col>
              : null
          }
          {
            coordinador === "true"  ?
              <Col>
                <Card>
                  <Card.Body className='roles'>
                    <Col >
                      <h3>Coordinador</h3>
                      <div className='mt-4 mb-4'>
                        <FontAwesomeIcon icon={faUser} size="5x" />
                      </div>
                      <Button type="submit" style={{ background: "#042B61", borderColor: "#042B61" }}
                        onClick={() => {
                          authContext.setRoleActive("COORDINADOR")
                          navigation("/dashboard", { replace: true })
                          alert()
                        }}>
                        Cambiar <FeatherIcon icon="log-out" /></Button>
                    </Col>
                  </Card.Body>
                </Card>
              </Col>
              : null
          }
        </Row>
      </Container>
    </div>
  )
}