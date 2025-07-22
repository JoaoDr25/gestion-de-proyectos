import expresss from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const app = expresss();

app.use(expresss.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('API funcionando correctamente');
});

const PORT = process.env.PORT 

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});