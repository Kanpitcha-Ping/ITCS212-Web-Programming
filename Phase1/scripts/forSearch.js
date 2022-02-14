function dis() 
{

    var lMenu = document.getElementById("listMenu").getElementsByTagName("li");

    for (var i=0; i<lMenu.length; i++) {
        if (lMenu[i].style.visibility === "") {
            lMenu[i].style.visibility = "inherit";
        }
    }
    

}

window.onmouseup = function(event) 
{
    var lMenu = document.getElementById("listMenu").getElementsByTagName("li");
    
    if (!event.target.matches("dropList")) {
        for (var i=0; i<lMenu.length; i++) {
            if (lMenu[i].style.visibility === "inherit") {
                lMenu[i].style.visibility = "";
            }    
        }
    }

}

function seeMenu()
{
    window.location = "Products.html";
}

function funcSearch()
{
    var input = document.getElementById("searchBox").value.toLowerCase();
    console.log(input);
    var lMenu = document.getElementById("listMenu").getElementsByTagName("li");
    var prodName, textName;

    for (var i=0; i<lMenu.length; i++) {
        prodName = lMenu[i].getElementsByTagName("a")[0];
        textName = prodName.textContent || prodName.innerText;
        
        if (textName.toLowerCase().indexOf(input) > -1) {
            lMenu[i].style.display = "";
        }
        else {
            lMenu[i].style.display = "none";
        }

    }

}

