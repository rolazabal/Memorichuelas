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
import { ToastContext } from './../context/ToastContext.jsx';

function SetList({ID, view, api}) {

	const [sets, setSets] = useState(null);
	const [fakeSets, setFakeSets] = useState([
                {
                        setID: 300,
                        name: "comidas",
                        score: 0.25
                },
                {
                        setID: 301,
                        name: "frases",
                        score: 1.00
                }
        ]);

	const { strings } = useContext(LocContext);
	const { toasts, showToast } = useContext(ToastContext);

	function getSets() {
		setSets(fakeSets);
		return;
		try {
			let res = fetch(api + "/" + ID, {
				method: 'GET'
			});
			if (res.status == 403) {
				showToast(toasts.TIMEOUT);
				return;
			}
			res = res.json();
			let sets = res.sets;
			setSets(sets);
		} catch(error) { showToast(toasts.ERR); }
	}

	function create(name) {
		let temp = {setID: 200, name: name, score: 0.00}
		setFakeSets([...fakeSets, temp]);
		view(temp.setID);
		return;
		try {
			let res = fetch(api + "/" + ID, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({name: name})
			});
			if (res.status == 403) {
				showToast(toasts.TIMEOUT);
				return;
			}
			res = res.json();
			let id = res.setID;
			view(id);
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
			<Form action={handleCreate}>
				<Stack direction='horizontal'>
					<Form.Control name="create_name" type="text" placeholder={strings.get("name_text")} style={{width: "50%"}}/>
					<Button type="submit" style={{width: "50%"}}>{strings.get("create")}</Button>
				</Stack>
			</Form>
		</Row>
		{sets != null && sets.map((set, index) => 
			<Row key={index}>
				<Stack direction="horizontal">
					<Button
						variant="light"
						className="ms-auto"
						style={{width: "100%"}}
						onClick={() => {view(set.setID)}}
					>
						<h4>
							{set.name}, {strings.get("score")}: {set.score}
						</h4>
					</Button>
				</Stack>
			</Row>
		)}
	</>);
}

export default SetList
