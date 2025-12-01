# Como Adicionar IDs na Planilha - MÉTODO MANUAL (RECOMENDADO)

## ⚡ Método Rápido e Simples

Ao invés de usar o script automático (que tem problemas com a API do SheetDB), você pode adicionar os IDs manualmente no Google Sheets de forma muito rápida:

### Passo a Passo:

#### 1. Abra sua Planilha "Estoque" no Google Sheets

#### 2. Insira uma nova coluna "id" como PRIMEIRA coluna
   - Clique com botão direito na coluna A (onde está "material" atualmente)
   - Selecione "Inserir 1 coluna à esquerda"
   - Na célula A1, digite: **id**

#### 3. Adicione IDs automaticamente com fórmula:
   - Na célula A2, digite: `=ROW()-1`
   - Isso criará o ID 1 para o primeiro item
   
#### 4. Copie a fórmula para todas as linhas:
   - Clique na célula A2
   - Posicione o mouse no canto inferior direito da célula até aparecer um "+"
   - Arraste para baixo até a última linha com dados
   
   **OU use o atalho:**
   - Selecione A2
   - Pressione Ctrl+C (copiar)
   - Selecione o intervalo A2:A[última linha]
   - Pressione Ctrl+V (colar)

#### 5. Converter fórmulas em valores (IMPORTANTE!):
   - Selecione toda a coluna ID (A2 até a última linha)
   - Ctrl+C (copiar)
   - Clique com botão direito → "Colar especial" → "Colar somente valores"
   - Isso converte as fórmulas em números fixos

#### 6. Pronto! ✅
   Agora sua planilha tem IDs sequenciais:
   ```
   | id | material        | estoqueAtual | estoqueCritico | ...
   |----|-----------------|--------------|----------------|
   | 1  | Luva G          | 100          | 50             |
   | 2  | Bota 42         | 30           | 10             |
   | 3  | Capacete Branco | 15           | 5              |
   ```

---

## 💡 Próximos Passos

Depois de adicionar os IDs:

1. **Verifique no navegador** se os IDs aparecem quando você acessa a planilha
2. **Crie a planilha "Inventario"** no mesmo Google Sheets:
   - Nova aba chamada "Inventario"
   - Colunas:dataHora | idItem | material | estoqueVirtual | estoqueFisico | diferenca | usuario | status
     ```

3. **Adicione a planilha "Inventario" no SheetDB**:
   - Vá em sheetdb.io
   - Adicione a nova aba "Inventario"

4. **Me avise quando terminar** para eu finalizar a integração do sistema de inventário!

---

## ❓ Por que não usar o script automático?

O SheetDB exige uma "chave primária" para fazer UPDATE em registros individuais. Como não sabemos qual campo está configurado como chave (pode ser "material" ou outro), o script pode falhar.

O método manual é:
- ✅ Mais rápido (30 segundos)
- ✅ Mais confiável
- ✅ Sem riscos de erros de API
- ✅ Você tem controle total
