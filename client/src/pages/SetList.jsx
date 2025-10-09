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

function SetList({sets, getSets, create, edit}) {

	const { strings } = useContext(LocContext);

	const submitCreate = (data) => {
        let name = data.get("create_name");
        create(name);
    }

	useEffect(() => {
		getSets();
	}, []);

	return (<>
		<Row>
			<Stack direction="horizontal">    
				<Card.Title>{strings.get("sets_title")}</Card.Title>
				<Tabs 
					defaultActiveKey="custom"
					className="ms-auto"
				>
					<Tab eventKey="custom" title={strings.get("sets_custom")}></Tab>
					<Tab eventKey="official" title={strings.get("sets_official")}></Tab>
				</Tabs>
			</Stack>
		</Row>
		<Row>
			<Form action={submitCreate}>
				<Stack direction='horizontal'>
					<Form.Control name="create_name" type="text" placeholder={strings.get("name_text")} />
					<Button type="submit">+</Button>
				</Stack>
			</Form>
		</Row>
		{sets != null && sets.map((set, index) => 
			<Row key={index}>
				<Stack direction="horizontal">
					<h3>
						{set.name}, {strings.get("score")}:  {set.score}
					</h3>
					<Button onClick={() => {edit(set.setID)}}>edit</Button>
				</Stack>
			</Row>
		)}
	</>);
}

export default SetList
