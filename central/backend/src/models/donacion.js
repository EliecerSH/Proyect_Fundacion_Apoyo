const mongoose = require('mongoose');

const donacionSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true, 
    trim: true 
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
  monto: { 
    type: Number, 
    required: true, 
    min: [1000, 'El monto mínimo es $1.000']
  },
  fechaDonacion: { 
    type: Date, 
    required: true,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Donacion', donacionSchema);