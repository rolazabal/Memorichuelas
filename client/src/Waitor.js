class Waitor {
    ///variables
    userID = -1;

    ///functions
    setUserID(id) {
        this.userID = id;
    }

    hasLoggedIn() {
        return (this.userID != -1);
    }

    //http functions
    async fetchUserID(user, pass) {
        try {
            let res = await fetch('http://localhost:5050/api/account', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'logIn', username: "admin", passkey: 12345678})
            });
            res = await res.json();
            let id = res.id;
            this.setUserID(id);
        } catch(error) {
            console.log(error);
        }
    }

    async logOutUser() {
        try {
            await fetch('http://localhost:5050/api/account', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'logOut', userID: this.userID})
            });
            this.setUserID(-1);
        } catch(error) {
            console.log(error);
        }
    }

    async fetchDictPage(page) {
        try {
            let res = await fetch('http://localhost:5050/api/dictionary', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'page', page: page, userID: this.userID})
            });
            return await res.json().words;
        } catch(error) {
            console.log(error);
            return [];
        }
    };

    async fetchWordObj(id) {
        try {
            let res = await fetch('http://localhost:5050/api/dictionary', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'word', wordID: id, userID: this.userID})
            });
            return await res.json().word;
        } catch(error) {
            console.log(error);
            return {};
        }
    }

    async fetchUserInfo() {
        try {
            let res = await fetch('http://localhost:5050/api/account', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'info', userID: this.userID})
            });
            return await res.json().info;
        } catch(error) {
            console.log(error);
            return {};
        }
    }
}

export default Waitor