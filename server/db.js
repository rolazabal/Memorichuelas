import { Pool } from 'pg';

//queries
const fetch_user = 'SELECT * FROM "Memorichuelas"."Users" WHERE name = $1 AND passkey = $2';
const fetch_set_ids = 'SELECT "setID" FROM "Memorichuelas"."Sets" WHERE "userID" = $1'; //get all user's set's ids as array
const fetch_set_words = 'SELECT (word."wordID", name, score) FROM "Memorichuelas"."Words" AS word JOIN "Memorichuelas"."SetWords" AS setword ON word."wordID" = setword."wordID" WHERE "setID" = $1';
const fetch_words = ''; //return x amount of word names and ids as array
const fetch_word = 'SELECT (name) FROM "Memorichuelas"."Words" WHERE "wordID" = $1';
const fetch_definitions = 'SELECT (definition) FROM "Memorichuelas"."Definitions" WHERE "wordID" = $1';
const fetch_examples = 'SELECT (example) FROM "Memorichuelas"."Examples" WHERE "wordID" = $1';
const create_user = 'INSERT INTO "Memorichuelas"."Users"(name, passkey, date) VALUES ($1, $2, CURRENT_DATE)';
const username_total = 'SELECT count(*) FROM "Memorichuelas"."Users" WHERE name = $1'; //return count of users in table with given username

//pool
const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
});
const client = await pool.connect();

//functions
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

async function requestUserState(username, passkey) {
    let res = await client.query(fetch_user, [username, passkey]);
    if (res.rows.length == 0) return false;
    let name = res.rows[0].name;
    let date = res.rows[0].date;
    let id = res.rows[0].userID;
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
    let state = {
        username: name,
        date: date,
        sets: sets
    };
    return state;
}

async function createUser(username, passkey) {
    //validate inputs just in case
    if (username == '') return true;
    if (passkey == 0) return false;
    //check existing username
    let res = await client.query(username_total, [username]);
    if (res.rows[0].count != 0) return false;
    //create user
    res = await client.query(create_user, [username, passkey]);
    return res;
}

//console.log(await createUser("admin", 12345678));
console.log(await requestUserState("admin", 12345678));
//console.log(await wordById(500));