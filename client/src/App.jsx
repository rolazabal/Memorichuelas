import { useState, useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, Row } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Tome from './Strings.js';
import Home from './pages/Home.jsx';
import Account from './pages/Account.jsx';
import DictionaryWizard from './pages/DictionaryWizard.jsx';
import SetWizard from './pages/SetWizard.jsx';
import { LocContext } from './context/LocContext.jsx';
import { use } from 'react';
import { ToastContext } from './context/ToastContext.jsx';

function App() {

	const verStr = "0.1.9d";

	const pages = {
		HOME: 0,
		DICTIONARY: 1,
		SETS: 2,
		SETTINGS: 3,
		GAME: 4
	};

	const [page, setPage] = useState(pages.SETS);
	const [userID, setUserID] = useState(-1);

	const loadLocal = () => {
		console.log("reload");
		let id = localStorage.getItem('userID');
		let page = localStorage.getItem('page');
		if (id != null) {
			id = parseInt(id);
			setUserID(id);
		}
		if (page != null) {
			page = parseInt(page);
			setPage(page);
		}
	}

	window.onload = function() { loadLocal() };

	const { strings, setStrings } = useContext(LocContext);
	const { toasts, showToast } = useContext(ToastContext);
	
	const accAPI = 'http://localhost:5050/api/account';

	async function logIn(user, pass) {
		try {
			let res = await fetch(accAPI, {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({username: user, passkey: pass})
			});
			if (res.status == 200) {
				res = await res.json();
				let id = await res.user_id;
				setUserID(id);
				setPage(pages.SETS);
				localStorage.setItem('userID', id);
				showToast(toasts.LOGIN_S);
			} else {
				switch(res.status) {
					case 403:
						showToast(toasts.LOGIN_BLOCK);
						break;
					default:
						showToast(toasts.LOGIN_F);
						break;
				}
			}
		} catch(error) { showToast(toasts.ERR); }
	}

	async function logOut() {
		try {
			await fetch(accAPI + "/" + userID, {
				method: 'PUT'
			});
			setUserID(-1);
			localStorage.removeItem('userID');
			showToast(toasts.LOGOUT_S);
			setPage(pages.HOME);
		} catch(error) { showToast(toasts.ERR); }
	}
	
	async function deleteUser() {
                try {
                        let res = await fetch(accAPI + "/" + userID, {
                                method: 'DELETE'
                        });
                        if (res.status == 200) {
                                setUserID(-1);
				localStorage.removeItem('userID');
                                showToast(toasts.ACC_DEL_S);
				setPage(pages.HOME);
                        } else {
                                showToast(toasts.TIMEOUT);
                        }
                } catch(error) { showToast(toasts.ERR); }
        }

	async function createAccount(user, pass) {
		try {
			let res = await fetch(accAPI, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({username: user, passkey: pass})
			});
			if (res.status == 200)
				logIn(user, pass);
			else {
				res = await res.json();
				switch (res.msg) {
					case 'username is in use.':
						showToast(toasts.USERNAME_TAKEN);
						break;
					default:
						showToast(toasts.ACC_CREATE_F);
						break;
				}
			}
		} catch(error) { showToast(toasts.ERR); }
	}


	return (
		<Container fluid style={{display: "block", height: "100%", width: "100%"}}>
			<Row>
				<Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
					<Stack direction="horizontal">
						<Navbar.Brand>Memorichuelas</Navbar.Brand>
						<Dropdown>
							<Dropdown.Toggle id="lang-dropdown">
								<FontAwesomeIcon icon="fa-solid fa-earth-americas" />	
							</Dropdown.Toggle>
							<Dropdown.Menu>
								<Dropdown.Item onClick={(e) => setStrings(new Tome('spanish'))}>
									Espanol
								</Dropdown.Item>
								<Dropdown.Item onClick={(e) => setStrings(new Tome('english'))}>
									English
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</Stack>
					<Navbar.Toggle aria-controls="responsive-navbar-nav" />
					<Navbar.Collapse id="responsive-navbar-nav">
						<Nav className="me-auto" activeKey={page}>
							<Nav.Link eventKey={pages.HOME} onClick={() => setPage(pages.HOME)}>{strings.get('about_title')}</Nav.Link>
							<Nav.Link eventKey={pages.DICTIONARY} onClick={() => setPage(pages.DICTIONARY)}>{strings.get('dictionary_title')}</Nav.Link>
							{userID != -1 && <>
								<Nav.Link eventKey={pages.SETS} onClick={() => setPage(pages.SETS)}>{strings.get('sets_title')}</Nav.Link>
								<Nav.Link eventKey={pages.SETTINGS} onClick={() => setPage(pages.SETTINGS)}>{strings.get('user_title')}</Nav.Link>
							</>}
						</Nav>
					</Navbar.Collapse>
				</Navbar>
			</Row>
			<Row style={{height: "80vh", backgroundColor: "gray"}}>
				<Card style={{width: "90%", maxHeight: "100%", marginLeft: "auto", marginRight: "auto"}}>
					<Card.Body style={{overflow: "hidden", margin: ".5%"}}>
						{page == pages.HOME && <Home
							ID={userID}
							logIn={(name, pass) => logIn(name, pass)} 
							createAccount={(name, pass) => createAccount(name, pass)} 
						/>}
						{page == pages.DICTIONARY && <DictionaryWizard
							ID={userID}
						/>}
						{page == pages.SETS && <SetWizard
							ID={userID}
						/>}
						{page == pages.SETTINGS && <Account
							ID={userID}
							logOut={() => logOut()}
							del={() => deleteUser()}
						/>}
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
