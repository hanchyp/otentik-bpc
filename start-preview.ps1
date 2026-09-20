$projectRoot = $PSScriptRoot
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCommand) { $nodePath = $nodeCommand.Source } else { $nodePath = Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' }
if (-not (Test-Path -LiteralPath $nodePath)) { throw 'Node.js tidak ditemukan. Instal Node.js 20+ lalu jalankan npm start.' }
Push-Location -LiteralPath $projectRoot
try { & $nodePath (Join-Path $projectRoot 'node_modules/next/dist/bin/next') dev --hostname 127.0.0.1 --port 4173 } finally { Pop-Location }
