# Organiza Gabinete Backend

API REST para agendamento de visitas em gabinetes políticos.

## Como rodar

```bash
npm install
cp .env.example .env # configure as variáveis
npx prisma migrate dev --name init
npm run dev
```

## Estrutura
- Express.js + TypeScript
- Prisma (PostgreSQL)
- JWT Auth, validação, rate limit, etc.

## Funcionalidades
Ver documentação detalhada no briefing do projeto.
