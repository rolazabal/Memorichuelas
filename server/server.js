import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import { Worker } from 'worker_threads';

// queries ====================================================================
const fetch_user = 'SELECT ("user_id") FROM users WHERE name = $1 AND passkey = $2';
const fetch_user_status = 'SELECT (active) FROM users WHERE "user_id" = $1';
// write db trigger to add official sets to this user
const create_user = 'INSERT INTO users(name, passkey, date) VALUES ($1, $2, CURRENT_DATE)';
const fetch_word = 'SELECT name FROM words WHERE word_id = $1';
const fetch_definitions = 'SELECT definition FROM definitions WHERE word_id = $1';
const fetch_examples = 'SELECT example FROM examples WHERE word_id = $1';
const fetch_active_users = 'SELECT ("user_id", timestamp) FROM users WHERE active = true';
const activate_user = 'UPDATE users SET active = true, timestamp = CURRENT_TIMESTAMP WHERE "user_id" = $1';
const deactivate_user = 'UPDATE users SET active = false, timestamp = null WHERE "user_id" = $1';
const fetch_user_info = 'SELECT (name, date) FROM users WHERE "user_id" = $1';
const update_user_name = 'UPDATE users SET name = $2 WHERE "user_id" = $1';
const username_total = 'SELECT COUNT(*) FROM users GROUP BY name HAVING name = $1';
const remove_user = 'DELETE FROM users WHERE "user_id" = $1';
const regex_words = "SELECT word_id, name FROM words WHERE name LIKE $1 GROUP BY 1";
const remove_set = 'DELETE FROM sets WHERE "set_id" = $1';
const remove_setword = 'DELETE FROM setwords WHERE set_id = $1 AND word_id = $2';
const create_setword = 'INSERT INTO setwords(set_id, word_id) VALUES ($1, $2)';
const fetch_sets = 'SELECT s.set_id, name, us.score FROM sets s ' +
	'JOIN usersets us ON s.set_id = us.set_id WHERE s.official = $2 AND us.user_id = $1 GROUP BY s.set_id, name, us.score';
const create_set = 'INSERT INTO sets(name) VALUES ($1) RETURNING set_id';
const create_set_clone = 'INSERT INTO sets(name) (SELECT name FROM sets WHERE set_id = $1) RETURNING set_id';
const create_setword_clone = 'INSERT INTO setwords(set_id, word_id) (SELECT s.set_id, w.word_id FROM ' +
    '(SELECT set_id FROM sets WHERE set_id = $1) s CROSS JOIN (SELECT word_id FROM setwords WHERE set_id = $2) w)';
const create_user_set = 'INSERT INTO usersets("set_id", "user_id") VALUES ($2, $1)';
const update_set_name = 'UPDATE sets SET name = $2 WHERE "set_id" = $1';
const fetch_set_words = 'SELECT w.word_id, name, score FROM words w ' + 
	'JOIN setwords sw ON w.word_id = sw.word_id WHERE set_id = $1 GROUP BY w.word_id, name, score';
const fetch_set = 'SELECT s.set_id, name, us.score, s.official FROM sets s JOIN usersets us ' +
	'ON s.set_id = us.set_id WHERE us.user_id = $1 AND s.set_id = $2 ' +
	'GROUP BY s.set_id, name, us.score, s.official';

// pool database connection ===================================================
const pool = new Pool({
	host: process.env.POSTGRES_HOST,
	database: process.env.POSTGRES_DB,
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD
});
const client = await pool.connect();

// express server =============================================================
const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());

// monitor thread =============================================================
const monitor = new Worker("./monitor.js");
const user_timeout_ms = 43200000; // 12 hours

// helper functions ===========================================================
function parseRow(str) {
	return str.substring(1, str.length - 1).replace(/"/g, "").split(",");
}

// database functions =========================================================
monitor.on("message", async (message) => {
	// user timeout logic
	let res = await client.query(fetch_active_users);
	for (let x of res.rows) {
		// id and timestamp info
		let data = parseRow(x.row);
		let user_id = data[0];
		let timeStamp = new Date(data[1]);
		if (isNaN(timeStamp)) 
			await deactivateUser(user_id);
		else {
			let currDate = new Date();
			let check = currDate.getTime() - timeStamp.getTime() > user_timeout_ms;
			if (check) await deactivateUser(user_id);
		}
	}
	console.log(message);
});

async function deactivateUser(user_id) {
	await client.query(deactivate_user, [user_id]);
}

async function userActive(user_id) {
	let res = await client.query(fetch_user_status, [user_id]);
	// console.log(res.rows);
	if (res.rows.length > 0)
		return res.rows[0].active;
	return false;
}

async function logAction(user_id) {
	await client.query(activate_user, [user_id]);
}

async function user_id(username, passkey) {
	let res = await client.query(fetch_user, [username, passkey]);
	if (res.rows.length == 0) return -0;
	let id = res.rows[0].user_id;
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

async function userInfo(user_id) {
	let res = await client.query(fetch_user_info, [user_id]);
	res = res.rows[0].row;
	let list = parseRow(res);
	let info = {
		name: list[0], 
		date: list[1]
	};
	return info;
}

async function updateUsername(user_id, username) {
	await client.query(update_user_name, [user_id, username]);
}

async function deleteUser(user_id) {
	await client.query(remove_user, [user_id]);
}

async function wordByID(word_id) {
	let res = await client.query(fetch_word, [word_id]);
	console.log(res.rows);
	let name = res.rows[0].name;
	res = await client.query(fetch_definitions, [word_id]);
	let defs = [];
	for (let x of res.rows)
	defs.push(x.definition);
	res = await client.query(fetch_examples, [word_id]);
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

async function dictionarySearch(string) {
	let res = await client.query(regex_words, [string]);
	let list = res.rows;
	return list;
}

async function getSets(user_id, official) {
	let res = await client.query(fetch_sets, [user_id, official]);
	let sets = [];
	if (res.rowCount == 0)
		return sets;
	for (let x of res.rows) {
		sets.push({
			set_id: x.set_id,
			name: x.name,
			score: x.score
		});
	}
	return sets;
}

async function getSet(user_id, set_id) {
	let res = await client.query(fetch_set, [user_id, set_id]);
	if (res.rowCount == 0)
		return null;
	res = res.rows[0];
	let set = {
		set_id: res.set_id,
		name: res.name,
		score: res.score,
        isOfficial: res.official,
		words: []
	};
	res = await client.query(fetch_set_words, [set_id]);
	console.log(res);
	for (let x of res.rows) {
		let word = {
			word_id: x.word_id,
			name: x.name,
			score: x.score
		};
		set.words.push(word);
	}
	console.log(set);
	return set;
}

async function updateSetName(set_id, newName) {
	await client.query(update_set_name, [set_id, newName]);
}

async function createSet(user_id, name) {
	let res = await client.query(create_set, [name]);
	let id = parseInt(res.rows[0].set_id);
	res = await client.query(create_user_set, [user_id, id]);
	return id;
}

async function cloneSet(user_id, set_id) {
	let res = await client.query(create_set_clone, [set_id]);
    let clone_id = parseInt(res.rows[0].set_id);
    res = await client.query(create_setword_clone, [clone_id, set_id]);
    res = await client.query(create_user_set, [user_id, clone_id]);
    return clone_id;
}

async function deleteSet(set_id) {
	await client.query(remove_set, [set_id]);
}

async function createSetWord(set_id, word_id) {
	await client.query(create_setword, [set_id, word_id]);
}

async function deleteSetWord(set_id, word_id) {
	await client.query(remove_setword, [set_id, word_id]);
}

// account api ================================================================
const accAPI = '/api/account';

// log in
app.put(accAPI, async (req, res) => {
	console.log(req.body);
	let username = req.body.username;
	let passkey = parseInt(req.body.passkey);
	let id = await user_id(username, passkey);
	if (!id) {
		res.status(404).json({msg: 'user not found.'});
		return;
	}
	await logAction(id);
	res.status(200).json({user_id: id});
});

// get info
app.get(accAPI + '/:id', async (req, res) => {
	let id = parseInt(req.params.id);
	if (!(await userActive(id))) {
		res.status(403).json({msg: 'user timed out.'});
		return;
	}
	let obj = await userInfo(id);
	console.log(obj);
	await logAction(id);
	res.status(200).json({info: obj});
});

// delete user
app.delete(accAPI + '/:id', async (req, res) => {
	let id = req.params.id;
	if (!(await userActive(id))) {
		res.status(403).json({msg: 'user timed out.'});
		return;
	}
	await deleteUser(id);
	res.status(200).json({msg: 'user deleted.'});
});

// log out
app.put(accAPI + '/:id', async (req, res) => {
	let id = req.params.id;
	if (!(await userActive(id))) {
		res.status(403).json({msg: 'user timed out.'});
		return;
	}
	await deactivateUser(id);
	res.status(200).json({msg: 'user logged out.'});
});

// change username
app.put(accAPI + '/:id/username', async (req, res) => {
	let id = req.params.id;
	if (!(await userActive(id))) {
		res.status(403).json({msg: 'user timed out.'});
		return;
	}
	let username = req.body.username;
	if (username == "") {
		res.status(400).json({msg: 'invalid username.'});
		return;
	}
	if (await usernameExists(username)) {
		res.status(400).json({msg: 'username is in use.'});
		return;
	}
	await updateUsername(id, username);
	await logAction(id);
	res.status(200).json({msg: 'username updated.'});
});

// create user
app.post(accAPI, async (req, res) => {
	console.log(req.body);
	let username = req.body.username;
	let passkey = parseInt(req.body.passkey);
	if (username == "") {
		res.status(400).json({msg: 'invalid username.'});
		return;
	}
	if (passkey > 99999999 || passkey < 1) {
		res.status(400).json({msg: 'invalid passkey.'});
		return;
	}
	if (await usernameExists(username)) {
		res.status(400).json({msg: 'username is in use.'});
		return;
	}
	await createUser(username, passkey);
	res.status(200).json({msg: 'user created.'});
});

// dictionary api =============================================================
const dictAPI = '/api/dictionary'

// get page
app.get(dictAPI + '/:page{/:user_id}', async (req, res) => {
	console.log(req.params);
	let page = req.params.page;
	let user_id = req.params.user_id;
	page = page.toLowerCase() + '%';
	let list = await dictionarySearch(page);
	console.log(list);
	if (user_id != undefined && user_id != -1)
		await logAction(user_id);
	res.status(200).json({words: list});
});

// search
app.get(dictAPI + '/search/:query{/:user_id}', async (req, res) => {
	console.log(req.params);
	let query = req.params.query;
	let user_id = req.params.user_id;
	let list = [];
	if (query != "") {
		query = '%' + query + '%';
		list = await dictionarySearch(query);
	}
	console.log(list);
	if (user_id != undefined && user_id != -1)
		await logAction(user_id);
	res.status(200).json({words: list});
});

// get word
app.get(dictAPI + '/word/:word_id{/:user_id}', async (req, res) => {
	console.log(req.params);
	let word_id = req.params.word_id;
	let user_id = req.params.user_id;
	let obj = await wordByID(word_id);
	console.log(obj);
	if (user_id != undefined && user_id != -1)
		await logAction(user_id);
	res.status(200).json({word: obj});
});

// sets api ===================================================================
const setAPI = '/api/sets';

// get custom sets
app.get(setAPI + '/:user_id', async (req, res) => {
	console.log(req.params);
	let id = req.params.user_id;
	if (!(await userActive(id))) {
		res.status(403).json({msg: 'user timed out.'});
		return;
	}
	let list = await getSets(id, false);
	await logAction(id);
	res.status(200).json({sets: list});
});

// get official sets
app.get(setAPI + '/:user_id/memorichuelas', async (req, res) => {
	let id = req.params.user_id;
	if (!(await userActive(id))) {
		res.status(403).json({msg: 'user timed out.'});
		return;
	}
	let list = await getSets(id, true);
	await logAction(id);
	res.status(200).json({sets: list});
});

// get set
app.get(setAPI + '/:user_id/:set_id', async (req, res) => {
	console.log(req.params);
	let user_id = req.params.user_id;
	if (!(await userActive(user_id))) {
		res.status(403).json({msg: 'user timed out.'});
		return;
	}
	let set_id = req.params.set_id;
	let obj = await getSet(user_id, set_id);
	await logAction(user_id);
	res.status(200).json({set: obj});
});

// create set
app.post(setAPI + '/:user_id', async (req, res) => {
	console.log(req.params);
	console.log(req.body);
	let user_id = req.params.user_id;
	if (!(await userActive(user_id))) {
		res.status(403).json({msg: 'user timed out.'});
		return;
	}
	let name = req.body.name;
	if (name == "") {
		res.status(400).json({msg: 'invalid name.'});
		return;
	}
	let s_id = await createSet(user_id, name);
	res.status(200).json({set_id: s_id});
});

// clone set
app.post(setAPI + '/:user_id/clone/:set_id', async (req, res) => {
	let user_id = req.params.user_id;
	if (!(await userActive(user_id))) {
		res.status(403).json({msg: 'user timed out.'});
		return;
	}
	let set_id = req.params.set_id;
	let clone_id = await cloneSet(user_id, set_id);
	res.status(200).json({set_id: clone_id});
});

// change name
app.put(setAPI + '/:user_id/:set_id/name', async (req, res) => {
	console.log(req.params);
	console.log(req.body);
	let u_id = req.params.user_id;
	if (!(await userActive(u_id))) {
		res.status(403).json({msg: 'user timed out.'});
		return;
	}
	let s_id = req.params.set_id;
	let name = req.body.name;
	if (name == "") {
		res.status(400).json({msg: 'invalid name.'});
		return;
	}
	await updateSetName(s_id, name);
	res.status(200).json({msg: 'set name updated.'});
});

// add word
app.post(setAPI + '/:user_id/:set_id/word', async (req, res) => {
	console.log("add word");
	console.log(req.params);
	console.log(req.body);
	console.log("/\\ body");
	let u_id = req.params.user_id;
	if (!(await userActive(u_id))) {
		res.status(403).json({msg: 'user timed out.'});
		return;
	}
	let s_id = req.params.set_id;
	let w_id = req.body.word_id;
	await createSetWord(s_id, w_id);
	res.status(200).json({msg: 'set word created.'});
});

// delete word
app.delete(setAPI + '/:user_id/:set_id/:word_id', async (req, res) => {
	console.log(req.params);
	let u_id = req.params.user_id;
	if (!(await userActive(u_id))) {
		res.status(403).json({msg: 'user timed out.'});
		return;
	}
	let s_id = req.params.set_id;
	let w_id = req.params.word_id;
	await deleteSetWord(s_id, w_id);
	res.status(200).json({msg: 'set word deleted.'});
});

// delete set
app.delete(setAPI + '/:user_id/:set_id', async (req, res) => {
	console.log(req.params);
	let u_id = req.params.user_id;
	if (!(await userActive(u_id))) {
		res.status(403).json({msg: 'user timed out.'});
		return;
	}
	let s_id = req.params.set_id;
	await deleteSet(s_id);
	res.status(200).json({msg: 'set deleted.'});
});

// update word score
app.put(setAPI + '/:user_id/:set_id', async (req, res) => {
	; // update individually or as a whole?
});

// start server ===============================================================
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
