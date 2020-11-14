from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver import ActionChains
import subprocess
import time

# Run as hidden widow; Run in background
CHROMEDRIVER_PATH = '/usr/bin/chromedriver'
chrome_options = Options()
chrome_options.add_argument("--headless")
driver = webdriver.Chrome(executable_path=CHROMEDRIVER_PATH, options=chrome_options)

# # Run as visible window; Run in foreground
# driver = webdriver.Chrome()

driver.get('http://localhost:5000')

# Set font size = 50 pt
font_size_input = driver.find_element_by_xpath('//*[@id="font-size"]')
font_size_input.clear()
font_size_input.send_keys('50')

# Set font color to 'Black'
driver.find_element_by_xpath("//select[@id='ink-color']/option[text()='Black']").click()

# Set page effect to 'No Effect'
driver.find_element_by_xpath("//select[@id='page-effects']/option[text()='No Effect']").click()

# Toggle Paper Margin
driver.find_element_by_xpath("/html/body/main/section[2]/form/div/div[2]/fieldset[4]/div/div[1]/label[2]").click()

# Toggle Paper Lines
driver.find_element_by_xpath("/html/body/main/section[2]/form/div/div[2]/fieldset[4]/div/div[2]/label[2]").click()

file = open('lines.txt', 'r')
lines = file.readlines()

count = 1
for line in lines:

	# Clear text area and fill text
	text_area = driver.find_element_by_xpath('//*[@id="note"]')
	text_area.clear()
	text_area.send_keys(line)

	# Generate image and give a 2 second delay
	generate_image_button = driver.find_element_by_xpath('//*[@id="generate-image-form"]/div/div[2]/div[2]/button')
	generate_image_button.click()
	time.sleep(2)

	# Download image and give a 2 second delay
	download_image_button = driver.find_element_by_xpath('//*[@id="output"]/div/div/a')
	download_image_button.click()
	time.sleep(2)

	# Close converted image
	close_converted_image_button = driver.find_element_by_xpath('//*[@id="output"]/div/button')
	close_converted_image_button.click()

	# Rename the downloaded file
	out = subprocess.Popen(['mv', '-f', 'download.jpeg', str(count) + '.jpeg'], 
	           stdout=subprocess.PIPE, 
	           stderr=subprocess.STDOUT)

	count += 1

driver.close()