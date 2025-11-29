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
	const { showToast } = useContext(ToastContext);

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
			} else {
				res = await res.json();
				showToast("danger", res.msg);
			}
		} catch(error) { 
			showToast("danger", "t_error");
		}
	}

	async function deleteSet() {
		try {
			let res = await fetch(api + "/" + ID + "/" + sID, {
				method: 'DELETE'
			});
			if (res.status == 200) {
				showToast("success", "t_delete_set_success");
				close();
			} else {
				res = await res.json();
				showToast("danger", res.msg);
			}
		} catch(error) { 
			showToast("danger", "t_error");
		}
	}

	async function rename(name) {
		try {
			let res = await fetch(api + "/" + ID + "/" + sID + "/name", {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({name: name})
			});
			if (res.status == 200) {
				setNameModal(false);
				showToast("success", "t_change_setname_success");
				setSet(null);
			} else {
				res = await res.json();
				showToast("danger", res.msg);
			}
		} catch(error) { 
			showToast("danger", "t_error");
		}
	}

	async function removeWord(w_id) {
		try {
			let res = await fetch(api + '/' + ID + '/' + sID + '/' + w_id, {
				method: 'DELETE'
			});
			if (res.status == 200) {
				setSet(null);
			} else {
				res = await res.json();
				showToast("danger", res.msg);
			}
		} catch(error) { 
			showToast("danger", "t_error");
		}
	}

	const handleName = (data) => {
		let name = data.get("change_name");
		rename(name);
	};

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
					{!set.isOfficial && <Button variant="light" title={strings.get("add")} onClick={add}>
						<FontAwesomeIcon icon="fa-solid fa-plus" />
					</Button>}
					{set.words.map((word, index, words) => <>
						<a onClick={() => view(word.word_id)}>{word.name}</a>
						{!set.isOfficial && <Button variant="light" title={strings.get("delete")} onClick={() => removeWord(word.word_id)}>
							<FontAwesomeIcon icon="fa-solid fa-trash" />
						</Button>}
                        {words.length - 1 != index && ", "} 
					</>)}
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
			<Form action={handleName}>
				<Modal.Body>
					<Form.Control name="change_name" type="text" placeholder={strings.get("set_rename_text")} />
				</Modal.Body>
				<Modal.Footer>
					<Button type="submit">
						{strings.get("rename")}
					</Button>
				</Modal.Footer>
			</Form>
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
