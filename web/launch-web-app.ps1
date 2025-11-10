# Launch Web App - Web Folder Script (delegates to root script)
Clear-Host
Write-Host "Starting Solutions Impact Web App..." -ForegroundColor Green

# Compute repository root from this script's directory and call the root script
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location -Path $repoRoot

# Execute the known-good root launcher
& (Join-Path $repoRoot "launch-web-app.ps1")
