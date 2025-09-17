#!/bin/bash
echo "🚀 Spouštím ModernWeb server..."
echo "📂 Složka: $(pwd)"
echo "📦 Instaluji závislosti..."
npm install
echo "🌐 Spouštím server na http://localhost:3000"
echo "💡 Pro ukončení stiskněte Ctrl+C"
npm start