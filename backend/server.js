import express, { json } from 'express';
import ordersRouter from './src/routes/orders.js';
import cors from 'cors';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

app.use(json());
app.use(cors());

//app.use(express.static(path.join(__dirname, 'build')));

// app.get('/*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

app.use('/api', ordersRouter);

app.listen(port, () => {
  console.log(`Server běží na portu ${port}`);
});
