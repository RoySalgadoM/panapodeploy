import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

export const AppMenu = () => {
  return (
    <div>
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <a className="brand-link" style={{textDecoration: "none"}}>
          <span className="brand-text font-weight-light">PANAPO | Coordinador</span>
        </a>
        <div className="sidebar">
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
              <li className="nav-item">
                <Link to={"/dashboard"} className="nav-link">
                  <i className="nav-icon far fa-image"></i>
                  <p>
                    Panel de proyectos
                  </p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/project"} className="nav-link">
                  <i className="nav-icon far fa-image"></i>
                  <p>
                    Gestión de proyectos
                  </p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/personal"} className="nav-link">
                  <i className="nav-icon far fa-image"></i>
                  <p>
                    Gestión de personal
                  </p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/user"} className="nav-link">
                  <i className="nav-icon far fa-image"></i>
                  <p>
                    Gestión de usuarios
                  </p>
                </Link>
              </li><li className="nav-item">
                <Link to={"/direction"} className="nav-link">
                  <i className="nav-icon far fa-image"></i>
                  <p>
                    Gestión de usuarios de alta dirección
                  </p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/client"} className="nav-link">
                  <i className="nav-icon far fa-image"></i>
                  <p>
                    Gestión de clientes
                  </p>
                </Link>
              </li>
              <li className="nav-item">
              <Link to={"/role"} className="nav-link">
                  <i className="nav-icon far fa-image"></i>
                  <p>
                    Gestión de roles
                  </p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/"} className="nav-link">
                  <i className="nav-icon far fa-image"></i>
                  <p>
                    Configuración
                  </p>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  )
}
