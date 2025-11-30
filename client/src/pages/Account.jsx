import { ListGroup } from 'react-bootstrap';
import { useState, useContext, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Stack from 'react-bootstrap/Stack';
import { LocContext } from './../context/LocContext.jsx';
import { ToastContext } from './../context/ToastContext.jsx';

function Account({ID, logOut, del}) {

	const [info, setInfo] = useState(null);
	const [createModal, setCreateModal] = useState(false);

	const { strings } = useContext(LocContext);
	const { showToast } = useContext(ToastContext);
	
	const accAPI = 'http://localhost:5050/api/account';

	async function getInfo() {
		try {
			let res = await fetch(accAPI + "/" + ID, {
				method: 'GET'
			});
			if (res.status == 200) {
				res = await res.json();
				let obj = res.info;
				setInfo(obj);
			} else {
				res = await res.json();
				showToast("danger", res.msg);
			}
		} catch(error) {
			showToast("danger", "t_error");
		}
	}

	async function changeName(user) {
		try {
			console.log("farts");
			let res = await fetch(accAPI + "/" + ID + "/username", {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({username: user})
			});
			console.log("farted", res.status);
			if (res.status == 200) {
				setInfo(null);
				showToast("success", "t_change_name_success");
			} else {
				res = await res.json();
				showToast("danger", res.msg);
			}
		} catch(error) {
			showToast("danger", "t_error");
		}
	}

	const handleChange = (data) => {
		let username = data.get("change_name");
		changeName(username);
	}

	useEffect(() => {
		if (info == null) {
			getInfo();
		}
	}, [info]);

	return (
		<>
			<Card.Title>{strings.get('user_title')}</Card.Title>
			<ListGroup style={{maxHeight: "90%", overflowY: "auto", overflowX: "hidden"}}>
				<ListGroup.Item>
					<Card.Text>{strings.get('change_name')}</Card.Text>
						<Form action={handleChange}>
							<Stack direction="horizontal" gap={3}>
								<Form.Control name="change_name" type="username" placeholder={strings.get('change_name_text')} />
								<Button type="submit">{strings.get('update')}</Button>
							</Stack>
						</Form>
				</ListGroup.Item>
				<ListGroup.Item>
					<Card.Text>{strings.get('user_information')}</Card.Text>
					{info != null && <Card.Text>
						{strings.get("username")}: {info.name}
						<br />
						{strings.get('user_date')}: {info.date}
					</Card.Text>}
					<Stack direction="horizontal">
						<Button variant="danger" 
							onClick={() => {setCreateModal(true)}}
						>
							{strings.get('user_delete')}
						</Button>
						<Button variant="secondary" className="ms-auto" onClick={() => logOut()}>{strings.get('logout')}</Button>
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
					<Button variant='danger' onClick={() => del()}>{strings.get('delete')}</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

export default Account
