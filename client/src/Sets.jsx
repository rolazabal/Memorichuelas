import { Dropdown, ListGroup, Row } from 'react-bootstrap';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import SetPage from './SetPage.jsx';

function Sets({sets, updateSets}) {

    const [index, setIndex] = useState(0);
    const [viewSet, setViewSet] = useState(-1);

    const addSet = () => {
        setIndex(index + 1);
        let sName = "set " + index;
        updateSets([...sets, {name:sName, words:[0], score:0.00}]);
    }

    function SetDisplay() {
        if (viewSet == -1) {
            return (
                <ListGroup>
                    {sets.map((item) => (
                        <ListGroup.Item action onClick={() => setViewSet(sets.indexOf(item))}>
                            {item.name} : {item.score}
                            {/* <Button onClick={() => {updateSets(sets.filter(a => a != item));}}>Delete</Button> */}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            );
        }
        return (
            <SetPage set={sets[viewSet]} />
        );
    }

    return (
        <Card.Body>
            <Card.Title>
                Sets
                <Button onClick={addSet}>Create set</Button>
                <Dropdown>
                    <Dropdown.Toggle id="sort-dropdown">
                        Sort
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item>
                            Name A-Z
                        </Dropdown.Item>
                        <Dropdown.Item>
                            Name Z-A
                        </Dropdown.Item>
                        <Dropdown.Item>
                            Score increasing
                        </Dropdown.Item>
                        <Dropdown.Item>
                            Score decreasing
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Card.Title>
            <SetDisplay />
        </Card.Body>
    )
}

export default Sets