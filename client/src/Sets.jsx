import { createContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, ListGroup, Row, Col } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

function Sets({lang, strings, userSets, setObj, getSets, setSetObj, createSet, deleteSet, setSetName, setSetWord}) {
	/// variables
	const [createModal, setCreateModal] = useState(false);

	const submitCreate = event => {
        event.preventDefault();
        setCreateModal(false);
        let name = document.getElementById("create_name").value;
        createSet(name, []);
    }

	/// functions
	function Display() {
		if (setObj == null) {
			return (
				<>
					<Row>
						<Stack direction="horizontal">    
		    	    				<Card.Title>
								{strings.sets_title[lang]}
							</Card.Title>
							<Tabs 
								defaultActiveKey="custom"
								className="ms-auto"
							>
								<Tab eventKey="custom" title={strings.sets_custom[lang]}>
								</Tab>
								<Tab eventKey="official" title={strings.sets_official[lang]}>
								</Tab>
							</Tabs>
		    			</Stack>
					</Row>
					<Row>
						<Button onClick={() => {setCreateModal(true)}}>+</Button>
					</Row>
						{(userSets == null || userSets.length < 1) ? 
								<></>
							:
								userSets.map((set, index) => 
									<Row key={index}>
										<Stack direction="horizontal">
											{set.name}
											<Button onClick={() => {}}>edit</Button>
											<Button onClick={() => {deleteSet(userSets[index].setID)}}>d</Button>
										</Stack>
									</Row>
						)}
				</>
			);
		} else {
			if (userSets) {
				getSets(null);
			}
			return (
				<>
					<Button onClick={() => {setSetObj(null)}}>Back</Button>
				</>
			);
		}
	}

	return (
		<Container>
			<Display />
			<Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={createModal}
                onHide={() => setCreateModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {strings.set_create_text[lang]}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={submitCreate}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>{strings.name[lang]}</Form.Label>
                            <Form.Control id="create_name" type="text" placeholder={strings.name_text[lang]} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit">{strings.create[lang]}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
		</Container>
	);
}

export default Sets
