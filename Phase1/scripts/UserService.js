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
router.delete("/teaorytype", jsonParser, function (req, res) {

    let tid = req.body.tid;
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
              + ";";

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
router.get("/teaoryuser/:id", jsonParser, function(req, res) {
    let userID = req.params.id;
    console.log(userID);

    if (!userID) {
        return res
            .status(400)
            .send({ error: true, message: 'Please provide a valid user id.' });
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
}) ;

/* Insert user */
router.post("/teaoryuser", jsonParser, function (req, res) {

    let uinfo = req.body.uInfo;
    let linfo = req.body.lInfo;

    if (!uinfo || !linfo) {
        return res
            .status(400)
            .send({ error: true, message: 'Please provide user information.' });
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
router.delete("/teaoryuser", jsonParser, function (req, res) {

    let userID = req.body.uid;
    if (!userID) {
        return res
            .status(400)
            .send({ error: true, message: 'Please provide user id.' });
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

app.listen(process.env.PORT, function() {
    console.log("Server listening at PORT "+process.env.PORT);
});