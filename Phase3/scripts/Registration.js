async function callWebService(url, method, sentData) {
    let data;
    if (method == "getID" || method == "getLoginInfo") {
        let response = await fetch (url, { method: "GET" });
        data = await response.json();   
    } else {
        let response = await fetch (url, { 
            method: "POST",
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

const queryString = window.location.search;
const params = new URLSearchParams(queryString);
let fname, lname, phone, mail;
if (queryString) {
    fname = params.get("firstname");
    lname = params.get("lastname");
    phone = params.get("phonenum");
    mail = params.get("email");
    console.log(fname+" "+lname+" "+phone+" "+mail);
} 
let usernameTxtRef = document.querySelector("#username");
let pwdTxtRef = document.querySelector("#password");
let comfirmPwdTxtRef = document.querySelector("#comfirmPwd");

let formRef = document.querySelector("#newAccount");
let insertBtnRef = document.querySelector("#insertNewAccount");

let newID;
function getNewUserID() {
    callWebService("http://localhost:3000/newID", "getID").then((data) => {
        if (data.error == false) {
            newID = data.data.id+1;
        } 
    });
}
getNewUserID();

function getCurrentDatetime() {
    let now = new Date();
    return now.toISOString().split("Z")[0];
    //"2021-04-03T19:21:09.000"
}

function resetWarning() {
    document.querySelector("#checkPwd").innerHTML = "";
}

function isPwdMatch() {
    return (pwdTxtRef.value === comfirmPwdTxtRef.value ? true : false);
}


insertBtnRef.addEventListener("click", () => {

    resetWarning(); 
    /* check whether the password and confirm password are matched */
    if (isPwdMatch() == false) {
        alert("Your comfirm password is unmatch!");
        comfirmPwdTxtRef.value = "";
        comfirmPwdTxtRef.focus;
        document.querySelector("#checkPwd").innerHTML = "*check your confirm";
    } else {
        /* check duplicated username and password */
        let valid = true;
        callWebService("http://localhost:3000/login", "getLoginInfo").then((data) => {
            //console.log(data.data);
            if (data.error == false) {
                data.data.forEach(element => { 
                    if (usernameTxtRef.value == element.login_user) {
                        valid = false;
                        alert("Sorry this username has been used!");
                        usernameTxtRef.focus();
                    } else if (pwdTxtRef.value == element.login_pwd) {
                        valid = false;
                        alert("Password is not strong enough!");
                        pwdTxtRef.focus();
                    } 
                });
            } 
            
            if (valid == true) {
                let info = {
                    "uInfo": {
                        "user_id": newID,
                        "user_fname": fname,
                        "user_lname": lname, 
                        "user_phone": phone, 
                        "user_email": mail,
                        "user_address": "",
                        "user_prefer": ""
                    },
                    "lInfo": {
                        "login_user": usernameTxtRef.value,
                        "login_pwd": pwdTxtRef.value,
                        "login_role": "C",
                        "login_time": getCurrentDatetime(),
                        "user_id": newID
                    }
                }
                //console.log(newID);
                //console.log(usernameTxtRef.value+" "+pwdTxtRef.value);
                callWebService("http://localhost:3000/teaoryuser", "insert", info).then((data) => {
                    console.log(data);
                        if (data.error == false) {
                            alert(data.message);
                            window.location = "normalUserSearch.html";
                        } else {
                            alert(data.message);
                        }
                });
            }
        });        
    }
});

formRef.addEventListener("submit", (event) => {
    event.preventDefault();
});