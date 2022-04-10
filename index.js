const express = require("express");
const app = express();
const cors = require("cors");
const BodyParser = require("body-parser");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectID = require("mongodb").ObjectID;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(BodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tpdhc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// async function verifyToken(req, res, next) {
//   if (req.headers?.authorization?.startsWith("Bearer ")) {
//     const token = req.headers.authorization.split(" ")[1];

//     try {
//       const decodedUser = await admin.auth().verifyIdToken(token);
//       req.decodedEmail = decodedUser.email;
//     } catch {}
//   }
//   next();
// }

async function run() {
  try {
    await client.connect();
    const database = client.db("cex_dashboard");
    // const appointmentsCollection = database.collection('appointments');
    // const usersCollection = database.collection('users');
    const agentsCollection = database.collection("agents");
    const enablersCollection = database.collection("attendance");
    const adjustmentCollection = database.collection("adjustment");
    const auditCollection = database.collection("callAudit");
    const roleCollection = database.collection("role");

    // app.get('/appointments', verifyToken, async (req, res) => {
    //     const email = req.query.email;
    //     const date = req.query.date;

    //     const query = { email: email, date: date }

    //     const cursor = agentsCollection.find(query);
    //     const appointments = await cursor.toArray();
    //     res.json(appointments);
    // })

    // app.get('/appointments/:id', async (req, res) => {
    //     const id = req.params.id;
    //     const query = { _id: ObjectId(id) };
    //     const result = await agentsCollection.findOne(query);
    //     res.json(result);
    // })

    // app.post('/appointments', async (req, res) => {
    //     const appointment = req.body;
    //     const result = await agentsCollection.insertOne(appointment);
    //     res.json(result)
    // });

    // app.put('/appointments/:id', async (req, res) => {
    //     const id = req.params.id;
    //     const payment = req.body;
    //     const filter = { _id: ObjectId(id) };
    //     const updateDoc = {
    //         $set: {
    //             payment: payment
    //         }
    //     };
    //     const result = await agentsCollection.updateOne(filter, updateDoc);
    //     res.json(result);
    // });

    // doctors api
    // app.get("/agents", async (req, res) => {
    //   const cursor = agentsCollection.find({});
    //   const agents = await cursor.toArray();
    //   res.json(agents);
    // });

    // app.get("/agents/:id", async (req, res) => {
    //   const query = { _id: ObjectId(req.params.id) };
    //   const agents = await agentsCollection.findOne(query);
    //   res.json(agents);
    // });
    app.get("/agents", (req, res) => {
      agentsCollection.find().toArray((err, items) => {
        res.send(items);
      });
    });

    app.get("/agents/:id", (req, res) => {
      const id = ObjectID(req.params.id);
      agentsCollection.find(id).toArray((err, items) => {
        res.send(items[0]);
      });
    });

    app.post("/addAgent", (req, res) => {
      const newAgent = req.body;
      console.log("Adding New Agent", newAgent);
      agentsCollection.insertOne(newAgent).then((result) => {
        console.log("inserted Count", result.insertedCount);
        res.send(result.insertedCount > 0);
      });
    });
    app.delete("/delete/:id", (req, res) => {
      const id = ObjectID(req.params.id);
      agentsCollection.deleteOne({ _id: id }).then((result) => {
        res.send(result.deletedCount > 0);
      });
    });
    //Adjustment API
    app.get("/adjustment", (req, res) => {
      adjustmentCollection.find().toArray((err, items) => {
        res.send(items);
      });
    });

    app.get("/adjustment/:id", (req, res) => {
      const id = ObjectID(req.params.id);
      adjustmentCollection.find(id).toArray((err, items) => {
        res.send(items[0]);
      });
    });

    app.post("/Addadjustment", (req, res) => {
      const newAdjustment = req.body;
      console.log("Adding New Adjustment", newAdjustment);
      adjustmentCollection.insertOne(newAdjustment).then((result) => {
        console.log("inserted Count", result.insertedCount);
        res.send(result.insertedCount > 0);
      });
    });
    app.delete("/delete/:id", (req, res) => {
      const id = ObjectID(req.params.id);
      adjustmentCollection.deleteOne({ _id: id }).then((result) => {
        res.send(result.deletedCount > 0);
      });
    });
    //QA Department
    app.get("/audit", (req, res) => {
      auditCollection.find().toArray((err, items) => {
        res.send(items);
      });
    });

    app.get("/audit/:id", (req, res) => {
      const id = ObjectID(req.params.id);
      auditCollection.find(id).toArray((err, items) => {
        res.send(items[0]);
      });
    });

    app.post("/audit", (req, res) => {
      const newAudit = req.body;
      console.log("Adding New Audit", newAudit);
      auditCollection.insertOne(newAudit).then((result) => {
        console.log("inserted Count", result.insertedCount);
        res.send(result.insertedCount > 0);
      });
    });
    app.delete("/delete/:id", (req, res) => {
      const id = ObjectID(req.params.id);
      auditCollection.deleteOne({ _id: id }).then((result) => {
        res.send(result.deletedCount > 0);
      });
    });
    // Enabler API
    app.get("/attendance", (req, res) => {
      enablersCollection.find().toArray((err, items) => {
        res.send(items);
      });
    });

    app.get("/attendance/:id", (req, res) => {
      const id = ObjectID(req.params.id);
      enablersCollection.find(id).toArray((err, items) => {
        res.send(items[0]);
      });
    });

    app.post("/addAttendance", (req, res) => {
      const newAttendance = req.body;
      console.log("Adding New Attendance", newAttendance);
      enablersCollection.insertOne(newAttendance).then((result) => {
        console.log("inserted Count", result.insertedCount);
        res.send(result.insertedCount > 0);
      });
    });
    app.delete("/delete/:id", (req, res) => {
      const id = ObjectID(req.params.id);
      enablersCollection.deleteOne({ _id: id }).then((result) => {
        res.send(result.deletedCount > 0);
      });
    });
    //Settings API

    app.get("/role", (req, res) => {
      roleCollection.find().toArray((err, items) => {
        res.send(items);
      });
    });

    app.get("/role/:email", (req, res) => {
      const id = ObjectID(req.params.id);
      roleCollection.find(id).toArray((err, items) => {
        res.send(items[0]);
      });
    });

    app.post("/addRole", (req, res) => {
      const newRole = req.body;
      console.log("Adding New Role", newRole);
      roleCollection.insertOne(newRole).then((result) => {
        console.log("inserted Count", result.insertedCount);
        res.send(result.insertedCount > 0);
      });
    });
    app.delete("/delete/:id", (req, res) => {
      const id = ObjectID(req.params.id);
      roleCollection.deleteOne({ _id: id }).then((result) => {
        res.send(result.deletedCount > 0);
      });
    });
    // app.post("/addAgent", async (req, res) => {
    //   console.log(req.body)
    //   const empId = req.body.empId;
    //   const loginId = req.body.loginId;
    //   const name = req.body.name;
    //   const email = req.body.email;
    //   const tlName = req.body.tlName;
    //   const qaName = req.body.qaName;
    //   // const pic = req.files.image;
    //   // const picData = pic.data;
    //   // const encodedPic = picData.toString('base64');
    //   // const imageBuffer = Buffer.from(encodedPic, 'base64');
    //   const agents = {
    //     empId,
    //     loginId,
    //     name,
    //     email,
    //     tlName,
    //     qaName,
    //   };
    //   const result = await agentsCollection.insertOne(agents);
    //   res.json(result);
    // });

    // app.get('/users/:email', async (req, res) => {
    //     const email = req.params.email;
    //     const query = { email: email };
    //     const user = await usersCollection.findOne(query);
    //     let isAdmin = false;
    //     if (user?.role === 'admin') {
    //         isAdmin = true;
    //     }
    //     res.json({ admin: isAdmin });
    // })

    // app.post('/users', async (req, res) => {
    //     const user = req.body;
    //     const result = await usersCollection.insertOne(user);
    //     console.log(result);
    //     res.json(result);
    // });

    // app.put('/users', async (req, res) => {
    //     const user = req.body;
    //     const filter = { email: user.email };
    //     const options = { upsert: true };
    //     const updateDoc = { $set: user };
    //     const result = await usersCollection.updateOne(filter, updateDoc, options);
    //     res.json(result);
    // });

    // app.put('/users/admin', verifyToken, async (req, res) => {
    //     const user = req.body;
    //     const requester = req.decodedEmail;
    //     if (requester) {
    //         const requesterAccount = await usersCollection.findOne({ email: requester });
    //         if (requesterAccount.role === 'admin') {
    //             const filter = { email: user.email };
    //             const updateDoc = { $set: { role: 'admin' } };
    //             const result = await usersCollection.updateOne(filter, updateDoc);
    //             res.json(result);
    //         }
    //     }
    //     else {
    //         res.status(403).json({ message: 'you do not have access to make admin' })
    //     }

    // })

    // app.post('/create-payment-intent', async (req, res) => {
    //     const paymentInfo = req.body;
    //     const amount = paymentInfo.price * 100;
    //     const paymentIntent = await stripe.paymentIntents.create({
    //         currency: 'usd',
    //         amount: amount,
    //         payment_method_types: ['card']
    //     });
    //     res.json({ clientSecret: paymentIntent.client_secret })
    // })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Database Connected");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
