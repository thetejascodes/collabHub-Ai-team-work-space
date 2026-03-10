import express from 'express';
import { hostname } from 'node:os';
// import app from './app.js'
const app = express();
const port = 5000;
app.get('/collabHub', (req, res) => {
    res.send("Backend is running");
    console.log(`Backend Is Running 🏃`);
});
app.listen(port, () => {
    console.log(`Server is started 🚀 on ${port}`);
});
//# sourceMappingURL=server.js.map