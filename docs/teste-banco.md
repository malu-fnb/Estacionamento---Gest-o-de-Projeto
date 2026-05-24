# Testes do Banco de Dados

## Criar migration

```powershell
cd apps\api
npx prisma migrate dev --name matheus_database_model
npx prisma generate
cd ..\..