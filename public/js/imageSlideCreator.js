function helperGetImageSlide(data) {
    // Hinders the creation of image slides if closed
    if (isClosed) {
        return;
    }


    const carousel = document.getElementById("menu");
    const imageList = parseCsvString(data);

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
            dotImage.setAttribute("src", "images/blurredDot.png")

            const moneyDot = document.createElement("img")
            moneyDot.className = "productSlide moneyDot";
            moneyDot.setAttribute("src", "images/vibrantDot.png")

            const imageText = document.createElement("div");
            imageText.className = "carousel-caption d-none d-md-block productPrice";

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
    }
};
