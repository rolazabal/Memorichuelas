import { ListGroup, Row } from 'react-bootstrap';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

function Account({user, updateUsername}) {

    return (
        <Card.Body>
            <Card.Title>Account settings</Card.Title>
            <Card.Subtitle>Change username</Card.Subtitle>
            <Form controlId="changeUsername">
                <Form.Control type="username" placeholder="Enter new username" />
                <Button>Update</Button>
            </Form>
            <Card.Subtitle>Account info</Card.Subtitle>
            <Card.Text>
                Username: {user.username}
                <br />
                Date created: {user.date}
            </Card.Text>
            <Button>Delete account</Button>
        </Card.Body>
    )
}

export default Account