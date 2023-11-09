const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

const productListPathDefault = "productList.csv";
const imageListPathDefault = "imageList.csv";
const openHoursListPathDefault = "openHoursList.csv";

let productListPath = urlParams.has('products') ? urlParams.get('products') : productListPathDefault;
let imageListPath = urlParams.has('images') ? urlParams.get('images') : imageListPathDefault;
let openHoursListPath = urlParams.has('openHours') ? urlParams.get('openHours') : openHoursListPathDefault;

// Runs getOpeningHours() with data from openHoursList.csv
function getOpeningHours() {
    $.ajax({
        type: 'GET',
        url: "http://127.0.0.1:8000/csv/" + openHoursListPath,
        success: function (data) { getOpeningHoursHelper(data) }
    });
}

// Runs getImageSlide() with data from imageList.csv
function getImageSlide(){
    $.ajax({
        type: 'GET',
        url: "http://127.0.0.1:8000/csv/" + imageListPath,
        success: function (data) { helperGetImageSlide(data) }
    });
}

// Runs get menu with data from productList.csv
function getMenu() {
    $.ajax({
        type: 'GET',
        url: "http://127.0.0.1:8000/csv/" + productListPath,
        success: function (data) { getMenuHelper(data) }
    });
}