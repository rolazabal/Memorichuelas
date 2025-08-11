import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT;
const dummyState = {username:"admin", date:"May 30, 2025", sets:[]};

app.use(cors());
app.use(express.json());

app.get('/api/state', (req, res) => {
    res.json({state: dummyState});
    console.log("Sent dummy user!");
})


app.post('/api/state', (req, res) => {
    let {set} = req.body;
    console.log(set);
    res.json({state: dummyState});
})

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});