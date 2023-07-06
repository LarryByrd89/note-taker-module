const express = require('express');
const fs = require('fs');
const path = require('path');

//HTML
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
  });
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });