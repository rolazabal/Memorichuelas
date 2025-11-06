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

	function get() {
		setSet(fakeSet);
	}

	function deleteSet() {
		try {
			let res = fetch(api + "/" + ID + "/" + sID, {
				method: 'DELETE'
			});
			if (res.status == 403) {
				showToast(toasts.TIMEOUT);
				return;
			}
			showToast(toasts.SEL_DEL_S);
			close();
		} catch(error) { showToast(toasts.ERR); }
	}

	function rename(name) {
		try {
			let res = fetch(api + "/" + ID + "/" + sID, {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({name: name})
			});
			if (res == 403) {
				showToast(toasts.ERR);
				return;
			}
			res = res.json();
			let set = res.set;
			setSet(set);
			showToast(toasts.SET_NAME_S);
		} catch(error) { showToast(toasts.ERR); }
	}

	function removeWord() {
		;
	}

	useEffect(() => {
		get();
	}, []);

	if (set == null) return;
	return(
		<>
			<Row>
				<Stack direction='horizontal'>
					<Card.Title>{set.name}</Card.Title>
					<Button variant="secondary" className="ms-auto" onClick={close}>{strings.get("back")}</Button>
				</Stack>
			</Row>
			<Row>
				<p style={{fontSize: "2em"}}>
					{set.words.map((word) => <>
						<a onClick={() => view(word.word_id)}>{word.name}</a>
						<FontAwesomeIcon icon="fa-solid fa-trash" onClick={() => removeWord(word.word_id)} />{", "} 
					</>)}
					<FontAwesomeIcon icon="fa-solid fa-plus" onClick={add} />
				</p>
			</Row>
			<Row>
				<Stack direction='horizontal'>
					<Button variant="danger" style={{width: "33%"}} onClick={() => deleteSet()}>{strings.get("delete")}</Button>
					<h2 style={{width: "33%"}}>score: {set.score}</h2>
					<Button style={{width: "33%"}}>{strings.get("play")}</Button>
				</Stack>
			</Row>
		</>
	);
}

export default Set
