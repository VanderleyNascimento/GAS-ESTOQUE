# INTEGRAÇÕES FINAIS - Sistema de Inventário
## Copie e cole os códigos abaixo nos locais indicados

---

## 1️⃣ ADICIONAR ao index.html - ANTES do fechamento de `</main>` (linha ~257)

```html
        <!-- Inventory View -->
        <div id="view-inventory" class="hidden space-y-6">
            <!-- Cabeçalho -->
            <div class="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
                <h2 class="text-2xl font-bold mb-2">📋 Gestão de Inventário</h2>
                <p class="text-purple-100 text-sm">Contagem física e reconciliação de estoque</p>
                <p class="text-purple-200 text-xs mt-2">🔒 Acesso:Administradores</p>
            </div>

            <!-- Scanner/Busca -->
            <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <div class="flex gap-3">
                    <input type="text" id="inventory-search" placeholder="Digite o ID ou nome do item..." 
                        class="flex-1 px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none">
                    <button onclick="Inventory.startCount()" 
                        class="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                        <i class="fa-solid fa-plus mr-2"></i>Adicionar
                    </button>
                </div>
            </div>

            <!-- Lista de itens em inventário -->
            <div id="inventory-list" class="space-y-3"></div>

            <!-- Resumo do inventário -->
            <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <h3 class="font-bold text-lg mb-4">📊 Resumo da Contagem</h3>
                <div class="grid grid-cols-3 gap-4 mb-4">
                    <div class="text-center p-4 bg-purple-50 rounded-lg">
                        <p class="text-3xl font-black text-purple-600" id="inv-total">0</p>
                        <p class="text-xs text-slate-600 mt-1">Itens Contados</p>
                    </div>
                    <div class="text-center p-4 bg-green-50 rounded-lg">
                        <p class="text-3xl font-black text-green-600" id="inv-sobras">0</p>
                        <p class="text-xs text-slate-600 mt-1">Sobras (+)</p>
                    </div>
                    <div class="text-center p-4 bg-red-50 rounded-lg">
                        <p class="text-3xl font-black text-red-600" id="inv-faltas">0</p>
                        <p class="text-xs text-slate-600 mt-1">Faltas (-)</p>
                    </div>
                </div>
                <button onclick="Inventory.finalize()" id="btn-finalize-inventory"
                    class="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <i class="fa-solid fa-check-double mr-2"></i>Finalizar Balanço
                </button>
            </div>

            <!-- Histórico de Inventários -->
            <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <h3 class="font-bold text-lg mb-4">🕐 Histórico de Inventários</h3>
                <div id="inventory-history"></div>
            </div>
        </div>
```

---

## 2️⃣ ADICIONAR ao index.html - Campo de busca em Materiais

Localize a linha que contém `<!-- Materials View -->` e `<div id="view-materials"...`

SUBSTITUA por:

```html
        <!-- Materials View -->
        <div id="view-materials" class="hidden space-y-6">
            <!-- Campo de busca -->
            <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <div class="relative">
                    <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input type="text" id="search-materials" 
                        placeholder="🔍 Buscar por ID ou nome do material..." 
                        class="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                </div>
            </div>
            <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
```

---

## 3️⃣ ADICIONAR ao index.html - Import do inventory.js

Logo ANTES de `</body>`, APÓS `<script src="js/app.js"></script>`:

```html
    <script src="js/inventory.js"></script>
</body>
```

---

## 4️⃣ ATUALIZAR app.js - switchTab function

Localize a função `switchTab` e SUBSTITUA por:

```javascript
window.switchTab = function (tabName) {
    // Verificar permissões para inventário
    if (tabName === 'inventory') {
        const user = getCurrentUser();
        if (!user || user.cargo !== 'Administrador') {
            Components.showToast('Acesso negado: apenas Administradores', 'error');
            return;
        }
    }

    // Hide all views
    document.getElementById('view-dashboard').classList.add('hidden');
    document.getElementById('view-analytics').classList.add('hidden');
    document.getElementById('view-materials').classList.add('hidden');
    const inventoryView = document.getElementById('view-inventory');
    if (inventoryView) inventoryView.classList.add('hidden');

    // Show selected view
    document.getElementById(`view-${tabName}`).classList.remove('hidden');

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-${tabName}`).classList.add('active');

    window.currentTab = tabName;

    // Render analytics charts when switching to analytics tab
    if (tabName === 'analytics' && window.stockData.length > 0) {
        setTimeout(() => {
            Charts.renderAllAnalytics(window.stockData, window.movementsData);
        }, 100);
    }

    // Load inventory when switching to inventory tab
    if (tabName === 'inventory' && typeof Inventory !== 'undefined') {
        Inventory.loadHistory();
        Inventory.renderCurrentItems();
    }
};
```

---

## 5️⃣ ADICIONAR ao app.js - Event Listeners para Busca

No final da função onde estão os event listeners (depois de `setupEventListeners` ou similar):

```javascript
// Search materials
const searchMaterials = document.getElementById('search-materials');
if (searchMaterials) {
    searchMaterials.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = window.stockData.filter(item =>
            item.material.toLowerCase().includes(searchTerm) ||
            (item.id && item.id.toString() === searchTerm)
        );
        Components.renderMaterialsTable(filtered);
    });
}
```

---

## 6️⃣ ATUALIZAR app.js - Normalizar dados com ID

Na função `loadData`, onde você normaliza `window.stockData`, ADICIONE o campo `id`:

```javascript
window.stockData = stock.map(item => ({
    id: parseInt(item.id) || null,  // ADICIONAR ESTA LINHA
    material: item.material || '',
    estoqueAtual: parseInt(item.estoqueAtual) || 0,
    estoqueCritico: parseInt(item.estoqueCritico) ||  0,
    qtdRetiradas: parseInt(item.qtdRetiradas) || 0,
    epiAtivo: item.epiAtivo
}));
```

---

## 7️⃣ ATUALIZAR scanner.js - Buscar por ID

Localize a função `searchAndOpenItem` e SUBSTITUA por:

```javascript
searchAndOpenItem(text) {
    const cleanText = text.trim();
    
    // Tentar buscar por ID primeiro (se for número)
    if (/^\d+$/.test(cleanText)) {
        const item = window.stockData.find(i => i.id === parseInt(cleanText));
        if (item) {
            Components.openMovementModal(item);
            return;
        }
    }
    
    // Fallback: buscar por nome (compatibilidade com QR codes antigos)
    const item = window.stockData.find(i => 
        i.material.toLowerCase() === cleanText.toLowerCase()
    );
    
    if (item) {
        Components.openMovementModal(item);
    } else {
        Components.showToast('Item não encontrado', 'error');
    }
}
```

---

## 8️⃣ ATUALIZAR qrcode-manager.js - Usar ID no QR Code

Na função `generateQRCode`, MODIFIQUE para usar ID:

```javascript
generateQRCode(item) {
    // Usar ID se disponível, senão usar nome (fallback)
    const qrData = item.id ? item.id.toString() : item.material;
    
    // ... resto do código ...
    
    new QRCode(qrCodeDiv, {
        text: qrData,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff"
    });
}
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [ ] 1. Adicionar view de inventário ao index.html
- [ ] 2. Adicionar campo de busca em materiais
- [ ] 3. Importar inventory.js no index.html
- [ ] 4. Atualizar switchTab no app.js
- [ ] 5. Adicionar event listener de busca no app.js
- [ ] 6. Normalizar dados com ID no app.js
- [ ] 7. Atualizar scanner.js para buscar por ID
- [ ] 8. Atualizar qrcode-manager.js para usar ID

---

## 🚀 TESTANDO

Após aplicar todas as mudanças:

1. Abra `index.html` no navegador
2. Faça login como Administrador
3. Clique na aba "Inventário"
4. Teste adicionar um item digitando ID ou nome
5. Teste o campo de busca na aba Materiais
6. Teste escanear QR Code com ID

**Arquivos já criados:**
- ✅ `js/inventory.js` - Módulo completo
- ✅ `js/api.js` - Endpoints de inventário adicionados
- ✅ `tools/COMO_ADICIONAR_IDS.md` - Guia de IDs
