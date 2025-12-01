# Estrutura do Projeto LoggiStock

```
GAS-ESTOQUE/
│
├── 📄 index.html              # Página principal da aplicação
├── 📄 login.html              # Página de login
├── 📄 criar-usuario.html      # Página de criação de usuário
├── 📄 Code.gs                 # Backend Google Apps Script
├── 📄 README.md               # Documentação do projeto
├── 📄 .gitignore              # Arquivos ignorados pelo Git
│
├── 📁 css/
│   └── styles.css            # Estilos customizados
│
└── 📁 js/
    ├── api.js                # Comunicação com Google Apps Script backend
    ├── app.js                # Inicialização e controle principal
    ├── auth.js               # Sistema de autenticação
    ├── charts.js             # Gráficos e analytics (Chart.js)
    ├── components.js         # Componentes e renderização de UI
    ├── qrcode-manager.js     # Gerenciamento de QR Codes
    └── scanner.js            # Scanner de QR Codes
```

## Descrição dos Arquivos

### HTML
- **index.html**: Interface principal com dashboard, analytics e tabela de materiais
- **login.html**: Tela de autenticação de usuários
- **criar-usuario.html**: Formulário de registro de novos usuários

### Backend
- **Code.gs**: Servidor no Google Apps Script que gerencia Sheets (Estoque, Movimentações, Usuários)

### JavaScript Modules
- **api.js**: Camada de comunicação HTTP com o backend GAS
- **app.js**: Ponto de entrada, gerencia state global e navegação
- **auth.js**: Login, logout, verificação de permissões
- **charts.js**: Configuração de todos os gráficos (críticos, status, comparação, timeline)
- **components.js**: Renderiza tabelas, modais, formulários e relatórios
- **qrcode-manager.js**: Geração, impressão e compartilhamento de QR Codes
- **scanner.js**: Integração com câmera para leitura de QR Codes

### CSS
- **styles.css**: Classes personalizadas, animações e ajustes do Tailwind

## Dependências Externas (CDN)
- Tailwind CSS
- Font Awesome 6.4.0
- Chart.js 4.4.0
- html5-qrcode
- qrcodejs 1.0.0
