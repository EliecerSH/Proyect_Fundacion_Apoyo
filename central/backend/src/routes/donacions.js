const express = require('express');
const router = express.Router();
const donacionController = require('../controllers/donacionController');

// Ruta para crear una nueva donación
router.post('/', donacionController.crearDonacion);

// Ruta para obtener todas las donaciones (con filtros opcionales)
router.get('/', donacionController.obtenerDonaciones);

// Ruta para obtener estadísticas de donaciones
router.get('/estadisticas', donacionController.obtenerEstadisticas);

// Ruta para obtener una donación específica por ID
router.get('/:id', donacionController.obtenerDonacion);

// Ruta para actualizar una donación
router.put('/:id', donacionController.actualizarDonacion);

// Ruta para eliminar una donación
router.delete('/:id', donacionController.eliminarDonacion);

module.exports = router;