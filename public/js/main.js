const daysOfWeek = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"]
let isClosed = false;

// Base value of the height of an item counted in lines
const itemHeightInLines = 1;
// A value that should roughly reflect how many times greater the height of a header is compared to an item's height
const headerHeightInLines = 2 * itemHeightInLines;

//Shows the clock on the website
function getTime(date) {
    let h = date.getHours();
    let m = date.getMinutes();

    h = addZeroUpTo10(h);
    m = addZeroUpTo10(m);

    document.getElementById("clock").innerHTML = h + ":" + m;
}

function addZeroUpTo10(i) {
    if (i < 10) { i = "0" + i }; //Adds a zero infront of numbers < 10
    return i;
}

// Shows todays weekday and date on the website
function getDate(date) {
    const day = date.getDay();
    const weekdayName = daysOfWeek[day];
    // Changes date to Swedish format
    date = date.toLocaleDateString("sv-SE");
    document.getElementById("day").innerHTML = weekdayName;
    document.getElementById("date").innerHTML = date;
}
// Adds a new slide to the carousel
function newMenuSlide(container) {
    // Creates a new div for the slide and adds classes and attributes
    const slide = document.createElement("div");
    slide.className = "carousel-item slide";
    // Sets the duration of the slide to 10 seconds
    slide.setAttribute("data-interval", "10000");
    slide.setAttribute("style", "background-color: #190f27;");
    // SlideCaption adds the div that the container is in
    const slideCaption = document.createElement("div");
    slideCaption.className = "carousel-caption d-none d-md-block priceList";
    slideCaption.setAttribute("style", "margin-top: 26vh;");
    slide.appendChild(slideCaption);
    slideCaption.appendChild(container);
    // Adds the slide to the carousel
    const carousel = document.getElementById("menu");
    carousel.appendChild(slide);
}


function resetContainer() {
    // Makes container epmty
    container = document.createElement("div");
    container.className = "container";
    return container;
}

function getItemAndPrice(items, i, y) {
    // Creates a new p for the item and price 
    const itemP = document.createElement("p");
    // Takes the item and price of the current item
    const itemText = document.createTextNode(items[0 + i * 4][y]);
    itemP.appendChild(itemText);
    const priceP = document.createElement("p");
    const priceText = document.createTextNode(items[1 + i * 4][y]);
    priceP.appendChild(priceText);
    return [itemP, priceP];
}
// This makes a new category and puts it in the container
function makeNewCategory(category, itemDiv, priceDiv, items, i) {
    // Creates a new div for the items and prices
    category = document.createElement("div");
    category.className = "row mb-5 mt-5";
    // PaddingDiv creates a div that is 2 columns wide
    let paddingDiv = document.createElement("div");
    paddingDiv.className = "col-2";
    let productDiv = document.createElement("div");
    productDiv.className = "col-7";
    // h2 is title for each category
    let header2 = document.createElement("h2");
    // Takes the category title of the current category
    let header2Text = document.createTextNode(items[0 + i * 4][0]);
    header2.appendChild(header2Text);
    // Creates a new div for the items and prices and add their classes
    itemDiv = document.createElement("div");
    priceDiv = document.createElement("div");
    priceDiv.className = "col-3 text-right aligner";
    category.appendChild(paddingDiv);
    productDiv.appendChild(header2);
    return [category, productDiv, itemDiv, priceDiv];
}
// This creates slides for the menu
function getMenuHelper(data) {
    // This splits data into lists
    const rows = data.split("\n");
    let rawMenuList = rows.map(row => row.split(','));
    // This removes empty items
    const menuList = rawMenuList.map(row => row.filter(value => value !== ""));
    let container = resetContainer();
    // This counts items on the slide to make sure it fits
    let currentLineCounter = 0;
    // Divides by four because each category takes up four lines
    let productCategoryCount = menuList.length / 4;
    // This loops through the categories
    for (let productCategory = 0; productCategory < productCategoryCount; productCategory++) {
        // List of booleans for each category
        const productVisibilityList = menuList[2 + productCategory * 4];
        let headerHasBeenMade = false;
        const maxLinesAllowedForNewItem = 23 * itemHeightInLines;
        const maxLinesAllowedForNewHeader = maxLinesAllowedForNewItem - headerHeightInLines;
        let section, itemDiv, priceDiv;
        for (let itemIndex = 0; itemIndex < productVisibilityList.length; itemIndex++) {
            if (productVisibilityList[itemIndex] === "FALSE") {
                continue;
            } else if (productVisibilityList[itemIndex] === "TRUE" || productVisibilityList[itemIndex] === "TRUE\r") {
                if (!headerHasBeenMade && currentLineCounter > maxLinesAllowedForNewHeader) {
                    // This makes a new slide
                    newMenuSlide(container);
                    currentLineCounter = 0;
                    headerHasBeenMade = false;
                    container = resetContainer();
                }
                // This happens if no header has been made, it makes a new section
                if (!headerHasBeenMade) {
                    section = makeNewCategory(section, itemDiv, priceDiv, menuList, productCategory)[0];
                    productDiv = makeNewCategory(section, itemDiv, priceDiv, menuList, productCategory)[1];
                    itemDiv = makeNewCategory(section, itemDiv, priceDiv, menuList, productCategory)[2];
                    priceDiv = makeNewCategory(section, itemDiv, priceDiv, menuList, productCategory)[3];
                    productDiv.appendChild(itemDiv);
                    section.appendChild(productDiv);
                    section.appendChild(priceDiv);
                    headerHasBeenMade = true;
                    currentLineCounter += headerHeightInLines;
                }
                // This gets the item and price and adds it to the item/price div
                itemDiv.appendChild(getItemAndPrice(menuList, productCategory, itemIndex)[0]);
                priceDiv.appendChild(getItemAndPrice(menuList, productCategory, itemIndex)[1]);
                currentLineCounter += itemHeightInLines;
                if (currentLineCounter > maxLinesAllowedForNewItem) {
                    // This makes a new slide
                    // The current section/header is saved to continue on the new slide
                    container.appendChild(section);
                    newMenuSlide(container);
                    container = resetContainer();
                    currentLineCounter = 0;
                    headerHasBeenMade = false;
                }
            }
        }
        // Adds category to the container
        if (headerHasBeenMade) {
            container.appendChild(section);
        }
    }
    // Create a new menuslide with the remaining items
    if (currentLineCounter !== 0) {
        newMenuSlide(container);
    }
}
// Runs get menu with data from productList.csv
function getMenu() {
    $.ajax({
        type: 'GET',
        url: "http://127.0.0.1:8000/productList.csv",
        success: function (data) { getMenuHelper(data) }
    });
}
// if 10 minutes has passed, then refresh site on opening hours slide to get updates
$('#open').on('slide.bs.carousel', function (event) {
    if (willRefresh) {
        // It checks if the slide has the class 'refreshSlide' and if it does then it reloads the current page
        if ($(event.relatedTarget).hasClass('refreshSlide')) {
            location.reload();
        }
    }
});

function tempClose(reason) {
    // This removes the opening hours and adds a message that the cafeteria is closed
    const openingHoursSlide = document.getElementById("cafeteria");
    let header = document.getElementById("openHoursHead");
    const openingHours = document.getElementById("openHours");
    openingHours.remove();
    header.style.fontSize = 90 + "px";
    header.innerText = "Cafeterian har tillfälligt stängt";
    // This adds a message with the reason for the closing 
    const reasoning = document.createElement("p");
    reasoning.className = "openHours";
    let reasoningText = document.createTextNode("");
    // If there are a reason write it out
    if (reason != "\r") {
        reasoningText = document.createTextNode('På grund av ' + reason);
    };
    reasoning.appendChild(reasoningText);
    openingHoursSlide.appendChild(reasoning);
    isClosed = true;
    // Pauses the carousel
    $(".carousel").carousel('pause');

}

function getOpeningHoursHelper(data) {
    const rows = data.split("\n");
    let rawOpeningHoursList = rows.map(row => row.split(','));
    // This removes empty items
    const openingHoursList = rawOpeningHoursList.map(row => row.filter(value => value !== ""));
    // Checks if the cafeteria is temporarily closed
    const isTempClose = openingHoursList[2][1];
    // Adds the opening hours to the website
    const morningHours = document.getElementById("morningHours");
    const afternoonHours = document.getElementById("afternoonHours");
    morningHours.innerHTML = openingHoursList[0][1];
    afternoonHours.innerHTML = openingHoursList[1][1];
    // If closed, run tempClose()
    if (isTempClose === "TRUE\r") {
        tempClose(openingHoursList[3][1]);
    };
}

// Runs getImageSlide() with data from imageList.csv
function getImageSlide(){
    $.ajax({
        type: 'GET',
        url: "http://127.0.0.1:8000/imageList.csv",
        success: function (data) { helperGetImageSlide(data) }
    });
}


function helperGetImageSlide(data){
    // This splits data into lists
    const rows = data.split("\n");
    let rawImageList = rows.map(row => row.split(','));
    // This removes empty items
    const imageList = rawImageList.map(row => row.filter(value => value !== ""));
    const carousel = document.getElementById("menu");
    // This loops through the slides 
    for (let currentSlide = 1; currentSlide < imageList[4].length; currentSlide++) {
        // Checks if slide should be shown or not 
        if (imageList[4][currentSlide] === "TRUE" || imageList[4][currentSlide] === "TRUE\r") {
            // Genererates HTML code for slides
            const imageSlide = document.createElement("div");
            imageSlide.className = "carousel-item slide";
            imageSlide.setAttribute("data-interval", "5000");
            imageSlide.setAttribute("style", "background-color: #190f27;");
            const productImage = document.createElement("img");
            productImage.className = "productSlide productImage";  
            productImage.setAttribute("referrerPolicy", "no-referrer"); // Enables loading of google user content images 
            productImage.setAttribute("src", `images/products/${imageList[2][currentSlide]}`);
            productImage.setAttribute("height", "700");
            const dotImage = document.createElement("img")
            dotImage.className = "productSlide dot";
            dotImage.setAttribute("src", "images/dot.png")
            const moneyDot = document.createElement("img")
            moneyDot.className = "productSlide moneyDot"; 
            moneyDot.setAttribute("src", "images/moneyDot.png")
            const imageText = document.createElement("div");
            imageText.className =  "carousel-caption d-none d-md-block productPrice";
            const product = document.createElement("p");
            product.className = "itemText";
            const productNode = document.createTextNode(imageList[0][currentSlide]);
            product.append(productNode) 
            const price = document.createElement("p");
            price.className = "price";
            const priceNode = document.createTextNode(imageList[3][currentSlide]);
            price.append(priceNode);
            imageText.append(product);
            imageText.append(price);
            imageSlide.append(productImage);
            imageSlide.append(dotImage)
            imageSlide.append(moneyDot)
            imageSlide.append(imageText)
            carousel.append(imageSlide)    
        }
}};

// Runs getOpeningHours() with data from openHoursList.csv
function getOpeningHours() {
    $.ajax({
        type: 'GET',
        url: "http://127.0.0.1:8000/openHoursList.csv",
        success: function (data) { getOpeningHoursHelper(data) }
    });
}

// Runs getTime() every 5 seconds
window.setInterval(function () {
    getTime(new Date());
}, 1000 * 5)
getTime(new Date());

// Runs getDate() every hour
window.setInterval(function () {
    getDate(new Date());
}, 1000 * 60 * 60)
getDate(new Date());

let willRefresh = false

window.setInterval(function () {
    if (isClosed) {
        location.reload();
    }
    willRefresh = true
}, 1000 * 60 * 10)

getImageSlide();
getOpeningHours();
getMenu();