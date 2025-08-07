import { ListGroup, Row } from 'react-bootstrap';
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import strings from './Strings.js';

//import * as formik from 'formik';
//import * as yup from 'yup';

function Home({lang, user, logIn, logOut, requestUser}) {
    const [createModal, setCreateModal] = useState(false);
    //const { formik } = formik;
    /*const schema = yup.object().shape({
        username: yup.string().required(),
        passkey: yup.number().required()
    });*/

    return (
        <Card.Body>
            <Card.Title>{strings.about_title[lang]}</Card.Title>
            <Card.Text>{strings.about_blurb[lang]}</Card.Text>
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={createModal}
                onHide={() => setCreateModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {strings.account_create_text[lang]}
                    </Modal.Title>
                </Modal.Header>
                <Form>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="formUsername">
                            <Form.Label>{strings.username[lang]}</Form.Label>
                            <Form.Control type="username" placeholder={strings.username_text[lang]} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPass">
                            <Form.Label>{strings.passkey[lang]}</Form.Label>
                            <Form.Control type="password" placeholder={strings.passkey_text[lang]} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => {setCreateModal(false)}}>{strings.account_create[lang]}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <ListGroup>
                <ListGroup.Item>
                    <Button onClick={() => {setCreateModal(true)}}>{strings.account_create_text[lang]}</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                <Card.Text>{strings.account_login_text[lang]}</Card.Text>
                    {/* <Formik noValidate> */}
                        <Form>
                            <Form.Group className="mb-3" controlId="formUsername">
                                <Form.Label>{strings.username[lang]}</Form.Label>
                                <Form.Control type="username" placeholder={strings.username_text[lang]} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formPass">
                                <Form.Label>{strings.passkey[lang]}</Form.Label>
                                <Form.Control type="password" placeholder={strings.passkey_text[lang]} />
                            </Form.Group>
                            <Button onClick={user ? logOut : logIn}>{user ? strings.account_login[lang] : strings.account_logout[lang]}</Button>
                        </Form>
                    {/* </Formik> */}
                </ListGroup.Item>
            </ListGroup>
        </Card.Body>
    )
}

export default Home