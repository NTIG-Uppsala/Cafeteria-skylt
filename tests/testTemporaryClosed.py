# !IMPORTANT!
# Run startServer.py before running this test

import csv
import unittest

from selenium import webdriver
from selenium.webdriver.common.by import By

import time

optionsChrome = webdriver.ChromeOptions()  # Define options for chrome
#optionsChrome.add_argument("headless")  # Pass headless argument to the options (no ui)
browser = webdriver.Chrome(options=optionsChrome)

# Adress to website
website = "http://127.0.0.1:8000/?openHours=testOpenHoursList.csv"
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
        # Checks that the closed slide is the only slide active every 5 seconds for 25 seconds
        for i in range(5):
            slides = self.browser.find_elements(By.CLASS_NAME, "carousel-item")
            if len(slides) > 1:
                raise Exception("Additional slides are active")
            time.sleep(5)

    def testTemporaryClosedWithRefresh(self):
        # Checks that the closed slide is the only slide active 10 times with 2 seconds delay
        for i in range(10):
            slides = self.browser.find_elements(By.CLASS_NAME, "carousel-item")
            if len(slides) > 1:
                raise Exception("Additional slides are active")
            self.browser.execute_script("location.reload();")
            time.sleep(2)

    # Closes the window after all the tests are done
    @classmethod
    def tearDownClass(self):
        self.browser.close()


# Starts test if run as python file
if __name__ == "__main__":
    unittest.main()
