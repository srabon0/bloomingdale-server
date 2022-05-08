const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

function validateJWT(req, res, next) {
  const authorization = req.headers.authorization;
  console.log("inside auth header", authorization);
  if (!authorization) {
    return res.status(401).send({ message: "Unauhtorized access" });
  }
  const authToken = authorization.split(" ")[1];
  jwt.verify(authToken, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Forbidden access" });
    }
    console.log("decoded", decoded);
    req.decoded = decoded;
    next();
  });
}

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
    const feedbacks = database.collection("feedbacks");

    // insert an item
    app.post("/addproduct", async (req, res) => {
      const productName = req.body.data.productName;
      const price = req.body.data.price;
      const quantity = req.body.data.quantity;
      const imgurl = req.body.data.imgurl;
      const desc = req.body.data.desc;
      const supplier = req.body.data.supplier;
      const mail = req.body.data.mail;
      if (productName && price && supplier && quantity) {
        const doc = {
          productName: productName,
          img: imgurl,
          quantity: quantity,
          price: price,
          supplier: supplier,
          description: desc,
          mail: mail,
        };
        const result = await items.insertOne(doc);
        res.send(result);
      }
    });

    // Query for a movie that has the title 'The Room'

    app.get("/items", async (req, res) => {
      const query = {};

      const cursor = items.find(query);
      // since this method returns the matched document, not a cursor, print it directly
      const products = await cursor.toArray();
      res.send(products);
    });

    //get an specific product
    app.get("/inventory/:id", async (req, res) => {
      const productId = req.params.id;

      const query = { _id: ObjectId(productId) };
      const product = await items.findOne(query);
      // since this method returns the matched document, not a cursor, print it directly
      res.send(product);
    });

    app.get("/myitems", validateJWT, async (req, res) => {
      const decodedAuthEmail = req.decoded.email;
      const user = req.query.email;
      if (decodedAuthEmail === user) {
        const query = { mail: user };
        const cursor = items.find(query);
        // since this method returns the matched document, not a cursor, print it directly
        const products = await cursor.toArray();
        res.send(products);
      } else {
        res.status(403).send({ message: "Forbidden access" });
      }
    });

    //update a qunatity in a product
    app.put("/inventory/:id", async (req, res) => {
      const productId = req.params.id;
      const newQty = req.body.upQty;

      if (productId && newQty) {
        const filter = { _id: ObjectId(productId) };
        // this option instructs the method to create a document if no documents match the filter
        const options = { upsert: true };
        // create a document that sets the plot of the movie
        const updateDoc = {
          $set: {
            quantity: newQty,
          },
        };
        const result = await items.updateOne(filter, updateDoc, options);

        res.send(result);
      }
    });

    //delete an item
    app.delete("/delete", async (req, res) => {
      const productId = req.body.id;
      if (productId) {
        const query = { _id: ObjectId(productId) };
        const result = await items.deleteOne(query);
        res.send(result);
      }
    });

    //gen token for jwt
    app.post("/login", (req, res) => {
      const email = req.body;
      console.log(email);
      var token = jwt.sign(email, process.env.TOKEN_SECRET);
      res.send({ token });
    });

    //get Feedback
    app.get('/feedback',async(req,res)=>{
      const query = {};

      const cursor = feedbacks.find(query);
      // since this method returns the matched document, not a cursor, print it directly
      const messge = await cursor.toArray();
      res.send(messge);

    })


    //feedback message
    app.post("/feedback",async (req,res)=>{
      const name = req.body.name
      const email = req.body.email
      const message = req.body.message
      if(name && email && message){
        const doc = {
          name: name,
          email:email,
          message:message
        }
        const result = await feedbacks.insertOne(doc);
        res.send(result);
      };

    })
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
