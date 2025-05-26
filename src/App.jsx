import { createContext, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { ListGroup, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Home from './Home.jsx';

function NavAccount({userActive, link, text}) {
  if (userActive) {
    return <Nav.Link href={link}>{text}</Nav.Link>;
  }
  return null;
}

function App() {
  const content = 0;
  const verStr = "1.4";
  const [loggedIn, setLoggedIn] = useState(false)

  const logIn = () => setLoggedIn(true);
  const logOut = () => setLoggedIn(false);

  function DisplayContent({page}) {
    switch(page) {
      case 0:
        return <Home user={loggedIn} logIn={logIn} logOut={logOut} />;
      break;
    }
    return null;
  }

  return (
    <>
      <div>
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container fluid>
            <Navbar.Brand href="#home">Memorichuelas</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="#home">Inicio</Nav.Link>
                <Nav.Link href='#dict'>Diccionario</Nav.Link>
                <NavAccount userActive={loggedIn} link='#sets' text="Collecciones" />
                <NavAccount userActive={loggedIn} link='#user' text="Configuracion" />
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Card>
          <DisplayContent page={content} />
        </Card>
        <p style={{color: 'white'}}>
          Ricardo Olazabal @ 2025 Version {verStr}
        </p>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
    </>
  )
}

export default App
