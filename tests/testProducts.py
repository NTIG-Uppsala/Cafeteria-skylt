# !IMPORTANT!
# Run startServer.py before running this test

import csv
import unittest

from selenium import webdriver
from selenium.webdriver.common.by import By

optionsChrome = webdriver.ChromeOptions()  # Define options for chrome
optionsChrome.add_argument("headless")  # Pass headless argument to the options (no ui)
browser = webdriver.Chrome(options=optionsChrome)

# Adress to website
website = "http://127.0.0.1:8000/?products=testProductList.csv"
# Path to product list csv file
productListPath = "public/csv/testProductList.csv"
# Resolution on screen
res = 1080, 1920


# Runs tests in Chrome
class TestProducts(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.browser = browser
        browser.get(website)
        browser.set_window_size(*res)

    def testProductList(self):
        # Creates an array with the product data from the csv file
        menuList = []
        with open(productListPath, encoding="utf-8", newline="") as products:
            lines = csv.reader(products, delimiter=",", quotechar="|")
            for row in lines:
                menuList.append(row)
        # Checks if every item set to TRUE is in the page source code
        for categoryIndex in range(round(len(menuList) / 4)):
            categoryVisibilityList = menuList[2 + 4 * categoryIndex]
            categoryItemList = menuList[0 + 4 * categoryIndex]
            for itemIndex in range(len(categoryVisibilityList)):
                # Finds an element that contains the wanted text while not part of an image slide
                xpath = f"//p[contains(text(), '{categoryItemList[itemIndex]}') and not(contains(@class,'itemText'))]"
                item = self.browser.find_elements(By.XPATH, xpath)
                if categoryVisibilityList[itemIndex] == "TRUE":
                    # If the element can not be found when it should the test fails
                    if len(item) == 0:
                        raise Exception(categoryItemList[itemIndex], "was not found")

    # Closes the window after all the tests are done
    @classmethod
    def tearDownClass(self):
        self.browser.close()


# Starts test if run as python file
if __name__ == "__main__":
    unittest.main()
