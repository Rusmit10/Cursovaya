# Docker Swarm Stack Deployment

Write-Host "Deploying Stack..." -ForegroundColor Cyan

# Check Swarm
$swarmStatus = docker info --format '{{.Swarm.LocalNodeState}}'
if ($swarmStatus -ne "active") {
    Write-Host "[ERROR] Swarm not initialized. Run .\swarm-init.ps1 first" -ForegroundColor Red
    exit 1
}

# Load environment variables
if (Test-Path ".env") {
    Write-Host "Loading .env..." -ForegroundColor Yellow
    Get-Content .env | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
}

# Build images
Write-Host "Building images..." -ForegroundColor Yellow
$services = @("auth-service", "user-service", "frontend", "nginx", "monitoring")

foreach ($service in $services) {
    Write-Host "  Building $service..." -ForegroundColor Cyan
    if (Test-Path "./$service") {
        docker build -t "localhost/${service}:latest" "./$service" 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  [OK] $service" -ForegroundColor Green
        } else {
            Write-Host "  [ERROR] $service" -ForegroundColor Red
        }
    }
}

# Deploy stack
Write-Host "Deploying services..." -ForegroundColor Yellow
docker stack deploy -c docker-stack.yml identity-system

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Stack deployed" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Deployment failed" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host ""
docker stack services identity-system
Write-Host ""
Write-Host "Access:" -ForegroundColor Yellow
Write-Host "  App: http://localhost" -ForegroundColor White
Write-Host "  Visualizer: http://localhost:8080" -ForegroundColor White
Write-Host "  Prometheus: http://localhost:9090" -ForegroundColor White
