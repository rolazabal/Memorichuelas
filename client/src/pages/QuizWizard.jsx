import { useState, useEffect, useContext } from 'react';
import Quiz from './Quiz.jsx';
import Word from './Word.jsx';

function timer() {
    ;
}

function QuizWizard({sID, view, quit}) {

    const modes = {
        DEF: 0,
        Q_DEF_M: 1, // multiple choice definition question
        Q_DEF_S: 2, // spell word definition question
        Q_EX: 3
    };

    const [mode, setMode] = useState(modes.DEF);
    const [wordScores, setWordScores] = useState(null);
    const [wordID, setWordID] = useState(null);

    return (<>
        <p>
            Quiz game state machine
        </p>
    </>);
}

export default QuizWizard