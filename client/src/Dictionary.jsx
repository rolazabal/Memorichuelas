import { createContext, useState } from 'react';
import './App.css';
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


function Dictionary({lang, strings, pageWords, wordObj, getPage, getWord, setWordObj}) {
    const columns = 2;
    const mode = "display"; //decide behavior of component: DISPLAY, SELECT, or EDIT

    function Display() {
        if (wordObj != null) { 
            return (
                <>
                    <h1>
                        {wordObj.name}
                        <Button onClick={() => {setWordObj(null)}}>{strings.back[lang]}</Button>
                    </h1>
                    {wordObj.defs.length > 0 ? 
                        <>
                            <h2>{strings.definition[lang]}</h2>
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
                            <h2>{strings.example[lang]}</h2>
                            <ul>
                                {wordObj.exs.map((ex) =>
                                    <li>{ex}</li>
                                )}
                            </ul>
                        </> 
                        : <></>
                    }
                </>
            );
        }
        //fetch page words
        if (pageWords.length == 0) getPage(10);
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
                <Table>
                    <tbody>
                        {rows.map((row) => 
                            <tr>
                                {row.map((entry) => 
                                    <th id={parseInt(entry[0])} onClick={async () => {await getWord(parseInt(entry[0]))}}>{entry[1]}</th>
                                )}
                            </tr>
                        )}
                    </tbody>
                </Table>
                <Button>{"<"}</Button>
                {"0"}
                <Button>{">"}</Button>
            </>
        );
    }

    function Select() {

        return (
            <>
                <Table>
                    <tbody>
                        <tr>
                            <th>
                                <tr>
                                    <th>
                                        {"hey"}
                                    </th>
                                </tr>
                            </th>
                            <th>
                                {"hii"}
                            </th>
                        </tr>
                    </tbody>
                </Table>
            </>
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
            <Card.Title>{strings.dictionary_title[lang]}</Card.Title>
            <Content />
        </Card.Body>
    );
}

export default Dictionary