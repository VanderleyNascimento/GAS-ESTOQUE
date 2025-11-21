# LoggiStock - Gestão de Estoque

## Visão Geral

Este é um **Web App** de gerenciamento de estoque desenvolvido com **HTML**, **Tailwind CSS**, **Font Awesome**, e **JavaScript** puro. Ele permite:

- Visualizar indicadores de desempenho (KPIs) como total de itens, itens críticos, taxa de giro e cobertura de estoque.
- Navegar entre **Dashboard**, **Analytics** e **Materiais** (lista de itens).
- **Adicionar**, **editar** e **excluir** itens via modal de formulário.
- Gerar **QR Codes** para cada material, imprimir em layout térmico ou A4 e compartilhar via WhatsApp.
- Escanear QR Codes para localizar rapidamente um item.
- Gerar relatórios filtrados por status e categoria.

## Principais Funcionalidades

| Funcionalidade | Descrição |
|----------------|-----------|
| **FAB Buttons** | Botões flutuantes para abrir o scanner, criar novo item e gerar relatório. |
| **Materials View** | Tabela interativa com ações: mover, excluir (admin) e gerar QR Code. |
| **QR Code Modal** | Gerado dinamicamente usando `qrcodejs`; inclui opções de impressão e compartilhamento. |
| **Scanner Modal** | Utiliza `html5-qrcode` para leitura de QR Codes. |
| **Analytics** | Gráficos de itens críticos, status de estoque e comparativo de estoque vs crítico (Chart.js). |
| **Relatório** | Filtro avançado e geração de relatório imprimível. |
| **Autenticação (placeholder)** | Estrutura preparada para integração futura com Google OAuth. |

## Estrutura de Pastas

```
GAS-ESTOQUE/
├─ index.html            # Página principal (HTML + Tailwind + scripts)
├─ css/
│   └─ styles.css       # Estilos customizados
├─ js/
│   ├─ auth.js          # (placeholder) autenticação
│   ├─ api.js           # Funções de comunicação com backend (Sheets)
│   ├─ components.js    # Renderização de tabelas, modais, relatórios
│   ├─ charts.js        # Configuração dos gráficos Chart.js
│   ├─ scanner.js       # Integração com html5-qrcode
│   ├─ qrcode-manager.js# Injeção do modal de QR Code e lógica de impressão/whatsapp
│   └─ app.js           # Inicialização da aplicação, carregamento de dados
└─ index.html.backup    # Backup original do HTML (para restauração)
```

## Como Executar Localmente

1. **Instale as dependências** (não há dependências npm, tudo é carregado via CDN).
2. **Inicie um servidor estático** (ex.: Python) na raiz do projeto:
   ```bash
   cd C:/Users/olive/Documents/GAS-ESTOQUE
   python -m http.server 8000
   ```
3. Abra o navegador em `http://localhost:8000`.
4. A aplicação carregará os dados do Google Sheets (configurados em `js/api.js`).

## Configuração do Google Sheets (API)

- Abra `js/api.js` e ajuste as constantes `SPREADSHEET_ID` e `API_KEY` para o seu projeto.
- As funções `API.getStock()`, `API.getMovements()`, `API.createItem()`, etc., utilizam a API do Google Sheets via **Sheets API v4**.

## QR Code Central

- **Gerar QR Code**: Clique no ícone de QR na coluna **Ações** da tabela de materiais.
- **Impressão**: Selecione o layout (térmico 58 mm ou A4 com 6 códigos) e clique em **Imprimir**.
- **Compartilhar**: Clique em **WhatsApp** para abrir o app com a mensagem contendo o código.
- **Escanear**: Use o botão de scanner (FAB) para abrir o modal de leitura.

## Screenshots

![Projeto LoggiStock UI](file:///C:/Users/olive/.gemini/antigravity/brain/3b4cce9e-4703-4db7-b85d-b73ad61f69ff/uploaded_image_1763694267574.png)

## Contribuição

1. Fork o repositório.
2. Crie uma branch para sua feature (`git checkout -b feature/nome`).
3. Commit suas mudanças (`git commit -m "Descrição"`).
4. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a **MIT License**.
