import { Row, Col } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import { useState, useEffect, useContext } from 'react';
import { LocContext } from './../context/LocContext.jsx';
import { ToastContext } from './../context/ToastContext.jsx';

function Word({uID, wID, close, api}) {

	const [word, setWord] = useState(null);

	const { strings } = useContext(LocContext);
    const { showToast } = useContext(ToastContext);

	async function getWord(id) {
		try {
			let res = await fetch(api + "/word/" + id + "/" + uID, {
				method: 'GET'
			});
			res = await res.json();
			let word = res.word;
			setWord(word);
		} catch(error) {
			showToast("danger", "t_error");
		}
	}

	useEffect(() => {
		getWord(wID);
	}, []);

	return (
		<>
			<Row>
				<Card.Title>
					<Stack direction="horizontal">
						{strings.get("dictionary_title")}
						<Button variant="secondary" className="ms-auto" onClick={close}>
							{strings.get("back")}
						</Button>
					</Stack>
				</Card.Title>
			</Row>
			<Container style={{padding: "0", maxHeight: "90%", overflowY: "auto", overflowX: "hidden"}}>
				{word != null && <>
					<h2>{word.name}</h2>
					{word.defs.length > 0 && <ul>
						{word.defs.map((def) => <li>
							{def}
						</li>)}	
					</ul>}
					{word.exs.length > 0 && <>
						<h3>{strings.get("example")}</h3>
						<ul>
							{word.exs.map((ex) => <li>
								{ex}
							</li>)}
						</ul>
					</>}
				</>}
			</Container>
		</>
	);
}

export default Word
