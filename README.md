# EventSync (Frontend)

EventSync é uma plataforma de gestão e participação em eventos. Este repositório contém o front-end da aplicação, desenvolvido com React e TypeScript, focando em uma experiência mobile-first moderna.

## 🚀 Funcionalidades

- **Autenticação**:
  - Login (`/`)
  - Cadastro de Novos Usuários (`/register`)
- **Eventos**:
  - Listagem de Eventos Disponíveis (Feed)
  - Detalhes do Evento (Data, Local, Organizador)
- **Participante**:
  - Inscrição em Eventos
  - Área "Meus Ingressos" (`/my-registrations`)
  - Visualização de Ticket com QR Code (`/ticket/:id`)
- **Organizador** (Em Breve):
  - Scanner de Check-in

## 🛠️ Tecnologias

- **Core**: [React](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) (Ícones)
- **Estado & Dados**: [TanStack Query](https://tanstack.com/query/latest) (React Query), [Axios](https://axios-http.com/)
- **Formulários**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
- **Outros**: `qrcode.react` (Geração de QR Code)

## 📦 Instalação e Execução

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/eventsync-front.git
    cd eventsync-front
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure o Backend:**
    Certifique-se de que a API do EventSync esteja rodando em `http://localhost:3333` (ou configure em `src/lib/api.ts`).

4.  **Rode o projeto:**
    ```bash
    npm run dev
    ```

5.  **Acesse:**
    Abra `http://localhost:5173` no seu navegador.

## 📱 Estrutura do Projeto

- `src/pages`: Telas da aplicação (SignIn, SignUp, EventList, MyRegistrations, Ticket).
- `src/components`: Componentes reutilizáveis.
- `src/services`: Camada de comunicação com a API.
- `src/context`: Gerenciamento de estado global (AuthContext).
- `src/routes`: Configuração de rotas (Public/Private).
- `src/types`: Definições de tipos TypeScript.

---

Desenvolvido para a disciplina de Programação Internet II.
