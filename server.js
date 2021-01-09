const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const app = express();

const PORT = process.env.PORT || 8080;

let db = require("./db/db.json")

app.use(express.static("public"))

app.use(express.urlencoded({extended: true}))
app.use(express.json())


app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"))
})


// GET `/notes` - Should return the `notes.html` file.
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

//GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
app.get("/api/notes", function (req, res) {
     res.json(db)
})

// POST `/api/notes` - Should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
app.post("/api/notes", function (req, res) {
    req.body.id = uuidv4()
    var newNote = req.body;
    db.push(newNote);
    fs.writeFile("./db/db.json", JSON.stringify(db), function(err) {
      if (err) throw err
      res.json(db)
    } )
   
});

//  * DELETE `/api/notes/:id` - Should receive a query parameter containing the id of a note to delete. This means you'll need to find a way to give each note a unique `id` when it's saved. In order to delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.

app.delete("/api/notes/:id", function(req, res) {
  var id = req.params.id
  db = db.filter(function (note){
      return note.id != id 
  })
 
  fs.writeFile("./db/db.json", JSON.stringify(db), function (err) {
    if (err) throw err
    res.json(db)
  })
})


app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
  });