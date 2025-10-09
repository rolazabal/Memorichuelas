import { useState, useEffect } from 'react';

import SetList from './SetList.jsx';
import Set from './Set.jsx';

function SetWizard({sets, set, getSets, getSet, createSet, deleteSet, changeName, changeSetWords, close}) {

	const modes = {
		LIST: 0,
		SET: 1,
		PICKER: 2
	};
	const [mode, setMode] = useState(modes.SET);

	useEffect(() => {
		if (set != null)
			setMode(modes.SET)
		else
			setMode(modes.LIST)
	}, [set]);

	return (<>
		{mode == modes.LIST &&
			<SetList sets={sets} getSets={getSets} create={createSet} edit={getSet}/>
		}
		{mode == modes.SET &&
			<Set set={set} delete={deleteSet} updateName={changeName} updateWords={changeSetWords} close={close}/>
		}
		{mode == modes.PICKER &&
			<h1>Pick words</h1>
		}
	</>);
}

export default SetWizard