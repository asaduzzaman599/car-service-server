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

const verifyJWToken = (req, res, nxt) => {
    const headerAccessToken = req.headers.accesstoken;
    if (!headerAccessToken) {
        return res.status(401).send({ message: "unauthorized!" })
    }
    const token = headerAccessToken.split(' ')[1]

    // verify a token symmetric
    jwt.verify(token, process.env.ACCESSTOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: "Forbidden!" })
        }
        req.decoded = decoded
        nxt()
    });

}
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
        app.get("/order", verifyJWToken, async (req, res) => {

            const queryEmail = req.query.email;
            const decodeEmail = req.decoded.email
            if (queryEmail === decodeEmail) {
                const query = {
                    email: queryEmail
                }
                const cursor = collectonOrder.find(query)
                const result = await cursor.toArray();

                res.send(result)
            } else {

                res.status(403).send({ message: 'Forbidden!' })
            }


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
