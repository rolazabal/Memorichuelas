import { Pool } from 'pg';

//queries
const fetch_user = 'SELECT * FROM "Memorichuelas"."Users" WHERE "Users"."userID" = 0';
const add_word = 'INSERT INTO "Memorichuelas"."Words"(name) VALUES ($1) RETURNING "wordID"';
const add_definition = 'INSERT INTO "Memorichuelas"."Definitions"("wordID", definition) VALUES ($1, $2)';
const add_example = 'INSERT INTO "Memorichuelas"."Examples"("wordID", example) VALUES ($1, $2)';
const add_set = 'INSERT INTO "Memorichuelas"."Sets"("userID", name, score) VALUES ($1, $2, 0)'; //userID, name
const fetch_set_ids = 'SELECT "setID" FROM "Memorichuelas"."Sets" WHERE "userID" = $1'; //get all user's set's ids as array
const fetch_set = 'SELECT ("wordID", score) FROM "Memorichuelas"."SetWords" WHERE "setID" = $1'; //return set object

//pool
const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
});

//functions
