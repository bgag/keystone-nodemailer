# keystone-nodemailer

Implements the `keystone.Email.prototype.send` method using [Nodemailer](http://www.nodemailer.com/).
 
## Configuration

Require the module after `keystone` in your configuration and call it with your keystone instance:

    var keystone = require('keystone');
    require('keystone-nodemailer')(keystone);

Set your options for Nodemailer using the keystone option `email nodemailer`:

    keystone.set('email nodemailer', {
	    // Nodemailer configuration
    });
