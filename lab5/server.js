const express = require("express");
const data = require("./data");
const people = data.people;
const redis = require('redis');
const client = redis.createClient();
const bluebird = require("bluebird");
const flat = require("flat");
const unflatten = flat.unflatten
const app = express();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);


app.get("/api/people/history", async (req, res) => {
    await client.lrange('recentlyviewed',0,19, function(error, myPeople) {
        let myParsedPeople = [];
        for(let i = 0; i < myPeople.length; i++)
        {
            myParsedPeople.push(JSON.parse(myPeople[i]));
        }
        res.json(myParsedPeople);
    })
})

app.get("/api/people/:id", async (req, res) => {
    let personId = req.params.id;
    let doesPersonExistInRedis = await client.existsAsync(personId);
    if(doesPersonExistInRedis === 0){
        //console.log("Not cached");
        try {
        let promiseResult = await people.getById(personId);
        //console.log(promiseResult);
        await client.setAsync(personId, JSON.stringify(promiseResult));
        await client.lpush('recentlyviewed', JSON.stringify(promiseResult));
        res.json(promiseResult);
        } catch(err) {
            //console.error(err);
            res.status(500).json({error: err});
        }
    }
    else
    {
        //console.log("This was cached and is being found");
        let finalPerson = await client.getAsync(personId);
        res.json(JSON.parse(finalPerson));
    }
})

app.get("/flushall", async (req, res) => {
    client.flushdb(function(err, succeeded) {
        res.json(succeeded);
    });
})

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});