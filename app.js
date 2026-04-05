const express = require('express');
const authMiddleware = require('./middlewares/authMiddleware'); 
const app = express();

app.use(express.json());

app.get('/api/secure', authMiddleware, (req, res) => {
    res.json({ 
        status: "Success", 
        message: "Siber Güvenlik Canavarı Bölgesi!",
        user: req.user ? req.user.id : "Beyzanur"
    });
});

app.listen(3000, () => {
    console.log("=========================================");
    console.log(">>> SESSİZ ÖLÜM SİSTEMİ ÇALIŞIYOR (3000)");
    console.log("=========================================");
});
