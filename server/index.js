const express = require("express");
const bodyParser = require('body-parser');

require("./database/init");

// Create express app
const app = express();

// Server port
const HTTP_PORT = 8000;
// Start server
app.listen(HTTP_PORT, () => {
  console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});

app.use(bodyParser.json());
app.use(express.static('public'));

require("./api/index");