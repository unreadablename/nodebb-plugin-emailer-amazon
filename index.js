'use strict';

var
	ses = require('node-ses'),
	winston = module.parent.require('winston'),
	Meta = module.parent.require('./meta'),
	Emailer = {},

	client;

Emailer.init = function (params, callback) {
	var router = params.router,
		middleware = params.middleware,
		controllers = params.controllers;

	function render(req, res, next) {
		res.render('admin/plugins/emailer-amazon', {});
	}

	Meta.settings.get('amazon-ses', function(err, settings) {
		if (!err && settings && settings.apiKey && settings.apiSecret) {
			client = ses.createClient({ key: settings.apiKey, secret: settings.apiSecret });

		} else {
			winston.error('[plugins/emailer-amazon] API key or secret not set!');
		}
	});

	router.get('/admin/plugins/emailer-amazon', middleware.admin.buildHeader, render);
	router.get('/api/admin/plugins/emailer-amazon', render);

	callback();


};

Emailer.send = function(data, callback) {
	if (!client) {
		winston.error('[emailer.amazon] Amazon SES is not set up properly!')
		return callback(null, data);
	}

	client.sendemail({
		to: data.to
		, from: data.from
		, cc: ''
		, bcc: []
		, subject: data.subject
		, message: data.html
		, altText: data.plaintext
	}, function (err, result, res) {
	if (!err) {
		winston.info('[emailer.amazon] Sent `' + data.template + '` email to uid ' + data.uid);
	} else {
		winston.warn('[emailer.amazon] Unable to send `' + data.template + '` email to uid ' + data.uid + '!!');
		winston.error('[emailer.amazon] (' + err.message + ')');
	}
	callback(err, data);
	});
};

Emailer.admin = {
	menu: function(custom_header, callback) {
		custom_header.plugins.push({
			"route": '/plugins/emailer-amazon',
			"icon": 'fa-envelope-o',
			"name": 'Emailer (Amazon SES)'
		});

		callback(null, custom_header);
	}
};

Emailer.getNotices = function(notices, callback) {
	//console.log(client);
	notices.push({
		done: client !== undefined,
		doneText: 'Emailer (Amazon SES) OK',
		notDoneText: 'Emailer (Amazon SES) needs setup'
	});

	callback(null, notices);
}

module.exports = Emailer;
