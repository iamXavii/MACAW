Write-Host "Starting MACAW Environment..."

# Start Backend
Write-Host "Launching Backend Server..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm start"

# Start Frontend
Write-Host "Launching Frontend Server..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "Servers launched! Please check the new windows."
