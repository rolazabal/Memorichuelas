import { Dropdown, ListGroup, Row, Col } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import Pagination from 'react-bootstrap/Pagination';
import { useState, useEffect, useContext } from 'react';
import { LocContext } from './../context/LocContext.jsx';
import { ToastContext } from './../context/ToastContext.jsx';

const alph = [
	'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
	'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
	'Y', 'Z'
];

const PageList = ({letter, list, setLetter, getWord}) => {

	const displayCols = 2;
	let rows = [];

	function computeTable(columns) {
	let rows = [];
	let row = [];
	// for each word, add to row until row is full, then add full row to rows array
	for (let i = 0; i < list.length; i ++) {
		row.push(list[i]);
		if ((i + 1) % columns == 0) {
		rows.push(row)
		row = [];
		}
	}
	if (row != []) 
		rows.push(row);
	return rows;
	}

	useEffect(() => {
	if (list != null)
		rows = computeTable(displayCols);
	}, [list]);

	return (<>
		<Container>
			<Row>
				<Pagination size="md">{alph.map((char) => 
					<Pagination.Item key={char} active={char == letter} onClick={() => setLetter(char)}>
						{char}
					</Pagination.Item>
				)}</Pagination>
			</Row>
		</Container>
		<Container>{rows.map((row) => 
			<Row>{row.map((entry) => 
				<Col id={parseInt(entry[0])} onClick={() => {getWord(parseInt(entry[0]))}}>{entry[1]}</Col>
			)}</Row>
		)}</Container>
	</>);
}

function Dictionary({ID}) {

	const [list, setList] = useState([]);
	const [word, setWord] = useState(null);
	const [pageLetter, setPageLetter] = useState(alph[0]);
	
	const { strings } = useContext(LocContext);
	const { toasts, showToast } = useContext(ToastContext);

	const dictAPI = 'http://localhost:5050/api/dictionary';

	const submitSearch = async (data) => {
		let query = data.get("search_input");
		await search(query);
	}

	async function getPage(letter) {
		try {
			let res = await fetch(dictAPI, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({action: 'page', letter: letter.toLowerCase(), userID: ID})
			});
			res = await res.json();
			let list = res.words;
			setList(list);
		} catch(error) {
			showToast(toasts.ERR);
		}
	}

	async function search(string) {
		try {
			let res = await fetch(dictAPI, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({action: 'search', string: string, userID: ID})
			});
			res = await res.json();
			let list = res.words;
			setList(list);
		} catch(error) {
			showToast(toasts.ERR);
		}
	}

	async function getWord(wID) {
		try {
			let res = await fetch(dictAPI, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({action: 'word', wordID: wID, userID: ID})
			});
			res = await res.json();
			let obj = res.word;
			setWord(obj);
		} catch(error) {
			showToast(toasts.ERR);
		}
	}

	useEffect(() => {
	getPage(pageLetter);
	}, [pageLetter]);

	return (<>
		<Row>
			<Col>
				<Card.Title>{strings.get('dictionary_title')}</Card.Title>
			</Col>
			{word == null && <Col>
				<Form action={submitSearch}>
					<Stack direction='horizontal'>
						<Form.Control id="search_input" type="text" />
						<Button type="submit">{strings.get('search')}</Button>
					</Stack>
				</Form>
			</Col>}
		</Row>
		<Container style={{padding: "0", maxHeight: "90%", overflowY: "auto", overflowX: "hidden"}}>
		{word != null ?
			<>
				<Stack direction="horizontal">
					<h2>{word.name}</h2>
					<Button className="ms-auto" onClick={async () => {await setWord(null)}}>{strings.get('back')}</Button>
				</Stack>
				{word.defs.length > 0 ? 
					<ul>{word.defs.map((def) => <li>{def}</li>)}</ul>
				: <></>}
				{word.exs.length > 0 ? 
					<>
						<h3>{strings.get('example')}</h3>
						<ul>{word.exs.map((ex) => <li>{ex}</li>)}</ul>
					</> 
				: <></>}
			</>
		: <PageList letter={pageLetter} list={list} setLetter={setPageLetter} getWord={getWord} />}
		</Container>
	</>);
}

export default Dictionary
