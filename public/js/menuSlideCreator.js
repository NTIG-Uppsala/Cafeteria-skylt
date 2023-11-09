// Base value of the height of an item counted in lines
const itemHeightInLines = 1;
// A value that should roughly reflect how many times greater the height of a header is compared to an item's height
const headerHeightInLines = 2 * itemHeightInLines;

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

function createContainer() {
    // Creates a new empty container
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
    // Hinders the creation of menu slides if closed
    if (isClosed) {
        return;
    }

    // This splits data into lists
    const rows = data.split("\n");
    let rawMenuList = rows.map(row => row.split(','));

    // This removes empty items
    const menuList = rawMenuList.map(row => row.filter(value => value !== ""));
    let container = createContainer();

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
                    container = createContainer();
                }

                // This happens if no header has been made, it makes a new section
                if (!headerHasBeenMade) {
                    [section, productDiv, itemDiv, priceDiv] = makeNewCategory(section, itemDiv, priceDiv, menuList, productCategory);
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
                    currentLineCounter = 0;
                    headerHasBeenMade = false;
                    container = createContainer();
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

// if 10 minutes has passed, then refresh site on opening hours slide to get updates
$('#open').on('slide.bs.carousel', function (event) {
    if (willRefresh) {
        // It checks if the slide has the class 'refreshSlide' and if it does then it reloads the current page
        if ($(event.relatedTarget).hasClass('refreshSlide')) {
            location.reload();
        }
    }
});

getMenu();