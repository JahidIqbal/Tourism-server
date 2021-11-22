const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;

const app = express();


const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sbyjk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);
async function run() {
    try {
        await client.connect();
        const database = client.db("jtourism");
        const placeCollection = database.collection("places");
        const orderCollection = database.collection("orders");
        const ServicesCollection = database.collection("services");


        // get places API
        app.get('/places', async (req, res) => {
            const cursor = placeCollection.find({})
            const places = await cursor.toArray();
            res.send(places);
        })

        //Add Orders API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order)
            res.send(result);
        })

        // Getting myorders
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({})
            const result = await cursor.toArray();
            res.send(result);
        })

        // DELETE API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.insertOne(query);
            res.json(result);
        })



        // get manageAllOrder api
        app.get('/manageAllOrders', async (req, res) => {
            const cursor = orderCollection.find({})
            const manageOrders = await cursor.toArray();
            res.send(manageOrders);
        })



        // DELETE manageAllorder API
        app.delete('/manageAllOrders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);

        })


        // post Add New services
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);
            const result = await ServicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        })

        // Get Add New Services
        app.get('/services', async (req, res) => {
            const getService = ServicesCollection.find({})
            const addNewService = await getService.toArray();
            res.send(addNewService);
        })


    }
    finally {
        //   await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Running tourism Server');
})

app.listen(port, () => {
    console.log('Running tourism Server on port', port)
})
