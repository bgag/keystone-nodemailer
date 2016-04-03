# keystone-nodemailer

Implements the `keystone.Email.prototype.send` method using [Nodemailer](http://www.nodemailer.com/).
 
## Default Configuration (SMTP)

Require the module after `keystone` in your configuration:

    var keystone = require('keystone');
    require('keystone-nodemailer');

Set your options for Nodemailer using the keystone option `email nodemailer`:

    keystone.set('email nodemailer', {
	    // Nodemailer configuration
    });

## SendGrid Configuration

In order to use [SendGrid](http://www.sendgrid.com/) as your mail service, set your node-mailer service option to 'sendgrid' in your keystone configuration file as in this example:

	keystone.set('email nodemailer', {
		service = 'sendgrid',
		auth: {
     	   api_key: "<SENDGRID_APIKEY>"
    	},
    	secure: true,
    	logger: true
    });

