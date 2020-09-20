const express = require('express');
const mysql = require('mysql');
const app = express();

app.use(express.json());
app.use(logger);

function logger (req, res, next) {
    console.log('request fired ' + req.url + ' ' + req.method);
    next();
}

let mysqlCon = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mySQLpassword",
    database: "sql_music_service",
    multipleStatements: true
  });

mysqlCon.connect(err => {
    if (err) throw err;
    console.log("Connected!");
});

app.get('/', (req, res) => {
res.send("Hello World!")
});

app.get('/top_songs', (req, res) => {
  mysqlCon.query(`SELECT songs.id, songs.title, songs.length, artists.name AS artist,albums.name AS album, songs.track_number, songs.lyrics, songs.youtube_link, songs.created_at, songs.upload_at
  FROM sql_music_service.songs
  LEFT JOIN artists
  ON songs.artist=artists.id
  LEFT JOIN albums
  ON songs.album=albums.id
  LIMIT 20;`, (error, results, fields) => {
      if (error) {
          res.send(err.message);
          throw error;
      };
      res.send(results);
    });
});

app.listen(3001);