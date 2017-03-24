const redisConnection = require("./redis-connection");
var jsonfile = require('jsonfile');
var http = require('https');
var fs = require('fs');
var peopleList;
var newDude = {
    first_name: "James"
};
var created = 0;
var updated = 0;
var file = fs.createWriteStream("file.json");
var request = http.get("https://gist.githubusercontent.com/xueye/5cf15393d245b38a2d86ce8207d5076c/raw/d529fb474c1af347702ca4d7b992256237fa2819/lab5.json", function(response) {
  response.pipe(file);
  file.on('finish', function() {
    file.close()
    jsonfile.readFile("file.json", function(err, obj) {
        //console.dir(obj)
        peopleList = obj;
        //console.log(peopleList);
        console.log("JSON file downloaded and saved to memory!");
        //console.log(peopleList.length);
        /*
        getPersonByID(1).then((data) => {
            console.log(data);
            updatePerson(1, newDude).then((please) => {
                console.log(please);
                getPersonByID(1).then((pretty) => {
                    console.log(pretty);
                });
            });
        });
        
        createPerson("Matt", "Colozzo", "dbag@yahoo.com", "fluid", "localhost:3000").then((data) => {
            console.log(data);
            console.log(peopleList.length);
            getPersonByID(1001).then((myPerson) => {
                console.log(myPerson);
                console.log(peopleList[1000]);
            })
        })
        deletePerson(50).then((data) => {
            console.log(data);
        });*/
    })
  })
});

function createPerson(fname, lname, email, gender,ip)
{
    //console.log("start of function");
    return new Promise((resolve, reject) => {
        console.log("start of promise");
        if(fname == undefined || fname == null || !(typeof fname == 'string'))
        {
            reject("Enter a valid first name");
        }
        if(lname == undefined || lname == null || !(typeof lname == 'string'))
        {
            reject("Enter a valid first name");
        }
        if(email == undefined || email == null || !(typeof email == 'string'))
        {
            reject("Enter a valid first name");
        }
        if(ip == undefined || ip == null || !(typeof ip == 'string'))
        {
            reject("Enter a valid first name");
        }
        created++
        if(created > 1)
        {
            created = 0;
            return;
        }
        let nextIndex = peopleList.length
        let newPerson = {
            id: nextIndex + 1,
            first_name: fname,
            last_name: lname,
            email: email,
            gender: gender,
            ip_address: ip
        }

        peopleList.push(newPerson);
        console.log(peopleList.length);
        resolve(newPerson);
        return;
    })
}



function getPersonByID(personID)
{
    //console.log("Person id is: " + personID);
    //console.log("start of function");
    return new Promise((resolve, reject) => {
                if(personID == undefined || isNaN(personID) || personID == null)
                {
                    return reject("Enter a valid ID");
                }
                let person = peopleList.filter(x => x.id == personID).shift();
                if(!person)
                {
                    return reject("Person not found");
                }

                resolve(person);
            })
        
}

function updatePerson(personID, updatedPerson)
{
    //console.log("start of function");
    /*
    if(updated > 1)
    {
        updated = 0;
        return;
    }
    updated++;*/
    return new Promise((resolve, reject) => {
        getPersonByID(personID).then((myPerson) => {
            let personIndex = myPerson.id - 1;
            let brandNewPerson = myPerson;
            if(updatedPerson.first_name)
            {
                brandNewPerson.first_name = updatedPerson.first_name;
            }
            if(updatedPerson.last_name)
            {
                brandNewPerson.last_name = updatedPerson.last_name;
            }
            if(updatedPerson.email)
            {
                brandNewPerson.email = updatedPerson.email;
            }
            if(updatedPerson.gender)
            {
                brandNewPerson.gender = updatedPerson.gender;
            }
            if(updatedPerson.ip_address)
            {
                brandNewPerson.ip_address = updatedPerson.ip_address;
            }
            peopleList[personIndex] = brandNewPerson;
            resolve(peopleList[personIndex]);
            return;
        }).catch((error) => {
            reject("Person does not exist to update");
        })
    });
}

function deletePerson(personID)
{
    return new Promise((resolve, reject) => {
        getPersonByID(personID).then((myPerson) => {
            var deleted = myPerson.first_name + " " + myPerson.last_name;
            var deletedID = myPerson.id;
            peopleList.splice(deletedID - 1, 1);
            resolve(deleted + " deleted, ID: " + deletedID);
        }).catch((error) => {
            reject("No person to delete");
        })
    });
}


redisConnection.on('send-message:request:*', (message, channel) => {
    let messageText = message.data.message;
    console.log("\n\n\n=================")
    console.log("We've received a message from the API server! It's:");
    console.log(messageText);
    console.log(JSON.stringify(message));
    console.log("=================\n\n\n")
});

redisConnection.on('send-message-with-reply:request:*', (message, channel) => {
    let requestId = message.requestId;
    let eventName = message.eventName;

    let messageText = message.data.message;
    let successEvent = `${eventName}:success:${requestId}`;
    //let person = 
    redisConnection.emit(successEvent, {
        requestId: requestId,
        data: {
            message: messageText
        },
        eventName: eventName
    });
});

redisConnection.on("getPerson:*", async (message, channel) => {
    let requestId = message.requestId;
    let eventName = message.eventName;

    let messageText = message.data.message;
    let successEvent = `${eventName}:success:${requestId}`;
    console.log("Message is " + parseInt(message.data.message));
    let promiseResult = await getPersonByID(parseInt(message.data.message));
    redisConnection.emit(successEvent, {
        data: {
            message: promiseResult
        },
        eventName: eventName
    });
});

redisConnection.on("createPerson:*", async (message, channel) => {
    //created = 0;
    let requestId = message.requestId;
    let eventName = message.eventName;

    let newPerson = message.data.message;
    let successEvent = `${eventName}:success:${requestId}`;
    let promiseResult = await createPerson(newPerson.first_name, newPerson.last_name, newPerson.email, newPerson.gender, newPerson.ip_address);
    redisConnection.emit(successEvent, {
        data: {
            message: promiseResult
        },
        eventName: eventName
        //redisConnection.quit();
    });
    //redisConnection.quit();
});

redisConnection.on("deletePerson:*", async (message, channel) => {
    let requestId = message.requestId;
    let eventName = message.eventName;

    let deletionId = message.data.message;
    let successEvent = `${eventName}:success:${requestId}`;
    let promiseResult = await deletePerson(deletionId);
    redisConnection.emit(successEvent, {
        data: {
            message: promiseResult
        },
        eventName: eventName
    });
});

redisConnection.on("updatePerson:*", async (message, channel) => {
    let requestId = message.requestId;
    let eventName = message.eventName;

    let updatedPersonId = message.data.message;
    let updatedPerson = message.data.person;
    let successEvent = `${eventName}:success:${requestId}`;
    let promiseResult = await updatePerson(updatedPersonId, updatedPerson);
    redisConnection.emit(successEvent, {
        data: {
            message: promiseResult
        },
        eventName: eventName
    });
});