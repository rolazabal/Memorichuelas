import { Row, Col } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import Pagination from 'react-bootstrap/Pagination';
import { useState, useEffect, useContext } from 'react';
import { LocContext } from './../context/LocContext.jsx';
import { ToastContext } from './../context/ToastContext.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function WordDirectory({ID, page, setPage, view, api}) {

	const alph = [
        	'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
        	'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
        	'Y', 'Z'
	];
	const displayCols = 2;

	const [table, setTable] = useState([]);
	const [list, setList] = useState(null);

	function computeTable(columns) {
		let rows = [];
		let row = [];
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

	const { strings } = useContext(LocContext);
	const { showToast } = useContext(ToastContext);
	
	async function getPage(letter) {
		try {
			let res = await fetch(api + "/" + letter + "/" + ID, {
				method: 'GET'
			});
			res = await res.json();
			let words = res.words;
			setList(words);
		} catch(error) {
			showToast("danger", "t_error");
		}
	}

	async function search(query) {
		try {
			let res = await fetch(api + "/search/" + query + "/" + ID, {
				method: 'GET'
			});
			res = await res.json();
			let words = res.words;
			setPage(null);
			setList(words);
		} catch(error) {
			showToast("danger", "t_error");
		}
	}

	const handleSearch = (data) => {
		let query = data.get("search_input");
		search(query);
	}

	useEffect(() => {
		if (alph.includes(page))
			getPage(page);
	}, [page])

	useEffect(() => {
		if (list != null)
			setTable(computeTable(displayCols));
	}, [list]);

	return (
		<>
			<Row>
				<Col>
					<Card.Title>
						{strings.get("dictionary_title")}
					</Card.Title>
				</Col>
				<Col>
					<Form action={handleSearch}>
						<Stack direction="horizontal">
							<Form.Control name="search_input" type="text" placeholder={strings.get("search")} />
							<Button title={strings.get("search")} type="submit">
								<FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
							</Button>
						</Stack>
					</Form>
				</Col>
			</Row>
				<Row style={{overflowX: "auto"}}>
					<Pagination size="md">
						{alph.map((c) => <Pagination.Item key={c} active={c == page} onClick={() => setPage(c)}>
							{c}
						</Pagination.Item>)}
					</Pagination>
				</Row>
			<Container style={{maxHeight: "90%", overflowY: "auto", overflowX: "hidden"}}>
				{table.map((row) => <Row>
					{row.map((entry) => <Col name={entry.word_id} onClick={() => view(entry.word_id)}>
						{entry.name}
					</Col>)}
				</Row>)}
			</Container>
		</>
	);
}

export default WordDirectory
