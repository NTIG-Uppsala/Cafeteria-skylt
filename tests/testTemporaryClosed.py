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
website = "http://127.0.0.1:8000/?products=testProductList.csv&images=testImageList.csv&openHours=testOpenHoursListClosed.csv"
# Resolution on screen
res = 1080, 1920


# Runs tests in Chrome
class TestTemporaryClosed(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.browser = browser
        browser.get(website)
        browser.set_window_size(*res)

    def testTemporaryClosed(self):
        slides = self.browser.find_elements(By.CLASS_NAME, "carousel-item")
        # Only one slide should exist when temporary closed
        self.assertEqual(len(slides), 1)

    # Closes the window after all the tests are done
    @classmethod
    def tearDownClass(self):
        self.browser.close()


# Starts test if run as python file
if __name__ == "__main__":
    unittest.main()
