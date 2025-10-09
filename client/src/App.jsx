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
	// const dictAPI = 'http://localhost:5050/api/dictionary';
	const setAPI = 'http://localhost:5050/api/sets';

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
				updateData({userID: id, page: pages.SETS});
				showToast(toasts.LOGIN_S);
				localStorage.setItem('userID', id);
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
                body: JSON.stringify({action: 'logOut', userID: data.userID})
            });
			clearData();
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

	async function deleteAccount() {
        try {
            let res = await fetch(accAPI, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'delete', userID: data.userID})
            });
            if (res.status < 300) {
				clearData();
				showToast(toasts.ACC_DEL_S);
            } else {
				showToast(toasts.TIMEOUT);
				logOut(true);
			}
        } catch(error) {
            showToast(toasts.ERR);
        }
    }

	async function getInfo() {
        try {
            let res = await fetch(accAPI, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'info', userID: data.userID})
            });
            if (res.status < 300) {
                res = await res.json();
                let obj = res.info;
                updateData({info: obj});
            } else
                showToast(toasts.TIMEOUT);
				logOut(true);
        } catch(error) {
            showToast(toasts.ERR);
        }
    }

	async function updateUsername(user) {
        try {
            let res = await fetch(accAPI, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'updateName', userID: data.userID, username: user})
            });
            if (res.status < 300) {
				await getInfo();
				showToast(toasts.USERNAME_S);
			} else {
                if (res.status == 403) {
					showToast(toasts.TIMEOUT);
					logOut(true);
				}
                showToast(toasts.USERNAME_F);
            }
        } catch(error) {
			showToast(toasts.ERR);
        }
    }

	/*
	async function getPage(letter) {
		try {
            let res = await fetch(dictAPI, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'page', letter: letter.toLowerCase(), userID: data.userID})
            });
            res = await res.json();
			let list = res.words;
			updateData({pageWords: list});

        } catch(error) {
            showToast(toasts.ERR);
        }
	}

	async function search(string) {
		try {
            let res = await fetch(dictAPI, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'search', string: string, userID: data.userID})
            });
            res = await res.json();
			let list = res.words;
            updateData({pageWords: list});
        } catch(error) {
            showToast(toasts.ERR);
        }
	}

	async function getWord(wID) {
		try {
            let res = await fetch(dictAPI, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'word', wordID: wID, userID: data.userID})
            });
            res = await res.json();
			let obj = res.word;
			updateData({wordObj: obj});
            return [res.word, false];
        } catch(error) {
            showToast(toasts.ERR);
        }
	}*/

	async function getSets() {
		try {
            let res = await fetch(setAPI, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'sets', userID: data.userID})
            });
            if (res.status < 300) {
                res = await res.json();
				let list = res.sets;
				updateData({userSets: list});
            }
            showToast(toasts.TIMEOUT);
			logOut(true);
        } catch(error) {
            showToast(toasts.ERR);
        }
	}

	async function getSet(sID) {
		updateData({setObj: fakeSet});
		try {
            let res = await fetch(setAPI, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'set', setID: sID, userID: data.userID})
            });
            if (res.status < 300) {
                res = await res.json();
				let obj = res.set;
				updateData({setObj: obj});
            }
            showToast(toasts.TIMEOUT);
			logOut(true);
        } catch(error) {
            showToast(toasts.ERR);
        }
	}

	async function changeSetWords(sID, words) {
		try {
            let res = await fetch(setAPI, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'updateWords', setID: sID, words: words, userID: data.userID})
            });
            if (res.status < 300) {
                res = await res.json();
				let obj = res.set;
				updateData({setObj: obj});	
				showToast(toasts.SET_WORDS_S);
            }
            showToast(toasts.TIMEOUT);
			logOut(true);
        } catch(error) {
            showToast(toasts.ERR);
        }
	}

	async function createSet(name) {
		let temp = fakeSet;
		temp = {...temp, name: name};
		setFakeSetList([...fakeSetList, temp]);
        try {
            let res = await fetch(setAPI, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'create', name: name, userID: data.userID})
            });
            if (res.status < 300) {
                res = await res.json();
				let obj = res.set;
                updateData({setObj: obj});
				showToast(toasts.SET_CREATE_S);
            }
            showToast(toasts.TIMEOUT);
			logOut(true);
        } catch(error) {
            showToast(toasts.ERR);
        }
	}

	async function deleteSet(sID) {
        try {
            let res = await fetch(setAPI, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'delete', setID: sID, userID: data.userID})
            });
            if (res.status < 300) {
                res = await res.json();
				let list = res.sets;
				updateData({userSets: list});
				showToast(toasts.SET_DEL_S);
            }
            showToast(toasts.TIMEOUT);
			logOut(true);
        } catch(error) {
            showToast(toasts.ERR);
        }
	}

	async function changeSetName(sID, name) {
        try {
            let res = await fetch(setAPI, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'updateName', setID: sID, name: name, userID: data.userID})
            });
            if (res.status < 300) {
                res = await res.json();
				let obj = res.set;
				updateData({setObj: obj});
				showToast(toasts.SET_NAME_S);
            }
            showToast(toasts.TIMEOUT);
			logOut(true);
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

	const [data, setData] = useState({
		userID: -1,
		info: null,
//		pageWords: null,
//		wordObj: null,
		userSets: null,
		setObj: null
	});
	const updateData = (fields) => { setData({...data, ...fields}); };
	const clearData = () => {
		updateData({
			userID: -1,
			info: null,
//			pageWords: null,
//			wordObj: null,
			userSets: null,
			setObj: null
		});
		localStorage.removeItem('userID');
	}
	const loadLocal = () => {
		console.log("reload");
		let id = localStorage.getItem('userID');
		let page = localStorage.getItem('page');
		if (id != null) {
			id = parseInt(id);
			updateData({userID: id});
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
							{data.userID != -1 &&
								<>
									<Nav.Link eventKey="3" onClick={() => setPage(pages.SETS)}>{strings.get('sets_title')}</Nav.Link>
									<Nav.Link eventKey="4" onClick={() => setPage(pages.SETTINGS)}>{strings.get('user_title')}</Nav.Link>
								</>
							}
						</Nav>
					</Navbar.Collapse>
				</Navbar>
			</Row>
			<Row style={{height: "80vh", backgroundColor: "gray"}}>
				<Card style={{width: "90%", maxHeight: "100%", marginLeft: "auto", marginRight: "auto"}}>
					<Card.Body style={{overflow: "hidden", margin: ".5%"}}>
						{page == pages.HOME &&
							<Home 
								logIn={async (name, pass) => logIn(name, pass)} 
								createAccount={async (name, pass) => createAccount(name, pass)} 
								ID={data.userID}
							/>
						}
						{page == pages.DICTIONARY &&
							<Dictionary
								ID={data.userID}
							/>
						}
						{page == pages.SETS &&
							<SetWizard 
								sets={fakeSetList}
								set={data.setObj}
								getSets={getSets}
								getSet={getSet}
								close={() => updateData({setObj: null})}
								createSet={createSet}
								deleteSet={deleteSet}
								changeName={changeSetName}
								changeSetWords={changeSetWords}
							/>
						}
						{page == pages.SETTINGS &&
							<Account 
								info={data.info} 
								getInfo={getInfo}
								logOut={() => logOut(false)}
								changeUsername={updateUsername}
								deleteAccount={deleteAccount}
							/>
						}
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