const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const redisConnection = require("./redis-connection");
const nrpSender = require("./nrp-sender-shim");

app.use(bodyParser.json());

app.post("/send-message", async (req, res) => {
    let response = await nrpSender.sendMessage({
        redis: redisConnection,
        eventName: "send-message",
        data: {
            message: req.body.message
        },
        expectsResponse: false
    });

    res.json({ sent: "we sent it!" });
});

app.post("/send-message-with-reply", async (req, res) => {
    try {
        let response = await nrpSender.sendMessage({
            redis: redisConnection,
            eventName: "send-message-with-reply",
            data: {
                message: req.body.message
            }
        });

        res.json(response);
    } catch (e) {
        res.json({ error: e.message });
    }
})

app.get("/api/people/:id", async (req, res) => {
    try {
        let response = await nrpSender.sendMessage({
            redis: redisConnection,
            eventName: "getPerson",
            data: {
                message: parseInt(req.params.id)
            }
        });
        res.json(response);
    } catch (e) {
        res.json({error: e.message});
    }
})

app.post("/api/people", async (req, res) => {
    try {
        let response = await nrpSender.sendMessage({
            redis: redisConnection,
            eventName: "createPerson",
            data: {
                message: req.body
            }
        });
        res.json(response);
    } catch (e) {
        res.json({error: e.message});
    }
})

app.delete("/api/people/:id", async (req, res) => {
    try {
        let response = await nrpSender.sendMessage({
            redis: redisConnection,
            eventName: "deletePerson",
            data: {
                message: req.params.id
            }
        });
        res.json(response);
    } catch (e) {
        res.json({error: e.message});
    }
})

app.put("/api/people/:id", async (req, res) => {
    try {
        let response = await nrpSender.sendMessage({
            redis: redisConnection,
            eventName: "updatePerson",
            data: {
                message: req.params.id,
                person: req.body
            }
        });
        res.json(response);
    } catch (e) {
        res.json({error: e.message});
    }
})
app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});