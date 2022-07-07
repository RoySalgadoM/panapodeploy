import { Link, useNavigate } from 'react-router-dom';
import React from 'react'

export const AppMenuRD = () => {
  return (
    <div>
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <a className="brand-link" style={{textDecoration: "none"}}>
          <span className="brand-text font-weight-light">PANAPO | RD</span>
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
