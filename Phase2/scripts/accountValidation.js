async function callWebService (url) {
    let data;
    let response = await fetch (url, { method: "GET" });
    data = await response.json();                      
    return data;
}

let usernameTxtRef = document.querySelector("#username");
let pwdTxtRef = document.querySelector("#password");

let signInBtnRef = document.querySelector("#signIn");

signInBtnRef.addEventListener("click", () => {

    if (usernameTxtRef.value && pwdTxtRef.value) {
        
        let uname = usernameTxtRef.value;
        let pwd = pwdTxtRef.value;
        var valid = true;
        callWebService("http://localhost:3000/login").then((data) => {
            if (data.error == false) {
                data.data.forEach(element => {
                    if (uname === element.login_user && pwd === element.login_pwd) {
                        if (element.login_role == 'A') { //Admin
                            //console.log(element.login_role);
                            window.location = "adminUserManagement.html"; //go search page
                        } else { //normal user (customer)
                            //console.log(element.login_role);
                            window.location = "normalUserSearch.html"; //go search page
                        }
                    } else if (uname === element.login_user && pwd != element.login_pwd) {
                        valid = false;
                        alert("password incorrect!");
                    } 
                });
                if (valid == false) { alert("Your username is invalid!"); }
            } 
        });
    } else if (!usernameTxtRef.value) {
        alert("Please provide your username");
    } else if (!pwdTxtRef.value) {
        alert("Please provide your password");
    }
});