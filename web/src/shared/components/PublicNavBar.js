import React from 'react'
import { Container, Nav, Navbar, Image, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';


export const PublicNavBar = () => {
    
    return (
        <Navbar bg="dark" variant="dark">
            <Container fluid>
                <Navbar.Brand href="#">
                     </Navbar.Brand>
                <Nav className="me-auto">
                    <Link to={"/"} className="nav-link">
                        Productos
                    </Link>
                    <Link to={"/contact"} className="nav-link">
                        Contacto
                    </Link>
                </Nav>
                <Button variant="outline-light" >
                    Iniciar sesión</Button>
            </Container>
        </Navbar>
    )
}
