#!/bin/bash

# Скрипт для запуска dev-сервера

echo "Проверка Node.js..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен!"
    echo ""
    echo "Установите Node.js одним из способов:"
    echo "1. Скачайте с https://nodejs.org/ (рекомендуется)"
    echo "2. Или через Homebrew: brew install node"
    echo "3. Или через nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo ""
    exit 1
fi

echo "✅ Node.js найден: $(node --version)"
echo "✅ npm найден: $(npm --version)"
echo ""

cd "$(dirname "$0")/web"

if [ ! -d "node_modules" ]; then
    echo "📦 Установка зависимостей..."
    npm install
    echo ""
fi

echo "🚀 Запуск dev-сервера..."
echo "📱 Откройте браузер на http://localhost:5173"
echo ""

npm run dev


