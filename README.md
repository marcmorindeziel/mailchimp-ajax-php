# mailchimp-ajax-php
Simple example of using custom html form with ajax,php and Mailchimp API 3

#Setup
 - jQuery is required
 - Set your API_KEY and LIST_ID in `mailchimp/mailchimp-credentials.php`
 - Set redirect URL after success subscribe in `index.html` `<input type="hidden" name="redirecturl" value="http://example.com">`
 - JS alert texts are located in `mailchimp.js`

##Where to find API_KEY in mailchimp website?
To find your MailChimp API Key: Log in to your MailChimp account at http://mailchimp.com. Then, from the menu on the top right, click on your Username, then select "Account" in the flyout menu. From the account page select "Extras", "API Keys"

##Where to find LIST_ID in mailchimp website?
Click "Lists" from the top menu to view your MailChimp lists. Select the list you wish to offer user sign-up. click "Settings" and then "List name and defaults". Your list id will be at the top of the right column under List ID
