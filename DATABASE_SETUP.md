# Настройка базы данных для калькулятора

## Шаг 1: Применить миграции Prisma

После добавления новых моделей в `schema.prisma`, нужно применить миграции:

```bash
cd server
npx prisma migrate dev --name add_cleaning_models
```

Это создаст таблицы:
- `CleaningCalculation` - история расчетов
- `CleaningCache` - кэш данных

## Шаг 2: Сгенерировать Prisma Client

```bash
npx prisma generate
```

## Шаг 3: Проверить базу данных

Можно открыть Prisma Studio для просмотра данных:

```bash
npx prisma studio
```

Откроется веб-интерфейс на http://localhost:5555

## Структура данных

### CleaningCalculation
Хранит все расчеты калькулятора:
- Параметры расчета (площадь, комнаты, тип услуги и т.д.)
- Результаты расчета (стоимость, скидки)
- Временные метки

### CleaningCache
Хранит кэшированные данные:
- Ключ-значение пары
- Время истечения (TTL)
- Автоматическая очистка устаревших записей

## API Endpoints

### Расчеты
- `POST /api/cleaning/calculations` - Сохранить расчет
- `GET /api/cleaning/calculations` - Получить историю расчетов
- `GET /api/cleaning/calculations/:id` - Получить конкретный расчет
- `DELETE /api/cleaning/calculations/:id` - Удалить расчет

### Статистика
- `GET /api/cleaning/statistics` - Получить статистику (общее количество, сумма, средняя стоимость)

### Кэш
- `GET /api/cleaning/cache/:key` - Получить из кэша
- `POST /api/cleaning/cache` - Сохранить в кэш

## Где хранятся данные

По умолчанию используется SQLite (файл базы данных):
- Путь: `server/prisma/dev.db`
- Файл создается автоматически при первой миграции

Для продакшена можно переключиться на PostgreSQL, изменив `DATABASE_URL` в `.env`


