const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');

const app = express();

// Conectar ao banco de dados MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.error(err));

/* * Segurança e Otimização
   * Configura Helmet para permitir CDNs específicos  
*/
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net",
          "https://code.jquery.com",
          "https://cdn.datatables.net",
        ],
        "style-src": [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
          "https://cdn.datatables.net",
        ],
        "font-src": [
          "'self'",     
          "data:",
          "https://fonts.gstatic.com",
          "https://cdnjs.cloudflare.com",
        ],
        "img-src": [
          "'self'",        
          "data:",
          "https://cdn.jsdelivr.net",
          "https://res.cloudinary.com",
        ],
        "connect-src": ["'self'", "https://fonts.googleapis.com"],
        "frame-src": ["'none'"],
      },
    },
  })
); // Protege contra vulnerabilidades comuns
app.use(mongoSanitize());
app.use(compression());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS || '*' })); // Permite apenas domínios autorizados

// Limite de requisições
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
});
app.use(limiter);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Cache-Control e ETag
app.use((req, res, next) => {
    res.setHeader('Cache-Control', '../public, max-age=3600'); // Cache por 1 hora
    next();
});

// Routas
app.use('/', async (req, res, next) => {
    const route = await import('../routes/index.js');
    route.default(req, res, next);
});

app.use('/admin', async (req, res, next) => {
    const route = await import('../routes/admin.js');
    route.default(req, res, next);
});

app.use('/api', async (req, res, next) => {
    const route = await import('../routes/api.js');
    route.default(req, res, next);
});

module.exports = app;
