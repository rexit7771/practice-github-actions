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

// Hanya jalankan server jika file ini dijalankan secara langsung (bukan diimpor)
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server berjalan di http://localhost:${port}`);
    });
}

module.exports = app;