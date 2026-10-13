const express = require('express');
const router = express.Router();
const ciudades = require('../data/ciudades');

// GET /api/ciudades  -> lista paginada con búsqueda opcional
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const nombre = req.query.nombre ? req.query.nombre.toLowerCase() : '';
  const pais = req.query.pais ? req.query.pais.toLowerCase() : '';

  // Filtros
  let filtrados = ciudades;
  if (nombre) filtrados = filtrados.filter(c => c.nombre.toLowerCase().includes(nombre));
  if (pais)   filtrados = filtrados.filter(c => c.pais.toLowerCase().includes(pais));

  // Paginación
  const totalItems = filtrados.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const items = filtrados.slice(startIndex, startIndex + limit);

  // Links de navegación
  const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
  const buildUrl = (p) => `${baseUrl}?page=${p}&limit=${limit}${nombre ? `&nombre=${nombre}` : ''}${pais ? `&pais=${pais}` : ''}`;

  res.json({
    items,
    meta: {
      totalItems,
      itemCount: items.length,
      itemsPerPage: limit,
      totalPages,
      currentPage: page
    },
    links: {
      first: buildUrl(1),
      previous: page > 1 ? buildUrl(page - 1) : '',
      next: page < totalPages ? buildUrl(page + 1) : '',
      last: buildUrl(totalPages)
    }
  });
});

// GET /api/ciudades/:id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const ciudad = ciudades.find(c => c.id === id);
  if (!ciudad) return res.status(404).json({ error: 'Ciudad no encontrada' });
  res.json(ciudad);
});

module.exports = router;