const express = require('express');
const app = express();

app.get('/auth', (req, res) => {
    res.json({ message: 'Auth Service' });
});

app.listen(3000, () => {
    console.log('Auth service running on port 3000');
});
