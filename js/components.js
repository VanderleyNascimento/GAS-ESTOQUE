// UI Components
// =====================================

const Components = {

    // Calculate advanced KPIs
    calculateKPIs(stock, movements) {
        const total = stock.length;
        const critical = stock.filter(item => item.estoqueAtual <= item.estoqueCritico).length;
        const totalSaidas = stock.reduce((sum, item) => sum + (parseInt(item.qtdRetiradas) || 0), 0);
        const epis = stock.filter(item => item.epiAtivo === 'Sim' || item.epiAtivo == 1).length;

        // Turnover Rate: Total withdrawals / Average stock
        const avgStock = stock.reduce((sum, i) => sum + i.estoqueAtual, 0) / (total || 1);
        const turnover = (totalSaidas / avgStock).toFixed(2);

        // Coverage: Average days of stock coverage
        const recentMovements = movements.filter(m => {
            const date = new Date(m.dataHora);
            const daysDiff = (new Date() - date) / (1000 * 60 * 60 * 24);
            return daysDiff <= 30 && m.tipoOperacao === 'Retirada';
        });
        const dailyConsumption = recentMovements.reduce((sum, m) => sum + (parseInt(m.quantidade) || 0), 0) / 30;
        const coverage = dailyConsumption > 0 ? Math.floor(avgStock / dailyConsumption) : 999;

        return { total, critical, turnover, coverage, epis };
    },

    // Set button loading state
    setButtonLoading(btnId, isLoading, loadingText = 'Processando...') {
        const btn = document.getElementById(btnId);
        if (!btn) return;

        if (isLoading) {
            btn.dataset.originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin mr-2"></i>${loadingText}`;
            btn.classList.add('opacity-75', 'cursor-not-allowed');
        } else {
            btn.disabled = false;
            btn.innerHTML = btn.dataset.originalText || 'Salvar';
            btn.classList.remove('opacity-75', 'cursor-not-allowed');
        }
    },

    // Show toast notification
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `fixed top-20 right-4 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-semibold z-50 fade-in ${type === 'success' ? 'bg-emerald-600' :
            type === 'error' ? 'bg-red-600' :
                type === 'warning' ? 'bg-amber-600' :
                    'bg-blue-600'
            }`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // Render KPIs
    renderKPIs(stock, movements) {
        const kpis = this.calculateKPIs(stock, movements);

        document.getElementById('kpi-total').textContent = kpis.total;
        document.getElementById('kpi-critico').textContent = kpis.critical;
        document.getElementById('kpi-turnover').textContent = kpis.turnover + 'x';
        document.getElementById('kpi-coverage').textContent = kpis.coverage > 999 ? '∞' : kpis.coverage;
    },

    // Render activity list
    renderActivity(movements) {
        const container = document.getElementById('activity-list');

        if (!movements || movements.length === 0) {
            container.innerHTML = '<p class="text-sm text-slate-400 text-center py-4">Nenhuma movimentação recente</p>';
            return;
        }

        const recent = movements.slice(0, 10);
        container.innerHTML = recent.map(mov => {
            const isRetirada = mov.tipoOperacao === 'Retirada';
            return `
                <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center ${isRetirada ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                }">
                        <i class="fa-solid ${isRetirada ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="font-semibold text-sm text-slate-900 truncate">${mov.material || 'Item'}</p>
                        <p class="text-xs text-slate-500">${mov.email ? mov.email.split('@')[0] : 'Sistema'}</p>
                    </div>
                    <span class="font-bold text-sm ${isRetirada ? 'text-red-600' : 'text-emerald-600'}">
                        ${isRetirada ? '-' : '+'}${mov.quantidade || 0}
                    </span>
                </div>
            `;
        }).join('');
    },

    // Render materials table
    renderMaterialsTable(stock) {
        const tbody = document.getElementById('materials-table');

        if (!stock || stock.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-4 py-8 text-center text-sm text-slate-500">
                        Nenhum material encontrado
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = stock.map(item => {
            const isCritical = item.estoqueAtual <= item.estoqueCritico;
            const isWarning = !isCritical && item.estoqueAtual <= item.estoqueCritico * 1.5;
            const isEpi = item.epiAtivo === 'Sim' || item.epiAtivo == 1;

            let statusBadge = '';
            if (isCritical) {
                statusBadge = '<span class="px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full">Crítico</span>';
            } else if (isWarning) {
                statusBadge = '<span class="px-2 py-1 text-xs font-semibold bg-amber-100 text-amber-700 rounded-full">Atenção</span>';
            } else {
                statusBadge = '<span class="px-2 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">OK</span>';
            }

            return `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-4 py-3">
                        <div class="flex items-center gap-2">
                            <span class="font-semibold text-sm text-slate-900">${item.material}</span>
                        </div>
                    </td>
                    <td class="px-4 py-3 text-center">
                        <span class="font-bold text-sm ${isCritical ? 'text-red-600' : 'text-slate-900'}">${item.estoqueAtual}</span>
                    </td>
                    <td class="px-4 py-3 text-center text-sm text-slate-600">${item.estoqueCritico}</td>
                    <td class="px-4 py-3 text-center">${statusBadge}</td>
                    <td class="px-4 py-3 text-center">
                        ${isEpi ? '<span class="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full">EPI</span>' : '<span class="px-2 py-1 text-xs font-semibold bg-slate-100 text-slate-600 rounded-full">Material</span>'}
                    </td>
                    <td class="px-4 py-3 text-center">
                        <div class="flex items-center justify-center gap-2">
                            <button onclick="openQRModal('${item.material}')" class="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors" title="QR Code">
                                <i class="fa-solid fa-qrcode"></i>
                            </button>
                            ${(() => {
                    const user = window.getCurrentUser ? window.getCurrentUser() : null;
                    const isAdmin = user && user.cargo === 'Administrador';
                    return isAdmin ? `
                            <button onclick="confirmDelete('${item.material}')" class="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Excluir">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                            ` : '';
                })()}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },
};

// Global helper functions
function adjustQuantity(delta) {
    const input = document.getElementById('movement-qty');
    if (!input) return;
    let val = parseInt(input.value) || 1;
    val += delta;
    if (val < 1) val = 1;
    input.value = val;
}

// handleMovement removed as it's no longer used
// handleMaterialAction removed as it's no longer used

async function confirmDelete(material) {
    if (!confirm(`Tem certeza que deseja excluir o item "${material}"?\nEsta ação não pode ser desfeita.`)) {
        return;
    }

    try {
        Components.showToast('Excluindo item...', 'info');
        await API.deleteItem(material);
        Components.showToast('Item excluído com sucesso!', 'success');
        if (window.loadData) window.loadData();
    } catch (error) {
        console.error(error);
        Components.showToast('Erro ao excluir item.', 'error');
    }
}

// Report Manager
Components.openReportModal = function () {
    console.log('🔘 Open Report Modal called');
    document.getElementById('modal-report').classList.remove('hidden');
};

Components.generateReport = function () {
    const statusFilter = document.getElementById('report-status').value;
    const categoryFilter = document.getElementById('report-category').value;

    let items = [...window.stockData];

    // Filter by Status
    if (statusFilter === 'critical') {
        items = items.filter(i => i.estoqueAtual <= i.estoqueCritico);
    } else if (statusFilter === 'warning') {
        items = items.filter(i => i.estoqueAtual <= i.estoqueCritico * 1.5);
    }

    // Filter by Category
    if (categoryFilter === 'epi') {
        items = items.filter(i => i.epiAtivo === 'Sim' || i.epiAtivo == 1);
    } else if (categoryFilter === 'material') {
        items = items.filter(i => i.epiAtivo !== 'Sim' && i.epiAtivo != 1);
    }

    if (items.length === 0) {
        Components.showToast('Nenhum item encontrado com os filtros selecionados.', 'warning');
        return;
    }

    // Generate HTML
    const date = new Date().toLocaleDateString('pt-BR');
    const time = new Date().toLocaleTimeString('pt-BR');

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
                < html >
        <head>
            <title>Relatório de Compras - ${date}</title>
            <style>
                body { font-family: sans-serif; padding: 20px; }
                h1 { margin-bottom: 5px; }
                .header { margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
                th { background-color: #f3f4f6; font-weight: bold; }
                .critical { color: red; font-weight: bold; }
                .warning { color: orange; font-weight: bold; }
                @media print {
                    button { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Relatório de Sugestão de Compras</h1>
                <p>Gerado em: ${date} às ${time}</p>
                <p>Filtros: Status (${statusFilter === 'all' ? 'Todos' : statusFilter}), Categoria (${categoryFilter === 'all' ? 'Todas' : categoryFilter})</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Material</th>
                        <th>Tipo</th>
                        <th>Estoque Atual</th>
                        <th>Mínimo</th>
                        <th>Sugestão de Compra</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(item => {
        const current = item.estoqueAtual;
        const min = item.estoqueCritico;
        const suggestion = Math.max(0, (min * 2) - current);
        const isCritical = current <= min;
        const tipo = (item.epiAtivo === 'Sim' || item.epiAtivo == 1) ? 'EPI' : 'Material';

        return `
                        <tr>
                            <td>${item.material}</td>
                            <td>${tipo}</td>
                            <td class="${isCritical ? 'critical' : ''}">${current}</td>
                            <td>${min}</td>
                            <td><strong>${suggestion}</strong></td>
                        </tr>
                        `;
    }).join('')}
                </tbody>
            </table>
            <script>
                window.onload = function() { window.print(); }
            </script>
        </body>
        </html >
    `);
    printWindow.document.close();
};

// Expose functions to window for HTML onclick access
window.adjustQuantity = adjustQuantity;
window.confirmDelete = confirmDelete;
