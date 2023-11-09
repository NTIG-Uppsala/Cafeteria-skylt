# Tests

## Using test data

* Some tests are run using test data
    * These tests include `testTemporaryClosed.py`, `testImages.py`, `testProducts.py`

* To change what data a test uses change the test file as in the example below:

Example uses code from testOpenHours.py starting at line 14

```Python
# Adress to website
website = "http://127.0.0.1:8000/?openHours=openHoursList.csv"
# Path to product list csv file
productListPath = "public/csv/openHoursList.csv"
```

Change the strings as shown below

```Python
# Adress to website
website = "http://127.0.0.1:8000/?openHours=testOpenHoursList.csv"
# Path to product list csv file
productListPath = "public/csv/testOpenHoursList.csv"
```

## Before running tests
* Make sure that the [local setup](localSetup.md) has been followed
* Run [startServer.py](../RaspberryPi/configuration/startServer.py) and keep it running during testing

## How to run tests using Selenium
* In VS Code open the terminal
* Input "py -m pip install selenium"
* Input "py -m pip install requests"
* While having the test.py open in VS Code open the testing tab as illustrated in the image below: <br> <br>
![Test setup](../Documentations/images/testSetup.jpg)
* If you are unable to find the testing tab go to "view" at the top of VS Code and press testing as shown below <br> <br>
![Open testing](../Documentations/images/openTesting.jpg)
* When the testing tab is open, press the blue "Configure Python Tests" button
* Next choose "unittest" as displayed below: <br> <br>
![Unittest](../Documentations/images/unittest.jpg)
* Next choose "Root directory" as displayed below: <br> <br>
![Unittest](../Documentations/images/chooseDirectory.jpg)
* Lastly choose "test*.py" so that all files beginning their name with test will be run as demonstrated below:<br> <br>
![Test naming](../Documentations/images/testNaming.jpg)