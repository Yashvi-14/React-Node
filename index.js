const express = require('express');
const bodyParser = require('body-parser');
const dbapi = require('./routes/dbconnection')
const app = express();
const cors = require('cors');

const PORT = 8002
app.use(cors());
// app.use(cors(corsOptionsDelegate))
// var corsOptionsDelegate = function (req, callback) {
//   let whitelistArr=["*","http://localhost:3000"]
//   var corsOptions;
//   if(whitelistArr && whitelistArr.length>0){
//     if (!req.header('Origin') && req.header('Sec-Fetch-Site') === 'same-origin') {
//       corsOptions = { origin: true }
//       callback(null, corsOptions)
//     }
//     else {
//       if (!req.header('Origin')||whitelistArr.indexOf(req.header('Origin')) !== -1) {
//         corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
//         callback(null, corsOptions)
//       } else {
//         corsOptions = { origin: false }
//         callback('Not allowed by CORS')
//         // disable CORS for this request
//       }
//     }
//   }
//   else{
//     corsOptions = { origin: true };
//     callback(null, corsOptions);
//   }
// }
// app.use(function (req, res, next) {
//   res.header("X-XSS-Protection", "1; mode:blocked")
//   //Enabling CORS
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization, authorization"
//   );
//   next();
// });
app.use(bodyParser.json());

app.use('/',dbapi)

app.listen(PORT,()=>
{console.log(`App listening on port  ${PORT}`)
});