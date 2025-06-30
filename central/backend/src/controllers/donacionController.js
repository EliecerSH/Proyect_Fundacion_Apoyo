const Donacion = require('../models/donacion');

// Crear una nueva donación
exports.crearDonacion = async (req, res) => {
  try {
    const nuevaDonacion = new Donacion(req.body);
    await nuevaDonacion.save();
    res.status(201).json(nuevaDonacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todas las donaciones con filtros opcionales
exports.obtenerDonaciones = async (req, res) => {
  try {
    const { nombre, fechaInicio, fechaFin } = req.query;
    let filtro = {};

    if (nombre) {
      filtro.nombre = { $regex: nombre, $options: 'i' };
    }

    if (fechaInicio || fechaFin) {
      filtro.fechaDonacion = {};
      if (fechaInicio) filtro.fechaDonacion.$gte = new Date(fechaInicio);
      if (fechaFin) filtro.fechaDonacion.$lte = new Date(fechaFin);
    }

    const donaciones = await Donacion.find(filtro).sort({ fechaDonacion: -1 });
    res.json(donaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener donaciones' });
  }
};

// Obtener estadísticas de donaciones
exports.obtenerEstadisticas = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    let matchStage = {};

    if (fechaInicio || fechaFin) {
      matchStage.fechaDonacion = {};
      if (fechaInicio) matchStage.fechaDonacion.$gte = new Date(fechaInicio);
      if (fechaFin) matchStage.fechaDonacion.$lte = new Date(fechaFin);
    }

    const estadisticas = await Donacion.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalDonaciones: { $sum: 1 },
          totalRecaudado: { $sum: "$monto" },
          promedioDonacion: { $avg: "$monto" }
        }
      }
    ]);

    const resultado = estadisticas[0] || {
      totalDonaciones: 0,
      totalRecaudado: 0,
      promedioDonacion: 0
    };

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};

// Obtener una donación específica
exports.obtenerDonacion = async (req, res) => {
  try {
    const donacion = await Donacion.findById(req.params.id);
    if (!donacion) {
      return res.status(404).json({ error: 'Donación no encontrada' });
    }
    res.json(donacion);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la donación' });
  }
};

// Actualizar una donación
exports.actualizarDonacion = async (req, res) => {
  try {
    const donacion = await Donacion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!donacion) {
      return res.status(404).json({ error: 'Donación no encontrada' });
    }
    res.json(donacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar una donación
exports.eliminarDonacion = async (req, res) => {
  try {
    const donacion = await Donacion.findByIdAndDelete(req.params.id);
    if (!donacion) {
      return res.status(404).json({ error: 'Donación no encontrada' });
    }
    res.json({ message: 'Donación eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la donación' });
  }
};

