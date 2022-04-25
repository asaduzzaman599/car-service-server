require('dotenv').config()
const express = require('express');
const cors = require('cors');


const app = express();
const port = process.env.PORT || 4000;

//middleware
app.use(cors())
app.use(express.json())

//Mongodb
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.sfale.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        client.connect()
        console.log("DB connected")
        const collectonService = client.db("geniusCar").collection('service')
        app.get("/service", async (req, res) => {
            const cursor = collectonService.find({});
            const result = await cursor.toArray();
            res.send(result);
        })
    } finally {

    }
}
run().catch(console.dir)

/* client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
}); */


app.get('/', (req, res) => {
    res.send(`Port Running at ${port}`)
})


app.listen(port, () => {
    console.log(`Port Running at ${port}`)
})
