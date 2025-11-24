import { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { LocContext } from './../context/LocContext.jsx';
import { ToastContext } from './../context/ToastContext.jsx';

function SetList({ID, view, api, modes, mode, setMode}) {

	const [sets, setSets] = useState(null);
	const [cloneModal, setCloneModal] = useState(false);

	const { strings } = useContext(LocContext);
	const { showToast } = useContext(ToastContext);

	async function getSets() {
		try {
            let str = api + '/' + ID;
            if (mode == modes.OFFICIAL)
                str = str + '/memorichuelas';
			let res = await fetch(str, {
				method: 'GET'
			});
			if (res.status == 200) {
				res = await res.json();
				let sets = res.sets;
				setSets(sets);
			} else {
				res = await res.json();
				showToast("danger", res.msg);
			}
		} catch(error) { 
			showToast("danger", "t_error");
		}
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
				let s_id = res.set_id;
				view(s_id);
			} else {
				res = await res.json();
				showToast("danger", res.msg);
			}
		} catch(error) { 
			showToast("danger", "t_error");
		}
	}

    async function clone(set_id) {
        try {
            let res = await fetch(api + '/' + ID + '/clone/' + set_id, {
                method: 'POST'
            });
            if (res.status == 200) {
                res = await res.json();
                let s_id = res.set_id;
                view(s_id);
			} else {
				res = await res.json();
				showToast("danger", res.msg);
			}
		} catch(error) { 
			showToast("danger", "t_error");
		}
    }

	const handleCreate = (data) => {
		let name = data.get("create_name");
		create(name);
	};

    const handleClone = (data) => {
        let id = data.get("clone_id");
        clone(id);
    };

	useEffect(() => {
        if (sets == null) {
            getSets();
        }
	}, [sets]);

	return (<>
		<Row>
			<Stack direction="horizontal">    
				<Card.Title style={{width: "50%"}}>{strings.get("sets_title")}</Card.Title>
				<Tabs
					style={{width: "50%"}}
					defaultActiveKey="custom"
					className="ms-auto"
					onSelect={(eventKey) => {setMode(eventKey); setSets(null)}}
                    activeKey={mode}
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
					<Button title={strings.get("clone")} onClick={() => setCloneModal(true)}>
						<FontAwesomeIcon icon="fa-solid fa-clone" />
					</Button>
					<Form.Control name="create_name" type="text" placeholder={strings.get("set_name_text")} style={{width: "50%"}}/>
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
							{set.name}
						</h4>
						<h4 className="ms-auto">
							{strings.get("score")}: {set.score}
						</h4>
					</Button>
				</Stack>
			</Row>
		)}
		<Modal
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
			show={cloneModal}
			onHide={() => setCloneModal(false)}
		>
			<Modal.Header closeButton>
				<Modal.Title>
					{strings.get("set_clone_text")}
				</Modal.Title>
			</Modal.Header>
            <Form action={handleClone}>
			    <Modal.Body>
				    <Form.Control name="clone_id" type="number" placeholder={strings.get("set_clone_text")} />
			    </Modal.Body>
			    <Modal.Footer>
				    <Button type="submit">
					    {strings.get("clone")}
				    </Button>
			    </Modal.Footer>
            </Form>
		</Modal>
	</>);
}

export default SetList
