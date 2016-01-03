# homebridge-home-state
Home-state (https://github.com/automait/home-state) plugin for homebridge: https://github.com/nfarina/homebridge

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g homebridge-home-state
3. Update your configuration file. See the sample below.

# Configuration

Configuration sample:

 ```
"platforms": [
        {
          "platform" : "HomeState",
          "host" : "http://127.0.0.1:4578",
          "states": [ "Default", "Night" ]
        }
    ]

```

Host is the location (ip and port) of the Home-state websocket server
