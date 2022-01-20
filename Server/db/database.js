const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const http = require("http");

const db = new sqlite3.Database("./app/Backend/db/test.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);

    console.log("connected");
})

const sql_create = 'CREATE TABLE IF NOT EXISTS Users (User_ID INTEGER PRIMARY KEY AUTOINCREMENT, Username TEXT, Password TEXT, Occupation TEXT)';
db.run(sql_create, err => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Users table successfully created")
})

const sql_create1 = 'CREATE TABLE IF NOT EXISTS Canvas (Canvas_ID INTEGER REFERENCES User(User_ID) , canvas BLOB, Username TEXT)';
db.run(sql_create1, err => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Canvas Table successfully created")
})

db.close((err) => {
    if (err) return console.error(err.message);
})

