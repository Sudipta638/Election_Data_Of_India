
  let mysql = require('mysql');

let connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password:'sudipta@638',
  database: 'project',
});

connection.connect((err) => {
  if (err) return console.error(err.message);

  console.log('Connected to the MySQL server.');
});
// connection.query('SELECT * FROM national_elections ', (err,rows) => {
//   if(err) throw err;

//   console.log('Data received from Db:');
//   console.log(rows);
// });
const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());

// app.get('/api/national_elections', (req, res) => {
//     connection.query('SELECT * FROM national_elections', (err, rows) => {
//       if (err) {
//         console.error(err.message);
//         res.status(500).send(err);
//       } else {
//         res.status(200).json(rows);
//       }
//     });
//   });
  connection.query('SELECT COUNT(CASE WHEN pc_type = "GEN" THEN 1 END) AS general,COUNT(CASE WHEN pc_type = "SC" THEN 1 END) AS sc, COUNT(CASE WHEN pc_type = "ST" THEN 1 END) AS st FROM national_elections WHERE st_name = "Bihar" AND year = 1999 ', (err, results) => {
    if (err) throw err;
    console.log(results);
    console.log('Data received from Db:');
  });
  app.get('/api/sc_candidates', (req, res) => {
    connection.query('SELECT COUNT(*) FROM  national_elections WHERE pc_type = "SC"', (err, results) => {
      if (err) {
        console.error(err.message);
        res.status(500).send(err);
      } else {
        res.status(200).json(results[0]['COUNT(*)']);
      }
    });
  });



  //Total number of gen/sc/st candidate from a state:
 
 
  app.get('/api/candidates_count/:state/:year', (req, res) => {
    connection.query('SELECT pc_type, COUNT(*) as count FROM national_elections WHERE st_name = ? AND Year = ? AND pc_type IN ("GEN", "SC", "ST") GROUP BY pc_type', [req.params.state, req.params.year], (err, results) => {
      if (err) {
        console.error(err.message);
        res.status(500).send(err);
      } else {
        res.status(200).json(results);
      }
    });
  });


  //JSON object  Returns
//   [
//     {
//         "pc_type": "SC",
//         "count": 49
//     },
//     {
//         "pc_type": "GEN",
//         "count": 459
//     },
//     {
//         "pc_type": "ST",
//         "count": 18
//     }
// ]


//Candidate details by name:

app.get('/api/candidate/:name', (req, res) => {
  connection.query('SELECT * FROM national_elections WHERE cand_name= ?', [req.params.name], (err, results) => {
    if (err) {
      console.error(err.message);
      res.status(500).send(err);
    } else {
      res.status(200).json(results);
    }
  });
});

//JSON object  Returns
// /[
//   {
//       "st_name": "Andhra Pradesh",
//       "Year": 1980,
//       "pc_no": 6,
//       "pc_name": "Anakapalli",
//       "pc_type": "GEN",
//       "cand_name": "Salla Chinthalli",
//       "cand_sex": "F",
//       "partyname": "Independents",
//       "partyabbre": "IND",
//       "totvotpoll": 5751,
//       "electors": 702428
//   }
// ]



app.get('/api/votes/:year', (req, res) => {
  connection.query('SELECT partyname, SUM(totvotpoll) as totvotpoll FROM national_elections WHERE Year = ? GROUP BY partyname', [req.params.year], (err, results) => {
    if (err) {
      console.error(err.message);
      res.status(500).send(err);
    } else {
      res.status(200).json(results);
    }
  }); 
  
});
 




app.get('/api/votesforState/:state', (req, res) => {
  connection.query('SELECT partyname, SUM(totvotpoll) as totvotpoll FROM national_elections WHERE st_name = ? GROUP BY partyname', [req.params.state], (err, results) => {
    if (err) {
      console.error(err.message);
      res.status(500).send(err);
    } else {
      res.status(200).json(results);
    }
  });
});

app.get('/api/votes', (req, res) => {
  connection.query('SELECT partyname, SUM(totvotpoll) as totvotpoll FROM national_elections GROUP BY partyname', (err, results) => {
    if (err) {
      console.error(err.message);
      res.status(500).send(err);
    } else {
      res.status(200).json(results);
    }
  });
});


app.get('/api/nameofStates', (req, res) => {
  connection.query('SELECT DISTINCT st_name FROM national_elections', (err, results) => {
    if (err) {
      console.error(err.message);
      res.status(500).send(err);
    } else {
      const stateNames = results.map(result => result.st_name);
      res.status(200).json(stateNames);
      console.log(stateNames);
    }
  });
});

app.get('/api/candidates/:state/:year', (req, res) => { 
  connection.query('SELECT COUNT(CASE WHEN pc_type = "GEN" THEN 1 END) AS general,COUNT(CASE WHEN pc_type = "SC" THEN 1 END) AS sc, COUNT(CASE WHEN pc_type = "ST" THEN 1 END) AS st FROM national_elections WHERE st_name = ? AND year = ?', [req.params.state, req.params.year], (err, results) => {
    if (err) {
      console.error(err.message);
      res.status(500).send(err);
    } else {
      console.log(results);
      res.status(200).json(results);
    }
  });
  
});



connection.query('SELECT COUNT(CASE WHEN pc_type = "GEN" THEN 1 END) AS general,COUNT(CASE WHEN pc_type = "SC" THEN 1 END) AS sc, COUNT(CASE WHEN pc_type = "ST" THEN 1 END) AS st FROM national_elections WHERE st_name = "Bihar" AND year = 1999 ', (err, results) => {
  if (err) throw err;
  console.log(results);
  console.log('Data received from Db:');
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});