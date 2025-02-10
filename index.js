const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config;

const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

// meddleware
app.use(cors());
app.use(express.json());

// DB_USER = job_hunter
// DB_PASS = ABX3c2RVYeNY2wjN

const uri = `mongodb+srv://<db_username>:<db_password>@cluster0.kbm4w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Job is falling from the sky.");
});

app.listen(port, () => {
  console.log(`Job is waiting at: ${port}`);
});
