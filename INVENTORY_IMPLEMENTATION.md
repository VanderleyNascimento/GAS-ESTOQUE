# Inventory System - Additional HTML & JS Code

## 1. Adicionar à index.html - Nova Aba Navigation

```html
<!-- Adicionar após tab-materials -->
<button onclick="switchTab('inventory')" id="tab-inventory"
    class="tab-btn px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all">
    <i class="fa-solid fa-clipboard-check mr-2"></i>Inventário
</button>
```

## 2. Adicionar à index.html - View de Inventário  

```html
<!-- Adicionar após view-materials, antes de </main> -->
<div id="view-inventory" class="hidden space-y-6">
    <!-- Cabeçalho -->
    <div class="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
        <h2 class="text-2xl font-bold mb-2">📋 Gestão de Inventário</h2>
        <p class="text-purple-100 text-sm">Contagem física e reconciliação de estoque</p>
        <p class="text-purple-200 text-xs mt-2">🔒 Acesso: Administradores</p>
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
    <div id="inventory-list" class="space-y-3">
        <!-- Populated by inventory.js -->
    </div>

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
        <div id="inventory-history">
            <!-- Populated by inventory.js -->
        </div>
    </div>
</div>
```

## 3. Adicionar à index.html - Campo de Busca em Materiais

```html
<!-- Adicionar logo antes de <div id="view-materials" ...> -->
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
    
    <!-- Resto do conteúdo de materiais ... -->
```

## 4. Adicionar ao index.html - Import do inventory.js

```html
<!-- Adicionar antes de </body>, após outros scripts -->
<script src="js/inventory.js"></script>
```

## 5. Atualizar app.js - switchTab function

```javascript
// Atualizar switchTab para incluir inventory
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
    document.getElementById('view-inventory').classList.add('hidden'); // ADICIONAR

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

    // Load inventory history when switching to inventory tab
    if (tabName === 'inventory') {
        Inventory.loadHistory();
        Inventory.renderCurrentItems();
    }
};
```

## 6. Atualizar app.js - Event Listeners

```javascript
function setupEventListeners() {
    // ... existing listeners ...

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

    // ... rest of listeners ...
}
```

## 7. Normalizar dados com ID em app.js

```javascript
// Atualizar loadData para incluir ID
window.stockData = stock.map(item => ({
    id: parseInt(item.id) || null,  // ADICIONAR
    material: item.material || '',
    estoqueAtual: parseInt(item.estoqueAtual) || 0,
    estoqueCritico: parseInt(item.estoqueCritico) || 0,
    qtdRetiradas: parseInt(item.qtdRetiradas) || 0,
    epiAtivo: item.epiAtivo
}));
```

## 8. Atualizar scanner.js - Buscar por ID

```javascript
// Atualizar searchAndOpenItem
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

## 9. Atualizar qrcode-manager.js - Usar ID no QR Code

```javascript
// Atualizar generateQRCode
generateQRCode(item) {
    // Usar ID se disponível, senão usar nome (fallback)
    const qrData = item.id ? item.id.toString() : item.material;
    
    // ... rest of the function ...
    
    new QRCode(qrCodeDiv, {
        text: qrData,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff"
    });
}
```
