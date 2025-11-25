import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import { Worker } from 'worker_threads';

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
	let res = await client.query('SELECT ("user_id", timestamp) FROM users WHERE active = true');
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
	await client.query('UPDATE users SET active = false, timestamp = null WHERE "user_id" = $1', [user_id]);
}

async function userActive(user_id) {
	let res = await client.query('SELECT (active) FROM users WHERE "user_id" = $1', [user_id]);
	// console.log(res.rows);
	if (res.rows.length > 0)
		return res.rows[0].active;
	return false;
}

async function logAction(user_id) {
	await client.query('UPDATE users SET active = true, timestamp = CURRENT_TIMESTAMP WHERE "user_id" = $1', [user_id]);
}

async function user_id(username, passkey) {
	let res = await client.query('SELECT ("user_id") FROM users WHERE name = $1 AND passkey = $2', [username, passkey]);
	if (res.rows.length == 0) return -0;
	let id = res.rows[0].user_id;
	return id;
}

async function createUser(username, passkey) {
	await client.query('INSERT INTO users(name, passkey, date) VALUES ($1, $2, CURRENT_DATE)', [username, passkey]);
}

async function usernameExists(username) {
	let res = await client.query('SELECT COUNT(*) FROM users GROUP BY name HAVING name = $1', [username]);
	let count = res.rows[0];
	return (count != undefined);
}

async function userInfo(user_id) {
	let res = await client.query('SELECT (name, date) FROM users WHERE "user_id" = $1', [user_id]);
	res = res.rows[0].row;
	let list = parseRow(res);
	let info = {
		name: list[0], 
		date: list[1]
	};
	return info;
}

async function updateUsername(user_id, username) {
	await client.query('UPDATE users SET name = $2 WHERE "user_id" = $1', [user_id, username]);
}

async function deleteUser(user_id) {
	await client.query('DELETE FROM users WHERE "user_id" = $1', [user_id]);
}

async function wordByID(word_id) {
	let res = await client.query('SELECT name FROM words WHERE word_id = $1', [word_id]);
	console.log(res.rows);
	let name = res.rows[0].name;
	res = await client.query('SELECT definition FROM definitions WHERE word_id = $1', [word_id]);
	let defs = [];
	for (let x of res.rows)
	defs.push(x.definition);
	res = await client.query('SELECT example FROM examples WHERE word_id = $1', [word_id]);
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
	let res = await client.query('SELECT word_id, name FROM words WHERE name LIKE $1 GROUP BY 1', [string]);
	let list = res.rows;
	return list;
}

async function getSets(user_id, official) {
	let res = await client.query('SELECT s.set_id, name, us.score FROM sets s ' +
	'JOIN usersets us ON s.set_id = us.set_id WHERE s.official = $2 AND us.user_id = $1 GROUP BY s.set_id, name, us.score', [user_id, official]);
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
	let res = await client.query('SELECT s.set_id, name, us.score, s.official FROM sets s JOIN usersets us ' +
	'ON s.set_id = us.set_id WHERE us.user_id = $1 AND s.set_id = $2 ' +
	'GROUP BY s.set_id, name, us.score, s.official', [user_id, set_id]);
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
	res = await client.query('SELECT w.word_id, name, score FROM words w ' + 
	'JOIN setwords sw ON w.word_id = sw.word_id WHERE set_id = $1 GROUP BY w.word_id, name, score', [set_id]);
	console.log(res.statusCode);
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
	await client.query('UPDATE sets SET name = $2 WHERE "set_id" = $1', [set_id, newName]);
}

async function createSet(user_id, name) {
	let res = await client.query('INSERT INTO sets(name) VALUES ($1) RETURNING set_id', [name]);
	let id = parseInt(res.rows[0].set_id);
	res = await client.query('INSERT INTO usersets("set_id", "user_id") VALUES ($2, $1)', [user_id, id]);
	return id;
}

async function cloneSet(user_id, set_id) {
	let res = await client.query('INSERT INTO sets(name) (SELECT name FROM sets WHERE set_id = $1) RETURNING set_id', [set_id]);
    let clone_id = parseInt(res.rows[0].set_id);
    res = await client.query('INSERT INTO setwords(set_id, word_id) (SELECT s.set_id, w.word_id FROM ' +
    '(SELECT set_id FROM sets WHERE set_id = $1) s CROSS JOIN (SELECT word_id FROM setwords WHERE set_id = $2) w)', [clone_id, set_id]);
    res = await client.query('INSERT INTO usersets("set_id", "user_id") VALUES ($2, $1)', [user_id, clone_id]);
    return clone_id;
}

async function deleteSet(set_id) {
	await client.query('DELETE FROM sets WHERE "set_id" = $1', [set_id]);
}

async function createSetWord(set_id, word_id) {
	await client.query('INSERT INTO setwords(set_id, word_id) VALUES ($1, $2)', [set_id, word_id]);
}

async function deleteSetWord(set_id, word_id) {
	await client.query('DELETE FROM setwords WHERE set_id = $1 AND word_id = $2', [set_id, word_id]);
}

// account api ================================================================
const accAPI = '/api/account';

const str = {
	not_found: ['User does not exist!', 'Usuario no existe!'],
	timed_out: ['User timed out!', 'Session expirada!'],
	invalid_username: ['Invalid username!', 'Nombre de usuario invalido!'],
	invalid_passkey: ['Invalid passkey!', 'Contraseña invalida!'],
	unique_username: ['Username already exists!', 'Nombre de usuario ya existe!'],
};

// log in
app.put(accAPI, async (req, res) => {
	console.log(req.body);
	let username = req.body.username;
	let passkey = parseInt(req.body.passkey);
	let id = await user_id(username, passkey);
	if (!id) {
		res.status(404).json({msg: str.not_found});
		console.log(res.statusCode);
		return;
	}
	await logAction(id);
	res.status(200).json({user_id: id});
	console.log(res.statusCode);
});

// get info
app.get(accAPI + '/:id', async (req, res) => {
	let id = parseInt(req.params.id);
	if (!(await userActive(id))) {
		res.status(403).json({msg: str.timed_out});
		console.log(res.statusCode);
		return;
	}
	let obj = await userInfo(id);
	console.log(obj);
	await logAction(id);
	res.status(200).json({info: obj});
	console.log(res.statusCode);
});

// delete user
app.delete(accAPI + '/:id', async (req, res) => {
	let id = req.params.id;
	if (!(await userActive(id))) {
		res.status(403).json({msg: str.timed_out});
	console.log(res.statusCode);
		return;
	}
	await deleteUser(id);
	res.status(200);
	console.log(res.statusCode);
});

// log out
app.put(accAPI + '/:id', async (req, res) => {
	let id = req.params.id;
	if (!(await userActive(id))) {
		res.status(403).json({msg: str.timed_out});
	console.log(res.statusCode);
		return;
	}
	await deactivateUser(id);
	res.status(200);
	console.log(res.statusCode);
});

// change username
app.put(accAPI + '/:id/username', async (req, res) => {
	console.log(req.body);
	let id = req.params.id;
	if (!(await userActive(id))) {
		res.status(403).json({msg: str.timed_out});
	console.log(res.statusCode);
		return;
	}
	let username = req.body.username;
	if (username == "") {
		res.status(400).json({msg: str.invalid_username});
	console.log(res.statusCode);
		return;
	}
	if (await usernameExists(username)) {
		res.status(400).json({msg: str.unique_username});
	console.log(res.statusCode);
		return;
	}
	await updateUsername(id, username);
	await logAction(id);
	res.status(200);
	console.log(res.statusCode);
});

// create user
app.post(accAPI, async (req, res) => {
	console.log(req.body);
	let username = req.body.username;
	let passkey = parseInt(req.body.passkey);
	if (username == "") {
		res.status(400).json({msg: str.invalid_username});
	console.log(res.statusCode);
		return;
	}
	if (passkey > 99999999 || passkey < 1) {
		res.status(400).json({msg: str.invalid_passkey});
	console.log(res.statusCode);
		return;
	}
	if (await usernameExists(username)) {
		res.status(400).json({msg: str.unique_username});
	console.log(res.statusCode);
		return;
	}
	await createUser(username, passkey);
	res.status(200);
	console.log(res.statusCode);
});

// dictionary api =============================================================
const dictAPI = '/api/dictionary'

// get page
app.get(dictAPI + '/:page{/:user_id}', async (req, res) => {
	let page = req.params.page;
	let user_id = req.params.user_id;
	page = page.toLowerCase() + '%';
	let list = await dictionarySearch(page);
	if (user_id != undefined && user_id != -1)
		await logAction(user_id);
	res.status(200).json({words: list});
});

// search
app.get(dictAPI + '/search/:query{/:user_id}', async (req, res) => {
	let query = req.params.query;
	let user_id = req.params.user_id;
	let list = [];
	if (query != "") {
		query = '%' + query + '%';
		list = await dictionarySearch(query);
	}
	if (user_id != undefined && user_id != -1)
		await logAction(user_id);
	res.status(200).json({words: list});
});

// get word
app.get(dictAPI + '/word/:word_id{/:user_id}', async (req, res) => {
	let word_id = req.params.word_id;
	let user_id = req.params.user_id;
	let obj = await wordByID(word_id);
	if (user_id != undefined && user_id != -1)
		await logAction(user_id);
	res.status(200).json({word: obj});
});

// sets api ===================================================================
const setAPI = '/api/sets';

// get custom sets
app.get(setAPI + '/:user_id', async (req, res) => {
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
