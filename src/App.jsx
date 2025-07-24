import { createContext, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, ListGroup, Row } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Home from './Home.jsx';
import Sets from './Sets.jsx';
import Account from './Account.jsx';
import Dictionary from './Dictionary.jsx';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Card from 'react-bootstrap/Card';

function App() {
  const [userState, updateUserState] = useState(null);
  const [page, setPage] = useState(0);
  const verStr = "0.1.5";
  const [toast, setToast] = useState(false);
  const [toastType, setToastType] = useState(0);
  // dummy userState
  const testUser = {username:"admin", date:"May 30, 2025", sets:[]};

  function showToast(type) {
    //0 logged in, 1 logged out, 2 created set, 3 update username
    setToastType(type);
    setToast(true);
  }
  
  function logIn() {
    updateUserState(testUser);
    showToast(0);
  }

  function logOut() {
    updateUserState(null);
    showToast(1);
  }

  function updateSets(nSets) {
    let newState = userState;
    newState.sets = nSets;
    updateUserState(newState);
    showToast(2);
  }

  function updateUsername(name) {
    let newState = userState;
    newState.username = name;
    updateUserState(newState);
    showToast(3);
  }

  function requestUserState() {
    return userState;
  }

  function DisplayContent() {
    switch(page) {
      case 0:
        return <Home user={userState} logIn={logIn} logOut={logOut} requestUser={requestUserState} />;
      break;
      case 1:
        return <Dictionary />;
      break;
      case 2:
        return <Sets sets={userState.sets} updateSets={updateSets}/>;
      break;
      case 3:
        return <Account user={userState} updateUsername={updateUserState} />;
      break;
    }
    return null;
  }

  function NavAccount({user, text}) {
    if (user) {
      switch(text) {
        case "Collecciones":
          return <Nav.Link onClick={() => setPage(2)}>{text}</Nav.Link>;
        break;
        default:
          return <Nav.Link onClick={() => setPage(3)}>{text}</Nav.Link>;
        break;
      }
    }
    return null;
  }

  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand>Memorichuelas</Navbar.Brand>
          <Dropdown>
            <Dropdown.Toggle id="lang-dropdown">
                Language
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item>
                    Espanol
                </Dropdown.Item>
                <Dropdown.Item>
                    English
                </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => setPage(0)}>Inicio</Nav.Link>
              <Nav.Link onClick={() => setPage(1)}>Diccionario</Nav.Link>
              <NavAccount user={userState} text="Collecciones" />
              <NavAccount user={userState} text="Configuracion" />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <ToastContainer
        position={'top-end'}
        style={{zIndex: 1}}
      >
        <Toast
          bg={'success'}
          onClose={() => setToast(false)}
          show={toast && toastType == 0}
          delay={5000} autohide
        >
          <Toast.Header>Success</Toast.Header>
          <Toast.Body>
              Logged in!
          </Toast.Body>
        </Toast>
        <Toast
          bg={'success'}
          onClose={() => setToast(false)}
          show={toast && toastType == 1}
          delay={5000} autohide
        >
          <Toast.Header>Success</Toast.Header>
          <Toast.Body>
              Logged out!
          </Toast.Body>
        </Toast>
        <Toast
          bg={'success'}
          onClose={() => setToast(false)}
          show={toast && toastType == 2}
          delay={5000} autohide
        >
          <Toast.Header>Success</Toast.Header>
          <Toast.Body>
              Modified sets!
          </Toast.Body>
        </Toast>
        <Toast
          bg={'danger'}
          onClose={() => setToast(false)}
          show={toast && toastType == 3}
          delay={5000} autohide
        >
          <Toast.Header>Danger</Toast.Header>
          <Toast.Body>
              Changed username! I'm too lazy to make this a success toast.
          </Toast.Body>
        </Toast>
        <Toast
          bg={'warning'}
          onClose={() => setToast(false)}
          show={toast && toastType == 4}
          delay={5000} autohide
        >
          <Toast.Header>Caution</Toast.Header>
          <Toast.Body>
              Cautiously cautious!
          </Toast.Body>
        </Toast>
      </ToastContainer>
      <Card>
        <DisplayContent />
      </Card>
      <br />
      <div>
        Ricardo Olazabal @ 2025 Version {verStr}
      </div>
    </div>
  )
}

export default App
