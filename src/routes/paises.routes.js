const express = require('express');
const router = express.Router();
const paises = require('../data/paises');

router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const nombre = req.query.nombre ? req.query.nombre.toLowerCase() : '';
  const continente = req.query.continente ? req.query.continente.toLowerCase() : '';

  let filtrados = paises;
  if (nombre)     filtrados = filtrados.filter(p => p.nombre.toLowerCase().includes(nombre));
  if (continente) filtrados = filtrados.filter(p => p.continente.toLowerCase().includes(continente));

  const totalItems = filtrados.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const items = filtrados.slice(startIndex, startIndex + limit);

  const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
  const buildUrl = (p) => `${baseUrl}?page=${p}&limit=${limit}${nombre ? `&nombre=${nombre}` : ''}${continente ? `&continente=${continente}` : ''}`;

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
  const pais = paises.find(p => p.id === id);
  if (!pais) return res.status(404).json({ error: 'País no encontrado' });
  res.json(pais);
});

module.exports = router;