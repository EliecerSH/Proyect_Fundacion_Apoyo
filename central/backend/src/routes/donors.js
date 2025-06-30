const express = require('express');
const router = express.Router();
const Donor = require('../models/donor');

// Registrar nuevo donante
router.post('/', async (req, res) => {
  try {
    const donor = new Donor(req.body);
    await donor.save();
    res.status(201).json({ 
      success: true, 
      data: donor,
      message: 'Donación registrada exitosamente' 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Obtener todos los donantes
router.get('/', async (req, res) => {
  try {
    const donors = await Donor.find().sort({ fechaDonacion: -1 });
    res.json({ 
      success: true, 
      data: donors 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener donantes' 
    });
  }
});

// Obtener estadísticas
router.get('/estadisticas', async (req, res) => {
  try {
    const totalDonantes = await Donor.countDocuments();
    const totalRecaudado = await Donor.aggregate([
      { $group: { _id: null, total: { $sum: "$monto" } } }
    ]);
    
    res.json({
      success: true,
      data: {
        totalDonantes,
        totalRecaudado: totalRecaudado[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener estadísticas' 
    });
  }
});

// GET /api/donors/search
router.get('/search', async (req, res) => {
  try {
    const term = req.query.term;
    const donors = await Donor.find({
      $or: [
        { nombre: { $regex: term, $options: 'i' } },
        { rut: term.replace(/[.-]/g, '') } // Busca RUT sin formato
      ]
    });
    res.json(donors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/donors/:id
router.delete('/:id', async (req, res) => {
  try {
    await Donor.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/donors/:id
router.put('/:id', async (req, res) => {
  try {
    // No permitir cambiar el RUT
    if (req.body.rut) {
      delete req.body.rut;
    }
    
    const updatedDonor = await Donor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedDonor) {
      return res.status(404).json({ error: 'Donante no encontrado' });
    }
    
    res.json(updatedDonor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;
