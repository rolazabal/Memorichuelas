import { ListGroup, Row } from 'react-bootstrap';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

function Account({lang, strings, user, updateUsername}) {

    return (
        <Card.Body>
            <Card.Title>{strings.user_title[lang]}</Card.Title>
            <ListGroup>
                <ListGroup.Item>
                    <Card.Text>{strings.change_name[lang]}</Card.Text>
                    <Form controlId="changeUsername">
                        <Form.Control type="username" placeholder={strings.change_name_text[lang]} />
                        <Button>{strings.update[lang]}</Button>
                    </Form>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Card.Text>{strings.user_information[lang]}</Card.Text>
                    <Card.Text>
                        {strings.username[lang]}: {user.username}
                        <br />
                        {strings.user_date[lang]}: {user.date}
                    </Card.Text>
                    <Button>{strings.user_delete[lang]}</Button>
                </ListGroup.Item>
            </ListGroup>
        </Card.Body>
    )
}

export default Account