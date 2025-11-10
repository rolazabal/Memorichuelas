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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { LocContext } from './../context/LocContext.jsx';
import { ToastContext } from './../context/ToastContext.jsx';

function SetList({ID, view, api}) {

	const modes = {
		CUSTOM: 0,
		OFFICIAL: 1
	};

	const [mode, setMode] = useState(modes.CUSTOM);
	const [sets, setSets] = useState(null);

	const { strings } = useContext(LocContext);
	const { toasts, showToast } = useContext(ToastContext);

	async function getSets() {
		try {
			let res = await fetch(api + "/" + ID, {
				method: 'GET'
			});
			if (res.status == 200) {
				res = await res.json();
				let sets = res.sets;
				setSets(sets);
			} else if (res.status == 403) {
				showToast(toasts.TIMEOUT);
			} else {
				showToast(toasts.SET_NAME_F);
			}
		} catch(error) { showToast(toasts.ERR); }
	}

	async function create(name) {
		try {
			let res = await fetch(api + "/" + ID, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({name: name})
			});
			if (res.status == 200) {
				res = await res.json();
				let id = res.set_id;
				view(id);
			} else if (res.status == 403) {
				showToast(toasts.TIMEOUT);
			} else {
				showToast(toasts.SET_NAME_F);
			}
		} catch(error) { showToast(toasts.ERR); }
	}

	const handleCreate = (data) => {
		let name = data.get("create_name");
		create(name);
	}

	useEffect(() => {
		getSets();
	}, []);

	return (<>
		<Row>
			<Stack direction="horizontal">    
				<Card.Title style={{width: "50%"}}>{strings.get("sets_title")}</Card.Title>
				<Tabs
					style={{width: "50%"}}
					defaultActiveKey="custom"
					className="ms-auto"
					onSelect={(eventKey) => setMode(eventKey)}
					fill
				>
					<Tab eventKey={modes.CUSTOM} title={strings.get("sets_custom")}></Tab>
					<Tab eventKey={modes.OFFICIAL} title={strings.get("sets_official")}></Tab>
				</Tabs>
			</Stack>
		</Row>
		{mode == modes.CUSTOM && <Row>
			<Form action={handleCreate}>
				<Stack direction='horizontal'>
					<Form.Control name="create_name" type="text" placeholder={strings.get("name_text")} style={{width: "50%"}}/>
					<Button title={strings.get("create")} type="submit" style={{width: "50%"}}>
						<FontAwesomeIcon icon="fa-solid fa-plus" />
					</Button>
				</Stack>
			</Form>
		</Row>}
		{sets != null && sets.map((set, index) => 
			<Row key={index}>
				<Stack direction="horizontal">
					<Button
						variant="light"
						className="ms-auto"
						style={{width: "100%"}}
						onClick={() => {view(set.set_id)}}
					>
						<h4 style={{float: "left"}}>
							{set.name}, {strings.get("score")}: {set.score}
						</h4>
					</Button>
				</Stack>
			</Row>
		)}
	</>);
}

export default SetList
