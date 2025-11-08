import { useState, useEffect, useContext } from 'react';

import SetList from './SetList.jsx';
import Set from './Set.jsx';
import WordDirectory from './WordDirectory.jsx';
import Word from './Word.jsx';
import { LocContext } from './../context/LocContext.jsx';
import { ToastContext } from './../context/ToastContext.jsx';

function SetWizard({ID}) {

	const modes = {
		LIST: 0,
		SET: 1,
		WORD: 2,
		PICKER: 3
	};

	const [mode, setMode] = useState(modes.LIST);
	const [setID, setSetID] = useState(null);
	const [wordID, setWordID] = useState(null);

	const { strings } = useContext(LocContext);
	const { toasts, showToast } = useContext(ToastContext);

	const setAPI = 'http://localhost:5050/api/sets';
	const dictAPI = 'http://localhost:5050/api/dictionary';
	
	async function addWord(w_id) {
                try {
                        let res = await fetch(setAPI + '/' + ID + '/' + setID + '/word', {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify({word_id: w_id})
                        });
                        if (res.status == 200) {
                                res = await res.json();
			} else if (res.status == 403) {
                                showToast(toasts.TIMEOUT);
                        } else {
                                showToast(toasts.ERR);
                        }
                } catch(error) { showToast(toasts.ERR); }
        }

	useEffect(() => {
		if (setID != null)
			setMode(modes.SET);
		else
			setMode(modes.LIST);
	}, [setID]);

	useEffect(() => {
		async function add() {
			await addWord(wordID);
		}
		if (wordID == null) {
			if (mode == modes.WORD)
				setMode(modes.SET);
		} else if (mode == modes.SET) {
			setMode(modes.WORD);
		} else if (mode == modes.PICKER) {
			add();
			setMode(modes.SET);
		}
	}, [wordID]);

	return (<>
		{mode == modes.LIST &&
			<SetList ID={ID} view={(id) => setSetID(id)} api={setAPI} />
		}
		{mode == modes.SET &&
			<Set ID={ID} sID={setID} close={() => setSetID(null)} add={() => setMode(modes.PICKER)} view={(wID) => setWordID(wID)} api={setAPI} />
		}
		{mode == modes.WORD &&
			<Word uID={ID} wID={wordID} close={() => setWordID(null)} api={dictAPI} />
		}
		{mode == modes.PICKER &&
			<WordDirectory ID={ID} view={(wID) => setWordID(wID)} api={dictAPI} />
		}
	</>);
}

export default SetWizard
