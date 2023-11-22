// Base value of the height of an item counted in lines
const itemHeightInLines = 1;
// A value that should roughly reflect how many times greater the height of a header is compared to an item's height
const headerHeightInLines = 2 * itemHeightInLines;
// The number of rows per category in the product list csv file
const linesPerCategory = 4;
// Used to index different rows within each category
const nameRowIndex = 0;
const priceRowIndex = 1;
const visibilityRowIndex = 2;

// Adds a new slide to the carousel
function newMenuSlide(slideContent) {
    // Creates a new div for the slide and adds classes and attributes
    const slide = document.createElement("div");
    slide.className = "carousel-item slide";

    slide.setAttribute("data-interval", "10000"); // Sets the duration of the slide to 10 seconds
    slide.setAttribute("style", "background-color: #190f27;");

    // slideWrapper is the div that contains the slide content
    const slideWrapper = document.createElement("div");
    slideWrapper.className = "carousel-caption d-none d-md-block priceList";
    slideWrapper.setAttribute("style", "margin-top: 26vh;");
    slideWrapper.appendChild(slideContent);
    slide.appendChild(slideWrapper);

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

class Category {
    constructor(categoryName) {
        let sectionHeading = this.#createHeading(categoryName);
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
        const itemNameElement = document.createElement("p");
        const itemPriceElement = document.createElement("p");

        itemNameElement.innerText = name;
        itemPriceElement.innerText = price;

        this.itemDiv.appendChild(itemNameElement);
        this.priceDiv.appendChild(itemPriceElement);
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

    #createSection(paddingDiv, productDiv, priceDiv) {
        // Creates a new div for the items and prices
        let section = document.createElement("div");
        section.className = "row my-5";

        section.appendChild(paddingDiv);
        section.appendChild(productDiv);
        section.appendChild(priceDiv);

        return section;
    }
}

function getProductArrays(dataString){
    // This splits data into an array of lines
    const rows = dataString.split("\n");
    let rawMenuList = rows.map(row => row.split(','));

    // This removes empty items
    const menuList = rawMenuList.map(row => row.filter(value => value !== ""));

    return menuList;
}

// This creates slides for the menu
function getMenuHelper(data) {
    // Hinders the creation of menu slides if closed
    if (isClosed) {
        return;
    }

    const menuList = getProductArrays(data);
    let slideContent = createContainer();

    // This counts items on the slide to make sure it fits
    let currentLineCounter = 0;

    // Divides by four because each category takes up four lines
    let productCategoryCount = menuList.length / linesPerCategory;

    // This loops through the categories
    for (let productCategoryIndex = 0; productCategoryIndex < productCategoryCount; productCategoryIndex++) {
        // List of booleans for each category
        const productVisibilityList = menuList[visibilityRowIndex + productCategoryIndex * linesPerCategory];
        let headerHasBeenMade = false;
        const maxLinesAllowedForNewItem = 23 * itemHeightInLines;
        const maxLinesAllowedForNewHeader = maxLinesAllowedForNewItem - headerHeightInLines;
        let category;
        // Takes the category title of the current category
        const categoryName = menuList[nameRowIndex + productCategoryIndex * linesPerCategory][0];

        for (let itemIndex = 0; itemIndex < productVisibilityList.length; itemIndex++) {
            const showProduct = productVisibilityList[itemIndex] === "TRUE" || productVisibilityList[itemIndex] === "TRUE\r";
            if (!showProduct) {
                continue;
            } 

            const canNotAddHeader = (!headerHasBeenMade && currentLineCounter > maxLinesAllowedForNewHeader);
            const canNotAddItem = (currentLineCounter > maxLinesAllowedForNewItem)

            if (canNotAddItem) {
                // The current section/header is saved to continue on the new slide
                slideContent.appendChild(category.section);
            }

            if (canNotAddHeader || canNotAddItem) {
                // This makes a new slide
                newMenuSlide(slideContent);
                currentLineCounter = 0;
                headerHasBeenMade = false;
                slideContent = createContainer();
            }

            // This happens if no header has been made, it makes a new section
            if (!headerHasBeenMade) {
                category = new Category(categoryName);
                headerHasBeenMade = true;
                currentLineCounter += headerHeightInLines;
            }
            
            const productName = menuList[nameRowIndex + productCategoryIndex * linesPerCategory][itemIndex]
            const productPrice = menuList[priceRowIndex + productCategoryIndex * linesPerCategory][itemIndex]
            category.addProduct(productName, productPrice);
            currentLineCounter += itemHeightInLines;
        }

        // Adds category to the slideContent container
        if (headerHasBeenMade) {
            slideContent.appendChild(category.section);
        }
    }

    // Create a new menuslide with the remaining items
    if (currentLineCounter !== 0) {
        newMenuSlide(slideContent);
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
