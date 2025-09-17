const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            error: 'Všechna pole jsou povinná'
        });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            error: 'Neplatný formát emailu'
        });
    }
    
    console.log('Nová zpráva z kontaktního formuláře:');
    console.log(`Jméno: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Zpráva: ${message}`);
    
    res.json({
        success: true,
        message: 'Zpráva byla úspěšně odeslána. Brzy se vám ozveme!'
    });
});

app.get('/api/services', (req, res) => {
    const services = [
        {
            id: 1,
            title: 'Webový vývoj',
            description: 'Moderní webové aplikace s nejnovějšími technologiemi',
            features: ['React.js', 'Node.js', 'MongoDB', 'REST API'],
            price: 'Od 50,000 CZK'
        },
        {
            id: 2,
            title: 'UI/UX Design',
            description: 'Krásné a funkční uživatelské rozhraní',
            features: ['Wireframing', 'Prototyping', 'User Testing', 'Responsive Design'],
            price: 'Od 30,000 CZK'
        },
        {
            id: 3,
            title: 'Backend řešení',
            description: 'Robustní serverové aplikace a databáze',
            features: ['API Development', 'Database Design', 'Cloud Hosting', 'Security'],
            price: 'Od 40,000 CZK'
        }
    ];
    
    res.json({
        success: true,
        data: services
    });
});

app.get('/api/stats', (req, res) => {
    const stats = {
        projectsCompleted: 150,
        happyClients: 120,
        yearsExperience: 8,
        teamMembers: 12
    };
    
    res.json({
        success: true,
        data: stats
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Stránka nebyla nalezena'
    });
});

app.use((err, req, res, next) => {
    console.error('Chyba serveru:', err.stack);
    res.status(500).json({
        success: false,
        error: 'Interní chyba serveru'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server běží na portu ${PORT}`);
    console.log(`📱 Web je dostupný na: http://localhost:${PORT}`);
    console.log(`🔧 Prostředí: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;