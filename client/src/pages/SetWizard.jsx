import { useState, useEffect } from 'react';

import SetList from './SetList.jsx';
import Set from './Set.jsx';

function SetWizard({ID}) {

	const modes = {
		LIST: 0,
		SET: 1,
		PICKER: 2
	};

	const [mode, setMode] = useState(modes.SET);
	const [set, setSet] = useState(null);
	const [sets, setSets] = useState(null);

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
            }
            showToast(toasts.TIMEOUT);
			logOut(true);
        } catch(error) {
            showToast(toasts.ERR);
        }
	}

	async function getSet(sID) {
		updateData({setObj: fakeSet});
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
			logOut(true);
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
			logOut(true);
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
			logOut(true);
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
			logOut(true);
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
			logOut(true);
        } catch(error) {
            showToast(toasts.ERR);
        }
	}

	return (<>
		{mode == modes.LIST &&
			<SetList sets={sets} getSets={getSets} create={create} edit={getSet}/>
		}
		{mode == modes.SET &&
			<Set set={set} deleteSet={deleteSet} updateName={changeName} updateWords={changeSetWords} close={() => {setSet(null)}}/>
		}
		{mode == modes.PICKER &&
			<h1>Pick words</h1>
		}
	</>);
}

export default SetWizard