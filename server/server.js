import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';

///variables
//queries
const fetch_user = 'SELECT ("userID") FROM "Memorichuelas"."Users" WHERE name = $1 AND passkey = $2';
const fetch_set_ids = 'SELECT "setID" FROM "Memorichuelas"."Sets" WHERE "userID" = $1'; //get all user's set's ids as array
const fetch_set_words = 'SELECT (word."wordID", name, score) FROM "Memorichuelas"."Words" AS word JOIN "Memorichuelas"."SetWords" AS setword ON word."wordID" = setword."wordID" WHERE "setID" = $1';
const create_user = 'INSERT INTO "Memorichuelas"."Users"(name, passkey, date) VALUES ($1, $2, CURRENT_DATE)';
const fetch_word = 'SELECT (name) FROM "Memorichuelas"."Words" WHERE "wordID" = $1';
const fetch_definitions = 'SELECT (definition) FROM "Memorichuelas"."Definitions" WHERE "wordID" = $1';
const fetch_examples = 'SELECT (example) FROM "Memorichuelas"."Examples" WHERE "wordID" = $1';
const fetch_dict_page = 'SELECT ("wordID", name) FROM "Memorichuelas"."Words" ORDER BY "wordID" ASC LIMIT $1';
const fetch_active_users = 'SELECT ("userID") FROM "Memorichuelas"."Users" WHERE active = true';
const activate_user = 'UPDATE "Memorichuelas"."Users" SET active = true, timestamp = CURRENT_TIMESTAMP WHERE "userID" = $1';
const deactivate_user = 'UPDATE "Memorichuelas"."Users" SET active = false, timestamp = null WHERE "userID" = $1';
const fetch_user_info = 'SELECT (name, date) FROM "Memorichuelas"."Users" WHERE "userID" = $1';
const update_user_name = 'UPDATE "Memorichuelas"."Users" SET name = $2 WHERE "userID" = $1';
const username_total = 'SELECT COUNT(*) FROM "Memorichuelas"."Users" GROUP BY name HAVING name = $1';
//write trigger on database to clear all user sets
const remove_user = 'DELETE FROM "Memorichuelas"."Users" WHERE "userID" = $1';
//write trigger on database to clear all set words
const remove_set = '';
const regex_words = 'SELECT ("wordID", name) FROM "Memorichuelas"."Words" WHERE name LIKE $1';

//pool
const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
});
const client = await pool.connect();

//server
const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());

///functions
async function logAction(userID) {
    //check if user is active
    let res = await client.query(fetch_active_users);
    let isActive = false;
    for (let x of res.rows) if (userID == x.userID) isActive = true;
    if (!isActive) return false;
    res = await client.query(activate_user, [userID]);
    return true;
}

async function logIn(username, passkey) {
    //get user id
    let res = await client.query(fetch_user, [username, passkey]);
    if (res.rows.length == 0) return -1;
    let id = res.rows[0].userID;
    //activate user
    await client.query(activate_user, [id]);
    return id;
}

async function logOut(userID) {
    //deactivate user
    await client.query(deactivate_user, [userID]);
}

async function createUser(username, passkey) {
    //validate inputs
    if (username.length < 1 || username.length > 10 || username.replace(/\s/g, "") == "") return false;
    if (passkey > 99999999 || passkey == 0) return false;
    //check for existing username
    let res = await client.query(username_total, [username]);
    let count = res.rows[0];
    if (count != undefined) return false;
    //create user
    await client.query(create_user, [username, passkey]);
    return true;
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
    //TODO: implement page logic
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
                    // TODO: rewrite query so I dont have to parse this
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
    //check for existing username
    let res = await client.query(username_total, [username]);
    let count = res.rows[0];
    if (count != undefined) return false;
    //update username
    await client.query(update_user_name, [userID, username]);
    return true;
}

async function deleteUser(userID) {
    
}

//http methods
app.post('/api/account', async (req, res) => {
    let id = -1;
    let op = false;
    let action = req.body.action;
    switch(action) {
        case 'logIn':
            id = await logIn(req.body.username, req.body.passkey);
            //log action
            op = await logAction(id);
            if (!op) id = -1;
            res.json({id});
            console.log(id);
        break;
        case 'logOut':
            id = req.body.userID;
            await logOut(id);
            res.json({mgs: "yep"});
            console.log("user " + id + " logged out!");
        break;
        case 'info':
            id = req.body.userID;
            //log action
            op = await logAction(id);
            if (op) {
                let info = await userInfo(id);
                res.json({info});
                console.log(info);
            }
        break;
        case 'create':
            op = await createUser(req.body.username, req.body.passkey);
            if (op) {
                console.log("account created under username: " + req.body.username);
                res.json({msg: "yay"});
            } else {
                console.log("account with username " + req.body.username + " failed to be created.");
                res.json({msg: "noo"});
            }
        break;
        case 'sets':
            id = req.body.userID;
            //log action
            op = await logAction(id);
            if (op) {
                let list = await userSets(id);
                res.json({sets: list});
                console.log(list);
            }
        break;
        case 'updateName':
            id = req.body.userID;
            let active = await logAction(id);
            if (active) {
                op = await updateUsername(id, req.body.username);
                if (op) {
                    console.log("username updated for id: " + id);
                    res.json({msg: "yep"});
                } else {
                    //communicate this to client
                    console.log("username already exists!");
                    res.json({msg: "nop"});
                }
            }
        break;
        case 'delete':

        break;
        default:
            console.log("account access error!");
        break;
    }
});

//get page
app.post('/api/dictionary', async (req, res) => {
    //log action if user is active
    let id = req.body.userID;
    await logAction(id);
    switch(req.body.action) {
        case 'page':
            let list = await dictionaryPage(req.body.letter);
            res.json({words: list});
            console.log(list);
        break;
        case 'word':
            let obj = await wordById(req.body.wordID);
            res.json({word: obj});
            console.log(obj);
        break;
        default:
            console.log("dictionary access error!");
        break;
    }
});

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

        break;
    }
});

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});