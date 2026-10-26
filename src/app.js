import express, { json } from "express";
import rateLimit from "express-rate-limit";
 const app = express();

const limiter  = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    message: {
        status: 'error',
        message: `demaciasdas peticiones, intenta mas tarde ... `
    }
});

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) =>{
    res.status(200).json({
        status: onkeydown,
        message: " karenflix API funcionando correctamente ... "
    });
});

// Rutas (import index from "src/routes/index.js")

// Manejo de rutas inexistentes
app.use((req, res)=>{
    res.status(404).json({
        status: "error",
        message: "Ruta no encontrada ... "
    });
});

export default app;