import { createContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, ListGroup, Row, Col } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Home from './Home.jsx';
import Sets from './Sets.jsx';
import Account from './Account.jsx';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';


function Dictionary({lang, strings, pageWords, wordObj, getPage, getWord, setWordObj, search, alph}) {
    ///variables
    const mode = "display"; //decide behavior of component: DISPLAY, SELECT, or EDIT
    const selection = [];
    
    ///functions
    const submitSearch = event => {
        event.preventDefault();
        search(document.getElementById("search").value);
    }

    function Content() {
        switch(mode) {
            case "display":
                return <Display />;
            break;
            case "select":
                return <Select />;
            break;
            case "edit":
                return;
            break;
            default:
                return;
            break;
        }
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
            if (row != []) rows.push(row);
        }
        return rows;
    }

    function Display() {
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
        let rows = computeTable(2);
        return (
            <>
                <Container>
                    <Row>
                        {alph.map((letter) =>
                            <Col>
                                <Button onClick={() => {getPage(letter)}}><small>{letter}</small></Button>
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
                </Container>
            </>
        );
    }

    function Select() {
        let rows = computeTable(2);
        return (
            <>
                <Container>
                    <Row>
                        {alph.map((letter) =>
                            <Col>
                                <Button onClick={() => {getPage(letter)}}><small>{letter}</small></Button>
                            </Col>
                        )}
                    </Row>
                </Container>
                <Container>
                    {rows.map((row) => 
                        <Row>
                            {row.map((entry) => 
                                <Col id={parseInt(entry[0])} onClick={() => {selection.push([entry[0], entry[1]])}}>{entry[1]}</Col>
                            )}
                            <Col>
                            
                            </Col>
                        </Row>
                    )}
                </Container>
            </>
        );
    }

    return (
        <Card.Body style={{overflow: "hidden"}}>
            <Stack style={{width: "100%"}} direction="horizontal">
                <Card.Title>{strings.dictionary_title[lang]}</Card.Title>
                {wordObj != null ? <></> : 
                    <Form onSubmit={submitSearch}>
                        <Stack direction='horizontal'>
                            <Form.Control id="search" type="text" />
                            <Button type="submit">{strings.search[lang]}</Button>
                        </Stack>
                    </Form>
                }
            </Stack>
            <Container style={{maxHeight: "90%", overflowY: "auto", overflowX: "hidden"}}>
                <Content />
            </Container>
        </Card.Body>
    );
}

export default Dictionary