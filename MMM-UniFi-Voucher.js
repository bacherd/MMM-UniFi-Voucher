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
		isGen2: false
	},
	
	// Override dom generator.
	getDom: function() {
		var list = document.createElement("ul");
		list.classList.add("MMM-UniFi-Voucher");
		for (index in this.data.vouchers) {
			if (this.data.vouchers[index].status_expires == 0 && index < this.config.maximumEntries) {
				var item = document.createElement("li")
				item.classList.add("MMM-UniFi-Voucher");
				item.innerHTML = this.data.vouchers[index].code
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
