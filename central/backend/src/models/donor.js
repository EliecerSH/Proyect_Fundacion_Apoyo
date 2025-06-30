const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  rut: { 
    type: String, 
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        // Validación básica de RUT chileno
        return /^0*(\d{1,3}(\.?\d{3})*)-?([\dkK])$/.test(v);
      },
      message: props => `${props.value} no es un RUT válido`
    }
  },
  numeroCuenta: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{9,20}$/.test(v);
      },
      message: props => `${props.value} no es un número de cuenta válido`
    }
  },
  correo: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  monto: { 
    type: Number, 
    required: true, 
    min: [1000, 'El monto mínimo es $1.000']
  },
  fechaDonacion: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  frecuencia: { 
    type: String, 
    required: true,
    enum: ['mensual', 'trimestral', 'anual'],
    default: 'mensual'
  },
  verificada: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Donor', donorSchema);