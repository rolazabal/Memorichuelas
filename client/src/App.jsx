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
  const verStr = "0.1.7";
  const [toast, setToast] = useState(false);
  //0 login s, 1 login f, 2 logout s, 3 create acc f, 4 username s, 5 username f, 6 acc del s, 7 acc del f
  const [toastType, setToastType] = useState(0);
  //language 0 = english; 1 = spanish
  const [lang, setLang] = useState(0);
  const alph = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  //user variables
  const [userID, setUserID] = useState(-1);
  const [info, setInfo] = useState(null);
  const [pageWords, setPageWords] = useState(null);
  const [wordObj, setWordObj] = useState(null);
  const [userSets, setUserSets] = useState(null);
  const [setObj, setSetObj] = useState(null);
  const [defaultSets, setDefaultSets] = useState(null);
  //server communicator
  const waitor = new Waitor();

  ///functions
  function showToast(type) {
    setToastType(type);
    setToast(true);
  }

  //helper method for logOut
  function clearVars() {
    setUserID(-1);
    setInfo(null);
    setPageWords(null);
    setWordObj(null);
    setUserSets(null);
    setDefaultSets(null);
    setSetObj(null);
  }
  
  async function logIn(user, pass) {
    let id = await waitor.fetchUserID(user, pass);
    if (id) {
      if (id != -1) {
        //successful log in toast
        setUserID(id);
        showToast(0);
        setPage(2);
      } else 
        showToast(1); //log in failed toast
    } else 
      showToast(9); //already logged in toast
  }

  async function logOut(supressToast) {
    await waitor.logOutUser(userID);
    setPage(0);
    clearVars();
    if (!supressToast)
      showToast(2); //successful log out toast
  }

  async function createAccount(user, pass) {
    let op = await waitor.createUser(user, pass);
    if (!op)
      showToast(3); //create fail
    else {
      if (op == -1)
        showToast(5); //username exists
      else
        logIn(user, pass);
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
    if (newInfo)
      setInfo(newInfo);
    else {
      showToast(8); //timedout toast
      logOut(true);
    }
  }

  async function changeUsername(user) {
    let op = await waitor.updateUsername(userID, user);
    if (op) {
      if (op == -1)
        showToast(5); //username exists
      else {
        await getInfo();
        showToast(4); //username updated
      }
    } else {
      showToast(8); //timedout toast
      logOut(true);
    }
  }

  async function deleteUser() {
    let op = await waitor.deleteUser(userID);
    if (op) {
      if (op == -1)
        showToast(7); //failure to delete
      else {
        setPage(0);
        clearVars();
        showToast(6); //user deleted
      }
    } else {
      showToast(8); //timed out toast
      logOut(true);
    }
  }

  function DisplayContent() {
    //manage user variables
    if (page != 1) {
      setPageWords(null);
      setWordObj(null);
    }
    if (page != 2) {
      setUserSets(null);
      setDefaultSets(null);
      setSetObj(null);
    }
    if (page != 3) 
      setInfo(null);
    //serve page contents
    switch(page) {
      case 0:
        return <Home lang={lang} strings={strings} logIn={logIn} createAccount={createAccount} loggedIn={userID == -1 ? false : true} />;
      break;
      case 1:
        if (pageWords == null) getPage(alph[0]);
        return <Dictionary lang={lang} strings={strings} wordObj={wordObj} pageWords={pageWords} getPage={getPage} getWord={getWord} setWordObj={setWordObj} search={search} alph={alph}/>;
      break;
      case 2:
        return <Sets lang={lang} strings={strings} userSets={userSets} defaultSets={defaultSets} setObj={setObj} />;
      break;
      case 3:
        if (info == null) getInfo();
        return <Account lang={lang} strings={strings} info={info} logOut={logOut} getInfo={getInfo} changeUsername={changeUsername} deleteUser={deleteUser} />;
      break;
      case 4:
        return <>Quiz Game</>;
      break;
      default:
        return <>Page index out of bounds.</>;
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