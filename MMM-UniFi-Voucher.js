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
		updateInterval: 60 * 1000,
		animationSpeed: 2.5 * 1000,
		title: "WLAN-Hotspot Voucher"
	},
	
	// Override dom generator.
	getDom: function() {
		var list = document.createElement("ul");
		list.classList.add("MMM-UniFi-Voucher");
		
		for (index in this.data) {
			if (this.data[index].status_expires == 0 && index < this.config.maximumEntries) {
				var item = document.createElement("li")
				item.classList.add("MMM-UniFi-Voucher");
				item.innerHTML = this.data[index].code
				list.appendChild(item)
			}
		}
		return list;
	},

        getStyles: function () {
                return ["MMM-UniFi-Voucher.css"];
        },


	//notificationReceived: function(notification, payload, sender) {
	//	Log.info(this.name + " - received notification: " + notification);
	//},

	socketNotificationReceived: function(notification, payload) {
		var self = this;
		var obj = JSON.parse(payload);
		
		if (JSON.stringify(self.data) !== JSON.stringify(obj.data)) {
			self.data = obj.data
			self.updateDom(self.config.animationSpeed);
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
