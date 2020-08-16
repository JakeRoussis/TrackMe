const mqtt = require('mqtt');
const express = require('express');
const bodyParser = require('body-parser');

const Device = require('../api/models/device');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Jake:sit209db@cluster0.nf7wt.mongodb.net/test')

const app = express();
const port = process.env.PORT || 5001;


const rand = require('random-int');
const randomCoordinates= require('random-coordinates');

app.use(express.static('public'));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const client = mqtt.connect("mqtt://broker.hivemq.com:1883");
client.on('connect', () => {
    client.subscribe('/sensorData');
    console.log('mqtt connected');
});

client.on('message', (topic, message) => {
    if (topic == '/sensorData') {
        const data = JSON.parse(message);

        Device.findOne({ "name": data.deviceId }, (err, device) => {
            if (err) {
                console.log(err)
            }

            const { sensorData } = device;
            const { ts, loc, temp } = data;
            sensorData.push({ ts, loc, temp });
            device.sensorData = sensorData;
            device.save(err => {
                if (err) {
                    console.log(err)
                }
            });
        });
    }
});


app.post('/send-command', (req, res) => {
    const { deviceId, command } = req.body;
    const topic = `/218244867/command/${deviceId}`;
    client.publish(topic, command, () => {
        res.send('published new message');
    });
});

app.put('/sensor-data', (req, res) => {
    const { deviceId } = req.body;
    const [lat, lon] = randomCoordinates().split(", ");
    const ts = new Date().getTime();
    const loc = { lat, lon };
    const temp = rand(20, 50);
    const topic = `/sensorData`;
    const message = JSON.stringify({ deviceId, ts, loc, temp });
    client.publish(topic, message, () => {
        console.log(lat, lon);
        console.log(deviceId);
        res.send('published new message');
    });
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

const topic = "/218244867/test";
const msg = "Hello MQTT world!";
client.publish(topic, msg, () => {
    console.log("message sent...");
});