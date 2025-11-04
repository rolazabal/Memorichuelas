import { createContext, useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, ListGroup, Row, Col } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { LocContext } from './../context/LocContext.jsx';

function Set({set, deleteSet, changeName, changeSetWords, close}) {

	const { strings } = useContext(LocContext);

	if (set == null) return <></>;
	return (
		<><Row>
			<Stack direction='horizontal'>
				<Card.Title>{set.name}</Card.Title>
				<Button className="ms-auto" onClick={close}>{strings.get("back")}</Button>
			</Stack>
		</Row>
		<Row>
			<ul>
				{set.words.map((word) => <li>
					{word.name}
					<Button>d</Button>
				</li>)}
				<li>
					<Button>add</Button>
				</li>
			</ul>
		</Row>
		<Row>
			<Stack direction='horizontal'>
				<Button variant="danger" style={{width: "33%"}}>{strings.get("delete")}</Button>
				<h2 style={{width: "33%"}}>score: {set.score}</h2>
				<Button style={{width: "33%"}}>{strings.get("play")}</Button>
			</Stack>
		</Row></>
	);
}

export default Set
