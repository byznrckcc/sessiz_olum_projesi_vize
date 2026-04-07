const express = require('express');
// KRİTİK DÜZELTME: Yol './middleware/authMiddleware' olarak güncellendi (Klasör yapısına uygun)
const authMiddleware = require('./middleware/authMiddleware'); 
const app = express();

// Middleware: Gelen JSON verilerini işlemek için standart Express parser
app.use(express.json());
app.use(express.static('public'));

/**
 * @route   GET /api/secure
 * @desc    Güvenli bölge erişimi. Sadece geçerli tokenı olanlar girebilir.
 * @access  Private (Redis tabanlı IPS korumalı)
 */
app.get('/api/secure', authMiddleware, (req, res) => {
    res.json({ 
        status: "Success", 
        message: "Siber Güvenlik Canavarı Bölgesi!",
        // Forensic analizi için kullanıcı kimliği veya varsayılan kimlik döndürülür
        user: req.user ? req.user.id : "Beyzanur"
    });
});

// Sunucu Başlatma Katmanı
const PORT = 3000;
app.listen(PORT, () => {
    console.log("=========================================");
    console.log(`>>> SESSİZ ÖLÜM SİSTEMİ AKTİF (PORT: ${PORT})`);
    console.log(">>> DURUM: GÜVENLİ & REDIS BAĞLANTISI HAZIR");
    console.log("=========================================");
});
