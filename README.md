# 🛡️ Proje: Sessiz Ölüm (JWT Token Revocation & Active IPS)

| Özellik | Detay |
| :--- | :--- |
| **Zorluk Seviyesi** | 9/10 (Legendary) |
| **Geliştirici** | Beyzanur Çakıcı |
| **Rol** | Güvenlik Uzmanı / Sistem Mimarı |
| **Teknoloji** | Node.js, Express, Redis, Docker, JWT |

---

## 📝 Proje Özeti
Bu proje, modern web uygulamalarındaki en büyük güvenlik açıklarından biri olan **"Stateless JWT Kontrolsüzlüğü"** sorununa hibrit bir çözüm sunar. Standart bir JWT, süresi dolana kadar durdurulamazken; **Sessiz Ölüm**, Redis tabanlı bir kara liste (Blacklist) ve aktif bir saldırı önleme sistemi (IPS) kullanarak çalınan token'ları anında etkisiz hale getirir.

---

## 🔍 Analiz Aşamaları (Vize Projesi Görevleri)

### 1️⃣ Kurulum ve Güvenlik Analizi (Reverse Engineering)
* **Analiz:** Projenin kurulum aşamasında kullanılan bağımlılıklar, terminal yetkileri ve dizin izinleri (`EACCES` kontrolleri dahil) analiz edilmiştir.
* **Güvenlik Çözümü:** Kurulum sırasında `npm` paketlerinin bütünlüğü doğrulanmış ve sistemin en düşük yetki prensibiyle (**Least Privilege**) çalışması sağlanmıştır.

### 2️⃣ Bellek Yönetimi ve Adli Bilişim (Forensics)
* **Analiz:** Redis veritabanında tutulan token ve IP verilerinin RAM üzerindeki etkisi incelenmiştir.
* **Kritik Soru:** Veri sızıntısı kalıyor mu?
> **Cevap:** Tüm engellemeler ve kara liste kayıtları **TTL (Time To Live)** ile sınırlandırılmıştır. Bir token'ın süresi dolduğunda, Redis üzerindeki kaydı da otomatik olarak silinir. Bu, bellek şişmesini ve adli analizde gereksiz veri birikmesini önler.

### 3️⃣ İş Akışları ve CI/CD (DevSecOps)
* **Analiz:** `.env` ve GitHub Secrets kullanımıyla "Hardcoded Secret" riski sıfıra indirilmiştir.
* **Kritik Soru:** Webhook ne işe yarar?
> **Cevap:** Dış dünyadan (örneğin bir IDS alarmından) gelen bir tetikleyici, sistemdeki tüm aktif oturumları saniyeler içinde "Sessiz Ölüm" moduna sokabilir.

### 4️⃣ Docker Mimarisi ve Network İzolasyonu
* **Analiz:** Redis ve Uygulama katmanı farklı konteynerlerde, izole bir **internal-network** üzerinde çalışır.
* **Kritik Soru:** İzolasyon sağlanmazsa ne olur?
> **Cevap:** Saldırgan Redis'un 6379 portuna sızarak kara listeyi temizleyebilir. Bu projede Redis dış dünyaya kapalıdır; sadece backend erişebilir.

### 5️⃣ Tehdit Modelleme ve Akış Analizi (Fail-Safe)
* **Analiz:** Sistemin çökme durumundaki davranışı (**Fail-Safe**) test edilmiştir.
* **Kritik Soru:** Redis çökerse ne olur?
> **Cevap:** Sistem **Fail-Closed** moduna geçer. Güvenlik riski almamak için tüm yetkilendirmeler durdurulur.

---

## 🔥 Canavar Özelliği: Aktif IPS (IP Shunning)
Bu projeyi standart projelerden ayıran en büyük özellik **Aktif Savunma** katmanıdır:

1.  Saldırgan üst üste **3 kez** yetkisiz erişim (token'sız veya iptal edilmiş token) denerse sistem alarm verir.
2.  Redis üzerindeki sayaç (`attempts`) 3'e ulaştığında, saldırganın IP adresi **24 saat boyunca** tamamen yasaklanır (`IP_BANNED`).
3.  Bu sayede kaba kuvvet (Brute-force) ve DoS saldırılarına karşı gerçek zamanlı koruma sağlanır.

---

## 🚀 Çalıştırma ve Test (Kali Linux)

```bash
# 1. Bağımlılıkları Yükle
npm install

# 2. Redis Servisini Başlat
sudo service redis-server start

# 3. Uygulamayı Ayağa Kaldır
node app.js

# 4. Saldırı Testi (IP Ban Simülasyonu)
for i in {1..4}; do curl http://localhost:3000/api/secure; done

📊 Teknik Çıktılar

Sistem 4. denemede şu yanıtı vererek güvenliği kanıtlamaktadır:
JSON

{
  "error": "IP_BANNED",
  "message": "Çok fazla şüpheli deneme! 24 saat yasaklandınız."
}


---
