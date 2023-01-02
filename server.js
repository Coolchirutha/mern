import express from 'express';

const app = express();

app.get('/', (req, res) => res.send('Hello'));

const port = process?.ENV?.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));