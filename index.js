const express = require('express');
const mssql = require('mssql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const config = {
    user: 'sa',
    password: 'Fyc012301',
    server: 'DESKTOP-24T3BNJ',
    database: 'contactos',
    options: {
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true
    }
};

mssql.connect(config, err => {
    if (err) {
        console.error('Error de conexión:', err);
    } else {
        console.log('Conectado a la base de datos');
    }
});

app.post('/guardar-contacto', async (req, res) => {
    try {
        console.log('Datos recibidos:', req.body);
        const pool = await mssql.connect(config);

        const { nombre, email, telefono, mensaje } = req.body;

        const query = `INSERT INTO Contactos (nombre, email, telefono, mensaje) VALUES (@nombre, @email, @telefono, @mensaje)`;

        const result = await pool.request()
            .input('nombre', mssql.NVarChar, nombre)
            .input('email', mssql.NVarChar, email)
            .input('telefono', mssql.NVarChar, telefono)
            .input('mensaje', mssql.NVarChar, mensaje)
            .query(query);

        if (result.rowsAffected.length > 0) {
            // Enviamos una respuesta de éxito al cliente
            res.send('<h1>¡Mensaje enviado exitosamente!</h1>');
        } else {
            res.status(500).send('<h1>No se pudo guardar los datos en la base de datos.</h1>');
        }
    } catch (error) {
        console.error('Error al guardar los datos:', error);
        res.status(500).send('<h1>Ocurrió un error al intentar guardar los datos en la base de datos.</h1>');
    }
});

// Ruta para servir el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
    console.log(`Servidor Node.js corriendo en http://localhost:${port}`);
});
