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


function Dictionary({lang, strings, pageWords, wordObj, getPage, getWord, setWordObj}) {
    const columns = 2;
    const mode = "display"; //decide behavior of component: DISPLAY, SELECT, or EDIT
    const alph = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    function Display() {
        if (wordObj != null) { 
            return (
                <>
                    <Stack direction="horizontal">
                        <h2>{wordObj.name}</h2>
                        <Button className="ms-auto" onClick={() => {setWordObj(null)}}>{strings.back[lang]}</Button>
                    </Stack>
                    <Container>
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
                </>
            );
        }
        //fetch page words
        if (pageWords.length == 0) getPage(alph[0]);
        //compute rows
        let rows = [];
        let row = [];
        for (let i = 0; i < pageWords.length; i ++) {
            // for each word, add to row until row is full, then add full row to rows array
            row.push(pageWords[i]);
            if ((i + 1) % columns == 0) {
                rows.push(row)
                row = [];
            }
        }
        return (
            <>
                <Stack direction="horizontal">
                    {alph.map((letter) =>
                        <Button onClick={() => {getPage(letter)}}><small>{letter}</small></Button>
                    )}
                </Stack>
                <Table>
                    {rows.map((row) => 
                        <Row>
                            {row.map((entry) => 
                                <Col id={parseInt(entry[0])} onClick={() => {getWord(parseInt(entry[0]))}}>{entry[1]}</Col>
                            )}
                        </Row>
                    )}
                </Table>
            </>
        );
    }

    function Select() {

        return (
            <Table>
            </Table>
        );
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

    return (
        <Card.Body>
            <Stack direction="horizontal">
                <Card.Title>{strings.dictionary_title[lang]}</Card.Title>
                {wordObj != null ? <></> : <Button className="ms-auto">{strings.search[lang]}</Button>}
            </Stack>
            <Content />
        </Card.Body>
    );
}

export default Dictionary