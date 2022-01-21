const express = require('express')
const app = express()
const db = require('./database')
const port = 3000
const passport = require('passport')

const initializePassport = require('./passportConfig')
initializePassport(passport)

db.sync().then(() => console.log('db is ready'));

app.get('/', (req, res) => {
    console.log('working');
})

app.get('/Users', (req, res) => {
    res.render('test.db');
})

app.get('/Canvas', (req, res) => {
    res.render('test.db');
})

app.post('/Users', (req, res) => {
})

app.listen(port, () => {
    console.log(`app listening on port ${port}!`);
});

//

