import { useState, useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, Row } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';

import Tome from './Strings.js';
import Home from './pages/Home.jsx';
import Account from './pages/Account.jsx';
import Dictionary from './pages/Dictionary.jsx';
import SetWizard from './pages/SetWizard.jsx';
import { LocContext } from './context/LocContext.jsx';
import { use } from 'react';
import { ToastContext } from './context/ToastContext.jsx';

function App() {

	const verStr = "0.1.8d";

	const accAPI = 'http://localhost:5050/api/account';

	const { toasts, showToast } = useContext(ToastContext);

	async function logIn(user, pass) {
		try {
			let res = await fetch(accAPI, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({action: 'logIn', username: user, passkey: pass})
			});
			if (res.status < 300) {
				res = await res.json();
				let id = await res.ID;
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
		} catch(error) {
			showToast(toasts.ERR);
		}
	}

	async function logOut(silent) {
		try {
			await fetch(accAPI, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({action: 'logOut', userID: userID})
			});
			setUserID(-1);
			localStorage.removeItem('userID');
			if (!silent)
				showToast(toasts.LOGOUT_S);
		} catch(error) {
			showToast(toasts.ERR);
		}
	}

	async function createAccount(user, pass) {
		try {
			let res = await fetch(accAPI, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({action: 'create', username: user, passkey: pass})
			});
			if (res.status < 300)
				logIn(user, pass);
			else {
				if (res.json().error == 'username already exists!') {
					showToast(toasts.USERNAME_F);
				} else
					showToast(toasts.ACC_CREATE_F);
			}
		} catch(error) {
			showToast(toasts.ERR);
		}
	}

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

	const [fakeSet, setFakeSet] = useState({
		setID: 300,
		name: "comidas",
		score: 0.25,
		words: [
			{
				wordID: 500,
				name: "A",
				score: 1.00
			},
			{
				wordID: 444,
				name: "B",
				score: 0.25
			}
		]
	});

	const [fakeSetList, setFakeSetList] = useState([
		{
			setID: 300,
			name: "comidas",
			score: 0.25
		},
		{
			setID: 301,
			name: "frases",
			score: 1.00
		}
	]);

	return (
		<Container fluid style={{display: "block", height: "100%", width: "100%"}}>
			<Row>
				<Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
					<Stack direction="horizontal">
						<Navbar.Brand>Memorichuelas</Navbar.Brand>
						<Dropdown>
							<Dropdown.Toggle id="lang-dropdown">
								{strings.get('language')}
							</Dropdown.Toggle>
							<Dropdown.Menu>
								<Dropdown.Item onClick={() => setStrings(new Tome('spanish'))}>
									Espanol
								</Dropdown.Item>
								<Dropdown.Item onClick={() => setStrings(new Tome('english'))}>
									English
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</Stack>
					<Navbar.Toggle aria-controls="responsive-navbar-nav" />
					<Navbar.Collapse id="responsive-navbar-nav">
						<Nav className="me-auto">
							<Nav.Link eventKey="1" onClick={() => setPage(pages.HOME)}>{strings.get('about_title')}</Nav.Link>
							<Nav.Link eventKey="2" onClick={() => setPage(pages.DICTIONARY)}>{strings.get('dictionary_title')}</Nav.Link>
							{userID != -1 && <>
								<Nav.Link eventKey="3" onClick={() => setPage(pages.SETS)}>{strings.get('sets_title')}</Nav.Link>
								<Nav.Link eventKey="4" onClick={() => setPage(pages.SETTINGS)}>{strings.get('user_title')}</Nav.Link>
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
						{page == pages.DICTIONARY && <Dictionary
							ID={userID}
						/>}
						{page == pages.SETS && <SetWizard
							ID={userID}
						/>}
						{page == pages.SETTINGS && <Account
							ID={userID}
							logOut={() => logOut(false)}
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