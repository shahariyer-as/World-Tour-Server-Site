const express = require('express')
const app = express();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()



const cors = require('cors');
const port = process.env.PORT || 5000;

// middle wire 
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wsk2b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db('Tourist_ass_10');
        const planCollection = database.collection("plans");
        const bookingCollection = database.collection("booking");

        // get tourist api 

        app.get('/plans', async (req, res) => {
            const cursor = planCollection.find({});
            const plans = await cursor.toArray();
            res.send(plans)
        });

        //  get single api 
        app.get('/plans/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const plan = await planCollection.findOne(query)
            res.json(plan);
        });
        // add booking 
        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.json(result)
        })


    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Tourist site is running');
});

app.listen(port, () => {
    console.log('server is running', port)
})