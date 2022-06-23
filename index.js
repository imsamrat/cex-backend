const express = require("express");
const app = express();
const cors = require("cors");
const BodyParser = require("body-parser");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectID = require("mongodb").ObjectID;
const port = process.env.PORT || 5000;

app.use(cors());
// app.use(BodyParser.json());
app.use(BodyParser.json({ limit: "50mb" }));
app.use(
  BodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

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
    // const enablersCollection = database.collection("attendance");
    const adjustmentCollection = database.collection("adjustment");
    // const auditCollection = database.collection("callAudit");
    const roleCollection = database.collection("role");
    const employeeCollection = database.collection("employee");
    const attendanceCollection = database.collection("attendance");
    const performanceCollection = database.collection("performance");
    const dayWiseReportCollection = database.collection("dayWisePerformance");
    const lagCollection = database.collection("lag");
    const auditCollection = database.collection("audit");
    const reportCollections = database.collection("report");
    const rtcCollections = database.collection("rtc");
    const outboundCollections = database.collection("OBReport");
    const rosterCollections = database.collection("roster");
    const statusCollections = database.collection("status");
    const dgPerformanceCollections = database.collection("dgPerformance");
    // const dgAttendanceCollections = database.collection("dgAttendance");
    // const dgAdjustmentCollections = database.collection("dgAdjustment");
    // const dgAuditCollections = database.collection("dgAudit");
    const dgDayWiseCollections = database.collection("dgDayWiseReport");

    //Digital Performance API
    app.get("/performanceReportDgTl", (req, res) => {
      const tlEmail = req.query.tlEmail;
      const query = { tlEmail: tlEmail };
      dgPerformanceCollections.find(query).toArray((err, items) => {
        res.send(items);
      });
    });
    app.get("/performanceReportDgAgent", (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      dgPerformanceCollections.find(query).toArray((err, items) => {
        res.send(items);
      });
    });
    app.get("/dgPerformanceReportDetails", (req, res) => {
      dgPerformanceCollections.find().toArray((err, items) => {
        res.send(items);
      });
    });

    app.post("/addDgPerformanceReport", (req, res) => {
      const newDgPerformanceReport = req.body;
      console.log("Adding New Day Wise Report", newDgPerformanceReport);
      dgPerformanceCollections.insert(newDgPerformanceReport).then((result) => {
        console.log("inserted Count", result.insertedCount);
        res.send(result.insertedCount > 0);
      });
    });
    //Drop Performance Collection
    app.delete("/deleteDgPerformanceReport", (req, res) => {
      const deleteDgPerformanceReport = req.body;
      dgPerformanceCollections.drop(deleteDgPerformanceReport).then((result) => {
        console.log("deleted Count", result.deletedCount);
        res.send(result.deletedCount > 0);
      });
    });

    //Day Wise Digital Performance API
    app.get("/dgDayWiseReportTL", (req, res) => {
      const tlEmail = req.query.tlEmail;
      const query = { tlEmail: tlEmail };
      dgDayWiseCollections.find(query).toArray((err, items) => {
        res.send(items);
      });
    });
    app.get("/dgDayWiseReportForAgent", (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      dgDayWiseCollections.find(query).toArray((err, items) => {
        res.send(items);
      });
    });
    //Digital Day wise Report
    app.get("/dgDayWiseReportDetails", (req, res) => {
      dgDayWiseCollections.find().toArray((err, items) => {
        res.send(items);
      });
    });

    app.post("/addDgDayWiseReport", (req, res) => {
      const newDgDayWiseReport = req.body;
      console.log("Adding New Day Wise Report", newDgDayWiseReport);
      dgDayWiseCollections.insert(newDgDayWiseReport).then((result) => {
        console.log("inserted Count", result.insertedCount);
        res.send(result.insertedCount > 0);
      });
    });
    //Drop Audit Collection
    app.delete("/deleteDgDayWiseReport", (req, res) => {
      const deleteDgReport = req.body;
      dgDayWiseCollections.drop(deleteDgReport).then((result) => {
        console.log("deleted Count", result.deletedCount);
        res.send(result.deletedCount > 0);
      });
    });
    

    //Report API
    app.get("/reportDetails", (req, res) => {
      reportCollections.find().toArray((err, items) => {
        res.send(items);
      });
    });
    app.post("/addReport", (req, res) => {
      const newReport = req.body;
      console.log("Adding New Performance", newReport);
      reportCollections.insert(newReport).then((result) => {
        console.log("inserted Count", result.insertedCount);
        res.send(result.insertedCount > 0);
      });
    });

    //Delete Information
    app.delete("/deleteInfo/:id", (req, res) => {
      console.log(req.params.id);
      reportCollections
        .deleteOne({ _id: ObjectID(req.params.id) })
        .then((result) => {
          res.send(result.deletedCount > 0);
        });
    });

    //Roster API
    app.get("/rosterDetails", (req, res) => {
      rosterCollections.find().toArray((err, items) => {
        res.send(items);
      });
    });
    app.post("/addRoster", (req, res) => {
      const newRoster = req.body;
      console.log("Adding New Performance", newRoster);
      rosterCollections.insert(newRoster).then((result) => {
        console.log("inserted Count", result.insertedCount);
        res.send(result.insertedCount > 0);
      });
    });
    app.post("/addUpdateRoster", (req, res) => {
      rosterCollections
        .insertOne(req.body)
        .then((result) => res.send(!!result.insertedCount));
    });

    //Delete Information
    app.delete("/deleteRoster/:id", (req, res) => {
      console.log(req.params.id);
      rosterCollections
        .deleteOne({ _id: ObjectID(req.params.id) })
        .then((result) => {
          res.send(result.deletedCount > 0);
        });
    });

    app.patch("/updateRoster/:id", (req, res) => {
      rosterCollections
        .updateOne(
          { _id: ObjectID(req.params.id) },
          {
            $set: req.body,
          }
        )
        .then((result) => res.send(!!result.modifiedCount));
    });

    //OB Report API
    app.get("/ObReportDetails", (req, res) => {
      outboundCollections.find().toArray((err, items) => {
        res.send(items);
      });
    });
    app.post("/addObReport", (req, res) => {
      const newObReport = req.body;
      console.log("Adding New OB Report", newObReport);
      outboundCollections.insert(newObReport).then((result) => {
        console.log("inserted Count", result.insertedCount);
        res.send(result.insertedCount > 0);
      });
    });
    //RTC API
    app.get("/rtcDetails", (req, res) => {
      rtcCollections.find().toArray((err, items) => {
        res.send(items);
      });
    });
    app.post("/addRtc", (req, res) => {
      const newRtc = req.body;
      console.log("Adding New RTC", newRtc);
      rtcCollections.insert(newRtc).then((result) => {
        console.log("inserted Count", result.insertedCount);
        res.send(result.insertedCount > 0);
      });
    });
    //Day Wise Performance API
    app.get("/dayWiseReportForTL", (req, res) => {
      const tlEmail = req.query.tlEmail;
      const query = { tlEmail: tlEmail };
      dayWiseReportCollection.find(query).toArray((err, items) => {
        res.send(items);
      });
    });
    app.get("/dayWiseReportForAgent", (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      dayWiseReportCollection.find(query).toArray((err, items) => {
        res.send(items);
      });
    });
    app.get("/dayWiseReportDetails", (req, res) => {
      dayWiseReportCollection.find().toArray((err, items) => {
        res.send(items);
      });
    });

    app.post("/addDayWiseReport", (req, res) => {
      const newDayWiseReport = req.body;
      console.log("Adding New Day Wise Report", newDayWiseReport);
      dayWiseReportCollection.insert(newDayWiseReport).then((result) => {
        console.log("inserted Count", result.insertedCount);
        res.send(result.insertedCount > 0);
      });
    });
    //Drop Audit Collection
    app.delete("/deleteDayWiseReport", (req, res) => {
      const deleteReport = req.body;
      dayWiseReportCollection.drop(deleteReport).then((result) => {
        console.log("deleted Count", result.deletedCount);
        res.send(result.deletedCount > 0);
      });
    });
    //Performance API
    //For TL
    app.get("/performanceReport", (req, res) => {
      const tlEmail = req.query.tlEmail;
      const query = { tlEmail: tlEmail };
      performanceCollection.find(query).toArray((err, items) => {
        res.send(items);
      });
    });
    app.get("/performance", (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      performanceCollection.find(query).toArray((err, items) => {
        res.send(items);
      });
    });
    app.get("/performanceDetails", (req, res) => {
      performanceCollection.find().toArray((err, items) => {
        res.send(items);
      });
    });

    app.post("/addPerformance", (req, res) => {
      const newPerformance = req.body;
      console.log("Adding New Performance", newPerformance);
      performanceCollection.insert(newPerformance).then((result) => {
        console.log("inserted Count", result.insertedCount);
        res.send(result.insertedCount > 0);
      });
    });
    //Drop Performance Collection
    app.delete("/deletePerformance", (req, res) => {
      const deletePerformance = req.body;
      performanceCollection.drop(deletePerformance).then((result) => {
        console.log("deleted Count", result.deletedCount);
        res.send(result.deletedCount > 0);
      });
    });
    //Adjustment API
    app.get("/adjustmentReport", (req, res) => {
      const tlEmail = req.query.tlEmail;
      const query = { tlEmail: tlEmail };
      adjustmentCollection.find(query).toArray((err, items) => {
        res.send(items);
      });
    });
    app.get("/adjustment", (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      adjustmentCollection.find(query).toArray((err, items) => {
        res.send(items);
      });
    });
    app.get("/adjustmentDetails", (req, res) => {
      adjustmentCollection.find().toArray((err, items) => {
        res.send(items);
      });
    });

    app.post("/addAdjustment", (req, res) => {
      const newAdjustment = req.body;
      console.log("Adding New Adjustment", newAdjustment);
      adjustmentCollection.insert(newAdjustment).then((result) => {
        console.log("inserted Count", result.insertedCount);
        res.send(result.insertedCount > 0);
      });
    });
    //Drop Adjustment Collection
    app.delete("/deleteAdjustment", (req, res) => {
      const deleteAdjustment = req.body;
      adjustmentCollection.drop(deleteAdjustment).then((result) => {
        console.log("deleted Count", result.deletedCount);
        res.send(result.deletedCount > 0);
      });
    });
    //Lag Consideration API
    app.get("/lagReport", (req, res) => {
      const tlEmail = req.query.tlEmail;
      const query = { tlEmail: tlEmail };
      lagCollection.find(query).toArray((err, items) => {
        res.send(items);
      });
    });
    app.get("/lagConsideration", (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      lagCollection.find(query).toArray((err, items) => {
        res.send(items);
      });
    });
    app.get("/lagDetails", (req, res) => {
      lagCollection.find().toArray((err, items) => {
        res.send(items);
      });
    });

    app.post("/addLag", (req, res) => {
      const newLag = req.body;
      console.log("Adding New Lag", newLag);
      lagCollection.insert(newLag).then((result) => {
        console.log("inserted Count", result.insertedCount);
        res.send(result.insertedCount > 0);
      });
    });
    //QA Report API
    app.get("/auditReport", (req, res) => {
      const tlEmail = req.query.tlEmail;
      const query = { tlEmail: tlEmail };
      auditCollection.find(query).toArray((err, items) => {
        res.send(items);
      });
    });
    app.get("/audit", (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      auditCollection.find(query).toArray((err, items) => {
        res.send(items);
      });
    });
    app.get("/auditDetails", (req, res) => {
      auditCollection.find().toArray((err, items) => {
        res.send(items);
      });
    });

    app.post("/addAudit", (req, res) => {
      const newAudit = req.body;
      console.log("Adding New Audit", newAudit);
      auditCollection.insert(newAudit).then((result) => {
        console.log("inserted Count", result.insertedCount);
        res.send(result.insertedCount > 0);
      });
    });
    //Drop Audit Collection
    app.delete("/deleteAudit", (req, res) => {
      const deleteAudit = req.body;
      auditCollection.drop(deleteAudit).then((result) => {
        console.log("deleted Count", result.deletedCount);
        res.send(result.deletedCount > 0);
      });
    });
    //EmployeeCollection API

    app.get("/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await employeeCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    app.get("/teamLeader/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await employeeCollection.findOne(query);
      let isTeamLeader = false;
      if (user?.role === "teamLeader") {
        isTeamLeader = true;
      }
      res.json({ teamLeader: isTeamLeader });
    });
    app.get("/digitalLeader/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await employeeCollection.findOne(query);
      let isDigitalLeader = false;
      if (user?.role === "digitalLeader") {
        isDigitalLeader = true;
      }
      res.json({ digitalLeader: isDigitalLeader });
    });

    app.get("/preAdmin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await employeeCollection.findOne(query);
      let isPreAdmin = false;
      if (user?.role === "preAdmin") {
        isPreAdmin = true;
      }
      res.json({ preAdmin: isPreAdmin });
    });

    app.get("/lob/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await employeeCollection.findOne(query);
      let isDigital = false;
      if (user?.role === "digital") {
        isDigital = true;
      }
      res.json({ digital: isDigital });
    });

    app.get("/voiceLob/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await employeeCollection.findOne(query);
      let isVoiceAgent = false;
      if (user?.role === "voiceAgent") {
        isVoiceAgent = true;
      }
      res.json({ voiceAgent: isVoiceAgent });
    });

    app.get("/employee", (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      employeeCollection.find(query).toArray((err, items) => {
        res.send(items);
      });
    });

    app.get("/employeeList", (req, res) => {
      employeeCollection.find().toArray((err, items) => {
        res.send(items);
      });
    });
    app.post("/addEmployee", (req, res) => {
      const newEmployee = req.body;
      // console.log("Adding New Employee", newEmployee);
      employeeCollection.insert(newEmployee).then((result) => {
        // console.log("inserted Count", result.insertedCount);
        res.send(result.insertedCount > 0);
      });
    });
    app.delete("/deleteEmployeeList", (req, res) => {
      const deleteEmployee = req.body;
      employeeCollection.drop(deleteEmployee).then((result) => {
        console.log("deleted Count", result.deletedCount);
        res.send(result.deletedCount > 0);
      });
    });
    //Attendance API
    //For TL
    app.get("/attendanceReport", (req, res) => {
      const tlEmail = req.query.tlEmail;
      const query = { tlEmail: tlEmail };
      attendanceCollection.find(query).toArray((err, items) => {
        res.send(items);
      });
    });
    app.get("/attendance", (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      attendanceCollection.find(query).toArray((err, items) => {
        res.send(items);
      });
    });

    app.get("/attendanceList", (req, res) => {
      attendanceCollection.find().toArray((err, items) => {
        res.send(items);
      });
    });
    app.post("/addAttendance", (req, res) => {
      const newAttendance = req.body;
      // console.log("Adding New Employee", newAttendance);
      attendanceCollection.insert(newAttendance).then((result) => {
        // console.log("inserted Count", result.insertedCount);
        res.send(result.insertedCount > 0);
      });
    });

    //Drop Attendance Collection
    app.delete("/deleteAttendance", (req, res) => {
      const deleteAttendance = req.body;
      attendanceCollection.drop(deleteAttendance).then((result) => {
        console.log("deleted Count", result.deletedCount);
        res.send(result.deletedCount > 0);
      });
    });

    //Status API
    app.get("/statusDetails", (req, res) => {
      statusCollections.find().toArray((err, items) => {
        res.send(items);
      });
    });
    app.post("/addStatus", (req, res) => {
      statusCollections
        .insertOne(req.body)
        .then((result) => res.send(!!result.insertedCount));
    });

    app.patch("/updateStatus/:id", (req, res) => {
      statusCollections
        .updateOne(
          { _id: ObjectID(req.params.id) },
          {
            $set: req.body,
          }
        )
        .then((result) => res.send(!!result.modifiedCount));
    });
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

    app.post("/AddAdjustment", (req, res) => {
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
    // // Enabler API
    // app.get("/attendance", (req, res) => {
    //   enablersCollection.find().toArray((err, items) => {
    //     res.send(items);
    //   });
    // });

    // app.get("/attendance/:id", (req, res) => {
    //   const id = ObjectID(req.params.id);
    //   enablersCollection.find(id).toArray((err, items) => {
    //     res.send(items[0]);
    //   });
    // });

    // app.post("/addAttendance", (req, res) => {
    //   const newAttendance = req.body;
    //   console.log("Adding New Attendance", newAttendance);
    //   enablersCollection.insertOne(newAttendance).then((result) => {
    //     console.log("inserted Count", result.insertedCount);
    //     res.send(result.insertedCount > 0);
    //   });
    // });
    // app.delete("/delete/:id", (req, res) => {
    //   const id = ObjectID(req.params.id);
    //   enablersCollection.deleteOne({ _id: id }).then((result) => {
    //     res.send(result.deletedCount > 0);
    //   });
    // });

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

    app.delete("/deleteRole", (req, res) => {
      const deleteRole = req.body;
      roleCollection.drop(deleteRole).then((result) => {
        console.log("deleted Count", result.deletedCount);
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
