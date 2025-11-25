import { useState, useContext } from 'react';
import { ListGroup } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Stack from 'react-bootstrap/Stack';
import { LocContext } from './../context/LocContext.jsx';
import { ToastContext } from './../context/ToastContext.jsx';

function Home({ID, setID, logIn, createAccount}) {

    const [createModal, setCreateModal] = useState(false);

    const { strings } = useContext(LocContext);
	const { showToast } = useContext(ToastContext);

	const accAPI = 'http://localhost:5050/api/account';

	async function logIn(user, pass) {
		try {
			let res = await fetch(accAPI, {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({username: user, passkey: pass})
			});
			if (res.status == 200) {
				res = await res.json();
				let id = await res.user_id;
				setID(id);
				localStorage.setItem('userID', id);
				showToast("success", "t_login_success");
			} else {
				res = await res.json();
				showToast("danger", res.msg);
			}
		} catch(error) { 
			showToast("danger", "t_error");
		}
	}

	async function createAccount(user, pass) {
		try {
			let res = await fetch(accAPI, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({username: user, passkey: pass})
			});
			if (res.status == 200) {
				logIn(user, pass);
			} else {
				res = await res.json();
				showToast("danger", res.msg);
			}
		} catch(error) { 
			showToast("danger", "t_error");
		}
	}

    const submitLogin = (data) => {
        let username = data.get("login_user");
        let passkey = data.get("login_pass");
        logIn(username, passkey);
    }
    
    const submitCreate = (data) => {
        let username = data.get("create_user");
        let passkey = data.get("create_pass");
        createAccount(username, passkey);
        setCreateModal(false);
    }

    return (
        <>
            <Card.Title>{strings.get('about_title')}</Card.Title>
            <Container style={{maxHeight: "90%", overflowY: "auto", overflowX: "hidden"}}>
                <Card.Text>{strings.get('about_blurb')}</Card.Text>
                {ID == -1 &&
                    <ListGroup>
                        <ListGroup.Item>
                            <Stack direction="horizontal" gap={3}>
                                <Button onClick={() => {setCreateModal(true)}}>{strings.get('user_create_text')}</Button>
                                <div className="vr" />
                                <Card.Text>{strings.get('login_text')}</Card.Text>
                            </Stack>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Form action={submitLogin}>
                                <Form.Group className="mb-3">
                                    <Form.Label>{strings.get('username')}</Form.Label>
                                    <Form.Control type="username" name="login_user" placeholder={strings.get('username_text')} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>{strings.get('passkey')}</Form.Label>
                                    <Form.Control type="password" name="login_pass" placeholder={strings.get('passkey_text')} />
                                </Form.Group>
                                <Button type="submit">{strings.get('login')}</Button>
                            </Form>
                        </ListGroup.Item>
                    </ListGroup>
                }
	    	{ID != -1 && <>
			<Card.Text>Visit the sets page and start learning with our official sets, or make your own!</Card.Text>
		</>}
            </Container>
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={createModal}
                onHide={() => setCreateModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {strings.get('user_create_text')}
                    </Modal.Title>
                </Modal.Header>
                <Form action={submitCreate}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>{strings.get('username')}</Form.Label>
                            <Form.Control name="create_user" type="username" placeholder={strings.get('username_text')} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>{strings.get('passkey')}</Form.Label>
                            <Form.Control name="create_pass" type="password" placeholder={strings.get('passkey_text')} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit">{strings.get('create')}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default Home
