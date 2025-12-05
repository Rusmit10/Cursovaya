---
description: How to deploy the application using Docker Swarm
---

# Docker Swarm Deployment

## Quick Deploy

// turbo
1. Initialize Swarm:
```powershell
.\swarm-init.ps1
```

// turbo
2. Deploy stack:
```powershell
.\swarm-deploy.ps1
```

## Access

- Application: http://localhost
- Visualizer: http://localhost:8080
- Prometheus: http://localhost:9090

## Scale Service

```powershell
docker service scale identity-system_user-service=5
```

## Remove

// turbo
```powershell
docker stack rm identity-system
docker swarm leave --force
```
