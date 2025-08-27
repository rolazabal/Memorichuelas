import { Dropdown, ListGroup, Row } from 'react-bootstrap';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import SetPage from './SetPage.jsx';

function Sets({lang, strings}) {

    const [sets, setSets] = useState([]);
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
                <Card.Body>
                    <Card.Title>
                        {strings.sets_title[lang]}
                        <Button onClick={addSet}>{strings.set_create[lang]}</Button>
                        <Dropdown>
                            <Dropdown.Toggle id="sort-dropdown">
                                {strings.sort[lang]}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item>
                                    {strings.sort_alphi[lang]}
                                </Dropdown.Item>
                                <Dropdown.Item>
                                    {strings.sort_alphd[lang]}
                                </Dropdown.Item>
                                <Dropdown.Item>
                                    {strings.sort_scorei[lang]}
                                </Dropdown.Item>
                                <Dropdown.Item>
                                    {strings.sort_scored[lang]}
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Card.Title>
                    <ListGroup>
                        {sets.map((item) => (
                            <ListGroup.Item action onClick={() => setViewSet(sets.indexOf(item))}>
                                {item.name} : {item.score}
                                {/* <Button onClick={() => {updateSets(sets.filter(a => a != item));}}>Delete</Button> */}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card.Body>
            );
        }
        return (
            <SetPage lang={lang} strings={strings} set={sets[viewSet]} />
        );
    }

    return (
        <SetDisplay />
    )
}

export default Sets