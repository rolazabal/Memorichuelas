import { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { LocContext } from './../context/LocContext.jsx';
import { ToastContext } from './../context/ToastContext.jsx';

function Set({ID, sID, close, add, view, api}) {
	
	const [set, setSet] = useState(null);
	const [deleteModal, setDeleteModal] = useState(false);
	const [nameModal, setNameModal] = useState(false);
	const [shareModal, setShareModal] = useState(false);

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
                    {!set.isOfficial && <>
					    <Button title={strings.get("rename")} onClick={() => setNameModal(true)}>
						    <FontAwesomeIcon icon="fa-solid fa-pencil" />
					    </Button>
					    <Button title={strings.get("share")} onClick={() => setShareModal(true)}>
						    <FontAwesomeIcon icon="fa-solid fa-share-nodes" />
					    </Button>
                    </>}
					<Button variant="secondary" className="ms-auto" onClick={close}>{strings.get("back")}</Button>
				</Stack>
			</Row>
			<Row style={{height: "68%"}}>
				<p style={{fontSize: "1.3em"}}>
					{set.words.map((word, index, words) => <>
						<a onClick={() => view(word.word_id)}>{word.name}</a>
						{!set.isOfficial && <Button variant="light" title={strings.get("delete")} onClick={() => removeWord(word.word_id)}>
							<FontAwesomeIcon icon="fa-solid fa-trash" />
						</Button>}
                        {words.length - 1 != index && ", "} 
					</>)}
					{!set.isOfficial && <Button variant="light" title={strings.get("add")} onClick={add}>
						<FontAwesomeIcon icon="fa-solid fa-plus" />
					</Button>}
				</p>
			</Row>
			<hr />
			<Row style={{height: "10%"}}>
				<Stack direction='horizontal'>
					{!set.isOfficial && <Button variant="danger" style={{width: "33%"}} onClick={() => setDeleteModal(true)}>
                        {strings.get("delete")}
                    </Button>}
					<p style={{width: "33%", fontSize: "1.3em"}}>{strings.get("score")}: {set.score}</p>
					<Button variant="success" style={{width: "33%"}}>{strings.get("play")}</Button>
				</Stack>
			</Row>
		</>}
		<Modal
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
			show={!nameModal && !shareModal && deleteModal}
			onHide={() => setDeleteModal(false)}
		>
			<Modal.Header closeButton>
				<Modal.Title>
					{strings.get("user_delete_text")}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{strings.get("set_delete_blurb")}
			</Modal.Body>
			<Modal.Footer>
				<Button variant="danger" onClick={() => deleteSet()}>
					{strings.get("delete")}
				</Button>
			</Modal.Footer>
		</Modal>
		<Modal
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
			show={!deleteModal && !shareModal && nameModal}
			onHide={() => setNameModal(false)}
		>
			<Modal.Header closeButton>
				<Modal.Title>
					{strings.get("set_rename_text")}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				Body
			</Modal.Body>
			<Modal.Footer>
				<Button>
					{strings.get("rename")}
				</Button>
			</Modal.Footer>
		</Modal>
		<Modal
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
			show={!deleteModal && !nameModal && shareModal}
			onHide={() => setShareModal(false)}
		>
			<Modal.Header closeButton>
				<Modal.Title>
					{strings.get("set_share_text")}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{sID}
			</Modal.Body>
		</Modal>
	</>);
}

export default Set
