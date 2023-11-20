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
    const itemNameElement = document.createElement("p");

    // Takes the item and price of the current item
    const itemText = document.createTextNode(items[0 + i * 4][y]);
    itemNameElement.appendChild(itemText);
    const itemPriceElement = document.createElement("p");
    const priceText = document.createTextNode(items[1 + i * 4][y]);
    itemPriceElement.appendChild(priceText);
    return [itemNameElement, itemPriceElement];
}

class Category {
    constructor(items, categoryIndex){
        let sectionTitle = items[0 + categoryIndex * 4][0]; // Takes the category title of the current category
        let sectionHeading = this.#createHeading(sectionTitle);

        let itemDiv = document.createElement("div");
        let productDiv = this.#createProductDiv(sectionHeading, itemDiv);
        let paddingDiv = this.#createPaddingDiv();
        let priceDiv = this.#createPriceDiv();

        let section = this.#createSection(paddingDiv, productDiv, priceDiv);

        this.section = section;
        this.itemDiv = itemDiv;
        this.priceDiv = priceDiv;
    }

    addProduct(name, price) {
        // This gets the item and price and adds it to the item/price div
        this.itemDiv.appendChild(name);
        this.priceDiv.appendChild(price);
    }

    #createPaddingDiv() {
        // PaddingDiv creates a div that is 2 columns wide
        let paddingDiv = document.createElement("div");
        paddingDiv.className = "col-2";

        return paddingDiv;
    }

    #createHeading(sectionTitle) {
        // h2 is title for the category
        let sectionHeading = document.createElement("h2");
        sectionHeading.innerText = sectionTitle

        return sectionHeading;
    }

    #createPriceDiv() {
        let priceDiv = document.createElement("div");
        priceDiv.className = "col-3 text-right aligner";

        return priceDiv;
    }

    #createProductDiv(sectionHeading, itemDiv) {
        let productDiv = document.createElement("div");
        productDiv.className = "col-7";
        productDiv.appendChild(sectionHeading);
        productDiv.appendChild(itemDiv);

        return productDiv;
    }

    #createSection(paddingDiv, productDiv, priceDiv){
        // Creates a new div for the items and prices
        let section = document.createElement("div");
        section.className = "row my-5";

        section.appendChild(paddingDiv);
        section.appendChild(productDiv);
        section.appendChild(priceDiv);

        return section;
    }
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
        let category;

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
                    category = new Category(menuList, productCategory);
                    headerHasBeenMade = true;
                    currentLineCounter += headerHeightInLines;
                }

                let productName = getItemAndPrice(menuList, productCategory, itemIndex)[0];
                let productPrice = getItemAndPrice(menuList, productCategory, itemIndex)[1];
                category.addProduct(productName, productPrice);
                currentLineCounter += itemHeightInLines;

                if (currentLineCounter > maxLinesAllowedForNewItem) {
                    // This makes a new slide
                    // The current section/header is saved to continue on the new slide
                    container.appendChild(category.section);
                    newMenuSlide(container);
                    currentLineCounter = 0;
                    headerHasBeenMade = false;
                    container = createContainer();
                }
            }
        }

        // Adds category to the container
        if (headerHasBeenMade) {
            container.appendChild(category.section);
        }
    }
    
    // Create a new menuslide with the remaining items
    if (currentLineCounter !== 0) {
        newMenuSlide(container);
    }
}

// if 10 minutes has passed, then refresh site on opening hours slide to get updates
$('#carousel').on('slide.bs.carousel', function (event) {
    if (willRefresh) {
        // It checks if the slide has the class 'refreshSlide' and if it does then it reloads the current page
        if ($(event.relatedTarget).hasClass('refreshSlide')) {
            location.reload();
        }
    }
});
