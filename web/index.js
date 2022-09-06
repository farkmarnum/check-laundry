const express = require('express');

const app = express();

const { API_KEY } = process.env;

app.get('/', (req, res) => {
  // TODO: serve frontend
})

app.post('/api/v1/status', (req, res) => {
  // check header for API key

  // Update storage
})
