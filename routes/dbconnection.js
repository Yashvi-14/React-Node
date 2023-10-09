var config = require("../db/connection");
const sql = require("mssql"); 
var router = require('express').Router();
const jwt = require('jsonwebtoken');
const secretKey = "secretKey";
const express = require('express')
const app = express();
//code for white listing url's

// app.use(cors(
//   {
//   "Access-Control-Allow-Origin": '*', 
//   // methods: 'GET,PUT,POST,DELETE',
//   // credentials: true,
//   // allowedHeaders: 'X-Requested-With',
// }
// ));
// app.use(cors())
// app.all('*', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", 'http://localhost:3000');
//   // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
// app.use('*', function(req, res, next) {
//   let origin = req.headers.origin;
//   if(cors.origin.indexOf(origin) >= 0){
//       res.header("Access-Control-Allow-Origin", origin);
//   }         
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
// const corsOptions = {
//   origin: '*',
//   credentials: true,
//   optionSuccessStatus: 200
// }
// app.use(cors(corsOptions))
// app.options('*', cors());

router.get("/country",verifyToken, async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let result = await sql.query("SELECT * FROM Country");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error executing SQL query", err);
    res.status(500).json({ error: "Internal Server error" });
  }
});

router.get("/state",verifyToken, async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let result = await sql.query("SELECT * FROM State");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error executing SQL query", err);
    res.status(500).json({ error: "Internal Server error" });
  }
});


router.get("/country/:Id", async (req, res) => {
  const { Id } = req.params;
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("Id", sql.Int, Id)
      .query("SELECT * FROM Country where PKId = @Id");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error executing SQL query", err);
    res.status(500).json({ error: "Internal Server error" });
  }
});

router.post('/addCountry', async (req, res) => {
  try {
    let Data = req.body;
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input('CountryName', sql.NVarChar,Data.CountryName)
      .input('IsActive', sql.Bit, Data.IsActive)
      .input('CreatedBy', sql.BigInt, Data.CreatedBy)
      .input('CreatedOn', sql.DateTime, Data.CreatedOn)
      .input('ModifiedBy', sql.BigInt, Data.ModifiedBy)
      .input('ModifiedOn', sql.DateTime, Data.ModifiedOn)
      .query(
      'INSERT INTO Country (CountryName, IsActive, CreatedBy, CreatedOn, ModifiedBy, ModifiedOn) VALUES (@CountryName, @IsActive, @CreatedBy, @CreatedOn, @ModifiedBy, @ModifiedOn); ')
    res.json(result.recordset);
  } catch (err) {
    console.error('Error executing SQL query:', err.message); // Log the SQL error message
    res.status(500).json({ error: 'Internal Server error' });
  }
});

router.delete("/country/:Id", async (req, res) => {
  const { Id } = req.params;
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("Id", sql.Int, Id)
      .query("DELETE FROM Country WHERE PKId = @Id");
      res.json({ message: "Record deleted successfully" });
  } catch (err) {
    console.error("Error executing SQL query", err);
    res.status(500).json({ error: "Internal Server error" });
  }
});

router.put("/country/:Id", async (req, res) => {
  const { Id } = req.params;
  const updateData = req.body
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("Id", sql.Int, Id)
      .input('CountryName', sql.NVarChar,updateData.CountryName)
      .input('IsActive', sql.Bit, updateData.IsActive)
      .input('CreatedBy', sql.BigInt, updateData.CreatedBy)
      .input('CreatedOn', sql.DateTime, updateData.CreatedOn)
      .input('ModifiedBy', sql.BigInt, updateData.ModifiedBy)
      .input('ModifiedOn', sql.DateTime, updateData.ModifiedOn)
      .query(
        "UPDATE Country SET CountryName = @CountryName, isActive = @isActive, ModifiedBy = @ModifiedBy, ModifiedOn = @ModifiedOn WHERE PKId = @Id"
      );
      // res.json(result.recordset);
      res.json({ message: "Record Updated successfully" });
  } catch (err) {
    console.error("Error executing SQL query", err);
    res.status(500).json({ error: "Internal Server error" });
  }
});
router.post("/login", (req, res) => {
  const user = {
      // id: 1,
      // username: "Yashvi",
      username: "yashvi@spec.com",
      password:"123456"
  };
  jwt.sign({ user }, secretKey, (err, token) => {
      res.json({
          token
      });
  });
});

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
      
  if (!token) {
    return res.status(403).json({ message: 'Token not provided' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.userId = decoded.userId;
    next();
  });

}
module.exports = router;
