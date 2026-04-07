#!/bin/bash
echo -e "\n\e[1m📊 PROJE PUANLAMA DENETİMİ (MİKRO ANALİZ)\e[0m"
echo "------------------------------------------------"

SCORE=0

# 1. .env Kontrolü (-20 Ceza)
if [ ! -f .env ]; then
    echo -e "✅ .env dosyası yok: +20 (Cezadan kurtulundu)"
    SCORE=$((SCORE+20))
else
    echo -e "❌ .env dosyası tespit edildi: -20 CEZA!"
fi

# 2. Profesyonellik Dosyaları
[ -f Makefile ] && echo "✅ Makefile mevcut: +20" && SCORE=$((SCORE+20))
[ -f package.json ] && echo "✅ package.json mevcut: +20" && SCORE=$((SCORE+20))
[ -f .gitattributes ] && echo "✅ .gitattributes mevcut: +10" && SCORE=$((SCORE+10))
[ -d .github/workflows ] && echo "✅ CI/CD (GitHub Actions) mevcut: +25" && SCORE=$((SCORE+25))

# 3. Dokümantasyon ve Hoca İsmi
if grep -q "Keyvan Arasteh" README.MD; then
    echo "✅ Danışman Hoca Bilgisi (Keyvan Arasteh) eklendi: +5"
    SCORE=$((SCORE+5))
fi

# 4. Dil Çeşitliliği (JS, Python, Rust)
LANGS=0
[ -f scripts/bypass.js ] && LANGS=$((LANGS+1))
[ -f src/analysis.py ] && LANGS=$((LANGS+1))
[ -f src/metrics.rs ] && LANGS=$((LANGS+1))
if [ $LANGS -ge 3 ]; then
    echo "✅ Çok dilli yapı (JS, Python, Rust) tespit edildi: +20"
    SCORE=$((SCORE+20))
fi

echo "------------------------------------------------"
echo -e "\e[1m🔥 TAHMİNİ TOPLAM PUAN: $SCORE / 100\e[0m"
echo -e "🎬 \e[32mNOT: Video Demo bonusu (+10) ile 110'a çıkıyor!\e[0m"
