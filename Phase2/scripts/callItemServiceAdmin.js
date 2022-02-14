async function callWebService (url, method, sentData = {}) {
    let data;
    if (method == "selectAll" || method == "getTypTea" || method == "select") {
        let response = await fetch (url, { method: "GET" });
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

/* get all type of tea and add them into options of each datalist */
callWebService("http://localhost:3000/typtea", "getTypTea").then((data) => {
    console.log(data);
    let typOpName = '';
    let typOpID = '';
    if (data.data.length > 0) {
        data.data.forEach( (element) => {
            typOpName += '<option id="'+element.tt_id+'" value="'+element.tt_name+'">'+element.tt_name+'</option>';
            typOpID += '<option id="'+element.tt_name+'" value="'+element.tt_id+'">';
        });
        document.querySelector("#typ_id").innerHTML = typOpID;
        document.querySelector("#typ_name").innerHTML = typOpName;
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

let typTIDTxtRef = document.querySelector("#typTID");
let typTNameTxtRef = document.querySelector("#typTName");

let pidTxtRef = document.querySelector("#p_id");
let pnameTxtRef = document.querySelector("#p_name");
let pstatusTxtRef = document.querySelector("#p_status");
let pdesTxtRef = document.querySelector("#p_des");
let ttidTxtRef = document.querySelector("#typID");
let ttnameTxtRef = document.querySelector("#typName");
let priceTxtRef = document.querySelector("#p_price");
let unitTxtRef = document.querySelector("#p_unit");

let searchItemBtnRef = document.querySelector("#searchItems");

let selTypeBtnRef = document.querySelector("#selType");
let selAllTypesBtnRef = document.querySelector("#selAllTypes");
let insertTypeBtnRef = document.querySelector("#insertType");
let updateTypeBtnRef = document.querySelector("#updateType");
let deleteTypeBtnRef = document.querySelector("#deleteType");

let selItemBtnRef = document.querySelector("#selItem");
let selAllItemBtnRef = document.querySelector("#selAllItems");
let insertItemBtnRef = document.querySelector("#insertItem");
let updateItemBtnRef = document.querySelector("#updateItem");
let deleteItemBtnRef = document.querySelector("#deleteItem");

function clearInput() {
    pidTxtRef.value = "";
    pnameTxtRef.value = "";
    pdesTxtRef.value = "";
    ttidTxtRef.value = "";
    ttnameTxtRef.value = "";
    priceTxtRef.value = "";
}

function macthTypID(f) {
    if (f === "formTyp" && document.getElementById(typTIDTxtRef.value.toString())) {
        typTNameTxtRef.value = document.getElementById(typTIDTxtRef.value.toString()).value;
    } else if (f === "formTyp" && !document.getElementById(typTIDTxtRef.value.toString())) {
        typTNameTxtRef.value = "";
    } else if (f === "formProd" && document.getElementById(ttidTxtRef.value.toString())) {
        ttnameTxtRef.value = document.getElementById(ttidTxtRef.value.toString()).value;
    } else if (f === "formProd" && !document.getElementById(ttidTxtRef.value.toString())) {
        ttnameTxtRef.value = "";
    }                 
}

function macthTypName(f) {
    if (f === "formTyp" && document.getElementById(typTNameTxtRef.value.toString())) {
        typTIDTxtRef.value = document.getElementById(typTNameTxtRef.value.toString()).value;
    } else if (f === "formTyp" && !document.getElementById(typTNameTxtRef.value.toString())) {
        typTIDTxtRef.value = "";
    } else if (f === "formProd" && document.getElementById(ttnameTxtRef.value.toString())) {
        ttidTxtRef.value = document.getElementById(ttnameTxtRef.value.toString()).value;
    } else if (f === "formProd" && !document.getElementById(ttnameTxtRef.value.toString())) {
        ttidTxtRef.value = "";
    } 
}

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
            "typTea": typT,
            "product": prodT,
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


/* Select type of tea */
selTypeBtnRef.addEventListener("click", () => {
    let tid= parseInt(typTIDTxtRef.value);
    
    callWebService("http://localhost:3000/teaorytype/"+tid, "select").then( (data) => {
        console.log(data);
        if (data.data) {
            alert(data.message);
            typTIDTxtRef.value = data.data.tt_id;
            typTNameTxtRef.value = data.data.tt_name; 
        } else {
            alert(data.message);
            clearInput();
        }
    }
    );
});

/* see all types */
selAllTypesBtnRef.addEventListener("click", () => {
    callWebService("http://localhost:3000/teaorytypes", "selectAll").then((data) => {
        console.log(data);
        let output;
        if (data.data.length > 0) {
            alert(data.message+": "+data.data.length);
            output = "<table class='Table'>";
            output += "<thead><tr>";
            output += "<tr>";
            output += "<th>TID</th>"+
                "<th>type</th>"+
                "</tr></thead>"; 
            output += "<tbody>";
            data.data.forEach( (element) => {
                output += "<tr>";
                output += "<td>"+element.tt_id+"</td>";
                output += "<td>"+element.tt_name+"</td>";
            });
            output += "</tbody>";
            output += "</table>";
            document.querySelector("#showAll").innerHTML = output;
        } else {
            alert("No existing items!");
        }
    });
});


/* Insert type of tea */
insertTypeBtnRef.addEventListener("click", () => {
    
    if (confirm("Are you sure to add new type id: "+parseInt(typTIDTxtRef.value)+" ?")) {

        let newType = {
            "typ": {
                "tt_id": parseInt(typTIDTxtRef.value),
                "tt_name": typTNameTxtRef.value
            }
        };

        callWebService("http://localhost:3000/teaorytype", "insert", newType).then( (data) => {
            console.log(data);
            if (data.error == false) {
                alert(data.message);
            } else {
                alert(data.message);
            }
        });
    }
});

/* Update type of tea */
updateTypeBtnRef.addEventListener("click", () => {
    
    if (confirm("Are you sure to update this type name?")) {

        let newData = {
            "typ": {
                "tt_id": parseInt(typTIDTxtRef.value),
                "tt_name": typTNameTxtRef.value
            }
        };

        callWebService("http://localhost:3000/teaorytype", "update", newData).then( (data) => {
            console.log(data);
            if (data.data > 0) {
                alert(data.message);
                typTIDTxtRef.value = "";
                typTNameTxtRef.value = "";
            }
        });
    }
});
/* Delete type of tea */
deleteTypeBtnRef.addEventListener("click", () => {

    if (confirm("Are you sure to delete type id: "+parseInt(typTIDTxtRef.value)+" ?")) {

        let typ = { "tt_id": parseInt(typTIDTxtRef.value) };

        callWebService("http://localhost:3000/teaorytype", "delete", typ).then( (data) => {
            if (data.error == false) {
                alert(data.message);
                typTIDTxtRef.value = "";
                typTNameTxtRef.value = "";
            } else  {
                confirm(data.message);
            }
        });
    }
});

/* Select product */
selItemBtnRef.addEventListener("click", () => {
    let PID = parseInt(pidTxtRef.value);
    
    callWebService("http://localhost:3000/teaoryitem/"+PID, "select").then( (data) => {
        console.log(data);
        if (data.data) {
            alert(data.message);
            pidTxtRef.value = data.data.prod_id;
            pnameTxtRef.value = data.data.prod_name;
            pstatusTxtRef.value = data.data.prod_status;
            pdesTxtRef.value = data.data.prod_des;
            ttidTxtRef.value = data.data.tt_id;
            ttnameTxtRef.value = data.data.tt_name;
            priceTxtRef.value = data.data.prod_price;
            unitTxtRef.value = data.data.prod_unit; 
        } else {
            alert(data.message);
            clearInput();
        }
    }
    );
});

/* see all products */
selAllItemBtnRef.addEventListener("click", () => {
    callWebService("http://localhost:3000/teaoryitems", "selectAll").then((data) => {
        console.log(data);
        let output;
        if (data.data.length > 0) {
            alert(data.message+": "+data.data.length);
            output = "<table class='Table'>";
            output += "<thead><tr>";
            output += "<tr>";
            output += "<th>PID</th>"+
                "<th>product</th>"+
                "<th>type</th>"+
                "<th>status</th>"+
                "<th>description</th>"+
                "<th>price</th>"+
                "<th>unit</th>"+
                "</tr></thead>"; 
            output += "<tbody>";
            data.data.forEach( (element) => {
                output += "<tr>";
                output += "<td>"+element.prod_id+"</td>";
                output += "<td>"+element.prod_name+"</td>";
                output += "<td>"+element.tt_name+"</td>";
                output += "<td>"+element.prod_status+"</td>";
                if (element.prod_des == null) {output += "<td></td>"; }
                else {output += "<td>"+element.prod_des+"</td>";}
                output += "<td>"+element.prod_price+"</td>";
                output += "<td>"+element.prod_unit+"</td>";
                output += "</tr>";
            });
            output += "</tbody>";
            output += "</table>";
            document.querySelector("#showAll").innerHTML = output;
        } else {
            alert("No existing items!");
        }
    });
});


/* Insert item */
insertItemBtnRef.addEventListener("click", () => {
    
    if (confirm("Are you sure to add new product id: "+parseInt(pidTxtRef.value)+" ?")) {

        let newProd = {
            "prod": {
                "prod_id": parseInt(pidTxtRef.value),
                "prod_name": pnameTxtRef.value,
                "prod_status": pstatusTxtRef.value, 
                "prod_des": pdesTxtRef.value, 
                "tt_id": parseInt(ttidTxtRef.value)
            },
            "prodDetails": {
                "prod_price": parseInt(priceTxtRef.value),
                "prod_unit": unitTxtRef.value,
                "prod_id": parseInt(pidTxtRef.value)
            }
        };

        callWebService("http://localhost:3000/teaoryitem", "insert", newProd).then( (data) => {
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

/* Update item */
updateItemBtnRef.addEventListener("click", () => {
    
    if (confirm("Are you sure to update this item?")) {

        let prod_data = {
            "prod": {
                "prod_id": parseInt(pidTxtRef.value),
                "prod_name": pnameTxtRef.value,
                "prod_status": pstatusTxtRef.value, 
                "prod_des": pdesTxtRef.value, 
                "tt_id": parseInt(ttidTxtRef.value)
            },
            "prodDetails": {
                "prod_price": parseInt(priceTxtRef.value),
                "prod_unit": unitTxtRef.value,
                "prod_id": parseInt(pidTxtRef.value)
            }
        };

        callWebService("http://localhost:3000/teaoryitem", "update", prod_data).then( (data) => {
            console.log(data);
            if (data.data > 0) {
                alert(data.message);
                clearInput();
            }
        });
    }
});

/* Delete item */
deleteItemBtnRef.addEventListener("click", () => {

    if (confirm("Are you sure to delete product id: "+parseInt(pidTxtRef.value)+" ?")) {

        let prod = { "pid": parseInt(pidTxtRef.value) };

        callWebService("http://localhost:3000/teaoryitem", "delete", prod).then( (data) => {
            console.log(data);
            if (data.data > 0) {
                alert(data.message);
                clearInput();
            }
        });
    }
});

