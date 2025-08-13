import { Pool } from 'pg';
import dict from './dict.js';

//queries
const add_word = 'INSERT INTO "Memorichuelas"."Words"(name) VALUES ($1) RETURNING "wordID"';
const add_definition = 'INSERT INTO "Memorichuelas"."Definitions"("wordID", definition) VALUES ($1, $2)';
const add_example = 'INSERT INTO "Memorichuelas"."Examples"("wordID", example) VALUES ($1, $2)';

//pool
const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
});

//functions
function buildWordObject(string) {
    let wordArr = string.split("#");
    let defs = wordArr[1].split("&");
    let exs = wordArr[2].split("&");
    let word = {
        name: wordArr[0],
        defs: defs,
        exs: exs
    };
    return word;
}

const buildDictDB = async() => {
    let client = await pool.connect();
    let words = dict.split("$");
    console.log("Building database!");
    for (let x of words) {
        let word = buildWordObject(x);
        console.log("adding " + word.name);
        let res = await client.query(add_word, [word.name]);
        //console.log("word success!");
        let id = res.rows[0].wordID;
        //add defintions and examples
        for (let y in word.defs)
            await client.query(add_definition, [id, word.defs[y]]);
        //console.log("definitions success!");
        for (let z in word.exs)
            await client.query(add_example, [id, word.exs[z]]);
        //console.log("examples success!");
    }
    console.log("Done!");
};

await buildDictDB();