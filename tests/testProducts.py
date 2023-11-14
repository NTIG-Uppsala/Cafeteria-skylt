# !IMPORTANT!
# Run startServer.py before running this test

import csv
import unittest

from selenium import webdriver
from selenium.webdriver.common.by import By


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
        optionsChrome = webdriver.ChromeOptions()  # Define options for chrome
        optionsChrome.add_argument("headless")  # Pass headless argument to the options (no ui)
        browser = webdriver.Chrome(options=optionsChrome)
        self.browser = browser
        browser.get(website)
        browser.set_window_size(*res)

    def testProductNames(self):
        self.assertIn("Wienerbröd", self.browser.page_source)
        self.assertIn("Starbucks", self.browser.page_source)
        self.assertIn("Grillad panini", self.browser.page_source)
        self.assertIn("Rostbiff-potatis", self.browser.page_source)
        self.assertIn("Risifrutti", self.browser.page_source)
        self.assertIn("Twix", self.browser.page_source)

    # Closes the window after all the tests are done
    @classmethod
    def tearDownClass(self):
        self.browser.close()


# Starts test if run as python file
if __name__ == "__main__":
    unittest.main()
