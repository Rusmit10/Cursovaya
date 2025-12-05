# Docker Swarm Initialization

Write-Host "Initializing Docker Swarm..." -ForegroundColor Cyan

# Check Docker
try {
    docker info | Out-Null
    Write-Host "[OK] Docker is running" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Docker is not running" -ForegroundColor Red
    exit 1
}

# Check if Swarm active
$swarmStatus = docker info --format '{{.Swarm.LocalNodeState}}'
if ($swarmStatus -eq "active") {
    Write-Host "[INFO] Swarm already initialized" -ForegroundColor Yellow
    exit 0
}

# Initialize Swarm
Write-Host "Creating Swarm cluster..." -ForegroundColor Yellow
docker swarm init --advertise-addr 127.0.0.1 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Swarm initialized" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Failed to initialize Swarm" -ForegroundColor Red
    exit 1
}

# Create network
Write-Host "Creating overlay network..." -ForegroundColor Yellow
$networkExists = docker network ls --filter name=app-network --format "{{.Name}}"
if (-not $networkExists) {
    docker network create --driver overlay --attachable app-network | Out-Null
    Write-Host "[OK] Network created" -ForegroundColor Green
} else {
    Write-Host "[OK] Network exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "Swarm initialized!" -ForegroundColor Green
Write-Host "Next: Run .\swarm-deploy.ps1" -ForegroundColor Yellow
