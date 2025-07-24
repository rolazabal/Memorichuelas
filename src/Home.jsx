import { ListGroup, Row } from 'react-bootstrap';
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';

//import * as formik from 'formik';
//import * as yup from 'yup';

function Home({user, logIn, logOut, requestUser}) {
    const [createModal, setCreateModal] = useState(false);
    //const { formik } = formik;
    /*const schema = yup.object().shape({
        username: yup.string().required(),
        passkey: yup.number().required()
    });*/

    return (
        <Card.Body>
            <Card.Title>About</Card.Title>
            <Card.Text>
                Aprendizaje personalizado de vocabulario utilizando colecciones de palabras; Como usuario podras crear y seleccionar collectiones y palabras de nuestro vocabulario para aprender de forma interactiva.
            </Card.Text>
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={createModal}
                onHide={() => setCreateModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Crea tu perfil
                    </Modal.Title>
                </Modal.Header>
                <Form>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="username" placeholder="Enter username" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPass">
                            <Form.Label>Passkey</Form.Label>
                            <Form.Control type="password" placeholder="Enter passkey" />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => {setCreateModal(false)}}>Crear</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <ListGroup>
                <ListGroup.Item>
                    <Button onClick={() => {setCreateModal(true)}}>Crea tu perfil</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                <Card.Text>O inicia una sesion para continuar:</Card.Text>
                    {/* <Formik noValidate> */}
                        <Form>
                            <Form.Group className="mb-3" controlId="formUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="username" placeholder="Enter username" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formPass">
                                <Form.Label>Passkey</Form.Label>
                                <Form.Control type="password" placeholder="Enter passkey" />
                            </Form.Group>
                            <Button onClick={user ? logOut : logIn}>{user ? "Salir" : "Entrar"}</Button>
                        </Form>
                    {/* </Formik> */}
                </ListGroup.Item>
            </ListGroup>
        </Card.Body>
    )
}

export default Home