var
	_ = require('lodash'),
	htmlToText = require('html-to-text'),
	nodemailer = require('nodemailer');

var transport;

function buildAddress (email, name) {
	if (name) {
		return name + ' <' + email + '>';
	} else {
		return email;
	}
}

function send (keystone, options, callback) {

	// create transport once
	if (!transport) {
		transport = nodemailer.createTransport(keystone.get('email nodemailer'));
	}

	var locals = options;

	var prepareOptions = [locals];

	if (arguments.length === 4 ) {
		// we expect locals, options, callback
		if (_.isObject(arguments[2])) {
			prepareOptions.push(arguments[2]);
		}
		callback = arguments[3];

	} else if (arguments.length === 3 && !_.isFunction(callback)) {
		// no callback so we expect locals, options
		if (_.isObject(arguments[2])) {
			prepareOptions.push(arguments[2]);
		}
		callback = function(err, info) {// eslint-disable-line no-unused-vars
			if (err) console.log(err);
		};

	} else if (arguments.length === 2) {
		// we expect options here and it is pushed already
		callback = function(err, info){// eslint-disable-line no-unused-vars
			if (err) console.log(err);
		};
	}

	prepareOptions.push(function(err, toSend) {

		if (err) {
			return callback(err, null);
		}

		return process.nextTick(function() {
			var message = toSend.message;

			var attachments = [];

			if (message.attachments) {
				attachments = message.attachments.map(function (attachment) {
					return {
						cid: attachment.cid,
						filename: attachment.name,
						content: attachment.content,
						contentType: attachment.type,
						encoding: 'base64'
					};
				});
			}

			var mail = {
				from: buildAddress(message.from_email, message.from_name),
				to: message.to.map(function (to) {
					return buildAddress(to.email, to.name)
				}).join(', '),
				subject: message.subject,
				html: message.html,
				attachments: attachments
			};

			if (options.sendPlainText) {
				if (typeof options.sendPlainText === 'object') {
					mail.text = htmlToText.fromString(message.html, options.sendPlainText);	
				} else {
					mail.text = htmlToText.fromString(message.html);
				}
			}

			transport.sendMail(mail, function(error, info) {
				if (error) {
					callback({
						from: 'Email.send',
						key: 'send error',
						message: 'Nodemailer encountered an error and did not send the emails.',
						info: error
					});
				} else {
					callback(null, info);
				}
			});
		});

	}.bind(this));

	this.prepare.apply(this, prepareOptions);

};

function init (keystone) {
  keystone.Email.prototype.send = function (options, callback) {
    send.call(this, keystone, options, callback);
  };
}

module.exports = init
