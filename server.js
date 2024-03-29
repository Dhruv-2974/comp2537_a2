const express = require('express')
const app = express()
const https = require("https");
const bodyparser = require("body-parser");
app.set('view engine', 'ejs');
const pokemon = require("./public/pokedata.js");



app.listen(process.env.PORT || 5000, function (err) {
    if (err) console.log(err);
});

// For parsing application/json
app.use(express.json());

// Connect to mongodb
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const eventSchema = new mongoose.Schema({
    text: String,
    hits: Number,
    time: String
});

const eventModel = mongoose.model("timelineevents", eventSchema);

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({
    extended: true
}));
app.use(bodyparser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}));


// CRUD
// 1. Read
app.get("/timeline/getAllEvents", function (req, res) {
    // console.log("received a request for "+ req.params.city_name);
    eventModel.find({}, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send(data);
    });
});

// 2. Create
app.put("/timeline/insert", function (req, res) {
    console.log(req.body);
    eventModel.create({
            text: req.body.text,
            time: req.body.time,
            hits: req.body.hits,
        },
        function (err, data) {
            if (err) {
                console.log("Error " + err);
            } else {
                console.log("Data " + data);
            }
            res.send(data);
        }
    );
});

// 3. Update
app.get("/timeline/increaseHits/:id", function (req, res) {
    console.log(req.params);
    eventModel.updateOne({
            _id: req.params.id,
        }, {
            $inc: {
                hits: 1
            },
        },
        function (err, data) {
            if (err) {
                console.log("Error " + err);
            } else {
                console.log("Data " + data);
            }
            res.send("Updated Successfully");
        }
    );
});

// 3.5 Decrease hits
app.get("/timeline/decreaseHits/:id", function (req, res) {
    console.log(req.params);
    eventModel.updateOne({
            _id: req.params.id,
        }, {
            $inc: {
                hits: -1
            },
        },
        function (err, data) {
            if (err) {
                console.log("Error " + err);
            } else {
                console.log("Data " + data);
            }
            res.send("Updated Successfully");
        }
    );
});

// 4. Delete
app.get("/timeline/remove/:id", function (req, res) {
    // console.log(req.params);
    eventModel.remove({
            _id: req.params.id,
        },
        function (err, data) {
            if (err) {
                console.log("Error " + err);
            } else {
                console.log("Data " + data);
            }
            res.send("Deleted Successfully");
        }
    );
});



app.get("/profile/:id", function (req, res) {

    const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`
    data = ""

    https.get(url, function (https_res) {
        https_res.on("data", function (chunk) {
            // console.log(JSON.parse(data))
            data += chunk;
        })
        https_res.on("end", function () {
            // console.log(JSON.parse(data))
            data = JSON.parse(data)

            z = data.stats.filter((obj_) => {
                return obj_.stat.name == "hp"
            })

            // returns the value
            console.log(z[0].base_stat)

            // returns the value as an array
            console.log(z.map((obj2) => {
                return obj2.base_stat
            }))

            tmp = data.stats.filter((obj_) => {
                return obj_.stat.name == "hp"
            }).map((obj2) => {
                return obj2.base_stat
            })

            atk = data.stats.filter((obj) => {
                return obj_.stat.name == "attack"
            }).map((obj2) => {
                return obj2.basestat
            })

            def = data.stats.filter((obj) => {
                return obj_.stat.name == "defense"
            }).map((obj2) => {
                return obj2.basestat
            })

            spd = data.stats.filter((obj) => {
                return obj_.stat.name == "speed"
            }).map((obj2) => {
                return obj2.base_stat
            })

            typeList = []
            for (i = 0; i < data.types.length; i++) {
                typeList.push(data.types[i].type.name)
            }

            console.log("name: " + data.name);
            // sends an entire html page
            res.render("profile.ejs", {
                "id": req.params.id,
                "name": data.name,
                "hp": tmp[0],
                "attack": atk[0],
                "defense": def[0],
                "speed": spd[0],
                "typeList": typeList,
            });
        })
    });


})

// app.use enables a middleware
// HAS TO HAVE index.html INSIDE PUBLIC FOLDER
app.use(express.static('public'));

function f_1() {
    console.log("dummy middleware");
}

app.use(f_1)