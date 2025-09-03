import { ListGroup, Row } from 'react-bootstrap';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Stack from 'react-bootstrap/Stack';

function Account({lang, strings, info, logOut, usernameForm, changeUsername, deleteUser}) {

    return (
        <Card.Body>
            <Card.Title>{strings.user_title[lang]}</Card.Title>
            <ListGroup>
                <ListGroup.Item>
                    <Card.Text>{strings.change_name[lang]}</Card.Text>
                    <Form>
                        <Stack direction="horizontal" gap={3}>
                            <Form.Control id="change_name" type="username" onChange={() => {usernameForm = document.getElementById("change_name").value}} placeholder={strings.change_name_text[lang]} />
                            <Button onClick={() => {changeUsername(usernameForm)}}>{strings.update[lang]}</Button>
                        </Stack>
                    </Form>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Card.Text>{strings.user_information[lang]}</Card.Text>
                    <Card.Text>
                        {strings.username[lang]}: {info != null ? info.name : ''}
                        <br />
                        {strings.user_date[lang]}: {info != null ? info.date : ''}
                    </Card.Text>
                    <Stack direction="horizontal">
                        <Button onClick={() => {logOut()}}>{strings.logout[lang]}</Button>
                        <Button className="ms-auto" variant="danger" onClick={() => {deleteUser()}}>{strings.user_delete[lang]}</Button>
                    </Stack>
                    <Modal>
                        {/*are you sure you want to delete account?*/}
                    </Modal>
                </ListGroup.Item>
            </ListGroup>
        </Card.Body>
    )
}

export default Account