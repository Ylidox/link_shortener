#Link Shortener
Сервис сокращения ссылок
Работает на `http://45.153.69.13:3004/`
Можете использовать `login: user`, `password: user` для авторизации 

Последовательность установки:
1. Добавить в директорию `/back` файл `.env` следующего содержания
```
PORT=3001
SECRET_KEY=very_secret_key
POSTGRES_USER=postgres
POSTGRES_PASSWORD=PASSWORD // замените на ваш пароль от postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=link_shortener
```
2. Выполнить в консоли psql sql-команды из `./back/db.sql` для создания таблиц
3. Запустить сервер на localhost:3001
```
   cd back
   npm i
   npm start
```
4. Запустить реакт приложение на localhost:3000
``` 
   cd front
   npm i
   npm run dev
```
