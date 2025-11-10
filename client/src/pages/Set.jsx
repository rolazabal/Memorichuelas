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
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { LocContext } from './../context/LocContext.jsx';
import { ToastContext } from './../context/ToastContext.jsx';

function Set({ID, sID, close, add, view, api}) {
	
	const [set, setSet] = useState(null);
	const [deleteModal, setDeleteModal] = useState(false);
	const [nameModal, setNameModal] = useState(false);

	const { strings } = useContext(LocContext);
	const { toasts, showToast } = useContext(ToastContext);

	const handleName = (data) => {
		;
	};

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
			} else {
				showToast(toasts.ERR);
			}
		} catch(error) { showToast(toasts.ERR); }
	}

	async function deleteSet() {
		try {
			let res = await fetch(api + "/" + ID + "/" + sID, {
				method: 'DELETE'
			});
			if (res.status == 200) {
				res = await res.json();
				showToast(toasts.SEL_DEL_S);
				close();
			} else if (res.status == 403) {
				showToast(toasts.TIMEOUT);
			} else {
				showToast(toasts.ERR);
			}
		} catch(error) { showToast(toasts.ERR); }
	}

	async function rename(name) {
		try {
			let res = await fetch(api + "/" + ID + "/" + sID + "/name", {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({name: name})
			});
			if (res.status == 200) {
				res = await res.json();
				setSet(null);
				showToast(toasts.SET_NAME_S);
			} else if (res.status == 403) {
				showToast(toasts.ERR);
			} else {
				showToast(toasts.ERR);
			}
		} catch(error) { showToast(toasts.ERR); }
	}

	async function addWord(w_id) {
		try {
			let res = await fetch(api + '/' + ID + '/' + sID + '/word', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({word_id: w_id})
			});
			if (res.status == 200) {
				res = await res.json();	
			} else if (res.status == 403) {
				showToast(toasts.TIMEOUT);
			} else {
				showToast(toasts.ERR);
			}
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
			} else {
				showToast(toasts.ERR);
			}
		} catch(error) { showToast(toasts.ERR); }
	}

	useEffect(() => {
		if (set == null)
			getSet();
	}, [set]);

	return(<>
		{set != null && <>
			<Row style={{height: "15%"}}>
				<Stack direction='horizontal'>
					<Card.Title>{set.name}</Card.Title>
					<Button title="change name">
						<FontAwesomeIcon icon="fa-solid fa-pencil" />
					</Button>
					<Button variant="secondary" className="ms-auto" onClick={close}>{strings.get("back")}</Button>
				</Stack>
			</Row>
			<Row style={{height: "68%"}}>
				<p style={{fontSize: "1.3em"}}>
					{set.words.map((word) => <>
						<a onClick={() => view(word.word_id)}>{word.name}</a>
						<Button variant="light" title={strings.get("delete")} onClick={() => removeWord(word.word_id)}>
							<FontAwesomeIcon icon="fa-solid fa-trash" />
						</Button>{", "} 
					</>)}
					<Button variant="light" title={strings.get("add")} onClick={add}>
						<FontAwesomeIcon icon="fa-solid fa-plus" />
					</Button>
				</p>
			</Row>
			<hr />
			<Row style={{height: "10%"}}>
				<Stack direction='horizontal'>
					<Button variant="danger" style={{width: "33%"}} onClick={() => deleteSet()}>{strings.get("delete")}</Button>
					<p style={{width: "33%", fontSize: "1.3em"}}>{strings.get("score")}: {set.score}</p>
					<Button variant="success" style={{width: "33%"}}>{strings.get("play")}</Button>
				</Stack>
			</Row>
		</>}
		<Modal
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
			show={!nameModal && deleteModal}
			onHide{() => setDeleteModal(false)}
		>
			<Modal.Header closeButton>
				<Modal.Title>
					Title
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				Body
			</Modal.body>
			<Modal.Footer>
				<Button>
				</Button>
			</Modal.Footer>
		</Modal>
		<Modal
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
			show={!deleteModal && nameModal}
			onHide{() => setNameModal(false)}
		>
			<Modal.Header closeButton>
				<Modal.Title>
					Title
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				Body
			</Modal.body>
			<Modal.Footer>
				<Button>
				</Button>
			</Modal.Footer>
		</Modal>
	</>);
}

export default Set
