let tokenApi = "pk.eyJ1Ijoia2FucGl0Y2hhcGluZyIsImEiOiJja25rbHE2djQwYWVwMndtMDA2NnJpNncxIn0.-A_qDI39BmUlWkAMwvgjTg";

let start = "-84.518641,39.134270";
let end = "-84.512023,39.102779";


let rooturl = "https://api.mapbox.com/directions-matrix/v5/mapbox/driving/-84.518641,39.134270;-84.512023,39.102779?"
              + "geometries=geojson&access_token="
              + tokenApi;

              mapboxgl.accessToken = 'pk.eyJ1Ijoia2FucGl0Y2hhcGluZyIsImEiOiJja25rbHE2djQwYWVwMndtMDA2NnJpNncxIn0.-A_qDI39BmUlWkAMwvgjTg';
              var map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v10',
                center: [-122.662323, 45.523751], // starting position
                zoom: 12
              });
              // set the bounds of the map
              var bounds = [[-123.069003, 45.395273], [-122.303707, 45.612333]];
              map.setMaxBounds(bounds);
              
              // initialize the map canvas to interact with later
              var canvas = map.getCanvasContainer();
              
              // an arbitrary start will always be the same
              // only the end or destination will change
              var start = [-122.662323, 45.523751];
              
              // this is where the code for the next step will go

fetch(rooturl, {
    method: "GET",

}).then((res) => res.json()) 
.then((data) => {
    console.log(data);
    let list = "";
    if (data.results.length > 0) {
        for (let i=0; i < data.results.length; i++) {
            list += "<li>"+data.results[i].title+"<br>"+"<img src='"+data.results[i].image+"'>"+"</li>"
        }
    } else {
        list = "Not Found";
    }
    //console.log(list);
    document.querySelector("#output").innerHTML = list;
})
.catch((err) => console.log(err));