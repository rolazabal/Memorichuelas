//interface that handles communicating with the server for the app
class Waitor {

    ///functions
    //account api
    async fetchUserID(user, pass) {
        //returns -1 if username or password incorrect, false if user is logged in
        try {
            let res = await fetch('http://localhost:5050/api/account', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'logIn', username: user, passkey: pass})
            });
            if (res.status < 300) {
                let id = res.json().ID;
                return id;
            } else {
                switch(res.status) {
                    case 403:
                        return false;
                    break;
                    default:
                        return -1;
                    break;
                }
            }
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
        try {
            let res = await fetch('http://localhost:5050/api/account', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'create', username: user, passkey: pass})
            });
            return (res.status < 300);
        } catch(error) {
            //invalid creds or username exists
            console.log(error);
            return false;
        }
    }

    async deleteUser(uID) {
        try {
            let res = await fetch('', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'delete', userID: uID})
            });
            if ('error' in res) {
                console.log(res.error);
                return false;
            }
            return true;
        } catch(error) {
            console.log(error);
            return false;
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
            //handle exception
            if ('error' in res) {
                console.log(res.error);
                return {};
            }
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
            console.log(res.status);
            if ('error' in await res.json()) {
                return false;
            }
            return true;
        } catch(error) {
            console.log(error);
            return false;
        }
    }

    //dictionary api
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

    async dictionarySearch(uID, string) {
        try {
            let res = await fetch('http://localhost:5050/api/dictionary', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'search', string: string, userID: uID})
            });
            res = await res.json();
            return res.words;
        } catch(error) {
            console.log(error);
            return [];
        }
    }

    //set api
    async fetchUserSets(uID) {

    }

    async fetchSetWords(wID) {
        
    }
}

export default Waitor