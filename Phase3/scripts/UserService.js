const express = require("express");
const app = express();

const router = express.Router();
app.use("/", router); 

const bp = require("body-parser");
var jsonParser = bp.json();

const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
router.use(cors());

const mysql = require("mysql2");
let dbConnection = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME
});

/*Connect to DB*/
dbConnection.connect(function(err) {
    if(err) throw err;
    console.log("Connected DB: "+process.env.DB_NAME);
});

router.get("/typtea", jsonParser, function (req, res) {
    dbConnection.query("SELECT * FROM typetea", function (error, results) {
        if (error) throw error;
        //console.log(results);
        return res.send({
            error: false,
            data: results,
        });
    });
});

/* search product by normal user and admin */
/* Testing search product (POST) url: http://localhost:3000/search */
/*
   test case1 (returen 10 items):
   {
        "condition": {
            "product": "",
            "typTea": "all",
            "min": 0,
            "max": 500,
            "unit": "all"
        }
   }
   test case2 (return 1 item):
   {
        "condition": {
            "product": "Ten Ren",
            "typTea": "all",
            "min": 0,
            "max": 480,
            "unit": "box"
        }
   }
   test case3 (return 3 items):
   {
        "condition": {
            "product": "i",
            "typTea": "all",
            "min": 0,
            "max": 400,
            "unit": "bag"
        }
   }
*/
router.post("/search", jsonParser, function (req, res) {

    console.log(req.body.condition);

    let productT = "%"+req.body.condition.product.toLowerCase()+"%";
    let typT = req.body.condition.typTea;
    let minp = req.body.condition.min;
    let maxp = req.body.condition.max;
    let unitT = req.body.condition.unit;
    let unitCondition = " AND (product_details.prod_unit = 'box' OR product_details.prod_unit = 'bag');";
    let typCondition = "";

    if (typT != "all") {
        typCondition = " AND (tt_name = '"+typT+"')";
    } 

    if (unitT == "bag") {
        unitCondition = " AND (product_details.prod_unit = 'bag');"
    } else if (unitT == "box") {
        unitCondition = " AND (product_details.prod_unit = 'box');"
    } 
  
    let qur = "SELECT tt_name, product.prod_name, product_details.prod_price, product_details.prod_unit FROM typetea"
              + " INNER JOIN product ON typetea.tt_id = product.tt_id"
              + " INNER JOIN product_details ON product.prod_id = product_details.prod_id"
              + " WHERE (LOWER(product.prod_name) LIKE ?)"
              + typCondition
              + " AND (product_details.prod_price BETWEEN ? AND ?)"
              + unitCondition;

    dbConnection.query(qur, [productT, minp, maxp], function (error, results) {
        if (error) throw error;
        return res.send({
            error: false, 
            data: results, 
            message: 'Items retrieved'
        });
    });
});

/* Select type of tea */
/* Testing select type (GET) url: http://localhost:3000/teaorytype/# */
/*
   test case1 : http://localhost:3000/teaorytype/1
       result : {
                    "error": false,
                    "data": {
                        "tt_id": 1,
                        "tt_name": "Rose tea"
                    },
                    "message": "Type of tea retrieved"
                }

   test case2 : http://localhost:3000/teaorytype/2
       result : {
                    "error": false,
                    "data": {
                        "tt_id": 2,
                        "tt_name": "Chrysanthemum tea"
                    },
                    "message": "Type of tea retrieved"
                }
*/
router.get("/teaorytype/:id", jsonParser, function(req, res) {
    let TID = req.params.id;

    if (!TID) {
        return res
            .status(400)
            .send({ error: true, message: 'Please provide a valid type id.' });
    }

    dbConnection.query("SELECT tt_id, tt_name FROM typetea WHERE tt_id = ?", TID, function (error, results) {
        if (error) throw error;
        console.log(results[0]);
        if (results[0]) {
            return res.send({
                error: false, 
                data: results[0], 
                message: 'Type of tea retrieved'
            });
        } else {
            return res.send({
                error: false, 
                data: results[0], 
                message: "Given id doesn't exist! Please change the id"
            });
        }
    });
});

/* Select all types */
/* Testing select all type (GET) url: http://localhost:3000/teaorytypes */
/* return 8 items */
router.get("/teaorytypes", jsonParser, function(req, res) {
    dbConnection.query("SELECT tt_id, tt_name FROM typetea", function (error, results) {
        if (error) throw error;
        //console.log(results);
        return res.send({
            error: false,
            data: results,
            message: "All types of tea!"
        });
    });
});

/* Insert new type of tea */
/* Testing insert a type of tea (POST) url: http://localhost:3000/teaorytype */
/*
   test case1:
   {
        "typ": {
            "tt_id": 9,
            "tt_name": "Pink lotus tea"
        }
   }
   test case2:
   {
        "typ": {
            "tt_id": 10,
            "tt_name": "Green lotus tea"
        }
   }
*/
router.post("/teaorytype", jsonParser, function (req, res) {

    let typInfo = req.body.typ;

    if (!typInfo) {
        return res
            .status(400)
            .send({ error: true, message: 'Please provide valid type id or type name' });
    }

    dbConnection.query("INSERT INTO TypeTea SET ? ", typInfo, function (error, results) {
        if (error) if (error.errno == 1062) {
            return res.send({ 
                error: true,
                message: error.message+" Please change the id"
            });
        } else {
            throw error;
        }
        return res.send({
            error: false, 
            data: results.affectedRows, 
            message: 'New type has been created successfully.'
        });
    });
});

/* Update type of tea */
/* Testing insert a type of tea (PUT) url: http://localhost:3000/teaorytype */
/*
   test case1:
   {
        "typ": {
            "tt_id": 9,
            "tt_name": "Yellow lotus tea"
        }
   }
   test case2:
   {
        "typ": {
            "tt_id" : 10,
            "tt_name": "Linden tea"
        }
   }
*/
router.put("/teaorytype", jsonParser, function (req, res) {

    let typInfo = req.body.typ;
    let tid = req.body.typ.tt_id;

    if (!typInfo) {
        return res
            .status(400)
            .send({ error: true, message: 'Please provide valid id or new name.' });
    }

    dbConnection.query("UPDATE TypeTea SET ? WHERE tt_id = ?", [typInfo, tid], function (error, results) {
        if (error) throw error;
        return res.send({
            error: false, 
            data: results.affectedRows, 
            message: "New type's name has been updated successfully."
        });
    });
});

/* Delete type of tea */
/* Testing insert a type of tea (DELETE) url: http://localhost:3000/teaorytype */
/*
   test case1:
   {
        "tt_id": 9
   }
   test case2:
   {
        "tt_id": 10
   }
*/
router.delete("/teaorytype", jsonParser, function (req, res) {

    let tid = req.body.tt_id;
    if (!tid) {
        return res
            .status(400)
            .send({ error: true, message: 'Please provide valid/existing type id.' });
    }
    
    dbConnection.query("DELETE FROM TypeTea WHERE tt_id = ?;", tid, function (error, results) {
        if (error) {
            if (error.errno == 1217) {
                return res.send({ 
                    error: true,
                    message: "This type is refered by existing product! Cannot delete!"
                });
            } else {
                throw error;
            }
        }
        return res.send({ 
            error: false,
            data: results.affectedRows, 
            message: "This type has been deleted successfully."
        });
    });
});


/* Select item */
/* Testing select item (GET) url: http://localhost:3000/teaoryitem/# */
/*
   test case1 : http://localhost:3000/teaoryitem/100000001
       result : {
                    "error": false,
                    "data": {
                        "tt_id": 1,
                        "tt_name": "Rose tea",
                        "prod_id": 100000001,
                        "prod_name": "Twinings",
                        "prod_status": "A",
                        "prod_des": null,
                        "prod_price": "400.00",
                        "prod_unit": "box"
                    },
                    "message": "Item retrieved"
                }

   test case2 : http://localhost:3000/teaoryitem/100000002
       result : {
                    "error": false,
                    "data": {
                        "tt_id": 1,
                        "tt_name": "Rose tea",
                        "prod_id": 100000002,
                        "prod_name": "Yogi tea",
                        "prod_status": "U",
                        "prod_des": null,
                        "prod_price": "250.00",
                        "prod_unit": "box"
                    },
                    "message": "Item retrieved"
                }
*/
router.get("/teaoryitem/:id", jsonParser, function(req, res) {
    let PID = req.params.id;

    if (!PID) {
        return res
            .status(400)
            .send({ error: true, message: 'Please provide a valid product id.' });
    }

    let q = "SELECT typetea.tt_id, tt_name, product.prod_id, product.prod_name, prod_status, prod_des, product_details.prod_price, product_details.prod_unit" 
            + " FROM typetea INNER JOIN product ON typetea.tt_id = product.tt_id" 
            + " INNER JOIN product_details ON product.prod_id = product_details.prod_id"
            + " WHERE product.prod_id = ?";

    dbConnection.query(q, PID, function (error, results) {
        if (error) throw error;
        console.log(results[0]);
        if (results[0]) {
            return res.send({
                error: false, 
                data: results[0], 
                message: 'Item retrieved'
            });
        } else {
            return res.send({
                error: false, 
                data: results[0], 
                message: "Given id doesn't exist! Please change the id"
            });
        }
    });
});

/* Select all items */
/* Testing select all type (GET) url: http://localhost:3000/teaoryitems */
router.get("/teaoryitems", jsonParser, function(req, res) {
    dbConnection.query("SELECT typetea.tt_id, tt_name, product.prod_id, product.prod_name, prod_status, prod_des, product_details.prod_price, product_details.prod_unit FROM typetea INNER JOIN product ON typetea.tt_id = product.tt_id INNER JOIN product_details ON product.prod_id = product_details.prod_id ORDER BY product.prod_id ASC", function (error, results) {
        if (error) throw error;
        //console.log(results);
        return res.send({
            error: false,
            data: results,
            message: "Item list"
        });
    });
});

/* Insert new item */
/* Testing insert an item (POST) url: http://localhost:3000/teaoryitem */
/*
   test case1 : 
        {
            "prod": {
                "prod_id": 100000011,
                "prod_name": "Lipton Premium",
                "prod_status": "A", 
                "prod_des": "Lipton Premium 2021", 
                "tt_id": 8
            },
            "prodDetails": {
                "prod_price": 400,
                "prod_unit": "box",
                "prod_id": 100000011
            }
        }
   test case2 : 
        {
            "prod": {
                "prod_id": 100000012,
                "prod_name": "Tezo Platinum",
                "prod_status": "U", 
                "prod_des": "Tezo Platinum 2021", 
                "tt_id": 1
            },
            "prodDetails": {
                "prod_price": 390,
                "prod_unit": "bag",
                "prod_id": 100000012
            }
        }
*/
router.post("/teaoryitem", jsonParser, function (req, res) {

    let prodInfo = req.body.prod;
    let detailsInfo = req.body.prodDetails;

    if (!prodInfo || !detailsInfo) {
        return res
            .status(400)
            .send({ error: true, message: 'Please provide all required information.' });
    }

    dbConnection.query("INSERT INTO Product  SET ? ", prodInfo, function (error, results) {
        if (error) if (error.errno == 1062) {
            return res.send({ 
                error: true,
                message: error.message+" Please change the id"
            });
        } else {
            throw error;
        }
        dbConnection.query("INSERT INTO Product_details SET ? ", detailsInfo, function (error, results) {
            if (error) throw error;
        });
        return res.send({
            error: false, 
            data: results.affectedRows, 
            message: 'New item has been created successfully.'
        });
    });
});

/* Update item */
/* Testing insert an item (PUT) url: http://localhost:3000/teaoryitem */
/*
   test case1 : 
        {
            "prod": {
                "prod_id": 100000011,
                "prod_name": "Lipton Premium++",
                "prod_status": "A", 
                "prod_des": "Lipton Premium 2021", 
                "tt_id": 8
            },
            "prodDetails": {
                "prod_price": 400,
                "prod_unit": "box",
                "prod_id": 100000011
            }
        }
   test case2 : 
        {
            "prod": {
                "prod_id": 100000012,
                "prod_name": "Tezo Gold",
                "prod_status": "A", 
                "prod_des": "Tezo Gold 2021", 
                "tt_id": 1
            },
            "prodDetails": {
                "prod_price": 390,
                "prod_unit": "box",
                "prod_id": 100000012
            }
        }
*/
router.put("/teaoryitem", jsonParser, function (req, res) {

    let prodInfo = req.body.prod;
    let detailsInfo = req.body.prodDetails;
    let pid = req.body.prod.prod_id;

    if (!prodInfo || !detailsInfo) {
        return res
            .status(400)
            .send({ error: true, message: 'Please provide item information.' });
    }

    dbConnection.query("UPDATE Product SET ? WHERE prod_id = ?", [prodInfo, pid], function (error, results) {
        if (error) throw error;
        dbConnection.query("UPDATE Product_details SET ? WHERE prod_id = ?", [detailsInfo, pid], function (error, results) {
            if (error) throw error;
        });
        return res.send({
            error: false, 
            data: results.affectedRows, 
            message: "New Item's information has been updated successfully."
        });
    });
});

/* Delete item */
/* Testing insert a type of tea (DELETE) url: http://localhost:3000/teaorytype */
/*
   test case1: { "pid": 100000011 }
   test case2: { "pid": 100000012 }
*/
router.delete("/teaoryitem", jsonParser, function (req, res) {

    let pid = req.body.pid;
    if (!pid) {
        return res
            .status(400)
            .send({ error: true, message: 'Please provide product id.' });
    }
    
    dbConnection.query("DELETE FROM Product_details WHERE prod_id = ?;", pid, function (error, results) {
        if (error) throw error;
        dbConnection.query("DELETE FROM Product WHERE prod_id = ?;", pid, function (error, results) {
            if (error) throw error;
        });
        return res.send({ 
            error: false,
            data: results.affectedRows, 
            message: "An item has been deleted successfully."
        });
    });
});

/* Search for user list */
/* Testing search product (POST) url: http://localhost:3000/searchuser */
/*
   test case1 (returen 7 users):
   {
        "condition": {
            "user_id": "",
            "user_fname": "",
            "user_lname": "", 
            "user_phone": "", 
            "user_email": "",
            "login_user": "",
            "login_pwd": "",
            "login_role": "both"
        }
   }
   test case2 (return 2 administrators):
   {
        "condition": {
            "user_id": "",
            "user_fname": "i",
            "user_lname": "a", 
            "user_phone": "", 
            "user_email": "",
            "login_user": "",
            "login_pwd": "",
            "login_role": "A"
        }
   }
   test case3 (return 1 user):
   {
        "condition": {
            "user_id": "100000005",
            "user_fname": "",
            "user_lname": "", 
            "user_phone": "", 
            "user_email": "",
            "login_user": "",
            "login_pwd": "",
            "login_role": "both"
        }
   }
*/
router.post("/searchuser", jsonParser, function (req, res) {

    console.log(req.body.condition);

    let _uid = (req.body.condition.user_id ? " AND (u.user_id = "+parseInt(req.body.condition.user_id)+")" : "");
    let _fname = "%"+req.body.condition.user_fname.toLowerCase()+"%";
    let _lname = "%"+req.body.condition.user_lname.toLowerCase()+"%";
    let _phone = (req.body.condition.user_phone ? " AND (user_phone = '"+req.body.condition.user_phone+"')" : "");
    let _email = (req.body.condition.user_email? " AND (user_email = '"+req.body.condition.user_email+"')" : "");
    let _username = (req.body.condition.login_user ? " AND (login_user = '"+req.body.condition.login_user+"')" : "");
    let _pwd = (req.body.condition.login_pwd ? " AND (login_pwd = '"+req.body.condition.login_pwd+"')" : " ");
    let _role = (req.body.condition.login_role == 'both' ?  "" : " AND (login_role = '"+req.body.condition.login_role+"')");
    
    let qur = "SELECT u.user_id, user_fname, user_lname, user_phone, user_email, user_address, user_prefer, login_user, login_pwd, login_role, login_time"
              + " FROM UserInfo u INNER JOIN LoginInfo l ON u.user_id = l.user_id"
              + " WHERE (LOWER(user_fname) LIKE ?)"
              + " AND (LOWER(user_lname) LIKE ?)"
              + _uid + _phone + _email + _username + _pwd + _role
              + "ORDER BY u.user_id ASC;";

    dbConnection.query(qur, [_fname, _lname], function (error, results) {
        if (error) throw error;
        return res.send({
            error: false, 
            data: results, 
            message: 'User list retrieved'
        });
    });
});

/* Select user */
/* Testing select user (GET) url: http://localhost:3000/teaoryuser/# */
/*
   test case1 : http://localhost:3000/teaoryuser/100000004
       result : {
                    "error": false,
                    "data": {
                        "user_id": 100000004,
                        "user_fname": "aaimmm",
                        "user_lname": "heyyyy",
                        "user_phone": "0975842659",
                        "user_email": "aaimmm@gmail.com",
                        "user_address": "1027 Phloen Chit road Bangkok 10330",
                        "user_prefer": "Jasmine tea",
                        "login_user": "aaimmm_hey",
                        "login_pwd": "aim1234",
                        "login_role": "A",
                        "login_time": "2021-04-05T02:46:33.000Z"
                    },
                    "message": "User information retrieved"
                }

   test case2 : http://localhost:3000/teaoryuser/100000005
       result : {
                    "error": false,
                    "data": {
                        "user_id": 100000005,
                        "user_fname": "Iloveshabu",
                        "user_lname": "buffet",
                        "user_phone": "0945123486",
                        "user_email": "Iloveshabu@gmail.com",
                        "user_address": "99/99 Chaengwattana road Nonthaburi 11120",
                        "user_prefer": "Chamomile tea",
                        "login_user": "Iloveshabu_buf",
                        "login_pwd": "shabu1234",
                        "login_role": "C",
                        "login_time": "2021-04-09T22:06:40.000Z"
                    },
                    "message": "User information retrieved"
                }
*/
router.get("/teaoryuser/:id", jsonParser, function(req, res) {
    let userID = req.params.id;
    console.log(userID);

    if (!userID || (userID < 100000000 || userID > 199999999)) {
        return res
            .status(400)
            .send({ error: true, message: 'Please provide a valid user id [9 digits] ! (e.g.100000005)' });
    }

    let q = "SELECT userinfo.user_id, user_fname, user_lname, user_phone, user_email, user_address, user_prefer, login_user, login_pwd, login_role, login_time"
            + " FROM userinfo INNER JOIN logininfo ON userinfo.user_id = logininfo.user_id"
            + " WHERE userinfo.user_id = ?";

    dbConnection.query(q, userID, function (error, results) {
        if (error) throw error;
        console.log(results[0]);
        if (results[0]) {
            return res.send({
                error: false, 
                data: results[0], 
                message: 'User information retrieved'
            });
        } else {
            return res.send({
                error: false, 
                data: results[0], 
                message: "Given id doesn't exist! Please change the id"
            });
        }
    });
});

/* Select all users */
/* Testing select all type (GET) url: http://localhost:3000/teaoryusers */
router.get("/teaoryusers", jsonParser, function(req, res) {
    let q = "SELECT userinfo.user_id, user_fname, user_lname, user_phone, user_email, user_address, user_prefer, login_user, login_pwd, login_role, login_time"
            + " FROM userinfo INNER JOIN logininfo ON userinfo.user_id = logininfo.user_id"
            + " ORDER BY user_id ASC;";
    dbConnection.query(q, function (error, results) {
        if (error) throw error;
        //console.log(results);
        return res.send({
            error: false,
            data: results,
            message: "User list"
        });
    });
});

/* Insert user */
/* Testing insert new user (POST) url: http://localhost:3000/teaoryuser */
/*
   test case1:
   {
        "uInfo": {
                "user_id": 100000008,
                "user_fname": "Meat",
                "user_lname": "Lover", 
                "user_phone": "0943225468", 
                "user_email": "iammeatlover@gmail.com",
                "user_address": "1520 Kanjanavanich road Songkhla 90110",
                "user_prefer": "Rose tea",
            },
        "lInfo": {
                "login_user": "meat_everyday",
                "login_pwd": "meatMe2021",
                "login_role": "C",
                "login_time": "2021-04-14T19:21:09.000",
                "user_id": 100000008
        }
   }
   test case2:
   {
        "uInfo": {
                "user_id": 100000009,
                "user_fname": "Chocolate",
                "user_lname": "Lover", 
                "user_phone": "0943225468", 
                "user_email": "iamchocolatelover@gmail.com",
                "user_address": "1520 Kanjanavanich road Songkhla 90110",
                "user_prefer": "Chrysanthemum tea"
            },
        "lInfo": {
                "login_user": "HappyChoco",
                "login_pwd": "Chocolovelove04",
                "login_role": "C",
                "login_time": "2021-04-16T19:21:09.000",
                "user_id": 100000009
        }
   }
*/
router.post("/teaoryuser", jsonParser, function (req, res) {

    let uinfo = req.body.uInfo;
    let linfo = req.body.lInfo;

    if (!uinfo || !linfo) {
        return res
            .status(400)
            .send({ error: true, message: 'Please provide user information.' });
    } else if ((uinfo.user_id < 100000000 || uinfo.user_id > 199999999)) {
        return res
            .status(400)
            .send({ error: true, message: 'Please provide a valid user id [9 digits] ! (e.g.100000005)' });
    }

    dbConnection.query("INSERT INTO UserInfo  SET ? ", uinfo, function (error, results) {
        if (error) if (error.errno == 1062) {
            return res.send({ 
                error: true,
                message: error.message+" Please change the id"
            });
        } else {
            throw error;
        }
        dbConnection.query("INSERT INTO loginInfo SET ? ", linfo, function (error, results) {
            if (error) throw error;
        });
        return res.send({
            error: false, 
            data: results.affectedRows, 
            message: 'New user account has been created successfully.'
        });
    });

});


/* Update user */
/* Testing insert new user (PUT) url: http://localhost:3000/teaoryuser */
/*
   test case1:
   {
        "uInfo": {
                "user_id": 100000008,
                "user_fname": "Meat",
                "user_lname": "LoveMak", 
                "user_phone": "0943225468", 
                "user_email": "iammeatlover@gmail.com",
                "user_address": "1520 Kanjanavanich road Songkhla 90110",
                "user_prefer": "Jasmine tea"
            },
        "lInfo": {
                "login_user": "meat_everyday",
                "login_pwd": "meatMe2021",
                "login_role": "C",
                "login_time": "2021-04-17T10:21:09.000",
                "user_id": 100000008
        }
   }
   test case2:
   {
        "uInfo": {
                "user_id": 100000009,
                "user_fname": "Chocolate",
                "user_lname": "LoveMak", 
                "user_phone": "0943225468", 
                "user_email": "iamchocolatelover@gmail.com",
                "user_address": "1520 Kanjanavanich road Songkhla 90110",
                "user_prefer": "Sacred lotus tea"
            },
        "lInfo": {
                "login_user": "HappyChoco",
                "login_pwd": "Chocolovelove04",
                "login_role": "C",
                "login_time": "2021-04-17T12:21:09.000",
                "user_id": 100000009
        }
   }
*/
router.put("/teaoryuser", jsonParser, function (req, res) {

    let uinfo = req.body.uInfo;
    let linfo = req.body.lInfo;
    let uid = req.body.uInfo.user_id;
    console.log(uid);
    console.log(uinfo);
    console.log(linfo);

    if (!uinfo || !linfo) {
        return res
            .status(400)
            .send({ error: true, message: 'Please provide user information.' });
    } else if ((uinfo.user_id < 100000000 || uinfo.user_id > 199999999)) {
        return res
            .status(400)
            .send({ error: true, message: 'Please provide a valid user id [9 digits] ! (e.g.100000005)' });
    }

    dbConnection.query("UPDATE UserInfo SET ? WHERE user_id = ?", [uinfo, uid], function (error, results) {
        if (error) throw error;
        dbConnection.query("UPDATE loginInfo SET ? WHERE user_id = ?", [linfo, uid], function (error, results) {
            if (error) throw error;
        });
        return res.send({
            error: false, 
            data: results.affectedRows, 
            message: 'User account and profile have been updated successfully.'
        });
    });
});

/* Delete user */
/* Testing insert a type of tea (DELETE) url: http://localhost:3000/teaorytype */
/*
   test case1: { "uid": 100000002  }
   test case2: { "uid": 100000003  }
*/
router.delete("/teaoryuser", jsonParser, function (req, res) {

    let userID = req.body.uid;
    if (!userID || (userID < 100000000 || userID > 199999999)) {
        return res
            .status(400)
            .send({ error: true, message: 'Please provide a valid user id [9 digits] ! (e.g.100000005)' });
    }
    
    dbConnection.query("DELETE FROM LoginInfo WHERE user_id = ?;", userID, function (error, results) {
        if (error) throw error;
        dbConnection.query("DELETE FROM UserInfo WHERE user_id = ?;", userID, function (error, results) {
            if (error) throw error;
        });
        return res.send({ 
            error: false,
            data: results.affectedRows, 
            message: "user's account and profile have been deleted successfully."
        });
    });
});

/* check lastest id of user (Registration.js)*/
/* Testing url: http://localhost:3000/newID */
/* lastest id od user */
router.get("/newID", function (req, res) {
    dbConnection.query("SELECT MAX(user_id) AS id FROM UserInfo ", function (error, results) {
        if (error) throw error;
        console.log(results[0]);
        return res.send({
            error: false,
            data: results[0],
        });
    });
});

/* email validation for new account creation (Register.html)*/
/* Testing url: http://localhost:3000/email */
/* return list of id and email of each user  */
router.get("/email", function (req, res) {
    dbConnection.query("SELECT user_id, user_email FROM UserInfo", function (error, results) {
        if (error) throw error;
        console.log("sent email list");
        return res.send({
            error: false,
            data: results,
        });
    });
});

/* login validation (accountValidation.js and Registration.js)*/
/* Testing url: http://localhost:3000/login */
/* return list of username, password, and role of each user  */
router.get("/login", function (req, res) {
    dbConnection.query("SELECT login_user, login_pwd, login_role FROM logininfo", function (error, results) {
        if (error) throw error;
        return res.send({
            error: false,
            data: results,
        });
    });
});

app.listen(process.env.PORT, function() {
    console.log("Server listening at PORT "+process.env.PORT);
});