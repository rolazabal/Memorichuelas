import { ListGroup, Row } from 'react-bootstrap';
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

function SetPage({lang, strings, set}) {
    
    return (
        <Card.Body>
            <Card.Title>
                {set.name}
            </Card.Title>
        </Card.Body>
    )
}

export default SetPage