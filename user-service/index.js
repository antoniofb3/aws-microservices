const express = require('express');
const app = express();

app.get('/users', (req, res) => {
    res.json([{ id: 1, name: 'User A' }, { id: 2, name: 'User B' }]);
});

app.listen(3002, () => {
    console.log('User service running on port 3002');
});
