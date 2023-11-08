import csv
import unittest

from selenium import webdriver
from selenium.webdriver.common.by import By

optionsChrome = webdriver.ChromeOptions()  # Define options for chrome
optionsChrome.add_argument("headless")  # Pass headless argument to the options (no ui)
browser = webdriver.Chrome(options=optionsChrome)

# Adress to website
website = "http://127.0.0.1:8000/?images=testImageList.csv"
# Path to product list csv file
imageListPath = "public/csv/testImageList.csv"
# Resolution on screen
res = 1080, 1920


# Runs tests in Chrome
class TestImages(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.browser = browser
        browser.get(website)
        browser.set_window_size(*res)

    def testImagesPresent(self):
        # Creates an array with data for the image slides from the csv file
        imageDataList = []
        with open(imageListPath, encoding="utf-8", newline="") as images:
            lines = csv.reader(images, delimiter=",", quotechar="|")
            for row in lines:
                imageDataList.append(row)

        imageVisibilityList = imageDataList[4]
        imagePathList = imageDataList[2]

        # Loops through the image data, starting at 1 to only include the relevant data
        for imageIndex in range(1, len(imageVisibilityList)):
            # Finds an image element containing the desired image source
            xpath = f"//img[@src = 'images/products/{imagePathList[imageIndex]}']"
            image = self.browser.find_elements(By.XPATH, xpath)

            if imageVisibilityList[imageIndex] == "TRUE":
                # If an element with the image source can not be found when it should the test fails
                if len(image) == 0:
                    raise Exception(
                        f"An image with the source: {imagePathList[imageIndex]} was not found"
                    )
            elif imageVisibilityList[imageIndex] == "FALSE":
                # If an element with the image source can be found when it should not the test fails
                if not len(image) == 0:
                    raise Exception(
                        f"An image with the source: {imagePathList[imageIndex]} was found"
                    )

    # Closes the window after all the tests are done
    @classmethod
    def tearDownClass(self):
        self.browser.close()


# Starts test if run as python file
if __name__ == "__main__":
    unittest.main()
