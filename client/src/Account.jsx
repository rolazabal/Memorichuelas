import { ListGroup, Row } from 'react-bootstrap';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Stack from 'react-bootstrap/Stack';

function Account({lang, strings, info, logOut, getInfo, changeUsername, deleteUser}) {
    ///variables
    const [createModal, setCreateModal] = useState(false);

    ///functions
    const submitChange = event => {
        event.preventDefault();
        let username = document.getElementById("change_name").value;
        changeUsername(username);
    }

    if (info == null) getInfo();

    return (
        <Card.Body style={{overflow: "hidden"}}>
            <Card.Title>{strings.user_title[lang]}</Card.Title>
            <ListGroup style={{maxHeight: "90%", overflowY: "auto", overflowX: "hidden"}}>
                <ListGroup.Item>
                    <Card.Text>{strings.change_name[lang]}</Card.Text>
                    <Form onSubmit={submitChange}>
                        <Stack direction="horizontal" gap={3}>
                            <Form.Control id="change_name" type="username" placeholder={strings.change_name_text[lang]} />
                            <Button type="submit">{strings.update[lang]}</Button>
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
                        <Button className="ms-auto" variant="danger" onClick={() => {setCreateModal(true)}}>{strings.user_delete[lang]}</Button>
                    </Stack>
                    <Modal>
                        {/*are you sure you want to delete account?*/}
                    </Modal>
                </ListGroup.Item>
            </ListGroup>
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={createModal}
                onHide={() => setCreateModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Are you sure?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    You will not be able to recover your account or sets once deleted.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='danger' onClick={() => {deleteUser()}}>{strings.delete[lang]}</Button>
                </Modal.Footer>
            </Modal>
        </Card.Body>
    )
}

export default Account