import { createContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, ListGroup, Row, Col } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';

function Sets({lang, strings, userSets, setObj}) {
    ///variables
    const [tab, setTab] = useState(0);

    ///functions
    function Display() {
        if (setObj == null) {
            //get set info
            //getSets();
            return (
                <Container>
                    <Row>
                        <Stack direction='horizontal'>
                            <Card.Title>
                                {strings.sets_title[lang]}
                            </Card.Title>
                            <Nav variant="tabs" className="ms-auto">
                                <Nav.Item eventKey="">
                                    Custom sets
                                </Nav.Item>
                                <Nav.Item eventKey="">
                                    Official sets
                                </Nav.Item>
                            </Nav>
                        </Stack>
                    </Row>
                    <Row>

                    </Row>
                </Container>

            );
        } else return <></>;
    }

    return (
        <Card.Body style={{overflow: "hidden"}}>
            <Display />
        </Card.Body>
    )
}

export default Sets