import { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, Row } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Tome from './context/Strings.js';
import Home from './pages/Home.jsx';
import Account from './pages/Account.jsx';
import DictionaryWizard from './pages/DictionaryWizard.jsx';
import SetWizard from './pages/SetWizard.jsx';
import { LocContext } from './context/LocContext.jsx';
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

	const [page, setPage] = useState(pages.HOME);
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
	const { showToast } = useContext(ToastContext);
	
	const accAPI = 'http://localhost:5050/api/account';

	async function logOut() {
		setUserID(-1);
		localStorage.removeItem('userID');
		changePage(pages.HOME);
		try {
			await fetch(accAPI + "/" + userID, {
				method: 'PUT'
			});
			showToast("success", "t_logout_success");
		} catch(error) { 
			showToast("danger", "t_error");
		}
	}
	
	async function deleteUser() {
		setUserID(-1);
		localStorage.removeItem('userID');
		changePage(pages.HOME);
		try {
			let res = await fetch(accAPI + "/" + userID, {
				method: 'DELETE'
			});
			if (res.status == 200) {
				showToast("success", "t_delete_acc_success");
			} else {
				showToast("danger", "t_user_timed_out");
			}
		} catch(error) { 
			showToast("danger", "t_error");
		}
	}

	function changePage(p) {
		setPage(p);
		localStorage.setItem('page', p);
	}

	return (
		<Container fluid style={{display: "block", height: "100%", width: "100%"}}>
			<Row>
				<Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
					<Stack direction="horizontal">
						<Navbar.Brand>Memorichuelas</Navbar.Brand>
						<Dropdown>
							<Dropdown.Toggle id="lang-dropdown" title={strings.get("language")}>
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
							<Nav.Link eventKey={pages.HOME} onClick={() => changePage(pages.HOME)}>{strings.get('about_title')}</Nav.Link>
							<Nav.Link eventKey={pages.DICTIONARY} onClick={() => changePage(pages.DICTIONARY)}>{strings.get('dictionary_title')}</Nav.Link>
							{userID != -1 && <>
								<Nav.Link eventKey={pages.SETS} onClick={() => changePage(pages.SETS)}>{strings.get('sets_title')}</Nav.Link>
								<Nav.Link eventKey={pages.SETTINGS} onClick={() => changePage(pages.SETTINGS)}>{strings.get('user_title')}</Nav.Link>
							</>}
						</Nav>
					</Navbar.Collapse>
				</Navbar>
			</Row>
			<Row style={{height: "80vh", backgroundColor: "#7cd4e2"}}>
				<Card style={{width: "90%", maxHeight: "100%", marginLeft: "auto", marginRight: "auto"}}>
					<Card.Body style={{overflow: "hidden", margin: ".5%"}}>
						{page == pages.HOME && <Home
							ID={userID}
							setID={setUserID}
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
							logOut={logOut}
							del={deleteUser}
						/>}
					</Card.Body>
				</Card>
			</Row>
			<Row style={{height: "10vh", backgroundColor: "#7cd4e2"}}>
				<p>{verStr} @ 2026 Ricardo Olazabal - <a href="https://github.com/rolazabal">github.com/rolazabal</a></p>
			</Row>
		</Container>
	)
}

export default App
