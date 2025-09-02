import { ListGroup, Row } from 'react-bootstrap';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

function Account({lang, strings, info, logOut, usernameForm, changeUsername}) {

    return (
        <Card.Body>
            <Card.Title>{strings.user_title[lang]}</Card.Title>
            <ListGroup>
                <ListGroup.Item>
                    <Card.Text>{strings.change_name[lang]}</Card.Text>
                    <Form>
                        <Form.Control id="change_name" type="username" onChange={() => {usernameForm = document.getElementById("change_name").value}} placeholder={strings.change_name_text[lang]} />
                        <Button onClick={() => {changeUsername(usernameForm)}}>{strings.update[lang]}</Button>
                    </Form>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Card.Text>{strings.user_information[lang]}</Card.Text>
                    <Card.Text>
                        {strings.username[lang]}: {info != null ? info.name : ''}
                        <br />
                        {strings.user_date[lang]}: {info != null ? info.date : ''}
                    </Card.Text>
                    <Button onClick={() => {logOut()}}>{strings.logout[lang]}</Button>
                    <Button>{strings.user_delete[lang]}</Button>
                </ListGroup.Item>
            </ListGroup>
        </Card.Body>
    )
}

export default Account