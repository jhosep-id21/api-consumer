const express = require('express');
const router = express.Router();
const puntos = require('../data/puntosTuristicos');

router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const ciudadId = req.query.ciudadId ? Number(req.query.ciudadId) : null;
  const tipo = req.query.tipo ? req.query.tipo.toLowerCase() : '';

  let filtrados = puntos;
  if (ciudadId) filtrados = filtrados.filter(p => p.ciudadId === ciudadId);
  if (tipo)     filtrados = filtrados.filter(p => p.tipo.toLowerCase().includes(tipo));

  const totalItems = filtrados.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const items = filtrados.slice(startIndex, startIndex + limit);

  const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
  const buildUrl = (p) => `${baseUrl}?page=${p}&limit=${limit}${ciudadId ? `&ciudadId=${ciudadId}` : ''}${tipo ? `&tipo=${tipo}` : ''}`;

  res.json({
    items,
    meta: { totalItems, itemCount: items.length, itemsPerPage: limit, totalPages, currentPage: page },
    links: {
      first: buildUrl(1),
      previous: page > 1 ? buildUrl(page - 1) : '',
      next: page < totalPages ? buildUrl(page + 1) : '',
      last: buildUrl(totalPages)
    }
  });
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const punto = puntos.find(p => p.id === id);
  if (!punto) return res.status(404).json({ error: 'Punto turístico no encontrado' });
  res.json(punto);
});

module.exports = router;