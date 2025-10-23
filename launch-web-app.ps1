# Launch Web App
Clear-Host
Write-Host "Starting AI Web Agency Web App..." -ForegroundColor Green

# Remember current location and move into web directory
$originalLocation = Get-Location
Set-Location -Path "web"

# Ensure dependencies are installed
if (-not (Test-Path -Path "node_modules")) {
  Write-Host "Installing dependencies..." -ForegroundColor Yellow
  npm install
}

# Helper: check whether a port is free by attempting to bind to it
function Test-PortFree {
  param([int]$Port)
  $listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback, $Port)
  try {
    $listener.Start()
    $listener.Stop()
    return $true
  } catch {
    return $false
  }
}

# Choose the first free port in 3000..3010
$port = $null
foreach ($p in 3000..3010) {
  if (Test-PortFree -Port $p) { $port = $p; break }
}

if (-not $port) {
  Write-Host "No free port found between 3000 and 3010." -ForegroundColor Red
  Set-Location -Path $originalLocation
  exit 1
}

Write-Host "Using port $port" -ForegroundColor Cyan

# Path to local next CLI on Windows
$nextCmd = Join-Path (Get-Location) "node_modules/.bin/next.cmd"
if (-not (Test-Path $nextCmd)) {
  Write-Host "next CLI not found. Installing dev dependencies..." -ForegroundColor Yellow
  npm install next react react-dom | Out-Null
}

if (-not (Test-Path $nextCmd)) {
  Write-Host "Could not find next CLI at $nextCmd" -ForegroundColor Red
  Set-Location -Path $originalLocation
  exit 1
}

# Start Next.js development server in the foreground and open browser shortly after
Write-Host "Starting development server..." -ForegroundColor Yellow
$uri = "http://localhost:$port"

# Open browser after a short delay in background
Write-Host "Opening browser shortly at $uri..." -ForegroundColor Yellow
$browserJob = Start-Job -ScriptBlock {
  param($targetUri)
  Start-Sleep -Seconds 3
  try {
    $chromePath1 = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    $chromePath2 = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    if (Test-Path $chromePath1) {
      Start-Process -FilePath $chromePath1 -ArgumentList $targetUri
      Write-Host "Opened $targetUri in Chrome" -ForegroundColor Green
    } elseif (Test-Path $chromePath2) {
      Start-Process -FilePath $chromePath2 -ArgumentList $targetUri
      Write-Host "Opened $targetUri in Chrome" -ForegroundColor Green
    } else {
      Start-Process $targetUri
      Write-Host "Opened $targetUri in default browser" -ForegroundColor Green
    }
  } catch {
    Start-Process $targetUri
    Write-Host "Opened $targetUri in default browser" -ForegroundColor Green
  }
} -ArgumentList $uri

Write-Host "The development server will keep this window open. Press Ctrl+C to stop it." -ForegroundColor Cyan

# Run Next.js dev server in the current console so logs are visible and Ctrl+C works
& $nextCmd dev -p $port

# When the server exits, return to original location
Write-Host "Development server exited." -ForegroundColor Yellow
Set-Location -Path $originalLocation