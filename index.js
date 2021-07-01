const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
// const { ObjectID } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
// console.log(process.env.DB_USER);

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.jumub.mongodb.net:27017,cluster0-shard-00-01.jumub.mongodb.net:27017,cluster0-shard-00-02.jumub.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-20e537-shard-0&authSource=admin&retryWrites=true&w=majority`;


app.use(cors())
app.use(bodyParser.json())



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })




client.connect(err => {
  console.log("Database Error", err)
  const eventCollection = client.db("volenteer").collection("events");
  // console.log("Database Connected Succesfully")


  app.get('/events', (req, res) => {
    eventCollection.find()
    .toArray((err, items) => {
        res.send(items)
        console.log("From Database", items)
    })
  })

  app.post('/addEvent', (req, res) => {
        const newEvents = req.body;
        // console.log("Events", newEvents)
        eventCollection.insertOne(newEvents)
        .then(result => {
          console.log('Inserted Count', result.insertedCount)
          res.send(result.insertedCount > 0)
        })
  })

  app.delete('deleteEvent/:id', (req, res) => {
    const id = ObjectID(req.params.id)
    console.log("Delete id", id)
    eventCollection.findOneAndDelete({_id: id})
    .then(documents => res.send(!!documents.value))
  })

});



app.listen(port)