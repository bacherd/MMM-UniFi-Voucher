# MMM-UniFi-Voucher
A [MagicMirror²](https://magicmirror.builders) module for [UniFi Hotspot](https://unifi-network.ui.com/) Voucher

![Example](screenshot.jpg)

## Installation

Go to your MacigMirror's module folder:
````
cd ~/MagicMirror/modules
````

Clone this repository:
````
git clone https://github.com/bacherd/MMM-UniFi-Voucher.git
````
Add the module to the modules list in  your config file:

````javascript
{
    module: "MMM-UniFi-Voucher",
    position: "right",
    header: "hotspot",
    config: {
        user: "mirror",
        pwd: "xxxxxxxxxx",
        url: "https://unifi-controller:8443",
    }
},
````

## Configuration

|option              | description
|--------------------|------------
| `user`             | Operator name: Create a new one under `Hotspotmanager->OPERATORS`
| `pwd`              | Operator password
| `url`              | Url to unifi controller api <br><br> **Default value:** `"https://unifi-controller:8443"`
| `maximumEntries`   | **Default value:** `5`
| `updateInterval`   | How often does the content update in milliseconds. <br><br> **Default value:** `60000`
| `animationSpeed`   | Animation speed in milliseconds. <br><br> **Default value:** `2500`
| `title`            | Headline <br><br> **Default value:** `"WLAN-Hotspot Voucher"`
| `isGen2`           | Use Cloudkey Gen2 api <br><br> **Default value:** `false`
| `split`            | Split voucher number for easier presentation <br><br> **Default value:** `3` use `0` for disable      
| `showDurationTime` | Show voucher duration time <br><br> **Default value:** `true`
| `showNote`         | Show voucher note <br><br> **Default value:** `false`
| `noteFilter`        | Show only voucher with special note. <br><br> **Default value:** `[]`<br> **Example value:** `["mirror", "mm"]`
| `noteFilterRegex`  | Show only vouchers that match the regular expression. Cannot be used with noteFilter. <br><br> **Default value:** `""`

### noteFilterRegex

For example use the regular expression to showing all vouchers containing word "business" "guest" but not "tomorrow" and "restricted".

```` javascript
noteFilterRegex="^.*(Business|Guest)(?!.*(tomorrow|restricted)).*$"
````

All notes:
* "Business restricted vouchers for tomorrow"
* "Business vouchers for tomorrow"
* "Business vouchers for today"
* "Guests welcome only to non-restricted"
* "Guests welcome only today"
* "Guests welcome only tomorrow"

Filtered notes:
* "Business vouchers for today"
* "Guests welcome only today"

Characters in the regular expression may need to be excaped.
