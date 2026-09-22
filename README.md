# Rota Viva Excursões

Sistema interno para gestão de excursões, clientes, vendas, reservas, pagamentos e usuários. O projeto segue a arquitetura do MeuOrcamento: React + Vite, API Node, Neon Postgres/Neon Auth e deploy no Render.

## Executar localmente

1. Crie um projeto no Neon e habilite o Neon Auth por e-mail e senha.
2. Execute `neon/schema.sql` no SQL Editor do banco.
3. Copie `.env.example` para `.env.local` e preencha as duas URLs.
4. Autorize `http://127.0.0.1:5173` nos domínios do Neon Auth.
5. Execute `npm install` e, em terminais separados, `npm start` e `npm run dev`.

Na primeira abertura, use **Criar o primeiro acesso administrativo**. Depois entre com:

- E-mail: `admin@rotaviva.com.br`
- Senha inicial: `RotaViva@2026`

Troque a senha no Neon Auth antes de colocar o sistema em produção.

## Deploy no Render

O arquivo `render.yaml` já descreve o Web Service. Publique esta pasta em um repositório (ou use `RotaViva` como Root Directory), informe `VITE_NEON_AUTH_URL` e `DATABASE_URL` no Render e autorize a URL final nos domínios do Neon Auth.

## Regras de acesso

- Administrador: acesso completo e gestão de usuários.
- Vendedor: operação de excursões, clientes, vendas e financeiro.
- Cliente: sem conta; consulta limitada por CPF na tela pública.

O banco não é acessado diretamente pelo navegador. A API valida a sessão e as permissões; a consulta por CPF tem limite de tentativas e retorna somente os dados necessários.
