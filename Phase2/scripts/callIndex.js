async function callUser(url, method, sentData = {}) {
    let data;
    if (method == "select_all") {
        let response = await fetch(url, {
            method: 'GET'
        });
        data = await response.json();
    }
    else if (method == "select") {
        let response = await fetch(url, {
            method: 'GET'
        });
        data = await response.json();
    }
    else if (method == "delete") {
        let response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sentData)
        });
        data = await response.json();
    }
    else if (method == "update") {
        let response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sentData)
        });
        data = await response.json();
    }
    else if (method == "insert") {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sentData)
        });
        data = await response.json();
    }
    return data;
}
const output = document.getElementById("result");

let selectAllBtnRef = document.querySelector("#select_all");
selectAllBtnRef.addEventListener("click", () => {
    let text = "";
    callUserWS("http://localhost:3030/students/", "select_all").then(
        (data) => {
            console.log(data);
            if (data) {
                alert(data.message);
                for (let i of data.data) {
                    let stuid = i.StudentID;
                    let stuf = i.Firstname;
                    let stul = i.Lastname;
                    let studob = i.DOB;
                    let stumobile = i.Mobilephone;
                    text += `Student ID: ${stuid} <ul> <li>Name: ${stuf} ${stul}</li> 
                        <li>Date of birth: ${studob}</li> <li>Phone: ${stumobile}</li> </ul>`
                }
                output.innerHTML = text;
            }
        }
    );
});

let selectBtnRef = document.querySelector("#select");
selectBtnRef.addEventListener("click", () => {
    let student_id = document.getElementById("inputID").value;
    callUserWS("http://localhost:3030/student/" + student_id, "select").then(
        (data) => {
            console.log(data);
            if (data) {
                alert(data.message);
            }
        }
    );
});

let insertBtnRef = document.querySelector("#insert");
insertBtnRef.addEventListener("click", () => {
    let text = "";
    let user = {
        "user_fname": document.getElementById("firstname").value,
        "user_lname": document.getElementById("lastname").value,
        "user_phone": document.getElementById("phonenum").value,
        "user_email": document.getElementById("email").value,
        "user_address": document.getElementById("address").value,
        "user_prefer": document.getElementById("favTea").value,
    }
    callUserWS("http://localhost:3030/user/", "insert", student).then((data) => {
        console.log(data);
    }
    );
});

let deleteBtnRef = document.querySelector("#delete");
deleteBtnRef.addEventListener("click", () => {
    let text = "";
    let student = {
        "StudentID": document.getElementById("inputID").value,
    }
    callUserWS("http://localhost:3030/delete/", "delete", student).then((data) => {
        console.log(data);
    }
    );
});

let updateBtnRef = document.querySelector("#update");
updateBtnRef.addEventListener("click", () => {
    let student = {
        "StudentID": document.getElementById("inputID").value,
        "Firstname": document.getElementById("inputFirst").value,
        "Lastname": document.getElementById("inputLast").value,
        "DOB": document.getElementById("inputAge").value,
        "Mobilephone": document.getElementById("inputMobile").value
    }
    console.log(student);

    callUserWS("http://localhost:3030/update/", "update", student).then((data) => {
        console.log(data);
    }
    );
});

function checkemail() {
    let user_email = document.getElementById("user_email").value;
    callUser("http://localhost:3030/user/" + user_email, "select").then(
        (data) => {
            console.log(data);
            if (data != undefined) {
                alert("This email has been already used");
            } else {
                alert("This email can be used");
            }
        }
    );
}