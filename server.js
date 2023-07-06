const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Serve the notes.html page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// Serve the index.html page for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Retrieve all notes
app.get('/api/notes', (req, res) => {
  fs.readFile('./db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error reading notes.' });
    }

    const notes = JSON.parse(data);
    res.json(notes);
  });
});

// Save a new note
app.post('/api/notes', (req, res) => {
  const newNote = req.body;

  fs.readFile('./db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error reading notes.' });
    }

    const notes = JSON.parse(data);

    // Assign a unique id to the new note
    newNote.id = Date.now();

    notes.push(newNote);

    fs.writeFile('./db.json', JSON.stringify(notes), (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error writing note.' });
      }

      res.json(newNote);
    });
  });
});

// Delete a note
app.delete('/api/notes/:id', (req, res) => {
  const noteId = parseInt(req.params.id);

  fs.readFile('./db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error reading notes.' });
    }

    const notes = JSON.parse(data);

    const index = notes.findIndex((note) => note.id === noteId);

    if (index === -1) {
      return res.status(404).json({ error: 'Note not found.' });
    }

    const deletedNote = notes.splice(index, 1)[0];

    fs.writeFile('./db.json', JSON.stringify(notes), (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error writing note.' });
      }

      res.json(deletedNote);
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
