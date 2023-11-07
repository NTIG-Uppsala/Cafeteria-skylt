const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

const productListDefault = "productList.csv";
const imageListDefault = "imageList.csv";
const openHoursListDefault = "openHoursList.csv";

let productList = urlParams.has('products') ? urlParams.get('products') : productListDefault;
let imageList = urlParams.has('images') ? urlParams.get('images') : imageListDefault;
let openHoursList = urlParams.has('openHours') ? urlParams.get('openHours') : openHoursListDefault;

// Runs getImageSlide() with data from imageList.csv
function getImageSlide(){
    $.ajax({
        type: 'GET',
        url: "http://127.0.0.1:8000/" + imageList,
        success: function (data) { helperGetImageSlide(data) }
    });
}

// Runs getOpeningHours() with data from openHoursList.csv
function getOpeningHours() {
    $.ajax({
        type: 'GET',
        url: "http://127.0.0.1:8000/" + openHoursList,
        success: function (data) { getOpeningHoursHelper(data) }
    });
}

// Runs get menu with data from productList.csv
function getMenu() {
    $.ajax({
        type: 'GET',
        url: "http://127.0.0.1:8000/" + productList,
        success: function (data) { getMenuHelper(data) }
    });
}