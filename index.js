const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


// middleware
app.use(express.json())
app.use(cors())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@cluster0.f6qd7af.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const teaCollection = client.db('teaDB').collection('tea');
    const userCollection = client.db('teaDB').collection('user');


    app.get('/tea', async (req, res) => {
      const cursor = teaCollection.find()
      const result = await cursor.toArray()
      res.send(result);
    })

    app.get('/tea/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await teaCollection.findOne(query)
      res.send(result);
    })

    app.post('/tea', async (req, res) => {
      const newTea = req.body;
      console.log(newTea);
      const result = await teaCollection.insertOne(newTea);
      res.send(result);
    })

    app.put('/tea/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedTea = req.body;
      const tea = {
        $set: {
          name: updatedTea.name,
          chef: updatedTea.chef,
          category: updatedTea.category,
          details: updatedTea.details,
          photo: updatedTea.photo
        }
      }
      const result = await teaCollection.updateOne(filter, tea, options)
      res.send(result);
    })

    app.delete('/tea/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await teaCollection.deleteOne(query)
      res.send(result);
    })

    // tea related api
    app.get('/user', async(req, res)=>{
      const cursor = userCollection.find()
      const result = await cursor.toArray()
      res.send(result);
    })

    app.post('/user', async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    })

    app.patch('/user', async(req, res)=>{
      const user = req.body;
      const filter = {email: user.email}
      const updateDoc = {
        $set: {
          lastSignInTime: user.lastSignInTime
        }
      }
      const result = await userCollection.updateOne(filter, updateDoc)
      res.send(result);
    })

    app.delete('/user/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.deleteOne(query)
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('tea shop is running')
});

app.listen(port, () => {
  console.log(`tea shop is running on port ${port}`)
});

