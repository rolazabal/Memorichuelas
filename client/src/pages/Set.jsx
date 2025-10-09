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

function Set({set, deleteSet, changeName, changeSetWords, close}) {

	if (set == null) return <></>;
	else return (<>
		<Row>
			<Stack direction='horizontal'>
				<Card.Title>{set.name}</Card.Title>
				<Button onClick={close}>close</Button>
			</Stack>
		</Row>
		<Row>
			<ul>
				{set.words.map((word) => <li>
					{word.name}
				</li>)}
			</ul>
			<Button>edit</Button>
		</Row>
		<Row>
			<Stack direction='horizontal'>
				<Button>delete</Button>
				<h2>score: {set.score}</h2>
				<Button>play</Button>
			</Stack>
		</Row>
	</>);
}

export default Set