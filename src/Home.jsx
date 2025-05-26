import { ListGroup, Row } from 'react-bootstrap';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

function Home({user, logIn, logOut}) {

    return (
        <Card.Body>
        <Card.Title>Sobre el servicio</Card.Title>
        <Card.Text>
            Aprendizaje personalizado de vocabulario utilizando colecciones de palabras; Como usuario podras crear y seleccionar collectiones y palabras de nuestro vocabulario para aprender de forma interactiva.
        </Card.Text>
        <ListGroup>
            <ListGroup.Item>
            <Button>Crea tu perfil</Button>
            </ListGroup.Item>
            <ListGroup.Item>
            <Card.Text>O inicia una sesion para continuar:</Card.Text>
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
            </ListGroup.Item>
        </ListGroup>
        </Card.Body>
    )
}

export default Home