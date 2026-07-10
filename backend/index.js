const express = require('express');
const app = express();
const port = process.env.PORT || 4001;

app.get('/', (req, res) => res.send('College Emmanuel API - OK'));

app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`));
