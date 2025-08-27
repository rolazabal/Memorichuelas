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


function Dictionary({lang, strings, getPage, getWord}) {
    const [dictPage, updateDictPage] = useState([]);
    const entryHeight = 20;
    const boxHeight = 100;
    const columns = 2;
    const mode = "DISPLAY"; //decide behavior of component: DISPLAY, SELECT, or EDIT
    //TODO: make displayWord a variable of App.jsx passed down to dictionary?
    const [displayWord, updateDisplayWord] = useState({});

    async function fetchPage(page) {
        let list = await getPage(page);
        updateDictPage(list);
    }

    function Display() {
        if (Object.entries(displayWord).length > 0) {
            return (
                <div>
                    <h1>{displayWord.name}</h1>
                    <h2>{strings.definition[lang]}</h2>
                    <ul>
                        {displayWord.defs.map((def) =>
                            <li>{def}</li>
                        )}
                    </ul>
                    <h2>{strings.example[lang]}</h2>
                    <ul>
                        {displayWord.exs.map((ex) =>
                            <li>{ex}</li>
                        )}
                    </ul>
                    <Button onClick={() => {updateDisplayWord({})}}>{strings.back[lang]}</Button>
                </div>
            );
        } else { 
            //fetch page words
            console.log(dictPage);
            if (dictPage.length == 0) fetchPage(10);
            //compute rows
            let rows = [];
            let row = [];
            for (let i = 0; i < dictPage.length; i ++) {
                // for each word, add to row until row is full, then add full row to rows array
                row.push(dictPage[i]);
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
                                        <th key={entry[0]} onClick={() => {updateDisplayWord(getWord(entry[0]))}}>{entry[1]}</th>
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
    }

    function Content() {
        switch(mode) {
            case "DISPLAY":
                return <Display />;
            break;
            case "SELECT":
                return;
            break;
            case "EDIT":
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