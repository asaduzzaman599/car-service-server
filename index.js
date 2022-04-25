require('dotenv').config()
const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
var jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 4000;

//middleware
app.use(cors())
app.use(express.json())

//Mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.sfale.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        client.connect()
        console.log("DB connected")
        const collectonService = client.db("geniusCar").collection('service')
        const collectonOrder = client.db("geniusCar").collection('order')
        app.get("/service", async (req, res) => {
            const cursor = collectonService.find({});
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get("/service/:serviceId", async (req, res) => {
            const id = req.params.serviceId
            const query = {
                _id: ObjectId(id)
            }
            const result = await collectonService.findOne(query);
            ;
            res.send(result);
        })

        app.post('/login', async (req, res) => {
            const email = req.body
            token = await jwt.sign(
                email
                , process.env.ACCESSTOKEN, { expiresIn: '1d' });
            console.log(token)
            // var token = jwt.sign({ foo: 'bar' }, 'shhhhh');

            res.send(token)
        })

        //order
        app.post("/order", async (req, res) => {
            const body = req.body.email;
            const result = await collectonOrder.insertOne(body)
            res.send(result)

        })
        app.get("/order", async (req, res) => {
            const accessToken = req.headers.accesstoken;
            console.log("accessToken", accessToken)
            const queryEmail = req.query.email;
            console.log(queryEmail)
            const query = {
                email: queryEmail
            }
            const cursor = collectonOrder.find(query)
            const result = await cursor.toArray();

            res.send(result)

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
