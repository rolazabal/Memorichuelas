import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import { Worker } from 'worker_threads';

///variables
//queries
const fetch_user = 'SELECT ("userID") FROM "Memorichuelas"."Users" WHERE name = $1 AND passkey = $2';
const fetch_user_status = 'SELECT (active) FROM "Memorichuelas"."Users" WHERE "userID" = $1';
const fetch_set_ids = 'SELECT "setID" FROM "Memorichuelas"."Sets" WHERE "userID" = $1'; //get all user's set's ids as array
const fetch_set_words = 'SELECT (word."wordID", name, score) FROM "Memorichuelas"."Words" AS word ' + 
    'JOIN "Memorichuelas"."SetWords" AS setword ON word."wordID" = setword."wordID" WHERE "setID" = $1';
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
const remove_set_words = 'DELETE FROM "Memorichuelas"."SetWords" WHERE "setID" = $1';
const add_set_word = 'INSERT INTO "Memorichuelas"."SetWords"("setID", "wordID") VALUES ($1, $2)';
const fetch_user_sets = 'SELECT ("setID", name, score) FROM "Memorichuelas"."Sets" WHERE "userID" = $1';
const fetch_set = 'SELECT ("setID", name, score) FROM "Memorichuelas"."Sets" WHERE "setID" = $1';
const create_set = 'INSERT INTO "Memorichuelas"."Sets"("userID", name) VALUES ($1, $2) RETURNING "setID"';
const update_set_name = 'UPDATE "Memorichuelas"."Sets" SET name = $2 WHERE "setID" = $1';
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
function parseRow(str) {
    return str.substring(1, str.length - 1).replace(/"/g, "").split(",");
}

//database functions
async function deactivateUser(userID) {
    await client.query(deactivate_user, [userID]);
}

monitor.on("message", async (message) => {
    //user timeout logic
    let res = await client.query(fetch_active_users);
    for (let x of res.rows) {
        //id and timestamp info
        let data = parseRow(x.row);
        let userID = data[0];
        let timeStamp = new Date(data[1]);
        if (isNaN(timeStamp)) 
            await deactivateUser(userID);
        else {
            let currDate = new Date();
            let check = currDate.getTime() - timeStamp.getTime() > user_timeout_ms;
            if (check) await deactivateUser(userID);
        }
    }
    console.log(message);
});

async function userActive(userID) {
    let res = await client.query(fetch_user_status, [userID]);
    let active = res.rows[0].active;
    if (!active) return false;
    return active;
}

async function logAction(userID) {
    await client.query(activate_user, [userID]);
}

async function userID(username, passkey) {
    let res = await client.query(fetch_user, [username, passkey]);
    if (res.rows.length == 0) return -0;
    let id = res.rows[0].userID;
    return id;
}

async function createUser(username, passkey) {
    await client.query(create_user, [username, passkey]);
}

async function usernameExists(username) {
    let res = await client.query(username_total, [username]);
    let count = res.rows[0];
    return (count != undefined);
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
    letter = letter + '%';
    let res = await client.query(regex_words, [letter]);
    let list = [];
    for (let x of res.rows)
        list.push(parseRow(x.row));
    return list;
}

async function userInfo(userID) {
    let res = await client.query(fetch_user_info, [userID]);
    res = res.rows[0].row;
    let list = parseRow(res);
    let info = {
        name: list[0], 
        date: list[1]
    };
    return info;
}

async function userSets(userID) {
    let res = await client.query(fetch_user_sets, [userID]);
    res = res.rows;
    let sets = [];
    if (res.length == 0)
        return sets;
    for (let x of res) {
        let info = parseRow(x.row);
        sets.push({
            setID: info[0],
            name: info[1],
            score: info[2]
        });
    }
    return sets;
}

async function setById(setID) {
    let res = await client.query(fetch_set, [setID]);
    res = res.rows[0];
    let set = null;
    if (res.length == 0)
        return set;
    let words = [];
    let info = parseRow(res.row);
    set = {
        setID: parseInt(info[0]),
        name: info[1],
        score: parseFloat(info[2]),
        words: words
    };
    res = await client.query(fetch_set_words, [setID]);
    res = res.rows;
    if (res.length == 0)
        return set;
    let word = {};
    for (let x of res) {
        let data = parseRow(x.row);
        word = {
            wordID: parseInt(data[0]),
            name: data[1],
            score: parseFloat(data[2])
        };
        words.push(word);
    }
    set = {
        ...set,
        words: words
    };
    return set;
}

async function updateSetWords(setID, wordArr) {
    //delete words
    await client.query(remove_set_words, [setID]);
    //add words
    for (let wordID of wordArr)
        await client.query(add_set_word, [setID, wordID]);
}

async function updateSetName(setID, newName) {
    await client.query(update_set_name, [setID, newName]);
}

async function createSet(userID, name) {
    let res = await client.query(create_set, [userID, name]);
    let id = parseInt(res.rows[0].setID);
    return id;
}

async function deleteSet(setID) {
    await client.query(remove_set, [setID]);
}

async function updateUsername(userID, username) {
    await client.query(update_user_name, [userID, username]);
}

async function dictionarySearch(string) {
    let list = [];
    if (string == "") return list;
    string = '%' + string + '%';
    let res = await client.query(regex_words, [string]);
    for (let x of res.rows)
        list.push(parseRow(x.row));
    return list;
}

async function deleteUser(userID) {
    await client.query(remove_user, [userID]);
}

//http functions
//account api
app.post('/api/account', async (req, res) => {
    console.log(req.body);
    let id = -0;
    let op = false;
    let action = req.body.action;
    let user = "";
    let pass = -0;
    switch(action) {
        case 'logIn':
            //check credentials
            id = await userID(req.body.username, parseInt(req.body.passkey));
            //console.log(id);
            if (!id) {
                res.status(400).json({error: 'invalid log in credentials!'});
            } else {
                //check if user is active
                op = await userActive(id);
                //console.log(op);
                if (op) 
                    res.status(403).json({msg: 'user is already logged in!'});
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
            } else
                res.status(403).json({error: 'user has timed out!'});
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
            } else
                res.status(403).json({error: 'user has timed out!'});
            break;
        case 'create':
            user = req.body.username;
            pass = req.body.passkey;
            //validate inputs
            if (false) res.status(400).json({error: 'invalid credentials'}); //TODO: implement this
            //check if username exists
            op = await usernameExists(user);
            if (op) 
                res.status(400).json({error: 'username already exists!'});
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
            } else
                res.status(403).json({error: 'user has timed out!'});
            break;
        case 'updateName':
            id = req.body.userID;
            user = req.body.username;
            let active = await userActive(id);
            if (active) {
                //validate username
                if (false) 
                    res.status(400).json({error: 'invalid credentials'}); //TODO: implement this
                //check if exists
                op = await usernameExists(user);
                if (!op) {
                    //log action
                    await logAction(id);
                    await updateUsername(id, user);
                    res.status(200).json({msg: 'success!'});
                } else
                    res.status(400).json({error: 'username already exists!'});
            } else
                res.status(403).json({error: 'user has timed out!'});
            break;
        case 'delete':
            id = req.body.userID;
            op = await userActive(id);
            if (op) {
                await deleteUser(id);
                res.status(200).json({msg: 'success!'});
            } else
                res.status(403).json({error: 'user has timed out!'});
            break;
        default:
            res.status(404).json({error: 'invalid action!'});
            break;
    }
});

//dictionary api
app.post('/api/dictionary', async (req, res) => {
    console.log(req.body);
    let id = req.body.userID;
    let action = req.body.action;
    let list = [];
    //log action
    await logAction(id);
    switch(action) {
        case 'page':
            let letter = req.body.letter;
            list = await dictionaryPage(letter);
            res.status(200).json({words: list});
            break;
        case 'word':
            let wID = req.body.wordID;
            let obj = await wordById(wID);
            res.status(200).json({word: obj});
            break;
        case 'search':
            let string = req.body.string;
            list = await dictionarySearch(string);
            res.status(200).json({words: list});
            break;
        default:
            res.status(404).json({error: 'invalid action!'});
            break;
    }
});

//sets api
app.post('/api/sets', async (req, res) => {
    console.log("ho");
    console.log(req.body);
    let id = req.body.userID;
    let sID = -0;
    let list = [];
    let obj = null;
    let action = req.body.action;
    if (await userActive(id)) {
        //log action
        await logAction(id);
        switch(action) {
            case 'sets':
                list = await userSets(id);
                res.status(200).json({sets: list});
                break;
            case 'set':
                sID = req.body.setID;
                obj = await setById(sID);
                res.status(200).json({set: obj});
                break;
            case 'create':
                let name = req.body.name;
                list = req.body.words;
                sID = await createSet(id, name);
                await updateSetWords(sID, list);
                obj = await setById(sID);
                res.status(200).json({set: obj});
                break;
            case 'delete':
                sID = req.body.setID;
                await deleteSet(sID);
                list = await userSets(id);
                res.status(200).json({sets: list});
                break;
            case 'updateWords':
                sID = req.body.setID;
                list = req.body.words;
                await updateSetWords(sID, list);
                obj = await setById(sID);
                res.status(200).json({set: obj});
                break;
            case 'updateName':
                sID = req.body.setID;
                str = req.body.name;
                await updateSetName(sID, str);
                obj = await setById(sID);
                res.status(200).json({set: obj});
                break;
            default:
                res.status(404).json({error: 'invalid action!'});
                break;
        }
    } else
        res.status(403).json({error: 'user has timed out!'});
});

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
