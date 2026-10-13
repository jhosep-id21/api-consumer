const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middlewares ----------
app.use(cors());
app.use(express.json());

// Logger simple
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// ---------- Rutas ----------
app.use('/api/ciudades', require('./src/routes/ciudades.routes'));
app.use('/api/paises', require('./src/routes/paises.routes'));
app.use('/api/puntos-turisticos', require('./src/routes/puntosTuristicos.routes'));

// ---------- Ruta raíz ----------
app.get('/', (req, res) => {
  res.json({
    ok: true,
    mensaje: 'API de Ciudades funcionando',
    endpoints: [
      '/api/ciudades',
      '/api/paises',
      '/api/puntos-turisticos'
    ]
  });
});

// ---------- 404 genérico ----------
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ---------- Arranque ----------
app.listen(PORT, () => {
  console.log(`✅ API en http://localhost:${PORT}`);
});