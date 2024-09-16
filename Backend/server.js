const express = require('express');
const app = express();

// Set up a basic route
app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

// Define the port (default to 5000)
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
