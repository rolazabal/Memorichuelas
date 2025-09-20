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
                return [id, false];
            } else {
                switch(res.status) {
                    case 403:
                        return [false, false];
                        break;
                    default:
                        return [-1, false];
                        break;
                }
            }
        } catch(error) {
            console.log(error);
            return [null, error];
        }
    }

    async logOutUser(uID) {
        try {
            await fetch('http://localhost:5050/api/account', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'logOut', userID: uID})
            });
            return [1, false];
        } catch(error) {
            console.log(error);
            return [null, error];
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
                return [1, false];
            else {
                if (res.json().error == 'username already exists!')
                    return [-1, false];
                return [false, false];
            }
        } catch(error) {
            console.log(error);
            return [null, error];
        }
    }

    async deleteUser(uID) {
        try {
            let res = await fetch('http://localhost:5050/api/account', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'delete', userID: uID})
            });
            if (res.status < 300)
                return [1, false];
            else
                return [false, false];
        } catch(error) {
            console.log(error);
            return [null, error];
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
                return [info, false];
            } else
                return [false, false];
        } catch(error) {
            console.log(error);
            return [null, error];
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
                return [1, false];
            else {
                if (res.status == 403)
                    return [false, false];
                return [-1, false];
            }
        } catch(error) {
            console.log(error);
            return [null, error];
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
            return [res.words, false];
        } catch(error) {
            console.log(error);
            return [null, error];
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
            return [res.word, false];
        } catch(error) {
            console.log(error);
            return [null, error];
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
            return [res.words, false];
        } catch(error) {
            console.log(error);
            return [null, error];
        }
    }

    //set api
    async fetchUserSets(uID) {
        try {
            let res = await fetch('http://localhost:5050/api/sets', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'sets', userID: uID})
            });
            if (res.status < 300) {
                res = await res.json();
                return [res.sets, false];
            }
            return [false, false];
        } catch(error) {
            console.log(error);
            return [null, error];
        }
    }

    async fetchSetObj(uID, sID) {
        try {
            let res = await fetch('http://localhost:5050/api/sets', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'set', setID: sID, userID: uID})
            });
            if (res.status < 300) {
                res = await res.json();
                return [res.set, false];
            }
            return [false, false];
        } catch(error) {
            console.log(error);
            return [null, error];
        }
    }

    async createSet(uID, name, words) {
        try {
            let res = await fetch('http://localhost:5050/api/sets', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'create', name: name, words: words, userID: uID})
            });
            if (res.status < 300) {
                res = await res.json();
                console.log(res);
                return [res.set, false];
            }
            return [false, false];
        } catch(error) {
            console.log(error);
            return [null, error];
        }
    }

    async deleteSet(uID, sID) {
        console.log(sID + " " + uID);
        try {
            let res = await fetch('http://localhost:5050/api/sets', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'delete', setID: sID, userID: uID})
            });
            if (res.status < 300) {
                res = await res.json();
                return [res.sets, false];
            }
            return [false, false];
        } catch(error) {
            console.log(error);
            return [null, error];
        }
    }

    async updateSetWords(uID, sID, words) {
        try {
            let res = await fetch('http://localhost:5050/api/sets', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'updateWords', setID: sID, words: words, userID: uID})
            });
            if (res.status < 300) {
                res = await res.json();
                return [res.set, false];
            }
            return [false, false];
        } catch(error) {
            console.log(error);
            return [null, error];
        }
    }

    async updateSetName(uID, sID, name) {
        try {
            let res = await fetch('http://localhost:5050/api/sets', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'updateName', setID: sID, name: name, userID: uID})
            });
            if (res.status < 300) {
                res = await res.json();
                return [res.set, false];
            }
            return [false, false];
        } catch(error) {
            console.log(error);
            return [null, error];
        }
    }
}

export default Waitor