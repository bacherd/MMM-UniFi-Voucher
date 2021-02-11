var NodeHelper = require("node_helper");
var request = require("request")

module.exports = NodeHelper.create({

	start: function() {
		this.cookie = '';
	},

	getVouchers: function() {
		var self = this;

		var options = {
			method: 'GET',
			url: this.config.url + '/api/s/default/stat/voucher',
		  	headers: {
		     		'cache-control': 'no-cache',
		     		'content-type': 'application/json;charset=UTF-8',
		     		'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
		     		origin: this.config.url,
				accept: 'application/json, text/plain, */*',
				'cookie': self.cookie
			},
			rejectUnauthorized: false,
		};

		console.log("[UniFi-Voucher] " + "get vouchers " + this.config.url);
		request(options, function (error, response, body) {
			if (!error && response.statusCode === 200) {
				var vouchers = body;
				self.sendSocketNotification("UNIFI_VOUCHER_ITEMS", vouchers);
			} else {
				console.log("[UniFi-Voucher] " + error);
				var msg = {
					"error": "cannot get vouchers from " +  self.config.url
				}
				self.sendSocketNotification("UNIFI_VOUCHER_ERROR", JSON.stringify(msg));
				self.cookie = '';
			}
		});
	},

	login: function() {
		var self = this;

		var options = {
			method: 'POST',
			url: this.config.url + '/api/login',
		  	headers: {
		     		'cache-control': 'no-cache',
		     		'content-type': 'application/json;charset=UTF-8',
		     		'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
		     		origin: this.config.url,
				accept: 'application/json, text/plain, */*'
			},
		  	body: '{"username":"' + this.config.user +'","password":"' + this.config.pwd + '","for_hotspot":true,"strict":true,"remember":true,"site_name":"default"}',
			rejectUnauthorized: false,
		};
		
		console.log("[UniFi-Voucher] " + "login /api/login");
		request(options, function (error, response, body) {
			if (!error && response.statusCode === 200) {
				var setCookie = response.headers['set-cookie'];
				self.cookie = setCookie[0].split(' ')[0];
				self.getVouchers();
			} else {
				console.log("[UniFi-Voucher] " + error);
				var msg = {
					"error": "cannot login to " +  self.config.url
				}
				self.sendSocketNotification("UNIFI_VOUCHER_ERROR", JSON.stringify(msg));
				return null;
			}
		});
	},

	fetch: function() {

		//console.log("[UniFi-Voucher] cookie:" + this.cookie);
		if (this.cookie === '') {
			this.login();
		} else {
			this.getVouchers();
		}
	},

	scheduleUpdateInterval: function() {
		var self = this;

		self.fetch();			
		setInterval(function() {
			self.fetch();			
		}, this.config.updateInterval);
	},
	
	socketNotificationReceived: function(notification, payload) {
		if (notification === "UNIFI_VOUCHER_UPDATE") {
			var self = this;
			self.config = payload.config;
			this.scheduleUpdateInterval();
			return;
		}
	}
});
