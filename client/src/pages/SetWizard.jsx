import { useState, useEffect, useContext } from 'react';

import SetList from './SetList.jsx';
import Set from './Set.jsx';
import { ToastContext } from './../context/ToastContext.jsx';

function SetWizard({ID}) {

	const modes = {
		LIST: 0,
		SET: 1,
		PICKER: 2
	};

	const [mode, setMode] = useState(modes.SET);
	const [set, setSet] = useState(null);
	const [sets, setSets] = useState(null);
	const [fakeSet, setFakeSet] = useState({
		setID: 300,
		name: "comidas",
		score: 0.25,
		words: [
			{
				wordID: 500,
				name: "A",
				score: 1.00
			},
			{
				wordID: 444,
				name: "B",
				score: 0.25
			}
		]
	});
	const [fakeSetList, setFakeSetList] = useState([
		{
			setID: 300,
			name: "comidas",
			score: 0.25
		},
		{
			setID: 301,
			name: "frases",
			score: 1.00
		}
	]);

	const { toasts, showToast } = useContext(ToastContext);

	useEffect(() => {
		if (set != null)
			setMode(modes.SET)
		else
			setMode(modes.LIST)
	}, [set]);

	const setAPI = 'http://localhost:5050/api/sets';
	
	async function getSets() {
		try {
			let res = await fetch(setAPI, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({action: 'sets', userID: data.userID})
			});
			if (res.status < 300) {
				res = await res.json();
				let list = res.sets;
				setSets(list);
			} else {
				showToast(toasts.TIMEOUT);
				// logOut(true);
			}
		} catch(error) {
			showToast(toasts.ERR);
		}
	}

	async function getSet(sID) {
		setSet(fakeSet);
		try {
	    let res = await fetch(setAPI, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({action: 'set', setID: sID, userID: data.userID})
	    });
	    if (res.status < 300) {
		res = await res.json();
				let obj = res.set;
				setSet(obj);
	    }
	    showToast(toasts.TIMEOUT);
			// logOut(true);
	} catch(error) {
	    showToast(toasts.ERR);
	}
	}

	async function changeSetWords(sID, words) {
		try {
	    let res = await fetch(setAPI, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({action: 'updateWords', setID: sID, words: words, userID: data.userID})
	    });
	    if (res.status < 300) {
		res = await res.json();
				let obj = res.set;
				setSet(obj);
				showToast(toasts.SET_WORDS_S);
	    }
	    showToast(toasts.TIMEOUT);
			// logOut(true);
	} catch(error) {
	    showToast(toasts.ERR);
	}
	}

	async function create(name) {
		let temp = fakeSet;
		temp = {...temp, name: name};
		setFakeSetList([...fakeSetList, temp]);
	try {
	    let res = await fetch(setAPI, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({action: 'create', name: name, userID: data.userID})
	    });
	    if (res.status < 300) {
		res = await res.json();
				let obj = res.set;
		setSet(obj);
				showToast(toasts.SET_CREATE_S);
	    }
	    showToast(toasts.TIMEOUT);
			// logOut(true);
	} catch(error) {
	    showToast(toasts.ERR);
	}
	}

	async function deleteSet(sID) {
	try {
	    let res = await fetch(setAPI, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({action: 'delete', setID: sID, userID: data.userID})
	    });
	    if (res.status < 300) {
		res = await res.json();
				let list = res.sets;
				setSets(list);
				showToast(toasts.SET_DEL_S);
	    }
	    showToast(toasts.TIMEOUT);
			// logOut(true);
	} catch(error) {
	    showToast(toasts.ERR);
	}
	}

	async function changeName(sID, name) {
	try {
	    let res = await fetch(setAPI, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({action: 'updateName', setID: sID, name: name, userID: data.userID})
	    });
	    if (res.status < 300) {
		res = await res.json();
				let obj = res.set;
				setSet(obj);
				showToast(toasts.SET_NAME_S);
	    }
	    showToast(toasts.TIMEOUT);
			// logOut(true);
	} catch(error) {
	    showToast(toasts.ERR);
	}
	}

	return (<>
		{mode == modes.LIST &&
			<SetList sets={fakeSetList} getSets={getSets} create={create} edit={getSet}/>
		}
		{mode == modes.SET &&
			<Set set={fakeSet} deleteSet={deleteSet} updateName={changeName} updateWords={changeSetWords} close={() => {setSet(null)}}/>
		}
		{mode == modes.PICKER &&
			<h1>Pick words</h1>
		}
	</>);
}

export default SetWizard
