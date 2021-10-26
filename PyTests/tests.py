# -*- coding: utf-8 -*-
from __future__ import print_function
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from datetime import datetime
import time
from pathlib import Path
import os
import aiohttp
import asyncio

#Download the following extensions with these commands:
#pip install selenium
#pip install aiohttp



def ConvertToCleanList(string):
    #Removes specified characters from the called string.
    disallowedCharacters = '["] \n}'
    for character in string:
        for symbol in disallowedCharacters:
            if character == symbol:
                string = string.replace(character, "")
    li = list(string.split(","))

    return li


async def main():
        #Function that gets timestamps from the sheet.
    async with aiohttp.ClientSession() as session:
        async with session.get('https://sheets.googleapis.com/v4/spreadsheets/1x-orVp4FAC1rCucW2jtH5WTWgBSbgAaDLp23wa-V2fQ/values/B4:C8?key=AIzaSyBPtjjvvCJ5Jy88dPjtlPXlsYCxGO8Kw7Q') as response:
            html = await response.text()
            rawData = html[80:430] #Sets rawData to be a string containing all characters of the data, between symbol 80 and symbol 430.
            processedData = ConvertToCleanList(rawData)
    return processedData


# removes non critical bug with browser and visualstudio
options = webdriver.ChromeOptions()
options.add_experimental_option('excludeSwitches', ['enable-logging'])
driver = webdriver.Chrome( options = options)

# gets current parent directory
cwd = Path(os.getcwd()).parent

# gets code file path way
codePath = str(cwd) + '/public/index.html'

# checking for text on site
def checkForText(text):
    assert text in driver.find_element_by_xpath("/html/body").text

# tests that time is correct on Monday-Friday and that it's closed on weekends
def TestWeekdays():
    driver.get(codePath)
    loop = asyncio.get_event_loop()
    timeList = loop.run_until_complete(main())

    for i in range(0, 7):
        # sets the day in the javascript code
        driver.execute_script("day = " + str(i) + "; GetOpenHours();")
        time.sleep(1)
        # number 0 is sunday and 6 is saturday
        if i <= 5 and i > 0:
            # every fourth index in the list is a new day from the sheets
            dayIndex = (i - 1) * 2
            dayStart = str(timeList[dayIndex] + " - " + timeList[dayIndex+1])
            checkForText(dayStart)
        else:
            checkForText("Måndag - Fredag")

        driver.refresh()
    driver.close()

TestWeekdays()