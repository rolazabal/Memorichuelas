class Waitor {

    ///functions
    async fetchUserID(user, pass) {
        try {
            let res = await fetch('http://localhost:5050/api/account', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'logIn', username: user, passkey: pass})
            });
            res = await res.json();
            let id = res.id;
            return id;
        } catch(error) {
            console.log(error);
            return -1;
        }
    }

    async logOutUser(uID) {
        try {
            await fetch('http://localhost:5050/api/account', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'logOut', userID: uID})
            });
            return true;
        } catch(error) {
            console.log(error);
            return false;
        }
    }

    async createUser(user, pass) {
        console.log("test1");
        try {
            await fetch('http://localhost:5050/api/account', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'create', username: user, passkey: pass})
            });
            console.log("test2");
            return true;
        } catch(error) {
            console.log(error);
            return false;
        }
    }

    async fetchDictPage(uID, letter) {
        try {
            let res = await fetch('http://localhost:5050/api/dictionary', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'page', letter: letter, userID: uID})
            });
            res = await res.json();
            return res.words;
        } catch(error) {
            console.log(error);
            return [];
        }
    };

    async fetchWordObj(uID, wID) {
        try {
            let res = await fetch('http://localhost:5050/api/dictionary', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'word', wordID: wID, userID: uID})
            });
            res = await res.json();
            return res.word;
        } catch(error) {
            console.log(error);
            return {};
        }
    }

    async fetchUserInfo(uID) {
        try {
            let res = await fetch('http://localhost:5050/api/account', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'info', userID: uID})
            });
            res = await res.json();
            return res.info;
        } catch(error) {
            console.log(error);
            return {};
        }
    }

    async updateUsername(uID, user) {
        try {
            let res = await fetch('http://localhost:5050/api/account', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'updateName', userID: uID, username: user})
            });
            //handle exception
            //res = await res.json();
            return true;
        } catch(error) {
            console.log(error);
            return false;
        }
    }

    async fetchUserSets(uID) {

    }

    async fetchSetWords(wID) {
        
    }
}

export default Waitor