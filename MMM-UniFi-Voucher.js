/* Magic Mirror
 * Module: MMM-UniFi-Voucher
 *
 * By Dominik Bacher www.bacher-online.de
 * MIT Licensed.
 */

Module.register("MMM-UniFi-Voucher", {
	
	// Define module config.
	defaults: {
		url: "https://unifi-controller:8443",
		user: "",
		pwd: "",
		maximumEntries: 5,
		//updateInterval: 60 * 1000,
		updateInterval: 10 * 1000,
		animationSpeed: 2.5 * 1000,
		title: "WLAN-Hotspot Voucher",
		isGen2: false,
		split: 3,
		showDurationTime: true
	},
	
	// Override dom generator.
	getDom: function() {
		var list = document.createElement("ul");
		list.classList.add("MMM-UniFi-Voucher");
		for (index in this.data.vouchers) {
			if (this.data.vouchers[index].status_expires == 0 && index < this.config.maximumEntries) {
				var item = document.createElement("li")
				var code = this.data.vouchers[index].code;
				var offset = 0;

				item.classList.add("MMM-UniFi-Voucher");

				var itemNumber = document.createElement('span');
				itemNumber.classList.add("MMM-UniFi-Voucher-number");
				if (this.config.split < 1) {
					itemNumber.innerHTML = this.data.vouchers[index].code
				} else {
					itemNumber.innerHTML += code.substr(offset, this.config.split);
					offset += this.config.split;

					while(offset < code.length) {
						itemNumber.innerHTML += "-" + code.substr(offset, this.config.split);
						offset += this.config.split;
					};
				}
				item.appendChild(itemNumber);

				if (this.config.showDurationTime === true) {
					var itemDuration = document.createElement('span');
					itemDuration.classList.add("MMM-UniFi-Voucher-duration");

					var duration = this.data.vouchers[index].duration;
					var d = Math.floor(duration / (60 * 24));
					var h =  Math.floor(duration % (60*24) / 60);
					var m =  Math.floor(duration % 60);

					var dDuration = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
					var hDuration = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
					var mDuration = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";

					itemDuration.innerHTML += dDuration + hDuration + mDuration;
					item.appendChild(itemDuration);
				}
				list.appendChild(item)
			}
		}
		return list;
	},

	getStyles: function () {
		return ["MMM-UniFi-Voucher.css"];
	},

	socketNotificationReceived: function(notification, payload) {
		var self = this;
		var obj = JSON.parse(payload);

		if (notification == "UNIFI_VOUCHER_ITEMS") {
			if (JSON.stringify(self.data.vouchers) !== JSON.stringify(obj.data)) {
				self.data.vouchers = obj.data
				self.updateDom(self.config.animationSpeed);
			}
		} else if (notification == "UNIFI_VOUCHER_ERROR") {
			self.data.vouchers = []
			self.updateDom(self.config.animationSpeed);
			Log.error(this.name + " " + obj.error)
		}
	},

	getHeader: function() {
		return this.data.header ? this.data.header : this.config.title;
	},

	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);
		this.sendSocketNotification("UNIFI_VOUCHER_UPDATE", { config: this.config });
	}
});
