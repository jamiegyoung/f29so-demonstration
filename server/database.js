const sqlite3 = require("sqlite3").verbose();
const express = require("express");
// const http = require("http");

const db = new sqlite3.Database(
    "./database.db",
    sqlite3.OPEN_READWRITE,
    (err) => {
        if (err) return console.error(err.message);

        console.log("connected");
    }
);

// creates table for users
const sql_create = "CREATE TABLE IF NOT EXISTS users (user_ID INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)";
db.run(sql_create, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Users table successfully created");
});

// creates table for canvas
const sql_create1 = "CREATE TABLE IF NOT EXISTS canvas (canvas_ID INTEGER REFERENCES users(user_ID), owner TEXT, preview TEXT, width INTEGER, height INTEGER)";
db.run(sql_create1, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Canvas Table successfully created");
});

// creates table for pixels
const sql_create2 = "CREATE TABLE IF NOT EXISTS pixels (canvas_ID INTEGER REFERENCES canvas(canvas_ID), pos_x INTEGER, pos_y INTEGER, colour TEXT, history_ID INTEGER, pixel_ID INTEGER)";
db.run(sql_create2, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Canvas Table successfully created");
});

// creates table for history
const sql_create3 = "CREATE TABLE IF NOT EXISTS history (history_ID INTEGER REFERENCES canvas(canvas_ID), date INTEGER, time INTEGER, user_ID INTEGER REFERENCES users(user_ID), p_colour TEXT)";
db.run(sql_create3, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Canvas Table successfully created");
});
