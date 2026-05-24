# Estacionamento — Backend

Backend do sistema web de controle de estacionamento.

A API foi construída com:

- Node.js
- TypeScript
- Express
- Prisma
- MySQL
- Zod

---

## 1. Estrutura do projeto

```txt
Estacionamento---Gest-o-de-Projeto
│
├── apps
│   └── api
│       ├── prisma
│       │   ├── schema.prisma
│       │   ├── migrations
│       │   └── seed.ts
│       │
│       └── src
│           ├── config
│           ├── database
│           ├── modules
│           │   ├── dashboard
│           │   ├── employees
│           │   ├── gatekeepers
│           │   ├── parking-records
│           │   └── vehicles
│           │
│           └── shared
│
├── package.json
├── package-lock.json
├── tsconfig.base.json
└── README.md
```

---

## 2. Requisitos

Antes de rodar o projeto, instale:

- Node.js
- npm
- Git
- XAMPP ou MySQL local

Versões usadas no projeto:

```txt
Node.js: recomendado 20 LTS ou superior
Prisma: 5.22.0
Banco: MySQL ou MariaDB via XAMPP
```

---

## 3. Clonar o projeto

```powershell
git clone https://github.com/malu-fnb/Estacionamento---Gest-o-de-Projeto.git
```

Entre na pasta:

```powershell
cd Estacionamento---Gest-o-de-Projeto
```

---

## 4. Instalar dependências

Na raiz do projeto, rode:

```powershell
npm install
```

---

## 5. Configurar o banco local

Abra o XAMPP e inicie o serviço:

```txt
MySQL
```

Depois crie o banco local:

```powershell
& "C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS parking_register;"
```

Caso use outro MySQL, crie manualmente um banco chamado:

```txt
parking_register
```

---

## 6. Configurar variáveis de ambiente

Crie o arquivo:

```txt
apps/api/.env
```

Com o conteúdo:

```env
DATABASE_URL="mysql://root:@localhost:3306/parking_register"
PORT=3333
NODE_ENV=development
```

Se seu MySQL tiver senha, use:

```env
DATABASE_URL="mysql://root:SUA_SENHA@localhost:3306/parking_register"
PORT=3333
NODE_ENV=development
```

---

## 7. Configurar Prisma localmente

Entre na pasta da API:

```powershell
cd apps\api
```

Confirme a versão do Prisma:

```powershell
npx prisma -v
```

A versão esperada é:

```txt
prisma: 5.22.0
@prisma/client: 5.22.0
```

Aplicar as migrations:

```powershell
npx prisma migrate dev
```

Gerar o Prisma Client:

```powershell
npx prisma generate
```

Conferir se o banco está atualizado:

```powershell
npx prisma migrate status
```

Resultado esperado:

```txt
Database schema is up to date
```

Volte para a raiz:

```powershell
cd ..\..
```

---

## 8. Rodar seed de dados

Se o arquivo abaixo existir:

```txt
apps/api/prisma/seed.ts
```

Rode:

```powershell
cd apps\api
npx prisma db seed
cd ..\..
```

O seed cria dados iniciais de teste, como:

- porteiro
- funcionários
- veículos
- registros de entrada e saída

---

## 9. Abrir Prisma Studio

Para visualizar o banco por uma interface web:

```powershell
cd apps\api
npx prisma studio
```

O Prisma Studio abrirá no navegador.

---

## 10. Rodar o backend

Na raiz do projeto:

```powershell
npm run dev:api
```

A API ficará disponível em:

```txt
http://localhost:3333
```

Teste no navegador ou terminal:

```powershell
curl http://localhost:3333/health
```

Resposta esperada:

```json
{
  "status": "ok",
  "message": "CampusGate API is running"
}
```

---

## 11. Build do backend

Na raiz do projeto:

```powershell
npm run build:api
```

Se não aparecer erro, o backend está compilando corretamente.

---

## 12. Configurar o frontend

No repositório do frontend, crie o arquivo:

```txt
.env.local
```

Com:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

Assim o frontend consegue chamar a API local.

Resumo local:

```txt
Frontend Next.js: http://localhost:3000
Backend API:      http://localhost:3333
```

---

## 13. Endpoints disponíveis

### Health

```txt
GET /health
```

---

## 14. Porteiros

### Cadastrar porteiro

```txt
POST /gatekeepers/register
```

Exemplo:

```json
{
  "name": "Carlos Porteiro",
  "phone": "81999990000",
  "email": "carlos.porteiro@campusgate.local",
  "cpf": "00011122233",
  "password": "123456"
}
```

### Login do porteiro

```txt
POST /gatekeepers/login
```

Exemplo:

```json
{
  "email": "carlos.porteiro@campusgate.local",
  "password": "123456"
}
```

---

## 15. Funcionários

### Endpoints

```txt
POST   /employees
GET    /employees
GET    /employees/:id
PUT    /employees/:id
DELETE /employees/:id
```

### Exemplo de cadastro

```json
{
  "name": "Antônio Edson",
  "department": "Tecnologia da Informação",
  "ra": "RA001",
  "email": "antonio@email.com",
  "phone": "81988887777"
}
```

### Buscar funcionários

```txt
GET /employees?search=antonio
```

---

## 16. Veículos

### Endpoints

```txt
POST   /vehicles
GET    /vehicles
GET    /vehicles/:id
GET    /vehicles/plate/:plate
DELETE /vehicles/:id
```

### Exemplo de cadastro

```json
{
  "ownerRa": "RA001",
  "plate": "ABC1234",
  "make": "Toyota",
  "model": "Corolla",
  "color": "Prata"
}
```

### Buscar veículos

```txt
GET /vehicles?search=ABC1234
```

### Buscar por placa

```txt
GET /vehicles/plate/ABC1234
```

---

## 17. Registros de estacionamento / Access Logs

### Endpoints

```txt
GET  /parking-records
POST /parking-records/entry
POST /parking-records/exit
```

### Registrar entrada

```json
{
  "plate": "ABC1234",
  "gatekeeperName": "Carlos Porteiro",
  "notes": "Entrada autorizada"
}
```

### Registrar saída

```json
{
  "plate": "ABC1234",
  "gatekeeperName": "Carlos Porteiro",
  "notes": "Saída registrada normalmente"
}
```

### Formato retornado

```json
{
  "id": "uuid",
  "vehiclePlate": "ABC1234",
  "type": "entry",
  "timestamp": "2026-05-24T12:00:00.000Z",
  "ownerName": "Antônio Edson",
  "gatekeeperName": "Carlos Porteiro"
}
```

---

## 18. Dashboard

### Resumo

```txt
GET /dashboard/summary
```

Resposta esperada:

```json
{
  "currentOccupancy": 1,
  "totalEmployees": 3,
  "totalVehicles": 3
}
```

---

## 19. Fluxo completo para testar

### 1. Rodar backend

```powershell
npm run dev:api
```

### 2. Cadastrar porteiro

```powershell
curl -X POST http://localhost:3333/gatekeepers/register `
  -H "Content-Type: application/json" `
  -d "{\"name\":\"Carlos Porteiro\",\"phone\":\"81999990000\",\"email\":\"carlos.porteiro@campusgate.local\",\"cpf\":\"00011122233\",\"password\":\"123456\"}"
```

### 3. Fazer login

```powershell
curl -X POST http://localhost:3333/gatekeepers/login `
  -H "Content-Type: application/json" `
  -d "{\"email\":\"carlos.porteiro@campusgate.local\",\"password\":\"123456\"}"
```

### 4. Cadastrar funcionário

```powershell
curl -X POST http://localhost:3333/employees `
  -H "Content-Type: application/json" `
  -d "{\"name\":\"Antônio Edson\",\"department\":\"Tecnologia da Informação\",\"ra\":\"RA001\",\"email\":\"antonio@email.com\",\"phone\":\"81988887777\"}"
```

### 5. Cadastrar veículo

```powershell
curl -X POST http://localhost:3333/vehicles `
  -H "Content-Type: application/json" `
  -d "{\"ownerRa\":\"RA001\",\"plate\":\"ABC1234\",\"make\":\"Toyota\",\"model\":\"Corolla\",\"color\":\"Prata\"}"
```

### 6. Registrar entrada

```powershell
curl -X POST http://localhost:3333/parking-records/entry `
  -H "Content-Type: application/json" `
  -d "{\"plate\":\"ABC1234\",\"gatekeeperName\":\"Carlos Porteiro\",\"notes\":\"Entrada autorizada\"}"
```

### 7. Tentar entrada duplicada

```powershell
curl -X POST http://localhost:3333/parking-records/entry `
  -H "Content-Type: application/json" `
  -d "{\"plate\":\"ABC1234\",\"gatekeeperName\":\"Carlos Porteiro\",\"notes\":\"Tentando entrada duplicada\"}"
```

Resultado esperado:

```json
{
  "message": "This vehicle already has an open entry"
}
```

### 8. Ver histórico

```powershell
curl http://localhost:3333/parking-records
```

### 9. Registrar saída

```powershell
curl -X POST http://localhost:3333/parking-records/exit `
  -H "Content-Type: application/json" `
  -d "{\"plate\":\"ABC1234\",\"gatekeeperName\":\"Carlos Porteiro\",\"notes\":\"Saída registrada\"}"
```

### 10. Ver dashboard

```powershell
curl http://localhost:3333/dashboard/summary
```

---

## 20. Regras de negócio

O sistema atende às seguintes regras:

- Um funcionário pode ter mais de um veículo.
- Uma placa não pode ser cadastrada mais de uma vez.
- Um veículo não pode registrar nova entrada se já estiver dentro.
- Um veículo não pode registrar saída se não estiver dentro.
- A entrada e a saída são feitas pela placa.
- A observação é opcional.
- O histórico registra entradas e saídas como logs de acesso.
- O dashboard exibe resumo de ocupação, funcionários e veículos.

---

## 21. Problemas comuns

### Erro de conexão com MySQL

Se aparecer:

```txt
Can't connect to MySQL server on 'localhost'
```

Verifique se o MySQL está ligado no XAMPP.

---

### Prisma mostrando erro sobre `url`

Se o WebStorm mostrar:

```txt
The datasource property url is no longer supported
```

Mas o terminal mostrar:

```txt
prisma: 5.22.0
@prisma/client: 5.22.0
```

Pode ignorar o alerta da IDE. O projeto usa Prisma 5.22.0.

---

### Porta 3333 ocupada

Se a porta 3333 estiver ocupada, altere:

```txt
apps/api/.env
```

Exemplo:

```env
PORT=3334
```

Depois rode novamente:

```powershell
npm run dev:api
```

---

## 22. Comandos úteis

Instalar dependências:

```powershell
npm install
```

Rodar backend:

```powershell
npm run dev:api
```

Build:

```powershell
npm run build:api
```

Migration:

```powershell
cd apps\api
npx prisma migrate dev
```

Gerar Prisma Client:

```powershell
cd apps\api
npx prisma generate
```

Status da migration:

```powershell
cd apps\api
npx prisma migrate status
```

Prisma Studio:

```powershell
cd apps\api
npx prisma studio
```

Seed:

```powershell
cd apps\api
npx prisma db seed
```

---

## 23. Deploy sugerido

Como frontend e backend estão em repositórios separados:

```txt
Frontend Next.js: Vercel
Backend Express: Railway ou Render
Banco MySQL: Railway
```

No frontend em produção:

```env
NEXT_PUBLIC_API_URL=https://url-do-backend.com
```

No backend em produção:

```env
DATABASE_URL="mysql://usuario:senha@host:porta/banco"
PORT=3333
NODE_ENV=production
```

---

## 24. Observação sobre repositórios

O frontend e o backend ficam separados.

Frontend:

```txt
Repositório do frontend Next.js
```

Backend:

```txt
Este repositório com Express, Prisma e MySQL
```

O frontend acessa o backend usando:

```env
NEXT_PUBLIC_API_URL
```