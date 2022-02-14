async function callWebService (url, method, sentData = {}) {
    let data;
    if ( method == "getTypTea") {
        let response = await fetch (url, { method: "GET" });
        data = await response.json();
    } else if (method == "search") {
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

callWebService("http://localhost:3000/typtea", "getTypTea").then((data) => {
    console.log(data);
    let typOpName = '';
    if (data.data.length > 0) {
        data.data.forEach( (element) => {
            typOpName += '<option value="'+element.tt_name+'">'+element.tt_name+'</option>';
        });
        typOpName += '<option value="all" selected>all types</option>';
        document.querySelector("#typTea").innerHTML = typOpName;
    }
});

let typTeaTxtRef = document.querySelector("#typTea");
let prodSelRef = document.querySelector("#product");
let minPRef = document.querySelector("#minP");
let maxPRef = document.querySelector("#maxP");
let bagRef = document.querySelector("#bag");
let boxRef = document.querySelector("#box");

let searchItemBtnRef = document.querySelector("#searchItems");

/* Normal searching*/
searchItemBtnRef.addEventListener("click", () => {
    let typT = typTeaTxtRef.value;
    let prodT = prodSelRef.value;
    let min = parseInt(minPRef.value);
    let max = parseInt(maxPRef.value);
    let unit = "all"; //case: all unchecked

    if (bagRef.checked === true && boxRef.checked === false) {
        unit = bagRef.value;
    } else if (bagRef.checked === false && boxRef.checked === true) {
        unit = boxRef.value;
    } 

    let condition = {
        "condition": {
            "product": prodT,
            "typTea": typT,
            "min": min,
            "max": max,
            "unit": unit
        }
    };
    console.log(condition);

    callWebService("http://localhost:3000/search", "search", condition).then((data) => {
        console.log(data);
        let output;
        if (data.data.length > 0) {
            alert(data.message+": "+data.data.length);
            output = "<table class='Table'>";
            output += "<thead><tr>";
            output += "<tr>";
            output += "<th>Product</th>"+
                "<th>Type</th>"+
                "<th>Price</th>"+
                "<th>Unit</th>"+
                "<th>view menu</th>"+
                "</tr></thead>"; 
            output += "<tbody>";
            data.data.forEach( (element) => {
                output += "<tr>";
                output += "<td>"+element.prod_name+"</td>";
                output += "<td>"+element.tt_name+"</td>";
                output += "<td>"+element.prod_price+"</td>";
                output += "<td>"+element.prod_unit+"</td>";
                let menu = element.tt_name.split(" tea");
                if (menu[0].split(' ')[1] == 'lotus') {
                    output += '<td class="col-view"><a href="product.html#lotus">'+'<img class="col-view" border="0" src="images/lotus_icon.png" width="50" height="50">'+'</a></td>';
                } else {
                    output += '<td class="col-view"><a href="product.html#'+menu[0].toLowerCase()+'">'+'<img class="col-view" border="0" src="images/'+menu[0].toLowerCase()+'_icon.png" width="50" height="50">'+'</a></td>';
                }
                output += "</tr>";
            });
            output += "</tbody>";
            output += "</table>";
            document.querySelector("#result").innerHTML = output;
        } else {
            alert("No existing products match!");
        }
    });
});


