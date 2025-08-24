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


function Dictionary({lang, strings}) {
    const [dictPage, updateDictPage] = useState([]);
    const entryHeight = 20;
    const boxHeight = 100;
    const columns = 2;

    const fetchDictPage = async() => {
        try {
            let response = await fetch('http://localhost:5050/api/dictionary');
            let newPage = await response.json();
        if (newPage) {
            updateDictPage(newPage.page);
            return true;
        }
        } catch(error) {
        console.log(error);
        return false;
        }
    };

    fetchDictPage();

    function DictTable() {
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
            <tbody>
                {rows.map((row) => 
                    <tr>
                        {row.map((entry) => 
                            <th>{entry[1]}</th>
                        )}
                    </tr>
                )}
            </tbody>
        );
    }

    return (
        <Card.Body>
            <Card.Title>{strings.dictionary_title[lang]}</Card.Title>
            <Table>
                <DictTable />
            </Table>
            <Button>Nav buttons</Button>
        </Card.Body>
    );
}

export default Dictionary