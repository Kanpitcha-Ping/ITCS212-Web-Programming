async function callWebService (url, method, sentData = {}) {
    let data;
    if (method == "selectAll" || method == "getTypTea" || method == "select") {
        let response =await fetch (url, { method: "GET" });
        data = await response.json();
    } else if (method == "search" || method == "insert" || method == "update" || method == "delete") {
        let aMethod;
        if (method == "search" || method == "insert") {
            aMethod = "POST";
        } else if (method == "update") {
            aMethod = "PUT";
        } else if (method == "delete") {
            aMethod = "DELETE";
        }
        let response = await fetch (url, { 
            method: aMethod,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sentData)        
        });
        data = await response.json();
    }                             
    return data;
}

function getCurrentDatetime() {
    let now = new Date();
    return now.toISOString().split("Z")[0];
    //"2021-04-03T19:21:09.000"
}

let uidTxtRef = document.querySelector("#uid");
let fnameTxtRef = document.querySelector("#fname");
let lnameTxtRef = document.querySelector("#lname");
let phoneTxtRef = document.querySelector("#phone");
let emailTxtRef = document.querySelector("#email");
let addressTxtRef = document.querySelector("#address");
let preferTxtRef = document.querySelector("#prefer");
let unameTxtRef = document.querySelector("#l_uname");
let pwdTxtRef = document.querySelector("#pwd");
let roleTxtRef = document.querySelector("#l_role");
let lastLoginTxtRef = document.querySelector("#lastLogin");
lastLoginTxtRef.value = getCurrentDatetime();

let s_uidTxtRef = document.querySelector("#s_uid");
let s_fnameTxtRef = document.querySelector("#s_fname");
let s_lnameTxtRef = document.querySelector("#s_lname");
let s_phoneTxtRef = document.querySelector("#s_phone");
let s_emailTxtRef = document.querySelector("#s_email");
let s_unameTxtRef = document.querySelector("#s_uname");
let s_pwdTxtRef = document.querySelector("#s_pwd");
let s_roleTxtRef = document.querySelector("#s_role");

let searchBtnRef = document.querySelector("#searchUsers");

let selUserBtnRef = document.querySelector("#selUser");
let selAllUserBtnRef = document.querySelector("#selAllUsers");
let insertUserBtnRef = document.querySelector("#insertUser");
let updateUserBtnRef = document.querySelector("#updateUser");
let deleteUserBtnRef = document.querySelector("#deleteUser");

/* get all type of tea and add them into options of each datalist */
callWebService("http://localhost:3000/typtea", "getTypTea").then((data) => {
    console.log(data);
    let typOpName = '';
    if (data.data.length > 0) {
        data.data.forEach( (element) => {
            typOpName += '<option value="'+element.tt_name+'">'+element.tt_name+'</option>';
        });
        document.querySelector("#dList").innerHTML = typOpName;
    }
});

function clearInput() {
    uidTxtRef.value = "";
    fnameTxtRef.value = "";
    lnameTxtRef.value = "";
    phoneTxtRef.value = "";
    emailTxtRef.value = "";
    addressTxtRef.value = "";
    preferTxtRef.value = "";
    unameTxtRef.value  = "";
    pwdTxtRef.value = "";
    roleTxtRef.value = "";
    lastLoginTxtRef.value  = getCurrentDatetime();
}


/* Search user */
searchBtnRef.addEventListener("click", () => {

    let condition = {
        "condition": {
            "user_id": parseInt(s_uidTxtRef.value),
            "user_fname": s_fnameTxtRef.value,
            "user_lname": s_lnameTxtRef.value, 
            "user_phone": s_phoneTxtRef.value, 
            "user_email": s_emailTxtRef.value,
            "login_user": s_unameTxtRef.value,
            "login_pwd": s_pwdTxtRef.value,
            "login_role": s_roleTxtRef.value
        }
    };
    console.log(condition);

    callWebService("http://localhost:3000/searchuser", "search", condition).then((data) => {
        console.log(data);
        let output;
        if (data.data.length > 0) {
            alert(data.message+": "+data.data.length);
            output = "<table class='Table'>";
            output += "<thead><tr>";
            output += "<tr>";
            output += "<th>ID</th>"+
            "<th>Firstname</th>"+
            "<th>Lastname</th>"+
            "<th>Phone</th>"+
            "<th>Email</th>"+
            "<th>Address</th>"+
            "<th>Prefer</th>"+
            "<th>Username</th>"+
            "<th>Password</th>"+
            "<th>Role</th>"+
            "<th>Last login</th>"+
            "</tr></thead>"; 
        output += "<tbody>";
        data.data.forEach( (element) => {
            output += "<tr>";
            output += "<td>"+element.user_id+"</td>";
            output += "<td>"+element.user_fname+"</td>";
            output += "<td>"+element.user_lname+"</td>";
            output += "<td>"+element.user_phone+"</td>";
            output += "<td>"+element.user_email+"</td>";
            output += "<td>"+element.user_address+"</td>";
            output += "<td>"+element.user_prefer+"</td>";
            output += "<td>"+element.login_user+"</td>";
            output += "<td>"+element.login_pwd+"</td>";
            output += "<td>"+element.login_role+"</td>";
            output += "<td>"+element.login_time+"</td>";
            output += "</tr>";
        });
            output += "</tbody>";
            output += "</table>";
            document.querySelector("#showUserList").style["height"] = "400px";
            document.querySelector("#showUserList").innerHTML = output;
        } else {
            alert("No existing user match!");
        }
    });
});

/* Select user */
selUserBtnRef.addEventListener("click", () => {
    let userID = parseInt(uidTxtRef.value);
    
    callWebService("http://localhost:3000/teaoryuser/"+userID, "select").then( (data) => {
        console.log(data);
        if (data.data) {
            alert(data.message);
            fnameTxtRef.value = data.data.user_fname;
            lnameTxtRef.value = data.data.user_lname;
            phoneTxtRef.value = data.data.user_phone;
            emailTxtRef.value = data.data.user_email;
            addressTxtRef.value = data.data.user_address;
            preferTxtRef.value = data.data.user_prefer;
            unameTxtRef.value = data.data.login_user;
            pwdTxtRef.value = data.data.login_pwd;
            roleTxtRef.value = data.data.login_role;
            let dt = data.data.login_time.split("Z"); //"2021-01-03T19:21:09.000Z"
            lastLoginTxtRef.value = dt[0];
            console.log(getCurrentDatetime());   
        } else {
            alert(data.message);
            clearInput();
        }
    }
    );
});

/* View all users*/ 
selAllUserBtnRef.addEventListener("click", () => {
    callWebService("http://localhost:3000/teaoryusers", "selectAll").then((data) => {
        console.log(data);
        let output;
        if (data.data.length > 0) {
            alert(data.message+": "+data.data.length);
            output = "<table class='Table'>";
            output += "<thead><tr>";
            output += "<tr>";
            output += "<th>ID</th>"+
                "<th>Firstname</th>"+
                "<th>Lastname</th>"+
                "<th>Phone</th>"+
                "<th>Email</th>"+
                "<th>Address</th>"+
                "<th>Prefer</th>"+
                "<th>Username</th>"+
                "<th>Password</th>"+
                "<th>Role</th>"+
                "<th>Last login</th>"+
                "</tr></thead>"; 
            output += "<tbody>";
            data.data.forEach( (element) => {
                output += "<tr>";
                output += "<td>"+element.user_id+"</td>";
                output += "<td>"+element.user_fname+"</td>";
                output += "<td>"+element.user_lname+"</td>";
                output += "<td>"+element.user_phone+"</td>";
                output += "<td>"+element.user_email+"</td>";
                output += "<td>"+element.user_address+"</td>";
                output += "<td>"+element.user_prefer+"</td>";
                output += "<td>"+element.login_user+"</td>";
                output += "<td>"+element.login_pwd+"</td>";
                output += "<td>"+element.login_role+"</td>";
                output += "<td>"+element.login_time+"</td>";
                output += "</tr>";
            });
            output += "</tbody>";
            output += "</table>";
            document.querySelector("#showUser").style["height"] = "400px";
            document.querySelector("#showUser").innerHTML = output;
        } else {
            alert("no existing information!");
        }
    });
});

/* Insert user */
insertUserBtnRef.addEventListener("click", () => {
    
    if (confirm("Are you sure to add new user id: "+parseInt(uidTxtRef.value)+" ?")) {

        let user_data = {
            "uInfo": {
                "user_id": parseInt(uidTxtRef.value),
                "user_fname": fnameTxtRef.value,
                "user_lname": lnameTxtRef.value, 
                "user_phone": phoneTxtRef.value, 
                "user_email": emailTxtRef.value,
                "user_address": addressTxtRef.value,
                "user_prefer": preferTxtRef.value
            },
            "lInfo": {
                "login_user": unameTxtRef.value,
                "login_pwd": pwdTxtRef.value,
                "login_role": roleTxtRef.value,
                "login_time": lastLoginTxtRef.value,
                "user_id": parseInt(uidTxtRef.value)
            }
        };

        callWebService("http://localhost:3000/teaoryuser", "insert", user_data).then( (data) => {
            console.log(data);
            if (data.error == false) {
                alert(data.message);
                clearInput();
            } else {
                alert(data.message);
            }
        });
    }
});

/* Update user information */
updateUserBtnRef.addEventListener("click", () => {
    
    if (confirm("Are you sure to update user's information?")) {

        let user_data = {
            "uInfo": {
                "user_id": parseInt(uidTxtRef.value),
                "user_fname": fnameTxtRef.value,
                "user_lname": lnameTxtRef.value, 
                "user_phone": phoneTxtRef.value, 
                "user_email": emailTxtRef.value,
                "user_address": addressTxtRef.value,
                "user_prefer": preferTxtRef.value,
            },
            "lInfo": {
                "login_user": unameTxtRef.value,
                "login_pwd": pwdTxtRef.value,
                "login_role": roleTxtRef.value,
                "login_time": lastLoginTxtRef.value,
                "user_id": parseInt(uidTxtRef.value)
            }
        };

        callWebService("http://localhost:3000/teaoryuser", "update", user_data).then( (data) => {
            console.log(data);
            if (data.data > 0) {
                alert(data.message);
                clearInput();
            }
        });
    }
});

/* Delete user */
deleteUserBtnRef.addEventListener("click", () => {

    if (confirm("Are you sure to delete user id: "+parseInt(uidTxtRef.value)+" ?")) {

        let user_data = { "uid": parseInt(uidTxtRef.value) };

        callWebService("http://localhost:3000/teaoryuser", "delete", user_data).then( (data) => {
            console.log(data);
            if (data.data > 0) {
                alert(data.message);
                clearInput();
            }
        });
    }
});

