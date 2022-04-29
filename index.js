const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;


const app = express();

app.get('/',(req,res)=>{
    res.send("hello the server is runnig")
})

app.listen(port,()=>{
    console.log("The server is running on port", port);
})