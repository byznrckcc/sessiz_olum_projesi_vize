const jwt = require('jsonwebtoken');
const redis = require('redis');
require('dotenv').config();

const client = redis.createClient({
    url: 'redis://redis_db:6379'
});
client.connect().catch(() => console.log("Fail-Closed: Redis Erismedi"));

module.exports = async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: "Token Eksik" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const isRevoked = await client.get(decoded.jti);
        
        if (isRevoked) return res.status(401).json({ error: "Token Revoked!" });

        req.user = decoded;
        next();
    } catch (err) {
        // Herhangi bir hata veya çökmede girişi kapatıyoruz (Fail-Closed)
        res.status(401).json({ error: "Guvenlik Protokolu: Erisim Engellendi" });
    }
};