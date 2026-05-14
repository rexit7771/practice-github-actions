const express = require('express');
const app = express();
const port = 3000;

// Endpoint untuk root URL ('/')
app.get('/', (req, res) => {
    res.send('Hello, World! Ini adalah API Express saya.');
});

// Endpoint contoh lain
app.get('/api/greeting', (req, res) => {
    res.json({ message: 'Halo dari API!' });
});

// Mulai server dan dengarkan di port yang ditentukan
app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});