# Script para resolver problemas do Prisma no Windows
Write-Host "Resolvendo problemas do Prisma..." -ForegroundColor Green

# Parar processos que possam estar usando o Prisma
Write-Host "Parando processos..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*node*" -or $_.ProcessName -like "*prisma*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Aguardar um pouco
Start-Sleep -Seconds 2

# Tentar remover a pasta .prisma
Write-Host "Removendo pasta .prisma..." -ForegroundColor Yellow
if (Test-Path "node_modules\.prisma") {
    try {
        Remove-Item -Recurse -Force "node_modules\.prisma" -ErrorAction Stop
        Write-Host "Pasta .prisma removida com sucesso!" -ForegroundColor Green
    }
    catch {
        Write-Host "Erro ao remover pasta .prisma: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Tentando alternativa..." -ForegroundColor Yellow
        
        # Tentar renomear a pasta
        try {
            Rename-Item "node_modules\.prisma" "node_modules\.prisma_old" -ErrorAction Stop
            Write-Host "Pasta .prisma renomeada!" -ForegroundColor Green
        }
        catch {
            Write-Host "Erro ao renomear pasta .prisma: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Reinstalar dependências
Write-Host "Reinstalando dependências..." -ForegroundColor Yellow
npm install

# Gerar cliente Prisma
Write-Host "Gerando cliente Prisma..." -ForegroundColor Yellow
npx prisma generate

Write-Host "Processo concluído!" -ForegroundColor Green 