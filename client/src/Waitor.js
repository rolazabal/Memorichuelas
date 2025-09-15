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
                res = await res.json();
                let id = await res.ID;
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
            return 1;
        } catch(error) {
            console.log(error);
            return -1;
        }
    }

    async createUser(user, pass) {
        try {
            let res = await fetch('http://localhost:5050/api/account', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'create', username: user, passkey: pass})
            });
            if (res.status < 300)
                return 1;
            else {
                if (res.json().error == 'username already exists!')
                    return -1;
                return false;
            }
        } catch(error) {
            console.log(error);
            return false;
        }
    }

    async deleteUser(uID) {
        try {
            let res = await fetch('http://localhost:5050/api/account', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'delete', userID: uID})
            });
            console.log("requested");
            if (res.status < 300)
                return 1;
            else
                return false;
        } catch(error) {
            console.log(error);
            return -1;
        }
    }

    async fetchUserInfo(uID) {
        try {
            let res = await fetch('http://localhost:5050/api/account', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'info', userID: uID})
            });
            if (res.status < 300) {
                res = await res.json();
                let info = res.info;
                return info;
            } else
                return false;
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
            if (res.status < 300)
                return 1;
            else {
                if (res.status == 403)
                    return false;
                return -1;
            }
        } catch(error) {
            console.log(error);
            return -1;
        }
    }

    //dictionary api
    async fetchDictPage(uID, letter) {
        try {
            let res = await fetch('http://localhost:5050/api/dictionary', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'page', letter: letter.toLowerCase(), userID: uID})
            });
            res = await res.json();
            console.log(res);
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