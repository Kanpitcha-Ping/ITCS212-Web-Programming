/* Import express, path, body-parser  */
const path = require("path"); //for contact w/ html
const express = require("express");
const app = express();
const bp = require("body-parser");

/* Router Module for handling routing */
const router = express.Router();
app.use("/", router);

router.use(bp.json())
router.use(bp.urlencoded({ extended: true}))

const dotenv = require("dotenv");
dotenv.config();

/* Import modules here: express, dotenv, router */
/* Config dotenv and router */
/* Connection to MySQL */
const mysql = require('mysql2');
var connection = mysql.createConnection({
    host : process.env.MYSQL_HOST,
    user : process.env.MYSQL_USERNAME,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE
});

var cors = require('cors');
app.use(cors());

/* Connect to DB */
connection.connect(function(err){
    if(err) throw err;
    console.log("Connected DB: "+process.env.MYSQL_DATABASE);
});

router.post('/user', function (req, res) {
    let user = req.body.user;
    console.log(user);
    if (!user) {
        return res.status(400).send({error: true, message: 'Please provide user information' });
    }
    connection.query("INSERT INTO userinfo SET ? ", user, function (error, results) {
        if (error) throw error;
            return res.send({error: false, data: results.affectedRows, message: 'New user has been created successfully.'});
    });
});

router.put('/user', function (req, res) {
    console.log(req.body);
    let user = req.body.user;
    console.log(user);
    if (!user) {
        return res.status(400).send({ error: user, message: 'Please provide user information' });
    }
    connection.query("UPDATE userinfo SET ? WHERE user_id = ?", [user, user.user_id], function (error,results) {
    if (error) throw error;
        return res.send({error: false, data: results.affectedRows, message: 'User has been updated successfully.'})
    });
});

router.delete('/delete', function (req, res) {
    let user_id = req.body.user;
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user id' });
    }
    connection.query('DELETE FROM userinfo WHERE user_id = ?', [user_id], function (error, results){
    if (error) throw error;
        return res.send({ error: false, data: results.affectedRows, message: 'User has been deleted successfully.' });
    });
});

router.get('/user/:id', function (req, res) {
    let user_id = req.params.id;
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user id.' });
    }
    connection.query('SELECT * FROM userinfo where user_id=?', user_id, function (error, results) {
    if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'User retrieved' });
    });
});

router.get('/users', function (req, res) {
    connection.query('SELECT * FROM userinfo', function (error, results) {
    if (error) throw error;
        return res.send({ error: false, data: results, message: 'User list.' });
    });
});

// server listening
app.listen(process.env.PORT, function () {
    console.log("Server listening at Port " + process.env.PORT);
});