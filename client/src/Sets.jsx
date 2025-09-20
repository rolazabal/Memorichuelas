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

function Sets({lang, strings, userSets, setObj, getSets, setSetObj, createSet, deleteSet, setSetName, setSetWord}) {
    ///variables
    
    ///functions
    function Display() {
        if (setObj == null) {
            return (
                <>
                    <Row>
                        <Col>
                            <Card.Title>
                                {strings.sets_title[lang]}
                            </Card.Title>
                        </Col>
                        <Col>
                            <Nav variant="tabs" className="ms-auto">
                                <Nav.Item eventKey="">
                                    Custom sets
                                </Nav.Item>
                                <Nav.Item eventKey="">
                                    Official sets
                                </Nav.Item>
                            </Nav>
                        </Col>
                    </Row>
                    <Row style={{overflowY: "auto"}}>
                        <Row>
                            <Button onClick={() => {createSet("set", [444])}}>{userSets == null ? 0 : userSets.length}</Button>
                        </Row>
                        {
                            (userSets == null || userSets.length < 1) ? 
                                <></>
                            :
                                userSets.map((set, index) => 
                                    <Row key={index}>
                                        {set.name}
                                    </Row>
                                )
                        }
                    </Row>
                </>
            );
        } else {
            return (
                <>
                    <Button onClick={() => {setSetObj(null)}}>Back</Button>
                </>
            );
        }
    }

    return (
        <Display />
    )
}

export default Sets