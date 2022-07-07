import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./authContext";
import Alert from "../../shared/plugins/alert";
import axios from "../../shared/plugins/axios";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Button,
  Row,
  Card,
  Container,
  Form,
  FormControl,
  InputGroup,
  FormGroup,
  Col,
} from "react-bootstrap";
import img from "../../assets/img/logo-cds.png";
import FeatherIcon from "feather-icons-react";

export const LoginScreen = (props) => {

  const navigation = useNavigate();
  const { authContext } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: yup.object().shape({
      username: yup.string().email("Ingresa un correo válido").required("Campo obligatorio"),
      password: yup
        .string()
        .required("Campo obligatorio")
        .min(3, "Mínimo tres caracteres"),
    }),
    onSubmit: (values) => {
      axios({
        url: "/auth/login",
        method: "POST",
        data: JSON.stringify(values),
      })
        .then((response2) => {
          if (!response2.error) {
            authContext.signIn(response2.data)
            let user = response2.data.user.username;
            axios({ url: "/user/", method: "GET" })
              .then((response) => {
                let exist = false;
                let actual = {};
                let resp = response.data
                for (let i = 0; i < resp.length; i++) {
                  if (resp[i].username === user) {
                    exist = true;
                    actual = resp[i];
                  }
                }
                if (exist) {
                  if (actual.status.id === 1) {
                    let authorities = response2.data.user.authorities;
                    let directivo, coordinador, rape, rd;
                    for (let i = 0; i < authorities.length; i++) {
                      if (authorities[i].authority === "Coordinador") {
                        coordinador = true;
                      }
                      if (authorities[i].authority === "RD") {
                        rape = true;
                      }
                      if (authorities[i].authority === "RAPE") {
                        rd = true;
                      }
                      if (authorities[i].authority === "Directivo") {
                        directivo = true;
                      }
                    }
                    authContext.setRoles(directivo, coordinador, rape, rd);
                    navigation("/", { replace: true });
                  } else if(actual.status.id === 2){
                    Alert.fire({
                      title: "Verifique los datos",
                      text: "Usuario y/o contraseña incorrectos",
                      icon: "error",
                      confirmButtonText: "Aceptar",
                      confirmButtonColor: "#3085D6",
                    });
                  }
                }
              })
              .catch((error) => {
              });
          }
        })
        .catch((error) => {
          Alert.fire({
            title: "Verifique los datos",
            text: "Usuario y/o contraseña incorrectos",
            icon: "error",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#3085D6",
          });
        });
    },
  });

  useEffect(() => {
    document.title = "PANAPO | Login";
  }, []);

  return (
    <section className="App-header">
      <Container>
        <Row className="d-flex justify-content-center align-items-center">
          <Card style={{ width: "22rem" }}>
            <Col className="text-center">
              <Card.Img
                variant="top"
                className="rounded"
                alt="logo-cds"
                src={img}
              />
            </Col>
            <hr />
            <Card.Body>
              <Card.Text>
                <Col className="text-center mb-3">
                  Para ingresar al sistema primero inicia sesión
                </Col>
                <Form onSubmit={formik.handleSubmit}>
                  <FormGroup>
                    <InputGroup className="mt-4">
                      <FormControl
                        placeholder="Correo electrónico"
                        id="username"
                        type="email"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                      />
                      <InputGroup.Text>
                        <FeatherIcon icon="mail" />
                      </InputGroup.Text>
                    </InputGroup>
                    {formik.errors.username ? (
                      <p className="text-danger mb-0">
                        {formik.errors.username}
                      </p>
                    ) : null}
                  </FormGroup>
                  <FormGroup>
                    <InputGroup className="mt-4">
                      <FormControl
                        placeholder="Contraseña"
                        id="password"
                        type="password"
                        autoComplete="off"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                      />
                      <InputGroup.Text>
                        <FeatherIcon icon="lock" />
                      </InputGroup.Text>
                    </InputGroup>
                    {formik.errors.password ? (
                      <span className="text-danger mb-0">
                        {formik.errors.password}
                      </span>
                    ) : null}
                  </FormGroup>
                  <Form.Group className="form-outline mb-4 mt-3">
                    <Col className="d-grid gap-2 text-center pt-1 pb-1">
                      <Button
                        style={{
                          background: "#042B61",
                          borderColor: "#042B61",
                        }}
                        type="submit"
                        disabled={!(formik.isValid && formik.dirty)}
                      >
                        Iniciar sesión
                      </Button>
                    </Col>
                  </Form.Group>
                </Form>
                <Link to={`/forgot`} className={"breadcrumb-item"}>
                  Recuperar contraseña
                </Link>
              </Card.Text>
            </Card.Body>
          </Card>
        </Row>
      </Container>
    </section>
  );
};
