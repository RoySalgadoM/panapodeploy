import React, { useContext, useState } from "react";
import { Container } from "react-bootstrap";
import { AuthContext } from "../auth/authContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginScreen } from "../auth/LoginScreen";
import { ForgotPassword } from "../auth/ForgotPassword"
import { RecoverPassword } from "../auth/RecoverPassword"
import { DashboardScreen } from '../home/DashboardScreen'

import { ProjectScreen } from "../project/coordinador/ProjectScreen"
import { ProjectScreenRd } from "../project/rd/ProjectScreenRd"
import { ProjectScreenRape } from "../project/rape/ProjectScreenRape"
import { ChangeRol } from "../home/ChangeRol";

import { RoleScreen } from "../role/RoleScreen"
import { ReportScreen } from "../report/ReportScreen";
import { AppHeader } from '../../shared/components/appHeader';
import { AppMenu } from "../../shared/components/appMenu";
import { AppMenuRD } from "../../shared/components/appMenuRD";
import { AppMenuRAPE } from "../../shared/components/appMenuRAPE";
import { AppMenuDireccion } from "../../shared/components/appMenuDireccion";
import { ClientScreen } from "../client/ClientScreen";
import { PersonalScreen } from "../personal/PersonalScreen";
import { DirectionScreen } from "../userHighDirection/DirectionScreen";
import { UserScreen } from "../users/UserScreen";

export const AppRouter = () => {
  const {state } = useContext(AuthContext);
  return (
    <Router>
      <Routes>
        <Route
          path="*"
          element={
            state.userToken !== null ? (
              state.rolSign === "COORDINADOR" ?
                <>
                  <body className="hold-transition sidebar-mini">
                    <div className="wrapper">
                      <AppHeader />
                      <AppMenu />
                      <Container fluid>
                        <Routes>
                          <Route path={"/dashboard"} element={<DashboardScreen />} />
                          <Route path={"/project"} element={<ProjectScreen/>} />
                          <Route path={"/personal"} element={<PersonalScreen/>} />
                          <Route path={"/direction"} element={<DirectionScreen/>} />
                          <Route path={"/user"} element={<UserScreen/>} />
                          <Route path={"/client"} element={<ClientScreen/>} />
                          <Route path={"/role"} element={<RoleScreen/>} />
                          <Route path={"/report"} element={<ReportScreen/>} />
                          <Route path={"/"} element={<ChangeRol/>} />
                          <Route path="*" element={<div>ERROR 404</div>} />
                        </Routes>
                      </Container>
                    </div>
                  </body>
                </>
              : state.rolSign === "RD" ?
              <>
                <body className="hold-transition sidebar-mini">
                  <div className="wrapper">
                    <AppHeader />
                    <AppMenuRD />
                    <Container fluid>
                      <Routes>
                        <Route path={"/dashboard"} element={<DashboardScreen />} />
                        <Route path={"/project"} element={<ProjectScreenRd />} />
                        <Route path={"/report"} element={<ReportScreen />} />
                        <Route path={"/"} element={<ChangeRol />} />
                        <Route path="*" element={<div>ERROR 404</div>} />
                      </Routes>
                    </Container>
                  </div>
                </body>
              </>
              : state.rolSign === "RAPE" ?
              <>
                <body className="hold-transition sidebar-mini">
                  <div className="wrapper">
                    <AppHeader />
                    <AppMenuRAPE />
                    <Container fluid>
                      <Routes>
                        <Route path={"/dashboard"} element={<DashboardScreen />} />
                        <Route path={"/project"} element={<ProjectScreenRape />} />
                        <Route path={"/report"} element={<ReportScreen />} />
                        <Route path={"/"} element={<ChangeRol />} />
                        <Route path="*" element={<div>ERROR 404</div>} />
                      </Routes>
                    </Container>
                  </div>
                </body>
              </> 
              : state.rolSign === "DIRECTIVO" ?
              <>
                <body className="hold-transition sidebar-mini">
                  <div className="wrapper">
                    <AppHeader />
                    <AppMenuDireccion />
                    <Container fluid>
                      <Routes>
                        <Route path={"/dashboard"} element={<DashboardScreen />} />
                        <Route path="*" element={<div>ERROR 404</div>} />
                        <Route path={"/report"} element={<ReportScreen />} />
                      </Routes>
                    </Container>
                  </div>
                </body>
              </>
              : null
            ) : (
              <>
                <Container fluid className="p-0">
                  <Routes>
                    <Route path={"/"} element={<LoginScreen />} />
                    <Route path={"/forgot"} element={<ForgotPassword />} />
                    <Route path={"/recover"} element={<RecoverPassword />} />
                    <Route path="*" element={<div>Error 404</div>} />
                  </Routes>
                </Container>
              </>
            )
          }
        />
      </Routes>
    </Router>
  );
};