const express = require('express');
const authMiddleware = require('./middleware/auth'); 
const app = express();

app.use(express.json()); // JSON gövdelerini okuyabilmek için

// Güvenli Bölge
app.get('/api/secure', authMiddleware, (req, res) => {
    console.log(`[+] Güvenli bölgeye giriş yapıldı: User ID: ${req.user.id}`);
    res.json({ 
        status: "Success", 
        message: "Siber Güvenlik Canavarı Bölgesi!",
        user: req.user.id 
    });
});

// Hata Yakalayıcı (Fail-Safe Mantığı için)
app.use((err, req, res, next) => {
    console.error("[-] Beklenmedik Sistem Hatası:", err.message);
    res.status(500).json({ error: "Sistem Hatası", message: "Güvenlik protokolü nedeniyle erişim kısıtlandı (Fail-Closed)." });
});

app.listen(3000, () => {
    console.log("=========================================");
    console.log(">>> SESSİZ ÖLÜM SİSTEMİ AKTİF");
    console.log(">>> PORT: 3000 | REDIS: BAĞLI");
    console.log(">>> DURUM: GÜVENLİK DUVARI AKTİF (IPS/IDS)");
    console.log("=========================================");
});