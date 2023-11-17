# !IMPORTANT!
# Run startServer.py before running this test

import unittest

from selenium import webdriver
from selenium.webdriver.common.by import By

optionsChrome = webdriver.ChromeOptions()  # Define options for chrome
optionsChrome.add_argument("headless")  # Pass headless argument to the options (no ui)
browser = webdriver.Chrome(options=optionsChrome)

# Adress to website
website = "http://127.0.0.1:8000/?products=testProductList.csv&images=testImageList.csv&openHours=testOpenHoursListOpen.csv"
# Resolution on screen
res = 1080, 1920


# Runs tests in Chrome
class TestProducts(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.browser = browser
        browser.get(website)
        browser.set_window_size(*res)

    def testVisibleProducts(self):
        self.assertIn("Mazariner", self.browser.page_source)
        self.assertIn("Kycklingröra", self.browser.page_source)
        self.assertIn("Tekaka Kalkon/ost eller ost", self.browser.page_source)

    def testHiddenProducts(self):
        self.assertNotIn("Kiviks Apelsin/Äpple", self.browser.page_source)
        self.assertNotIn("Kalkon-Ost", self.browser.page_source)
        self.assertNotIn("Marabou choklad", self.browser.page_source)

    def testVisibleCategories(self):
        self.assertIn("Fika", self.browser.page_source)
        self.assertIn("Baguette", self.browser.page_source)
        self.assertIn("Godis", self.browser.page_source)

    def testMenuPagination(self):
        slides = self.browser.find_elements(By.CLASS_NAME, "carousel-item")
        fourthSlide = slides[3]
        fifthSlide = slides[4]

        # Check that the assumed last item on the slide is on the correct slide
        self.assertIn("Liten Pucko", fourthSlide.get_attribute("innerHTML"))
        self.assertIn("Ostfralla Kalkon/ost eller ost", fifthSlide.get_attribute("innerHTML"))
        # Check that the assumed first item on the slide is on the correct slide
        self.assertIn("Stor Pucko", fifthSlide.get_attribute("innerHTML"))

    # Closes the window after all the tests are done
    @classmethod
    def tearDownClass(self):
        self.browser.close()


# Starts test if run as python file
if __name__ == "__main__":
    unittest.main()
