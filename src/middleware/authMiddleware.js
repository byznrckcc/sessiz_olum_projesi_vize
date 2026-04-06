const jwt = require('jsonwebtoken');
const redis = require('redis');

// Redis bağlantısı (Hocanın Adım 4'te istediği network katmanı)
const redisClient = redis.createClient({ url: 'redis://localhost:6379' });
redisClient.connect().catch(console.error);

module.exports = async (req, res, next) => {
    // Saldırganın IP adresini tespit ediyoruz (Forensics için önemli)
    const userIP = req.ip || req.connection.remoteAddress;

    try {
        // 1. ADIM: IP Engelli mi? (Aktif Savunma / IPS)
        const isBanned = await redisClient.get(`banned_ip:${userIP}`);
        if (isBanned) {
            return res.status(403).json({ 
                error: "IP_BANNED", 
                message: "Çok fazla şüpheli deneme! 24 saat yasaklandınız." 
            });
        }

        const token = req.headers['authorization']?.split(' ')[1];

        // 2. ADIM: Token yoksa ban sayacını artır (Hocayı şaşırtacak kısım)
        if (!token) {
            const attempts = await redisClient.incr(`attempts:${userIP}`);
            if (attempts >= 3) {
                // 3. denemede IP'yi 24 saatliğine (86400 sn) Redis'e gömüyoruz
                await redisClient.set(`banned_ip:${userIP}`, "BANNED", { EX: 86400 });
            }
            return res.status(401).json({ error: "Token eksik.", attempts: attempts });
        }

        // 3. ADIM: JWT Doğrulama (Gizli Anahtar: siber_vatan_2026)
        const decoded = jwt.verify(token, "siber_vatan_2026"); 
        
        // 4. ADIM: Sessiz Ölüm (Token Kara Listede mi?)
        const isRevoked = await redisClient.get(`blacklist:${decoded.jti}`);
        if (isRevoked) {
            const attempts = await redisClient.incr(`attempts:${userIP}`);
            if (attempts >= 3) {
                await redisClient.set(`banned_ip:${userIP}`, "BANNED", { EX: 86400 });
            }
            return res.status(401).json({ error: "TOKEN_REVOKED" });
        }

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Geçersiz Token" });
    }
};
