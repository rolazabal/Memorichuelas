import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import { Worker } from 'worker_threads';

///variables
//queries
const fetch_user = 'SELECT ("userID") FROM "Memorichuelas"."Users" WHERE name = $1 AND passkey = $2';
const fetch_user_status = 'SELECT (active) FROM "Memorichuelas"."Users" WHERE "userID" = $1';
const fetch_set_ids = 'SELECT "setID" FROM "Memorichuelas"."Sets" WHERE "userID" = $1'; //get all user's set's ids as array
const fetch_set_words = 'SELECT (word."wordID", name, score) FROM "Memorichuelas"."Words" AS word JOIN "Memorichuelas"."SetWords" AS setword ON word."wordID" = setword."wordID" WHERE "setID" = $1';
const create_user = 'INSERT INTO "Memorichuelas"."Users"(name, passkey, date) VALUES ($1, $2, CURRENT_DATE)';
const fetch_word = 'SELECT (name) FROM "Memorichuelas"."Words" WHERE "wordID" = $1';
const fetch_definitions = 'SELECT (definition) FROM "Memorichuelas"."Definitions" WHERE "wordID" = $1';
const fetch_examples = 'SELECT (example) FROM "Memorichuelas"."Examples" WHERE "wordID" = $1';
const fetch_active_users = 'SELECT ("userID", timestamp) FROM "Memorichuelas"."Users" WHERE active = true';
const activate_user = 'UPDATE "Memorichuelas"."Users" SET active = true, timestamp = CURRENT_TIMESTAMP WHERE "userID" = $1';
const deactivate_user = 'UPDATE "Memorichuelas"."Users" SET active = false, timestamp = null WHERE "userID" = $1';
const fetch_user_info = 'SELECT (name, date) FROM "Memorichuelas"."Users" WHERE "userID" = $1';
const update_user_name = 'UPDATE "Memorichuelas"."Users" SET name = $2 WHERE "userID" = $1';
const username_total = 'SELECT COUNT(*) FROM "Memorichuelas"."Users" GROUP BY name HAVING name = $1';
const remove_user = 'DELETE FROM "Memorichuelas"."Users" WHERE "userID" = $1'; //write trigger on database to clear all user sets
const remove_set = 'DELETE FROM "Memorichuelas"."Sets" WHERE "setID" = $1'; //write trigger on database to clear all set words
const regex_words = 'SELECT ("wordID", name) FROM "Memorichuelas"."Words" WHERE name LIKE $1';

//pool database connection
const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
});
const client = await pool.connect();

//express server
const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());

//monitor thread
const monitor = new Worker("./monitor.js");
const user_timeout_ms = 1800000; //30 minutes

///functions
//database functions
async function deactivateUser(userID) {
    await client.query(deactivate_user, [userID]);
}

monitor.on("message", async (message) => {
    //user timeout logic
    let res = await client.query(fetch_active_users);
    for (let x of res.rows) {
        //id and timestamp info
        let data = x.row.substring(1, x.row.length - 1).split(",");
        let userID = data[0];
        let timeStamp = new Date(data[1]);
        //check if date is valid
        if (isNaN(timeStamp)) await deactivateUser(userID);
        else {
            let currDate = new Date();
            let check = currDate.getTime() - timeStamp.getTime() > user_timeout_ms;
            if (check) await deactivateUser(userID);
        }
    }
    console.log(message);
});

async function userActive(userID) {
    //check if user is active
    let res = await client.query(fetch_user_status, [userID]);
    let active = false;
    if (res.rows.length > 0) {
        active = res.rows[0].active;
    }
    return active;
}

async function logAction(userID) {
    await client.query(activate_user, [userID]);
}

async function userID(username, passkey) {
    //get user id
    let res = await client.query(fetch_user, [username, passkey]);
    if (res.rows.length == 0) return -0;
    let id = res.rows[0].userID;
    return id;
}



async function createUser(username, passkey) {
    //create user
    await client.query(create_user, [username, passkey]);
}

async function usernameExists(username) {
    let res = await client.query(username_total, [username]);
    let count = res.rows[0];
    if (count != undefined) return true;
    return false;
}

async function wordById(wordID) {
    let res = await client.query(fetch_word, [wordID]);
    let name = res.rows[0].name;
    res = await client.query(fetch_definitions, [wordID]);
    let defs = [];
    for (let x of res.rows)
        defs.push(x.definition);
    res = await client.query(fetch_examples, [wordID]);
    let exs = [];
    for (let y of res.rows)
        exs.push(y.example);
    let word = {
        name: name,
        defs: defs,
        exs: exs
    };
    return word;
}

async function dictionaryPage(letter) {
    letter = letter + '%'
    let res = await client.query(regex_words, [letter]);
    let list = [];
    for (let x of res.rows) {
        list.push(x.row.substring(1, x.row.length - 1).replace(/"/g, "").split(","));
    }
    return list;
}

async function userInfo(userID) {
    let res = await client.query(fetch_user_info, [userID]);
    res = res.rows[0].row;
    let list = res.substring(1, res.length -1).split(",");
    let info = {name: list[0], date: list[1]};
    return info;
}

async function userSets(userID) {
    let res = await client.query(fetch_set_ids, [userID]);
    let setIds = res.rows;
    let sets = [];
    if (setIds.length > 0) {
        let set = [];
        for (let x of setIds) {
            res = await client.query(fetch_set_words, [x.setID]);
            let words = res.rows;
            if (words.length > 0) {
                for (let y of words) {
                    y = y.row.substring(1, y.row.length - 1).split(",");
                    y[0] = parseInt(y[0]);
                    y[2] = parseFloat(y[2]);
                    set.push({id: y[0], name: y[1], score: y[2]});
                }
            }
            sets.push(set);
            set = [];
        }
    }
    return sets;
}

async function updateUsername(userID, username) {
    //update username
    await client.query(update_user_name, [userID, username]);
}

async function dictionarySearch(string) {
    //empty search gets empty result
    if (string == "") return null;
    string = '%' + string + '%';
    let res = await client.query(regex_words, [string]);
    let list = [];
    for (let x of res.rows) {
        list.push(x.row.substring(1, x.row.length - 1).replace(/"/g, "").split(","));
    }
    return list;
}

async function deleteUser(userID) {
    await client.query(remove_user, [userID]);
}

//http functions
//account api
app.post('/api/account', async (req, res) => {
    let id = -0;
    let op = false;
    let action = req.body.action;
    let user = "";
    let pass = -0;
    switch(action) {
        case 'logIn':
            //check credentials
            id = await userID(req.body.username, req.body.passkey);
            if (!id) {
                res.status(400).json({error: 'invalid log in credentials!'});
            } else {
                //check if user is active
                op = await userActive(id);
                if (op) res.status(403).json({msg: 'user is already logged in!'});
                else {
                    //activate user
                    await logAction(id);
                    res.status(200).json({ID: id});
                }
            }
        break;
        case 'logOut':
            id = req.body.userID;
            //check if user is active
            op = await userActive(id);
            if (op) {
                await deactivateUser(id);
                res.status(200).json({msg: 'success!'});
            } else res.status(403).json({error: 'user has timed out!'});
        break;
        case 'info':
            id = req.body.userID;
            //check if user is active
            op = await userActive(id);
            if (op) {
                //log action
                await logAction(id);
                let info = await userInfo(id);
                res.status(200).json({info});
                //console.log(info);
            } else res.status(403).json({error: 'user has timed out!'});
        break;
        case 'create':
            user = req.body.username;
            pass = req.body.passkey;
            //validate inputs
            if (false) res.status(400).json({error: 'invalid credentials'}); //TODO: implement this
            //check if username exists
            op = await usernameExists(user);
            if (op) res.status(400).json({error: 'username already exists!'});
            else {
                await createUser(user, pass);
                res.status(200).json({msg: 'success!'});
            }
        break;
        case 'sets':
            id = req.body.userID;
            op = await userActive(id);
            if (op) {
                await logAction(id);
                let list = await userSets(id);
                res.status(200).json({sets: list});
            } else res.status(403).json({error: 'user has timed out!'});
        break;
        case 'updateName':
            id = req.body.userID;
            user = req.body.username;
            let active = await userActive(id);
            if (active) {
                //validate username
                if (false) res.status(400).json({error: 'invalid credentials'}); //TODO: implement this
                //check if exists
                op = await usernameExists();
                if (!op) {
                    //log action
                    await logAction(id);
                    await updateUsername(id, user);
                } else res.status(400),json({error: 'username already exists!'});
            } else res.status(403).json({error: 'user has timed out!'});
        break;
        case 'delete':
            id = req.body.userID;
            op = await userActive(id);
            if (op) {
                await deleteUser(id);
                res.status(200).json({msg: 'success!'});
            } else res.status(403).json({error: 'user has timed out!'});
        break;
        default:
            res.status(404).json({error: 'invalid action!'});
            //console.log("account access error!");
        break;
    }
});

//dictionary api
app.post('/api/dictionary', async (req, res) => {
    //log action if user is active
    let id = req.body.userID;
    let list = [];
    //log action
    await logAction(id);
    switch(req.body.action) {
        case 'page':
            list = await dictionaryPage(req.body.letter);
            res.status(200).json({words: list});
            //console.log(list);
        break;
        case 'word':
            let obj = await wordById(req.body.wordID);
            res.status(200).json({word: obj});
            //console.log(obj);
        break;
        case 'search':
            list = await dictionarySearch(req.body.string);
            res.status(200).json({words: list});
            //console.log("search for: " + req.body.string);
        break;
        default:
            res.status(404).json({error: 'invalid action!'});
            //console.log("dictionary access error!");
        break;
    }
});

//sets api
app.post('/api/sets', async (req, res) => {
    switch(req.body.action) {
        case 'wordScores':

        break;
        case 'create':

        break;
        case 'delete':

        break;
        case 'addWord':

        break;
        case 'removeWord':

        break;
        default:
            res.status(404).json({error: 'invalid action!'});
        break;
    }
});

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});