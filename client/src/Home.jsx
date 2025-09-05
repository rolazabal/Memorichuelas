import { ListGroup, Row } from 'react-bootstrap';
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Stack from 'react-bootstrap/Stack';
//import * as formik from 'formik';
//import * as yup from 'yup';

function Home({lang, strings, logIn, createAccount, loggedIn}) {
    ///variables
    const [createModal, setCreateModal] = useState(false);

    ///functions
    const submitLogin = event => {
        event.preventDefault();
        let username = document.getElementById("login_user").value;
        let passkey = document.getElementById("login_pass").value;
        logIn(username, passkey);
    }
    
    const submitCreate = event => {
        event.preventDefault();
        setCreateModal(false);
        let username = document.getElementById("create_user").value;
        let passkey = document.getElementById("create_pass").value;
        createAccount(username, passkey);
    }

    function AccountForm() {
        if (loggedIn) return;
        return(
            <ListGroup>
                <ListGroup.Item>
                    <Stack direction="horizontal" gap={3}>
                        <Button onClick={() => {setCreateModal(true)}}>{strings.user_create_text[lang]}</Button>
                        <div className="vr" />
                        <Card.Text>{strings.login_text[lang]}</Card.Text>
                    </Stack>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Form onSubmit={submitLogin}>
                        <Form.Group className="mb-3">
                            <Form.Label>{strings.username[lang]}</Form.Label>
                            <Form.Control type="username" id="login_user" placeholder={strings.username_text[lang]} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>{strings.passkey[lang]}</Form.Label>
                            <Form.Control type="password" id="login_pass" placeholder={strings.passkey_text[lang]} />
                        </Form.Group>
                        <Button type="submit">{strings.login[lang]}</Button>
                    </Form>
                </ListGroup.Item>
            </ListGroup>
        );
    }

    return (
        <Card.Body style={{overflow: "hidden"}}>
            <Card.Title>{strings.about_title[lang]}</Card.Title>
            <Container style={{maxHeight: "90%", overflowY: "auto", overflowX: "hidden"}}>
                <Card.Text>{strings.about_blurb[lang]}</Card.Text>
                <AccountForm />
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
                        {strings.user_create_text[lang]}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={submitCreate}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>{strings.username[lang]}</Form.Label>
                            <Form.Control id="create_user" type="username" placeholder={strings.username_text[lang]} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>{strings.passkey[lang]}</Form.Label>
                            <Form.Control id="create_pass" type="password" placeholder={strings.passkey_text[lang]} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit">{strings.create[lang]}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Card.Body>
    )
}

export default Home