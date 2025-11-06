import { useState, useEffect, useContext } from 'react';

import SetList from './SetList.jsx';
import Set from './Set.jsx';
import WordDirectory from './WordDirectory.jsx';
import Word from './Word.jsx';
import { ToastContext } from './../context/ToastContext.jsx';

function SetWizard({ID}) {

	const modes = {
		LIST: 0,
		SET: 1,
		WORD: 2,
		PICKER: 3
	};

	const [mode, setMode] = useState(modes.SET);
	const [setID, setSetID] = useState(null);

	const setAPI = 'http://localhost:5050/api/sets';
	const dictAPI = 'http://localhost:5050/api/dictionary';
	
	useEffect(() => {
		if (setID != null)
			setMode(modes.SET);
		else
			setMode(modes.LIST);
	}, [setID]);

	return (<>
		{mode == modes.LIST &&
			<SetList ID={ID} view={(id) => {setSetID(id)}} api={setAPI} />
		}
		{mode == modes.SET &&
			<Set ID={ID} sID={setID} close={() => {setSetID(null)}} add={() => {setMode(modes.PICKER)}} api={setAPI}/>
		}
		{mode == modes.PICKER &&
			<h1>Pick words</h1>
		}
	</>);
}

export default SetWizard
