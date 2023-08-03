const express = require('express');
const fs = require ('fs');
const path = require ('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error reading notes from the database.' });
      }
      const notes = JSON.parse(data);
      res.json(notes);
    });
  });

app.post('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error reading notes from the database.' });
      }
      const notes = JSON.parse(data);
      const newNote = {
        id: uuidv4(),
        title: req.body.title,
        text: req.body.text,
      };
      notes.push(newNote);
  
      fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error saving the note to the database.' });
        }
        res.json(newNote);
      });
    });
  });

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
  });
  
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

// New route for deleting a note based on the provided id
app.delete('/api/notes/:id', (req, res) => {
    const noteIdToDelete = req.params.id;
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error reading notes from the database.' });
      }
      const notes = JSON.parse(data);
      const updatedNotes = notes.filter((note) => note.id !== noteIdToDelete);
  
      fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(updatedNotes), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error deleting the note from the database.' });
        }
        res.json({ message: 'Note deleted successfully.' });
      });
    });
  });

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
