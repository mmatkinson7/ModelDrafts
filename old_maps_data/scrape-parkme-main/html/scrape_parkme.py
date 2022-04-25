# scrape_parkme - script to scrape parking cost data for Boston from parkme.com

import urllib3
from bs4 import BeautifulSoup
import sys

parkme_boston_url = "https://www.parkme.com/boston-parking"

# Background/reference info:
# The following returns a page with no "featured_lot_entry" <div> records,
# i.e., IT DOES NOT WORK:
#
#    http = urllib3.PoolManager()
#    response = http.request('GET', url)
#    parkme_soup = BeautifulSoup(response.data, 'html.parser')
#
# So, we'll have to resort to saving the HTML page to a file manually in the browser,
# and then using BeautifulSoup to parse it.
#

# Definition of CSV file header
csv_header = 'lot_name,lot_address,daily_rates,monthly_rates,rate_simple,lot_url\n'

def harvest_one_lot(http, lot_page_url):
    print('\tLot url = ' + lot_page_url)
    
    retval = { 'addr_text' : '', 'daily_rates' : '', 'monthly_rates' : '' }
    response = http.request('GET', lot_page_url)
    lot_soup = BeautifulSoup(response.data, 'html.parser')
    
    # There have been times when either the attempt to read the page for a specfic lot fails:
    # although data is returned, some element(s) are missing and the BeautifulSoup query/ies below fails.
    # Hence, the following code is wrapped in a try/except block.
    # -- BK 11 January 2022
    #
    try: 
        # The complete address
        module_header_node = lot_soup.find('div', class_='module-header-info')
        lot_address_node = module_header_node.find('div', class_='module-header-address')
        full_addr_parts = lot_address_node.find_all('div', class_='module-text')
        addr_text = ''
        for addr_part in full_addr_parts:
            addr_text += addr_part.text + ' '
        # end_for
        # The addr_text may (and does) contain commas...
        addr_text =  '"' + addr_text + '"'
        retval['addr_text'] = addr_text
        
        # Daily rates
        daily_node = lot_soup.find('div', id="daily")
        rates_table_node = daily_node.find_all('div', class_='rates-table')
        # Some lots don't have daily rates...
        if (len(rates_table_node) > 0):
            # Believe it or not, the most succinct representation of
            # the daily rate detail is found in the single 'hidden' node.
            # Long live screen readers!
            rows = rates_table_node[0].find_all('div', class_='hidden')
            daily_rates = ''
            for row in rows:
                temp = row.text
                temp = temp.strip()
                # print(temp)
                daily_rates = daily_rates + temp + '; '
            # end_for
            retval['daily_rates'] = daily_rates
        # end_if
        
        # Monthly rates
        monthly_node = lot_soup.find('div', id='monthly-rates')
        # And some lots don't have monthly rates...
        if (len(monthly_node) > 0):
            # And some even _look_ like they do, but don't really...
            monthly_info = monthly_node.find('div', class_='hidden')
            if monthly_info != None:
                temp = monthly_info.text
                temp = temp.strip()
                retval['monthly_rates'] = temp
            # end_if (inner)
        # end_if (outer)
    except:
        exception_info = sys.exc_info()[1]
        print("\tEncounterd exception reading/parsing lot-specific page:\n")
        print("\t" + str(exception_info))
    # end try/except block
    
    # And return...
    return retval
# end_def harvest_one_lot()

# Main processing function
#
def process_html_file(input_html_fn, output_csv_fn):
    print('Reading input from: ' + input_html_fn)
    print('Writing output to: ' + output_csv_fn)
    
    # Enable making HTTP requests
    http = urllib3.PoolManager()
    
    # Open the input HMTL file
    input = open(input_html_fn, 'r')
    html = input.read()
    input.close()
    
    # Open the output CSV file
    output_csv = open(output_csv_fn, "w")
    output_csv.write(csv_header)
    
    # Do the work
    soup = BeautifulSoup(html, 'html.parser')
    lots = soup.find_all('div', class_='featured_lot_container')
    i = 0
    for lot in lots:
        name_node = lot.find('div', class_='fle_lot_name')
        name = name_node.text
        print('Processing ' + name)
        short_addr_node = lot.find('div', class_='fle_lot_address')
        addr = short_addr_node.text
        price_node = lot.find('div', class_='fle_right')
        a_node = price_node.find('a')
        simple_rate = a_node.text
        
        # We _can_ successfully retrieve the HTML for the page for each specific lot.
        # We need to do this in order to get the FULL text of the lot's address,
        # AND all the nitty-gritty hourly-daily and monthly rate info.
        # -- BK 07 January 2022
        #
        lot_page_url = a_node['href']
        lot_info = harvest_one_lot(http, lot_page_url)
        addr_text = lot_info['addr_text']
        daily_rates = lot_info['daily_rates']
        monthly_rates = lot_info['monthly_rates']
        
        s = name + ',' + addr_text + ',' 
        s += daily_rates + ','  + monthly_rates + ',' 
        s += simple_rate + ',' + lot_page_url + '\n'
        output_csv.write(s)
        #
        print('Processed record #' + str(i))
        i += 1
    # end_for
    output_csv.close()
# end_def process_html_file()



