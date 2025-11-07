import { createContext, useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, ListGroup, Row, Col } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { LocContext } from './../context/LocContext.jsx';
import { ToastContext } from './../context/ToastContext.jsx';

function Set({ID, sID, close, add, view, api}) {
	
	const [set, setSet] = useState(null);
	const [fakeSet, setFakeSet] = useState({
                setID: 300,
                name: "comidas",
                score: 0.25,
                words: [
                        {
                                word_id: 500,
                                name: "A",
                                score: 1.00
                        },
                        {
                                word_id: 444,
                                name: "B",
                                score: 0.25
                        }
                ]
        });

	const { strings } = useContext(LocContext);
	const { toasts, showToast } = useContext(ToastContext);

	async function getSet() {
		try {
			let res = await fetch(api + '/' + ID + '/' + sID, {
					method: 'GET'
			});
			if (res.status == 200) {
				res = await res.json();
				let set = res.set;
				console.log(set);
				setSet(set);
			} else if (res.status == 403) {
				showToast(toasts.TIMEOUT);
			}
		} catch(error) { showToast(toasts.ERR); }
	}

	async function deleteSet() {
		try {
			let res = await fetch(api + "/" + ID + "/" + sID, {
				method: 'DELETE'
			});
			if (res.status == 403) {
				showToast(toasts.TIMEOUT);
				return;
			}
			res = await res.json();
			showToast(toasts.SEL_DEL_S);
			close();
		} catch(error) { showToast(toasts.ERR); }
	}

	async function rename(name) {
		try {
			let res = await fetch(api + "/" + ID + "/" + sID + "/name", {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({name: name})
			});
			res = await res.json();
			if (res.status == 403) {
				showToast(toasts.ERR);
				return;
			} else if (res.status == 400) {
				showToast(toasts.ERR);
				return;
			}
			setSet(null);
			showToast(toasts.SET_NAME_S);
		} catch(error) { showToast(toasts.ERR); }
	}

	async function addWord(w_id) {
		try {
			let res = await fetch(api + '/' + ID + '/' + sID + '/word', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({word_id: w_id})
			});
		} catch(error) { showToast(toasts.ERR); }
	}

	async function removeWord(w_id) {
		try {
			let res = await fetch(api + '/' + ID + '/' + sID + '/' + w_id, {
				method: 'DELETE'
			});
			if (res.status == 200) {
				res = await res.json();
				setSet(null);
			} else if (res.status == 403) {
				showToast(toasts.TIMEOUT);
			}
		} catch(error) { showToast(toasts.ERR); }
	}

	useEffect(() => {
		if (set == null)
			getSet();
	}, [set]);

	return(
		<>
		{set != null && <>
			<Row style={{height: "6%"}}>
				<Stack direction='horizontal'>
					<Card.Title>{set.name}</Card.Title>
					<Button variant="secondary" className="ms-auto" onClick={close}>{strings.get("back")}</Button>
				</Stack>
			</Row>
			<Row style={{height: "88%"}}>
				<p style={{fontSize: "1.5em"}}>
					{set.words.map((word) => <>
						<a onClick={() => view(word.word_id)}>{word.name}</a>
						<FontAwesomeIcon icon="fa-solid fa-trash" onClick={() => removeWord(word.word_id)} />{", "} 
					</>)}
					<FontAwesomeIcon icon="fa-solid fa-plus" onClick={add} />
				</p>
			</Row>
			<Row style={{height: "6%"}}>
				<Stack direction='horizontal'>
					<Button variant="danger" style={{width: "33%"}} onClick={() => deleteSet()}>{strings.get("delete")}</Button>
					<h2 style={{width: "33%"}}>{strings.get("score")}: {set.score}</h2>
					<Button variant="success" style={{width: "33%"}}>{strings.get("play")}</Button>
				</Stack>
			</Row>
		</>}</>
	);
}

export default Set
