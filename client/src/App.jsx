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

function App() {
  ///variables
  const pages = {
    HOME: 0,
    DICTIONARY: 1,
    SETS: 2,
    SETTINGS: 3,
    GAME: 4
  }
  const [page, setPage] = useState(pages.HOME);
  const verStr = "0.1.8d";
  //toasts
  const t_menu = {
    LOGIN_S: 0,
    LOGIN_F: 1,
    LOGOUT_S: 2,
    ACC_CREATE_F: 3,
    USERNAME_S: 4,
    USERNAME_F: 5,
    ACC_DEL_S: 6,
    ACC_DEL_F: 7,
    TIMEOUT: 8,
    LOGIN_BLOCK: 9,
    ERR: 10,
    SET_CREATE_S: 11,
    SET_DEL_S: 12,
    SET_NAME_S: 13,
    SET_WORDS_S: 14
  };
  const [toast, setToast] = useState(false);
  const [toastType, setToastType] = useState(t_menu.LOGIN_S);
  //language: 0 = english, 1 = spanish
  const [lang, setLang] = useState(0);
  const alph = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
    'Y', 'Z'
  ];
  //user variables
  const [data, setData] = useState({
    userID: -1,
    info: null,
    pageWords: null,
    wordObj: null,
    userSets: null,
    setObj: null,
  });
  //server communicator
  const waitor = new Waitor();

  ///functions
  function persistentUser() {
    let id = localStorage.getItem('userID');
    if (id == null) return;
    id = parseInt(id);
    setData({
      ...data,
      userID: id
    });
  }

  window.onload = () => {
    persistentUser();
  }

  function loggedIn() {
    return (data.userID != -1);
  }

  function setWordObj(word) {
    setData({
      ...data,
      wordObj: word
    });
  }

  function clearData() {
    setData({
      ...data,
      userID: -1,
      info: null,
      pageWords: null,
      wordObj: null,
      userSets: null,
      setObj: null,
    });
    localStorage.removeItem('userID');
  }

  function showToast(type) {
    setToastType(type);
    setToast(true);
  }
  
  async function logIn(user, pass) {
    let [id, error] = await waitor.fetchUserID(user, pass);
    if (error) {
      showToast(t_menu.ERR);
      return;
    }
    if (id) {
      if (id != -1) {
        setData({
          ...data,
          userID: id
        });
        localStorage.setItem('userID', '' + id);
        showToast(t_menu.LOGIN_S);
        setPage(pages.SETS);
      } else 
        showToast(t_menu.LOGIN_F);
    } else 
      showToast(t_menu.LOGIN_BLOCK);
  }

  async function logOut(supressToast) {
    let [res, error] = await waitor.logOutUser(data.userID);
    if (error) {
      showToast(t_menu.ERR);
      return;
    }
    setPage(pages.HOME);
    clearData();
    if (!supressToast)
      showToast(t_menu.LOGOUT_S);
  }

  async function createAccount(user, pass) {
    let [op, error] = await waitor.createUser(user, pass);
    if (error) {
      showToast(t_menu.ERR);
      return;
    }
    if (!op)
      showToast(t_menu.ACC_CREATE_F);
    else {
      if (op == -1)
        showToast(t_menu.USERNAME_F);
      else
        logIn(user, pass);
    }
  }

  async function getPage(letter) {
    let [list, error] = await waitor.fetchDictPage(data.userID, letter);
    if (error) {
      showToast(t_menu.ERR);
      return;
    }
    setData({
      ...data,
      pageWords: list
    });
  }

  async function search(string) {
    let [list, error] = await waitor.dictionarySearch(data.userID, string);
    if (error) {
      showToast(t_menu.ERR);
      return;
    }
    setData({
      ...data,
      pageWords: list
    });
  }

  async function getWord(id) {
    let [word, error] = await waitor.fetchWordObj(data.userID, id);
    if (error) {
      showToast(t_menu.ERR);
      return;
    }
    setData({
      ...data,
      wordObj: word
    });
  }

  async function getInfo() {
    let [newInfo, error] = await waitor.fetchUserInfo(data.userID);
    if (error) {
      showToast(t_menu.ERR);
      return;
    }
    if (newInfo) {
      setData({
        ...data,
        info: newInfo
      });
    } else {
      showToast(t_menu.TIMEOUT);
      logOut(true);
    }
  }

  async function changeUsername(user) {
    let [op, error] = await waitor.updateUsername(data.userID, user);
    if (error) {
      showToast(t_menu.ERR);
      return;
    }
    if (op) {
      if (op == -1)
        showToast(t_menu.USERNAME_F);
      else {
        await getInfo();
        showToast(t_menu.USERNAME_S);
      }
    } else {
      showToast(t_menu.TIMEOUT);
      logOut(true);
    }
  }

  async function deleteUser() {
    let [op, error] = await waitor.deleteUser(data.userID);
    if (error) {
      showToast(t_menu.ERR);
      return;
    }
    if (op) {
      if (op == -1)
        showToast(t_menu.ACC_DEL_F);
      else {
        setPage(pages.HOME);
        clearData();
        showToast(t_menu.ACC_DEL_S);
      }
    } else {
      showToast(t_menu.TIMEOUT);
      logOut(true);
    }
  }

  async function getSets(setList) {
	if (setList) {
		setData({
			...data,
			userSets: setList
		});
		return;
	}
    let [sets, error] = await waitor.fetchUserSets(data.userID);
    if (error) {
      showToast(t_menu.ERR);
      return;
    }
    if (sets) {
      setData({
        ...data,
        userSets: sets
      });
    } else {
      showToast(t_menu.TIMEOUT);
      logOut(true);
    }
  }

  async function setSetObj(id) {
    if (!id) {
      setData({
        ...data,
        setObj: null
      });
      return;
    }
    let [set, error] = await waitor.fetchSetObj(data.userID, id);
    if (error) {
      showToast(t_menu.ERR);
      return;
    }
    if (set) {
      setData({
        ...data,
        setObj: set
      });
    } else {
      showToast(t_menu.TIMEOUT);
      logOut(true);
    }
  }

  async function setSetWords(id, words) {
    let [set, error] = await waitor.updateSetWords(data.userID, id, words);
    if (error) {
      showToast(t_menu.ERR);
      return;
    }
    if (set) {
      setData({
        ...data,
        setObj: set
      });
      showToast(t_menu.SET_WORDS_S);
    } else {
      showToast(t_menu.TIMEOUT);
      logOut(true);
    }
  }

  async function createSet(name) {
    let [set, error] = await waitor.createSet(data.userID, name);
    if (error) {
      showToast(t_menu.ERR);
      return;
    }
    if (set) {
      await getSets();
      /*setData({
        ...data,
        setObj: set
      });*/
      showToast(t_menu.SET_CREATE_S);
    } else {
      showToast(t_menu.TIMEOUT);
      logOut(true);
    }
  }

  async function deleteSet(id) {
    console.log(id);
    let [sets, error] = await waitor.deleteSet(data.userID, id);
    if (error) {
      showToast(t_menu.ERR);
      return;
    }
    if (sets) {
      setData({
        ...data,
        userSets: sets
      });
      showToast(t_menu.SET_DEL_S);
    } else {
      showToast(t_menu.TIMEOUT);
      logOut(true);
    }
  }

  async function setSetName(id, name) {
    let [set, error] = await waitor.updateSetName(data.userID, id, name);
    if (error) {
      showToast(t_menu.ERR);
      return;
    }
    if (set) {
      setData({
        ...data,
        setObj: set
      });
      showToast(t_menu.SET_NAME_S);
    } else {
      showToast(t_menu.TIMEOUT);
      logOut(true);
    }
  }

  function DisplayContent() {
    //serve page contents
    switch(page) {
      case pages.HOME:
        return <Home lang={lang} strings={strings} logIn={logIn} createAccount={createAccount} loggedIn={loggedIn()} />;
      case pages.DICTIONARY:
        if (data.pageWords == null) 
          getPage(alph[0]);
        return <Dictionary lang={lang} strings={strings} wordObj={data.wordObj} pageWords={data.pageWords} setWordObj={setWordObj} getPage={getPage} getWord={getWord} search={search} alph={alph}/>;
      case pages.SETS:
        if (data.userSets == null)
            getSets();
        return <Sets lang={lang} strings={strings} userSets={data.userSets} setObj={data.setObj} getSets={getSets} setSetObj={setSetObj} createSet={createSet} deleteSet={deleteSet} setSetName={setSetName} setSetWords={setSetWords} />;
      case pages.SETTINGS:
        if (data.info == null)
          getInfo();
        return <Account lang={lang} strings={strings} info={data.info} logOut={logOut} getInfo={getInfo} changeUsername={changeUsername} deleteUser={deleteUser} />;
      case pages.GAME:
        return <>Quiz Game</>;
      default:
        return <>Page index out of bounds.</>;
    }
  }

  function NavAccount() {
    if (!loggedIn()) return;
    return(
      <>
        <Nav.Link eventKey="3" onClick={() => setPage(pages.SETS)}>{strings.sets_title[lang]}</Nav.Link>
        <Nav.Link eventKey="4" onClick={() => setPage(pages.SETTINGS)}>{strings.user_title[lang]}</Nav.Link>
      </>
    );
  }

  console.log(data);

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
                <Nav.Link eventKey="1" onClick={() => setPage(pages.HOME)}>{strings.about_title[lang]}</Nav.Link>
                <Nav.Link eventKey="2" onClick={() => setPage(pages.DICTIONARY)}>{strings.dictionary_title[lang]}</Nav.Link>
                <NavAccount />
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Toaster lang={lang} strings={strings} toast={toast} t_menu={t_menu} toastType={toastType} setToast={setToast} />
      </Row>
      <Row style={{height: "80vh", backgroundColor: "gray"}}>
        <Card style={{width: "90%", maxHeight: "100%", marginLeft: "auto", marginRight: "auto"}}>
          <Card.Body style={{overflow: "hidden", margin: ".5%"}}>  
            <DisplayContent />
          </Card.Body>
        </Card>
      </Row>
      <Row style={{height: "10vh", backgroundColor: "#7cd4e2"}}>
        Ricardo Olazabal @ 2026 // {verStr}
      </Row>
    </Container>
  )
}

export default App
