import { useState, useEffect } from 'react';

import Word from './Word.jsx';
import WordDirectory from './WordDirectory.jsx';

function DictionaryWizard({ID}) {
	
	const modes = {
		WORD: 0,
		DIRECTORY: 1
	};

	const [mode, setMode] = useState(modes.DIRECTORY);
	const [wordID, setWordID] = useState(null);

	useEffect(() => {
		if (wordID == null)
			setMode(modes.DIRECTORY);
		else
			setMode(modes.WORD);
	}, [wordID]);

	const dictAPI = 'http://localhost:5050/api/dictionary';

	return (
		<>
			{mode == modes.DIRECTORY &&
				<WordDirectory ID={ID} view={(id) => setWordID(id)} api={dictAPI} />
			}
			{mode == modes.WORD &&
				<Word uID={ID} wID={wordID} close={() => setWordID(null)} api={dictAPI} />
			}
		</>
	);
}

export default DictionaryWizard
