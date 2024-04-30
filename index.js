const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

// midleware
app.use(cors({
  origin: ["http://localhost:5173", "https://monazila-852ee.web.app"]
}))
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zyfftle.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const paintingCollection = client.db("paintingDB").collection("painting")
    const subcategoryCollection = client.db("paintingDB").collection("subCategory")

    app.get('/paintings', async (req, res) => {
      const cursor = paintingCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/paintings/:email', async (req, res) => {
      const cursor = paintingCollection.find({ email: req.params.email })
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/painting/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await paintingCollection.findOne(query)
      res.send(result)
    })

    app.get("/paint/:subcategory_Name", async (req, res) => {
      const cursor = paintingCollection.find({ subcategory_Name: req.params.subcategory_Name })
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/subCategory', async (req, res) => {
      const cursor = subcategoryCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get("/subCategory/:subcategory_Name", async (req, res) => {
      const cursor = subcategoryCollection.find({ subcategory_Name: req.params.subcategory_Name })
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post('/paintings', async (req, res) => {
      const painting = req.body
      const result = await paintingCollection.insertOne(painting)
      res.send(result)
    })

    app.put('/painting/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updateArt = req.body
      const artItems = {
        $set: {
          item_name: updateArt.item_name,
          price: updateArt.price,
          subcategory_Name: updateArt.subcategory_Name,
          customization: updateArt.customization,
          processing_time: updateArt.processing_time,
          stockStatus: updateArt.stockStatus,
          image: updateArt.image,
          rating: updateArt.rating,
          short_description: updateArt.short_description,
        },
      };
      const result = await paintingCollection.updateOne(filter, artItems, options)
      res.send(result)
    })

    app.delete('/painting/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await paintingCollection.deleteOne(query)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("My Monazila is running")
})

app.listen(port, () => {
  console.log(`My Monazila is running on port: ${port}`);
})