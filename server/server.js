import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';

///variables
//queries
const fetch_user = 'SELECT ("userID") FROM "Memorichuelas"."Users" WHERE name = $1 AND passkey = $2';
const fetch_set_ids = 'SELECT "setID" FROM "Memorichuelas"."Sets" WHERE "userID" = $1'; //get all user's set's ids as array
const fetch_set_words = 'SELECT (word."wordID", name, score) FROM "Memorichuelas"."Words" AS word JOIN "Memorichuelas"."SetWords" AS setword ON word."wordID" = setword."wordID" WHERE "setID" = $1';
const create_user = 'INSERT INTO "Memorichuelas"."Users"(name, passkey, date) VALUES ($1, $2, CURRENT_DATE) RETURNING "userID"';
const fetch_word = 'SELECT (name) FROM "Memorichuelas"."Words" WHERE "wordID" = $1';
const fetch_definitions = 'SELECT (definition) FROM "Memorichuelas"."Definitions" WHERE "wordID" = $1';
const fetch_examples = 'SELECT (example) FROM "Memorichuelas"."Examples" WHERE "wordID" = $1';
const fetch_dict_page = 'SELECT ("wordID", name) FROM "Memorichuelas"."Words" ORDER BY "wordID" ASC LIMIT $1';
const fetch_active_users = 'SELECT ("userID") FROM "Memorichuelas"."Users" WHERE active = true';
const activate_user = 'UPDATE "Memorichuelas"."Users" SET active = true, timestamp = CURRENT_DATE WHERE "userID" = $1';
const timeout_user = 'UPDATE "Memorichuelas"."Users" SET active = false, timestamp = null WHERE "userID" = $1';

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
async function logIn(username, passkey) {
    //get user id
    let res = await client.query(fetch_user, [username, passkey]);
    if (res.rows.length == 0) return -1;
    let id = res.rows;
    //activate user
    await client.query(activate_user, [id]);
    return id;
    /*
    res = await client.query(fetch_set_ids, [id]);
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
    */
}

async function logOut(userID) {
    //deactivate user
    await client.query()
}

async function createUser(username, passkey) {
    //validate inputs
    if (username.length < 1 || username.length > 10 || username.replace(/\s/g, "") == "") return false;
    if (passkey > 99999999 || passkey == 0) return false;
    //check for existing username
    let res = await client.query(username_total, [username]);
    if (res.rows[0].count != 0) return false;
    //create user
    res = await client.query(create_user, [username, passkey]);
    let id = res.rows;
    //activate user
    await client.query(activate_user, [id]);
    return id;
}

async function wordById(id) {
    let res = await client.query(fetch_word, [id]);
    let name = res.rows[0].name;
    res = await client.query(fetch_definitions, [id]);
    let defs = [];
    for (let x of res.rows)
        defs.push(x.definition);
    res = await client.query(fetch_examples, [id]);
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

async function dictionaryPage(page) {
    //TODO: implement page logic
    let res = await client.query(fetch_dict_page, [page]);
    let list = [];
    for (let x of res.rows) {
        list.push(x.row.substring(1, x.row.length - 1).replace(/"/g, "").split(","));
    }
    return list;
}

//http methods
app.post('/api/account', async (req, res) => {
    switch(req.body.action) {
        case 'logIn':
            let id = await logIn(req.body.username, req.body.passkey);
            res.json({id});
            console.log(id);
        break;
        case 'logOut':
            id = req.body.userID;
            logOut(id);
            console.log("user " + id + " logged out!");
        break;
        case 'create':

        break;
        default:
            console.log("account access error!");
        break;
    }
});

//get page
app.post('/api/dictionary', async (req, res) => {
    switch(req.body.action) {
        case 'page':
            //TODO: add page logic
            let list = await dictionaryPage(req.body.page);
            res.json({words: list});
            console.log(list);
        break;
        case 'word':
            let obj = await wordById(req.body.word);
            res.json({word: obj});
            console.log(obj);
        break;
        default:
            console.log("dictionary access error!");
        break;
    }
});

//create account
app.post('/api/create', async (req, res) => {
    //TODO: check req formatting
    let {username, passkey} = req.body;
    let op = await createUser(username, passkey);
    //TODO: check op success
    let user = await requestUserState("admin", 12345678);
    res.json({state: user});
    console.log(user);
});

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});