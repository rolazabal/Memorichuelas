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


function Dictionary() {
    const dict = [
        {word:"a",def:["def1","def2","def3"],ex:["ex1","ex2"]},
        {word:"b",def:["def1","def2"],ex:["ex1"]},
        {word:"c",def:["def1"],ex:["ex1"]},
        {word:"d",def:["def1","def2","def3","def4"],ex:["ex1"]},
        {word:"e",def:["def1","def2"],ex:["ex1"]},
        {word:"f",def:["def1","def2"],ex:["ex1"]}
    ];
    const entryHeight = 20;
    const boxHeight = 100;
    const columns = 2;

    function DictTable() {
        //compute rows
        let rows = [];
        let row = [];
        for (let i = 0; i < dict.length; i ++) {
            //alert("index " + i);
            row.push(dict[i]);
            //alert("pushed " + dict[i].word);
            //alert("check " + ((i + 1) % columns));
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
                            <th>{entry.word}</th>
                        )}
                    </tr>
                )}
            </tbody>
        );
    }

    return (
        <Card.Body>
            <Table>
                <DictTable />
            </Table>
        </Card.Body>
    );
}

export default Dictionary