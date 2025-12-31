# Настройка окружения для разработки

## Установка Node.js

Для запуска dev-сервера и просмотра интерфейса в браузере нужен Node.js.

### Вариант 1: Установка через официальный сайт (рекомендуется)

1. Перейдите на https://nodejs.org/
2. Скачайте LTS версию для macOS
3. Установите скачанный .pkg файл
4. Перезапустите терминал

### Вариант 2: Установка через Homebrew

Если у вас установлен Homebrew:
```bash
brew install node
```

### Вариант 3: Установка через nvm (Node Version Manager)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.zshrc
nvm install --lts
nvm use --lts
```

## После установки Node.js

1. Проверьте установку:
```bash
node --version
npm --version
```

2. Установите зависимости:
```bash
cd web
npm install
```

3. Запустите dev-сервер:
```bash
npm run dev
```

4. Откройте браузер на http://localhost:5173

## Быстрый запуск

После установки Node.js выполните:
```bash
cd web && npm install && npm run dev
```


