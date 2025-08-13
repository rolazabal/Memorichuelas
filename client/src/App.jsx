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
import strings from './Strings.js';
import Button from 'react-bootstrap/Button';

function App() {
  const [userState, updateUserState] = useState(null);
  // 0 home, 1 dictionary, 2 sets, 3 settings
  const [page, setPage] = useState(0);
  const verStr = "0.1.6";
  const [toast, setToast] = useState(false);
  // 0 logged in, 1 logged out, 2 created set, 3 update username
  const [toastType, setToastType] = useState(0);
  // language 0 = english; 1 = spanish
  const [lang, setLang] = useState(0);

  const fetchUserState = async() => {
    try {
      let response = await fetch('http://localhost:5050/api/state');
      let newState = await response.json();
      if (newState) {
        updateUserState(newState.state);
        return true;
      }
    } catch(error) {
      console.log(error);
      return false;
    }
  };

  const updateSets = async (sets) => {
    try {
      const response = await fetch('https://localhost:5050/api/state', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({sets: sets})
      });
      let newState = await response.json();
      if (newState) updateUserState(newState.state);
    } catch(error) {
      console.log(error);
    }
  };

  function showToast(type) {
    setToastType(type);
    setToast(true);
  }
  
  const logIn = async() => {
    let login = await fetchUserState();
    if (login) {
      showToast(0);
      setPage(2);
    } else showToast(3);
  }

  function logOut() {
    setPage(0);
    updateUserState(null);
    showToast(1);
  }

  function updateUsername(name) {
    let newState = userState;
    newState.username = name;
    updateUserState(newState);
    showToast(3);
  }

  function DisplayContent() {
    switch(page) {
      case 0:
        return <Home lang={lang} strings={strings} user={userState} logIn={logIn} logOut={logOut} />;
      break;
      case 1:
        return <Dictionary lang={lang} strings={strings} />;
      break;
      case 2:
        return <Sets lang={lang} strings={strings} sets={userState != null ? userState.sets : []} updateSets={updateSets} />;
      break;
      case 3:
        return <Account lang={lang} strings={strings} user={userState} updateUsername={updateUserState} />;
      break;
    }
    return;
  }

  function NavAccount({user}) {
    if (!user) return;
    return(<>
      <Nav.Link onClick={() => setPage(2)}>{strings.sets_title[lang]}</Nav.Link>
      <Nav.Link onClick={() => setPage(3)}>{strings.user_title[lang]}</Nav.Link>
    </>);
  }

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand>Memorichuelas</Navbar.Brand>
          <Dropdown>
            <Dropdown.Toggle id="lang-dropdown">
                {strings.language[lang]}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item onClick={() => setLang(1)}>
                    Espanol
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setLang(0)}>
                    English
                </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {userState ? <Button onClick={() => logOut()}>{strings.logout[lang]}</Button> : <></>}
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => setPage(0)}>{strings.about_title[lang]}</Nav.Link>
              <Nav.Link onClick={() => setPage(1)}>{strings.dictionary_title[lang]}</Nav.Link>
              <NavAccount user={userState} />
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
        Ricardo Olazabal @ 2026 // app version {verStr}
      </div>
    </div>
  )
}

export default App