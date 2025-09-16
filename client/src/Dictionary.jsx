import { createContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, ListGroup, Row, Col } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';


function Dictionary({lang, strings, wordObj, pageWords, setWordObj, getPage, getWord, search, alph}) {
    ///variables
    const modes = {
        display: 0,
        select: 1
    };
    const mode = modes.display;
    const selection = [];
    const display_columns = 2;
    
    ///functions
    const submitSearch = event => {
        event.preventDefault();
        search(document.getElementById("search").value);
    }

    function computeTable(columns) {
        let rows = [];
        if (pageWords != null) {
            let row = [];
            for (let i = 0; i < pageWords.length; i ++) {
                //for each word, add to row until row is full, then add full row to rows array
                row.push(pageWords[i]);
                if ((i + 1) % columns == 0) {
                    rows.push(row)
                    row = [];
                }
            }
            //add remaining contents of row
            if (row != []) 
                rows.push(row);
        }
        return rows;
    }

    function Content() {
        if (wordObj != null) { 
            //word page
            return (
                <Container>
                    <Stack direction="horizontal">
                        <h2>{wordObj.name}</h2>
                        <Button className="ms-auto" onClick={() => {setWordObj(null)}}>{strings.back[lang]}</Button>
                    </Stack>
                    {wordObj.defs.length > 0 ? 
                        <>
                            <ul>
                                {wordObj.defs.map((def) =>
                                    <li>{def}</li>
                                )}
                            </ul>
                        </> 
                        : <></>
                    }
                    {wordObj.exs.length > 0 ? 
                        <>
                            <h3>{strings.example[lang]}</h3>
                            <ul>
                                {wordObj.exs.map((ex) =>
                                    <li>{ex}</li>
                                )}
                            </ul>
                        </> 
                        : <></>
                    }
                </Container>
            );
        }
        //dictionary page
        //compute rows
        let rows = computeTable(display_columns);
        return (
            <>
                <Container>
                    <Row>
                        {alph.map((letter) =>
                            <Col>
                                <h2 onClick={() => {getPage(letter)}}><small>{letter}</small></h2>
                            </Col>
                        )}
                    </Row>
                </Container>
                <Container>
                    {rows.map((row) => 
                        <Row>
                            {row.map((entry) => 
                                <Col id={parseInt(entry[0])} onClick={() => {getWord(parseInt(entry[0]))}}>{entry[1]}</Col>
                            )}
                        </Row>
                    )}
                    {
                        (mode == modes.select) ?
                            <Col></Col>
                        : <></>
                    }
                </Container>
            </>
        );
    }

    /*<Col id={parseInt(entry[0])} onClick={() => {selection.push([entry[0], entry[1]])}}>{entry[1]}</Col>*/

    return (
        <>
            <Row>
                <Col>
                    <Card.Title>{strings.dictionary_title[lang]}</Card.Title>
                </Col>
                {wordObj != null ? <></> : 
                    <Col>
                        <Form onSubmit={submitSearch}>
                            <Stack direction='horizontal'>
                                <Form.Control id="search" type="text" />
                                <Button type="submit">{strings.search[lang]}</Button>
                            </Stack>
                        </Form>
                    </Col>
                }
            </Row>
            <Container style={{padding: "0", maxHeight: "90%", overflowY: "auto", overflowX: "hidden"}}>
                <Content />
            </Container>
        </>
    );
}

export default Dictionary