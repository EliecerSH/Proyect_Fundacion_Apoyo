require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const donorRoutes = require('./routes/donors');
const donacionRoutes = require('./routes/donacions');

const app = express();

// Conexión a MongoDB
mongoose.connect(process.env.DB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => {
  console.error('❌ Error de MongoDB:', err);
  process.exit(1); // Salir si no hay conexión a DB
});

// Middlewares
app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => res.send('OK'));

// Rutas
app.use('/api/donors', donorRoutes);
app.use('/api/donaciones', donacionRoutes);

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(500).send('Algo salió mal!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend en http://localhost:${PORT}`);
});