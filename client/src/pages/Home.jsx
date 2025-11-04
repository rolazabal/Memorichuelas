import { useState, useContext } from 'react';
import { ListGroup } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Stack from 'react-bootstrap/Stack';
import { LocContext } from './../context/LocContext.jsx';

function Home({logIn, createAccount, ID}) {

    const [createModal, setCreateModal] = useState(false);
    const { strings } = useContext(LocContext);

    const submitLogin = (data) => {
        let username = data.get("login_user");
        let passkey = data.get("login_pass");
		console.log("sumbit");
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
