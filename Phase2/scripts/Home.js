function showLang() {

    var listLang = document.getElementById("dropdown-lang").getElementsByTagName("li");
    console.log(listLang[0]);

    for (var i = 0; i < listLang.length; i++) {
        if (listLang[i].style.visibility === "") {
            listLang[i].style.visibility = "inherit";
        } else {
            listLang[i].style.visibility = "";
        }
    }
}

function ShowPassword() {
    var x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}




