import { createContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, ListGroup, Row } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Home from './Home.jsx';
import Sets from './Sets.jsx';
import Account from './Account.jsx';
import Dictionary from './Dictionary.jsx';
import Card from 'react-bootstrap/Card';
import strings from './Strings.js';
import Button from 'react-bootstrap/Button';
import Waitor from './Waitor.js';
import Toaster from './Toaster.jsx';
import Stack from 'react-bootstrap/Stack';
import Col from 'react-bootstrap/Col';

function App() {
  ///variables
  //0 home, 1 dictionary, 2 sets, 3 settings
  const [page, setPage] = useState(0);
  const verStr = "0.1.7d";
  const [toast, setToast] = useState(false);
  //0 login s, 1 login f, 2 logout s, 3 create acc f, 4 username s, 5 username f, 6 acc del s, 7 acc del f
  const [toastType, setToastType] = useState(0);
  //language 0 = english; 1 = spanish
  const [lang, setLang] = useState(0);
  //user variables
  const [userID, setUserID] = useState(-1);
  const [info, setInfo] = useState(null);
  const [pageWords, setPageWords] = useState(null);
  const [wordObj, setWordObj] = useState(null);
  //server communicator
  const waitor = new Waitor();

  ///functions
  function showToast(type) {
    setToastType(type);
    setToast(true);
  }

  function clearVars() {
    setUserID(-1);
    setInfo(null);
    setPageWords(null);
    setWordObj(null);
  }
  
  async function logIn(user, pass) {
    let id = await waitor.fetchUserID(user, pass);
    if (id != -1) {
      //successful log in toast
      setUserID(id);
      showToast(0);
      setPage(2);
    } else showToast(1); //failure to log in toast
  }

  //TODO: figure out why this fucntion does not execute past first line
  async function logOut() {
    let op = await waitor.logOutUser(userID);
    setPage(0);
    clearVars();
    if (op) {
      //successful log out toast
      showToast(2);
    } else {
      //failure to log out toast?
    }
  }

  async function createAccount(user, pass) {
    let op = await waitor.createUser(user, pass);
    if (op) {
      logIn(user, pass);
    } else {
      //handle create account fail
      showToast(3);
    }
  }

  async function getPage(letter) {
    let list = await waitor.fetchDictPage(userID, letter);
    setPageWords(list);
  }

  async function search(string) {
    let list = await waitor.dictionarySearch(userID, string);
    setPageWords(list);
  }

  async function getWord(id) {
    let word = await waitor.fetchWordObj(userID, id);
    setWordObj(word);
  }

  async function getInfo() {
    let newInfo = await waitor.fetchUserInfo(userID);
    setInfo(newInfo);
  }

  async function changeUsername(user) {
    let op = await waitor.updateUsername(userID, user);
    if (op) {
      //update info
      await getInfo();
      //show toast
      showToast(4);
    } else {
      //handle exception
      showToast(5);
    }
  }

  async function deleteUser() {
    let op = await waitor.deleteUser(userID);
    if (op) {
      setPage(0);
      clearVars();
      showToast(6);
    } else {
      showToast(7);
    }
  }

  function DisplayContent() {
    switch(page) {
      case 0:
        return <Home lang={lang} strings={strings} logIn={logIn} createAccount={createAccount} loggedIn={userID == -1 ? false : true} />;
      break;
      case 1:
        return <Dictionary lang={lang} strings={strings} wordObj={wordObj} pageWords={pageWords} getPage={getPage} getWord={getWord} setWordObj={setWordObj} search={search} />;
      break;
      case 2:
        return <Sets lang={lang} strings={strings} />;
      break;
      case 3:
        return <Account lang={lang} strings={strings} info={info} logOut={logOut} getInfo={getInfo} changeUsername={changeUsername} deleteUser={deleteUser} />;
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
        <Nav.Link eventKey="3" onClick={() => setPage(2)}>{strings.sets_title[lang]}</Nav.Link>
        <Nav.Link eventKey="4" onClick={() => setPage(3)}>{strings.user_title[lang]}</Nav.Link>
      </>
    );
  }

  return (
    <Container fluid style={{display: "block", height: "100%", width: "100%"}}>
      <Row>
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
          <Container>
            <Stack direction="horizontal">
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
            </Stack>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link eventKey="1" onClick={() => setPage(0)}>{strings.about_title[lang]}</Nav.Link>
                <Nav.Link eventKey="2" onClick={() => setPage(1)}>{strings.dictionary_title[lang]}</Nav.Link>
                <NavAccount />
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Toaster lang={lang} strings={strings} toast={toast} toastType={toastType} setToast={setToast} />
      </Row>
      <Row style={{height: "80vh", backgroundColor: "gray"}}>
        <Card style={{width: "90%", maxHeight: "100%", marginLeft: "auto", marginRight: "auto"}}>
          <DisplayContent />
        </Card>
      </Row>
      <Row style={{height: "10vh", backgroundColor: "#7cd4e2"}}>
        Ricardo Olazabal @ 2026 // {verStr}
      </Row>
    </Container>
  )
}

export default App