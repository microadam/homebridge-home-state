module.exports = init;

var Primus = require('primus');
var Emitter = require('primus-emitter');
var Socket = Primus.createSocket({ transformer: 'websockets', parser: 'JSON', plugin: { emitter: Emitter } });

var Service = null;
var Characteristic = null;

function init(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerPlatform('homebridge-home-state', 'HomeState', HomeStatePlatform);
}

function HomeStatePlatform(log, config) {
  this.config = config;
  this.log = log;
  this.homeStateClient = new Socket(config.host);
  this.switches = [];
}

HomeStatePlatform.prototype.accessories = function (callback) {
  this.log('Creating State Switches...');
  this.config.states.forEach(function (state) {
    var acc = new StateAccessory(state, this.homeStateClient, this.log);
    this.switches.push(acc);
  }.bind(this));
  callback(this.switches);
};

function StateAccessory(state, homeStateClient, log) {
  this.id = state;
  this.state = state;
  this.name = state + ' State';
  this.log = log;
  this.homeStateClient = homeStateClient;
  this.currentState = null;
  this.homeStateClient.on('state', function (state) {
    this.currentState = state;
  }.bind(this));
}

StateAccessory.prototype.getServices = function () {
  var service = new Service.Switch(this.name);

  service.getCharacteristic(Characteristic.On)
    .on('get', function (callback) {
      callback(null, this.currentState === this.state ? 1 : 0);
    }.bind(this))
    .on('set', function (value, callback) {
      this.homeStateClient.send('changeState', this.state);
      callback();
    }.bind(this));

  var informationService = new Service.AccessoryInformation();

  informationService
    .setCharacteristic(Characteristic.Manufacturer, 'Test')
    .setCharacteristic(Characteristic.Model, 'Test')
    .setCharacteristic(Characteristic.SerialNumber, this.name)
    .addCharacteristic(Characteristic.FirmwareRevision, 'test');

  return [ service, informationService ];
};
