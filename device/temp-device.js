var awsIot = require('aws-iot-device-sdk');
const fs = require('fs');

var device = awsIot.device({
   keyPath: '../certs/065b804031-private.pem.key',
  certPath: '../certs/065b804031-certificate.pem.crt',
    caPath: '../certs/VeriSign-Class 3-Public-Primary-Certification-Authority-G5.pem',
  clientId: 'RoomThermometer',
      host: 'a22voz20bfrf7e.iot.eu-central-1.amazonaws.com'
});

device
  .on('connect', function() {
    console.log('connect');
    device.subscribe('topic_1');
    device.publish('topic_2', JSON.stringify({ test_data: 1}));
  });

device
  .on('message', function(topic, payload) {
    console.log('message', topic, payload.toString());
});

device
    .on('close', function() {
        console.log('close')
});

device
    .on('error', function(error) {
        console.log('error', error)
});

function publishTemp() {
        console.log('Publishing temp: ', 1);
        var file = fs.readFileSync('../ds28B30.txt', 'UTF-8');
        var temp = ((file.split('t='))[1]/1000).toFixed(1);
        console.log(temp);
        device.publish('Sensor/temp/room1', JSON.stringify({temp: temp}));
}

setInterval(() => publishTemp(), 1000);
//published = device.publish('Sensor/temp/room1', JSON.stringify({ test_data: 2}));
//console.log('published', published);