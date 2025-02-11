const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// meddleware
app.use(cors());
app.use(express.json());

// DB_USER = job_hunter
// DB_PASS = ABX3c2RVYeNY2wjN

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kbm4w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    // jobs realte apis
    const jobsCollection = client.db("jobPortal").collection("jobs");
    const jobApplicationCollection = client
      .db("jobPortal")
      .collection("jobs_applications");

    app.get("/jobs", async (req, res) => {
      const cursor = jobsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/jobs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobsCollection.findOne(query);
      res.send(result);
    });

    // job application apis
    // get all data, get one data, get some data [0, 1, many]
    app.get("/job-applications", async (req, res) => {
      const email = req.query.email;
      const query = { applicant_email: email };
      const result = await jobApplicationCollection.find(query).toArray();

      // fokira way to aggregate data
      for (const application of result) {
        const query1 = { _id: new ObjectId(application.job_id) };
        const job = await jobsCollection.findOne(query1);
        if (job) {
          application.title = job.title;
          application.location = application.location;
          application.company = job.company;
          application.company_log = job.company_log;
        }
      }

      res.send(result);
    });

    app.post("/job-applications", async (req, res) => {
      const application = req.body;
      const result = await jobApplicationCollection.insertOne(application);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Job is falling from the sky.");
});

app.listen(port, () => {
  console.log(`Job is waiting at: ${port}`);
});
