import { ListGroup } from 'react-bootstrap';
import { useState, useContext, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Stack from 'react-bootstrap/Stack';
import { LocContext } from './../context/LocContext.jsx';

function Account({ID, logOut}) {

	const [info, setInfo] = useState(null);

	const { strings } = useContext(LocContext);
	const [createModal, setCreateModal] = useState(false);

	const accAPI = 'http://localhost:5050/api/account';

	async function deleteUser() {
		try {
			let res = await fetch(accAPI, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({action: 'delete', userID: ID})
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
				body: JSON.stringify({action: 'info', userID: ID})
			});
			if (res.status < 300) {
				res = await res.json();
				let obj = res.info;
				setInfo(obj);
			} else
				showToast(toasts.TIMEOUT);
				logOut(true);
		} catch(error) {
			showToast(toasts.ERR);
		}
	}

	async function changeName(user) {
		try {
			let res = await fetch(accAPI, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({action: 'updateName', userID: ID, username: user})
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

	const submitChange = event => {
		let username = data.get("change_name");
		changeName(username);
	}

	useEffect(() => {
		getInfo();
	}, []);

	return (
		<>
			<Card.Title>{strings.get('user_title')}</Card.Title>
			<ListGroup style={{maxHeight: "90%", overflowY: "auto", overflowX: "hidden"}}>
				<ListGroup.Item>
					<Card.Text>{strings.get('change_name')}</Card.Text>
					<Form action={submitChange}>
						<Stack direction="horizontal" gap={3}>
							<Form.Control name="change_name" type="username" placeholder={strings.get('change_name_text')} />
							<Button type="submit">{strings.get('update')}</Button>
						</Stack>
					</Form>
				</ListGroup.Item>
				<ListGroup.Item>
					<Card.Text>{strings.get('user_information')}</Card.Text>
					<Card.Text>
						{strings.get('username')}: {info != null ? info.name : ''}
						<br />
						{strings.get('user_date')}: {info != null ? info.date : ''}
					</Card.Text>
					<Stack direction="horizontal">
						<Button onClick={() => {logOut(false)}}>{strings.get('logout')}</Button>
						<Button className="ms-auto" variant="danger" 
							onClick={() => {setCreateModal(true)}}
						>
							{strings.get('user_delete')}
						</Button>
					</Stack>
				</ListGroup.Item>
			</ListGroup>
			<Modal
				size="lg"
				aria-labelledby="contained-modal-title-vcenter"
				centered
				show={createModal}
				onHide={() => setCreateModal(false)}
			>
				<Modal.Header closeButton>
					<Modal.Title>
						{strings.get('user_delete_text')}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{strings.get('user_delete_blurb')}
				</Modal.Body>
				<Modal.Footer>
					<Button variant='danger' onClick={() => {deleteUser()}}>{strings.get('delete')}</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default Account
