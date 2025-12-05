#!/bin/bash

echo "Testing Health Endpoints..."

# Check Auth Service
AUTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:80/auth/health)
if [ "$AUTH_STATUS" != "200" ]; then
    echo "Auth Service failed: $AUTH_STATUS"
    exit 1
fi
echo "Auth Service OK"

# Check User Service
USER_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:80/users/health)
if [ "$USER_STATUS" != "200" ]; then
    echo "User Service failed: $USER_STATUS"
    exit 1
fi
echo "User Service OK"

echo "All tests passed!"
