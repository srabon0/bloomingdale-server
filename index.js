const express = require('express');
const cors = require('cors');
const { config } = require('dotenv');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qljfq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  console.log("connected")
  // perform actions on the collection object
  client.close();
});

app.get('/',(req,res)=>{
    res.send("hello the server is runnig")
})

app.listen(port,()=>{
    console.log("The server is running on port", port);
})