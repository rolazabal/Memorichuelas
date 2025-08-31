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
import Waitor from './Waitor.js';

function App() {
  ///variables
  //0 home, 1 dictionary, 2 sets, 3 settings
  const [page, setPage] = useState(0);
  const verStr = "0.1.6";
  const [toast, setToast] = useState(false);
  //0 logged in, 1 logged out, 2 created set, 3 update username
  const [toastType, setToastType] = useState(0);
  //language 0 = english; 1 = spanish
  const [lang, setLang] = useState(0);
  //user variables
  const [userID, setUserID] = useState(-1);
  const [info, setInfo] = useState(null);
  const [pageWords, setPageWords] = useState([]);
  const [wordObj, setWordObj] = useState(null);
  //forms
  const accountForm = useState({username: "", passkey: 0});
  //server communicator
  const waitor = new Waitor();

  ///functions
  function showToast(type) {
    setToastType(type);
    setToast(true);
  }
  
  async function logIn(user, pass) {
    let id = await waitor.fetchUserID(user, pass);
    if (id != -1) {
      //successful log in toast
      setUserID(id);
      showToast(0);
      setPage(2);
    } else showToast(3); //failure to log in toast
  }

  async function logOut() {
    let op = await waitor.logOutUser(userID);
    if (op) {
      //successful log out toast
      setUserID(-1);
      showToast(0);
      setPage(0);
    } else showToast(3); //failure to log out toast?
  }

  async function createAccount(user, pass) {
    let op = await waitor.createUser(user, pass);
    if (op) {
      logIn(user, pass);
    } else {
      //handle create account fail
    }
  }

  async function getPage(page) {
    let list = await waitor.fetchDictPage(userID, page);
    setPageWords(list);
  }

  async function getWord(id) {
    let word = await waitor.fetchWordObj(userID, id);
    setWordObj(word);
  }

  async function getInfo() {
    if (info == null) {
      let newInfo = await waitor.fetchUserInfo(userID);
      setInfo(newInfo);
    }
    setPage(3);
  }

  function DisplayContent() {
    switch(page) {
      case 0:
        return <Home lang={lang} strings={strings} logIn={logIn} accountForm={accountForm} createAccount={createAccount} loggedIn={userID == -1 ? false : true} />;
      break;
      case 1:
        return <Dictionary lang={lang} strings={strings} wordObj={wordObj} pageWords={pageWords} getPage={getPage} getWord={getWord} setWordObj={setWordObj} />;
      break;
      case 2:
        return <Sets lang={lang} strings={strings} />;
      break;
      case 3:
        return <Account lang={lang} strings={strings} info={info} logOut={logOut} />;
      break;
      default:
        return;
      break;
    }
  }

  function NavAccount() {
    if (userID == -1) return;
    return(
      <>
        <Nav.Link onClick={() => setPage(2)}>{strings.sets_title[lang]}</Nav.Link>
        <Nav.Link onClick={async () => await getInfo()}>{strings.user_title[lang]}</Nav.Link>
      </>
    );
  }

  return (
    <>
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
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => setPage(0)}>{strings.about_title[lang]}</Nav.Link>
              <Nav.Link onClick={() => setPage(1)}>{strings.dictionary_title[lang]}</Nav.Link>
              <NavAccount />
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
      <Card style={{width: '90%', display: 'block', marginLeft: 'auto', marginRight: 'auto'}}>
        <DisplayContent />
      </Card>
      <br />
      <div>
        Ricardo Olazabal @ 2026 // app version {verStr}
      </div>
    </>
  )
}

export default App