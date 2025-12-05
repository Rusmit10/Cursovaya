# Identity Management System

Система управления идентификацией с поддержкой Docker Swarm.

## Компоненты

- **auth-service** - Аутентификация (JWT), 2 реплики
- **user-service** - Управление пользователями, 3 реплики
- **frontend** - Веб-интерфейс, 2 реплики
- **reverse-proxy** - Nginx, 2 реплики
- **db** - PostgreSQL, 1 реплика
- **monitoring** - Prometheus, 1 реплика

## Требования

- Docker Desktop

## Быстрый старт

### Docker Compose (для разработки)

```powershell
docker-compose up --build
```

### Docker Swarm (для кластеризации)

```powershell
# 1. Инициализация Swarm
.\swarm-init.ps1

# 2. Развертывание
.\swarm-deploy.ps1
```

## Доступ

- Приложение: http://localhost
- Prometheus: http://localhost:9090
- Visualizer: http://localhost:8080

## Управление Swarm

```powershell
# Масштабирование
docker service scale identity-system_user-service=5

# Статус
docker service ls
docker stack services identity-system

# Логи
docker service logs identity-system_user-service

# Удаление
docker stack rm identity-system
docker swarm leave --force
```

## API

- `POST /auth/login` - Вход
- `GET /auth/verify` - Проверка токена
- `POST /users/` - Создать пользователя
- `GET /users/` - Список пользователей
- `GET /users/{id}` - Информация о пользователе
