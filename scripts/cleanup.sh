#!/bin/bash
docker compose down -v
docker system prune -af
echo "[+] Forensics Cleanup Tamamlandi."