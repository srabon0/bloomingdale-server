const express = require("express");
const cors = require("cors");
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qljfq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("broomingDaleInventory");
    const items = database.collection("items");
    // Query for a movie that has the title 'The Room'

    app.get("/items", async (req, res) => {
      const query = {};

      const cursor = items.find(query);
      // since this method returns the matched document, not a cursor, print it directly
      const products = await cursor.toArray();
      res.send(products);
      console.log("items called");
    });



  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello the server is runnig");
});

app.listen(port, () => {
  console.log("The server is running on port", port);
});
