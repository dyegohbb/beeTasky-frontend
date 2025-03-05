# BeeTasky - Frontend

Sistema de gerenciamento de tarefas desenvolvido com Angular 19.

## Tecnologias

- Angular 19
- TailwindCSS 4
- SweetAlert2
- NgxToastr
- NgxBootstrap

## Pré-requisitos

- Node.js
- npm
- Angular CLI 19\

## Instalação
1. Clone o repositório

```bash
git clone git@github.com:seu-usuario/beeTasky-frontend.git
cd beeTasky-frontend
```

2. Instale as dependências:

```bash
npm install
```
3. Configure o proxy:

O projeto utiliza um proxy para se comunicar com o backend. Certifique-se de que o arquivo `proxy.conf.json` está configurado corretamente:

```json
{
    "/api": {
        "target": "http://localhost:8080",
        "secure": false,
        "changeOrigin": true,
        "pathRewrite": {
            "^/api": ""
        }
    }
}
```

4. Inicie o projeto com proxy:

```bash
ng serve --proxy-config proxy.conf.json
```

O aplicativo estará disponível em `http://localhost:4200`

## Funcionalidades

- Autenticação de usuários
- Registro de novos usuários
- Gerenciamento de tarefas (CRUD)
- Respostas intuitivas e visuais
- Filtros e ordenação
- Paginação

## Estrutura do projeto

```
src/
├── app/
│ ├── core/         # Serviços, guards, models e interceptors
│ ├── features/     # Módulos principais da aplicação
│ │ ├── auth/       # Autenticação e registro
│ │ ├── tasks/      # Gerenciamento de tarefas
│ │ ├── home/       # Página inicial
│ │ └── contact/    # Página de contato
│ └── shared/       # Componentes compartilhados
```

