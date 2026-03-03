// Main application entry point
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Routes will be imported here

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
