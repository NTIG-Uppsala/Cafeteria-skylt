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
    const slide = document.createElement("div");
    slide.className = "carousel-item slide text-light priceList";
    slide.setAttribute("data-interval", "10000"); // Sets the duration of the slide to 10 seconds
    slide.append(slideContent);

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
    // Creates an empty category
    constructor(categoryName) {
        let sectionHeading = this.#createHeading(categoryName);
        let nameDiv = document.createElement("div");
        let productDiv = this.#createProductDiv(sectionHeading, nameDiv);
        let paddingDiv = this.#createPaddingDiv();
        let priceDiv = this.#createPriceDiv();

        let section = this.#createSection(paddingDiv, productDiv, priceDiv);

        this.section = section;
        this.nameDiv = nameDiv;
        this.priceDiv = priceDiv;
    }

    addProduct(name, price) {
        const itemNameElement = document.createElement("p");
        const itemPriceElement = document.createElement("p");

        itemNameElement.innerText = name;
        itemPriceElement.innerText = price;

        this.nameDiv.appendChild(itemNameElement);
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

    #createProductDiv(sectionHeading, nameDiv) {
        let productDiv = document.createElement("div");
        productDiv.className = "col-7";
        productDiv.appendChild(sectionHeading);
        productDiv.appendChild(nameDiv);

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
    let menuList = rawMenuList.map(row => row.filter(value => value !== ""));
    // This removes whitespace characters like "\r"
    menuList = menuList.map(row => row.map(value => value.trim()))

    return menuList;
}

// This creates slides for the menu
function createMenuSlides(data) {
    // Hinders the creation of menu slides if closed
    if (isClosed) {
        return;
    }

    const menuList = getProductArrays(data);
    // Creates the first container
    let slideContent = createContainer();

    // Keeps track of total height of added items
    let currentLineCounter = 0;

    const maxLinesAllowedForNewItem = 23 * itemHeightInLines;
    const maxLinesAllowedForNewHeader = maxLinesAllowedForNewItem - headerHeightInLines;

    // Divides by four because each category takes up four lines
    let productCategoryCount = menuList.length / linesPerCategory;

    let category;

    // This loops through the categories
    for (let productCategoryIndex = 0; productCategoryIndex < productCategoryCount; productCategoryIndex++) {
        // List of strings to determine the visibility of items
        const productVisibilityList = menuList[visibilityRowIndex + productCategoryIndex * linesPerCategory];

        let headerHasBeenMade = false;
        // Takes the category title of the current category
        const categoryName = menuList[nameRowIndex + productCategoryIndex * linesPerCategory][0];

        for (let itemIndex = 0; itemIndex < productVisibilityList.length; itemIndex++) {
            const showProduct = productVisibilityList[itemIndex] === "TRUE";

            // Checks if a header can be added to the current slide
            const canNotAddHeader = (!headerHasBeenMade && currentLineCounter > maxLinesAllowedForNewHeader);
            // Checks if an item should 
            const canNotAddItem = (currentLineCounter > maxLinesAllowedForNewItem);

            const productName = menuList[nameRowIndex + productCategoryIndex * linesPerCategory][itemIndex];
            const productPrice = menuList[priceRowIndex + productCategoryIndex * linesPerCategory][itemIndex];

            if (!showProduct) {
                continue;
            }

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
