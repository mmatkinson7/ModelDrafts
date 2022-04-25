# scrape-parkme
Tool to "scrape" parking cost data from parkme.com

## Introduction
Most of this README file is devoted to a detailed description of the internal workings 
of the 'parkme screen scraper. __Users__ of the tool need only read the __Pre-requisites__
and __User Instructions__ sections, immmediately below

## Pre-requisites
The code in this repository relies upon the Python __urllib3__ and __bs4__ packages.
(__bs4__ is the name given to version 4 of the __BeautifulSoup__ package.)
__urllib3__ is part of the Python standard library, and thus does not need to be installed.
__bs4__, however is _not_ part of the Python standard library, and must be
explicitly installed, e.g.,:
```
    python -m pip install bs4
```
## User Instructions
In order to use the 'parkme screen scraper', the user must first have saved the HTML returned
by parkme.com/boston-parking for (1) a given geographic extent and (2) a choice of "daily" or
"monthly" costs in the parkme.com user interface. If the user expects to survey several geographic
extents, one work-flow would be to:
1. Capture the HTML returned for all combinations of geographic extent and "daily" vs. "monthly" UI choice
2. Run the 'screen scraper' on each saved HTML file
3. Perform manual cleanup of the CSV output

### Saving the HTML
1. In a web browser (Google Chrome is recommended) navigate to https://parkme.com/boston-parking
2. Select the "Daily" button in the left-hand pane of the parkme.com user interface, if not already selected
3. Click the "..." (3 dots) in the upper right hand corner of the Chrome user interface
4. From this, select __More tools -> Clear browsing data__
5. This will open a new tab in your browser
6. Use the controls in the newly-opened tab to "Clear cached images and files" for the "last hour"
7. Return to the browser tab for parkme.com
8. Click the "..." (3 dots) in the upper right hand corner of the Chrome user interface
9. From this, select __More tools -> Save page as__ and havigate to a place to save the HTML under a meaningful file name
10. Select the "Monthly" button in the left-hand pane of the parkme.com user interface, if not already selected
11. Repeat steps (4) through (9)

### Running the Screen-scraper Tool
First, be sure that the Python __bs4__ package has been installed on your system.
The screen-scraper will not work without this library!

1. Navigate to the directory containing the HTML file(s) to be 'scraped'
2. Download the scrape_parkme.py Python source file to this directory
3. Open a command window: either a "DOS BOX" or an "Anaconda Prompt"
4. In the command window, launch Python
5. In the Python command window type:
```
from scrape_parkme import process_html_file
```
6. Invoke __process\_html\_file__ on each HTML file in question.
process_html
7. Note that  __process\_html\_file__ takes two parameters:
    1. the __full path__ to the input HTML file
    2. the __full_path__ to the output CSV file  

In order to minimize typing, users may find it helpful to define a Python variable that points to the directory in which the scraper is being run:
```
base_dir = r'C:\Users\ben_k\work_stuff\web_scraping\scrape-parkme'
input_html_fn = base_dir + r'\boston_daily_page.html'
output_csv_fn = base_dir + r'\boston_daily_results_raw.csv'
process_html_file(input_html_fn, output_csv_fn)
```

### Manual Clean-up of the CSV Output File
The contents of the HTML pages 'scraped' by the tool aren't completely 'clean'.
By this, we mean that some HTML elements _may_ contain either 'garbage' characters
or information that has nothing whatsoever to do with what the given HTML element is 'supposed'
to contain. Consequently, a certain amount of manual cleanup of the output CSV files is required.

The following items requiring manual 'cleanup' have been identified to date, based on running
the tool on 3-4 sample geographic extents:
* For lots that do not have a monthly rate, the __monthly\_rate__ column _may_ contain
a string indicating the lot's hours of operation, e.g., 'Mon-Sun:  24 Hours', rather than nothing.
Such entries in the CSV file need to be manually 'blanked out.'
* Some lots do not display any visible rate whatsoever on the parkme.com page;
the relevant HTML element in the parkme.com page however is _non-empty_,and consequently is harvested.
The issue is that this field may contain 'garbage' characters, such as â€”.
The contents of this HTML element, harvested into the __rate\_simple__ column of the CSV file,
needs to be manually 'blanked out.'

### Format of the CSV Output File
The output CSV file has the following columnar structure:

| Column Name      | Contents |
| ---------------- | -------- |
| lot_name | Full name of lot. Harvested from lot's 'detail' page. |
| lot_address | Full address of lot. Harvested from lot's 'detail' page. |
| daily_rate | Daily rate(s) of lot. Harvested from lot's 'detail' page. |
| monthly_rate | Montly rate(s) of lot. Harvested from lot's 'detail' page. |
| rate_simple | Lot's rate displayed in parkme.com page. Harvested from parkme.com |
| lot_url | URL of page with detailed information on lot. Harvested from parkme.com, where it is a hidden element. |

## Introduction to Tool Internals
The reader of the following sections of this document is expected to have at least minimal familiarity with HTML and CSS,
and ideally should have at least browsed 
the [BeautifulSoup documentation](https://www.crummy.com/software/BeautifulSoup/bs4/doc/#).
Without this background troubleshooting and debugging, should they be required, will not be possible.

The home page for parkme.com for Boston offers the ability to query for either daily or monthly parking rates
by means of two buttons in the left-hand side of the page UI. However, as best as I can tell, there is no way 
to execute a query of the underlying data for daily vs. monhtly parking rates by means of passing a URL parameter.
Such a mechanism might be available by means of some kind of form submission, but exploration for any such 
mechanism was put aside when a higher-level obstacle was encountered: _programmatic_ requests for the contents
of the parkme.com page always returned a page _with no parking lot / rate information_. 
In other words, when the following code was executed:
```
import urllib3
from bs4 import BeautifulSoup
url = "https://www.parkme.com/boston-parking"
http = urllib3.PoolManager()
response = http.request('GET', url)
parkme_soup = BeautifulSoup(response.data, 'html.parser')
```
no HTML elements containing lot parking rate information were found.
It would appear that the parmke.com server is "smart enough" to suppress attempts to harvest its data programmatically.

This having been found, the approach taken was to load parkme.com into a browser tab, select either the "Daily" or
"Monthly" option, and then _save the returned HTML to a file_. The saved HTML was then "crawled" programmatically
using the BeautifulSoup library, and the relevant data extracted.

## The Conents of the parkme.com Page
The HTML found in the parkme.com page (daily or monthly) does not provide much really useful information.
However, it does contain the URL for a page containing detailed information about each lot.
For each parking lot, the following information was displayed and is readily find-able in the HTML
1. the name of the lot
2. a 'short' address for the lot (without town name or zip code)
3. a _single_ rate, which may be either hourly, daily, or monthly (I refer to this as the lot's _simple rate_.)
4. the url of the page for the specific lot  

Item #4 is the most important of these, as it allows one to 'dig' for more detailed information about each lot.

## Determining the Structure of the HTML Pages
The internal structure of the HTML pages was determined empirically by a combination of:
* Using the Developer Console in the Google Chrome browser, either "inspecting" elements manually
or with the [jQuery JavaScript library](https://jquery.com)
* Using the [eautiful Soup Python package](https://www.crummy.com/software/BeautifulSoup/) to "probe around" in the HTML

Once the internal strucutre of the HTML was understood well enough, code was prototyped to navigate the HTML 
and exract the desired data.

## Algorithmic Overview
Given the above, the overall processing algorithm adopted is as follows:
```
Load HTML for page from file
Parse HTML using BeautifulSoup library
Navigate HTML, find elements for list of parking lots
For each lot element:
    Harvest lot name, 'simple rate', and url for lot-specific page
    Load HTML for lot-specific page using urllib3 library
    Parse returned HTML using BeautifulSoup library
    Navigate through parsed HTML, harvesting full lot address, and daily and monthly rate information
# end_for
```
The careful reader will note that the parkme.com server did _not_ suppress attempts to programmatically
read the pages for specific lots! (Somebody may be asleep on the job at parkme.com!)

## HTML Navigation
In spite of having saved HTML for 'daily' and 'monthly' pages, in both cases the HTML contained information
for _both_ 'daily' and 'monthly' rates. The numbers of records returned, however were different: many more
records were found in the 'daily' page than in the 'monthly' page.

The general approach was to fisrt navigate in the HTML to a \<div\> that is the direct or indirect 
parent of the element containing the desired data, and then "drill down" to find the desired
node and extract data from it.

### HTML Navigation - Daily Rates
The following is the hierarchical structure of the page devoted to daily rates, and illustrates
the values found in the page for one sample lot (lot #32143):
```
	<div id="daily">
		<div class="rates-table">
			<div class="left lot-rate-type">
				"1 hour"
			</div>
			<div class="right">
				$12
			</div>
			<div class="hidden" style="display: none;" itemprop="priceRange">
				1 Hour: $12
			</div>
			
			<div class="left lot-rate-type">
				"2 hour"
			</div>
			<div class="right">
				$20
			</div>
			<div class="hidden" style="display: none;" itemprop="priceRange">
				2 Hours: $20
			</div>
			
			<div class="left lot-rate-type">
			</div>
			<div class="right">
				$28
			</div>
			<div class="hidden" style="display: none;" itemprop="priceRange">
				3 Hours: $28
			</div>
			
			<!-- Etc., etc., etc. -->
		</div>
	</div>
```
From this structure, it follows that the simplest way to harvest the daily rate information - which must
include an indiation of the number of hours for which a given rate applies - is from the \<div\>
elements with class __hidden__ found hierarchially "below" the \<div\> nodes with class __rates-table__
found hierarhically "below" the \<div\> node with the HTML "id" __daily__.

### HTML Navigation - Monthly Rates
The following is the hierarchical structure of the page devoted to monthly rates, and illustrates
the values found in the page for one sample lot (lot #32133):
```
	<div id="monthly-rates">
		<div class="module-table-group">
			<div class="module-table-row">
				<div class="left">
					Monthly
				</div>
				<div class="right">
					$95
				</div>
				<div class="hidden" style="display: none;" itemprop="priceRange">
					Monthly: $95
				</div>
			</div>
		</div>
	</div>
```
From this structure, it follows that the simplest way to harvest the monthly rate information
is from the \<div\> elements with class __hidden__ found hierarchially "below" the \<div\> nodes 
with class __module-table-row__ found hierarhically "below" the \<div\> node with the HTML "id" __monthly-rates__.

## Sample Usage
This section illustrates sample useage of the tool:
```
###############################################################################
#
# Sample usage:
#
base_dir = r'C:\Users\ben_k\work_stuff\web_scraping\scrape-parkme'

# The page with the results of the "daily" query:
daily_input_html_fn = base_dir + r'\boston_daily_page.html'
# And the page with the results of the "monthly" query:
monthly_input_html_fn = base_dir + r'\boston_monthly_page.html'

# Output CSV file names
daily_output_csv_fn = base_dir + r'\boston_daily_results_raw.csv'
monthly_output_csv_fn = base_dir + r'\boston_monthly_results_raw.csv'

process_html_file(daily_input_html_fn, daily_output_csv_fn)
process_html_file(monthly_input_html_fn, monthly_output_csv_fn)

###############################################################################

daily_input_html_fn = base_dir + r'\east_cambridge_daily_page.html'
monthly_input_html_fn = base_dir + r'\east_cambridge_monthly_page.html'
daily_output_csv_fn = base_dir + r'\east_cambridge_daily_results_raw.csv'
monthly_output_csv_fn = base_dir + r'\east_cambridge_monthly_results_raw.csv'

process_html_file(daily_input_html_fn, daily_output_csv_fn)
process_html_file(monthly_input_html_fn, monthly_output_csv_fn)

###############################################################################

daily_input_html_fn = base_dir + r'\harvard_square_daily_page.html'
monthly_input_html_fn = base_dir + r'\harvard_square_monthly_page.html'
daily_output_csv_fn = base_dir + r'\harvard_square_daily_results_raw.csv'
monthly_output_csv_fn = base_dir + r'\harvard_square_monthly_results_raw.csv'

process_html_file(daily_input_html_fn, daily_output_csv_fn)
process_html_file(monthly_input_html_fn, monthly_output_csv_fn)
```

## Colophon
Title: scrape-parkme  
Subject: HTML ("screen") scraping  
Author: B. Krepp, attending metaphysician  
Publisher: CTPS  
Date of creation: 11 January 2022  
Date of last revision: 21 January 2022
Place: Cyberspace
