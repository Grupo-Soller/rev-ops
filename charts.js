// charts.js - Configuração e criação de todos os gráficos com verificações

document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que data.js foi carregado
    setTimeout(function() {
        initializeCharts();
    }, 100);
});

function initializeCharts() {
    // Verificar se os dados existem
    if (!window.SollerData) {
        console.error('SollerData não encontrado. Verifique se data.js foi carregado antes de charts.js');
        return;
    }
    
    // Configurações globais do Chart.js
    Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    Chart.defaults.color = '#1f2937';
    
    // Criar todos os gráficos
    createAllCharts();
}

// Função principal para criar todos os gráficos
function createAllCharts() {
    // 1. Gráfico de Origem dos Leads
    createSourceChart();
    
    // 2. Gráfico de Contratos
    createContractsChart();
    
    // 3. Gráfico GMV
    createGMVChart();
    
    // 4. Gráfico de Nichos (já criado em main.js)
    // createNichesChart() é chamado em main.js
}

// Função para criar gráfico de origem dos leads
function createSourceChart() {
    const sourceCtx = document.getElementById('sourceChart');
    if (!sourceCtx) return;
    
    // Verificar dados
    if (!window.SollerData.leadSource || !window.SollerData.leadSource.distribution) {
        console.warn('Dados de origem dos leads não encontrados');
        return;
    }
    
    // Destruir gráfico existente se houver
    if (sourceCtx.chart) {
        sourceCtx.chart.destroy();
    }
    
    sourceCtx.chart = new Chart(sourceCtx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Outbound', 'Inbound'],
            datasets: [{
                data: [
                    window.SollerData.leadSource.distribution.outbound.count,
                    window.SollerData.leadSource.distribution.inbound.count
                ],
                backgroundColor: ['#00A8FF', '#FF375F'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    reverse: true,
                    labels: {
                        padding: 20,
                        font: {
                            size: 14
                        },
                        color: '##666666'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Função para criar gráfico de contratos
function createContractsChart() {
    const contractsCtx = document.getElementById('contractsChart');
    if (!contractsCtx) return;
    
    // Verificar dados
    if (!window.SollerData.contracts || !window.SollerData.contracts.data) {
        console.warn('Dados de contratos não encontrados');
        return;
    }
    
    // Destruir gráfico existente se houver
    if (contractsCtx.chart) {
        contractsCtx.chart.destroy();
    }
    
    contractsCtx.chart = new Chart(contractsCtx.getContext('2d'), {
        type: 'line', // MUDANÇA: Voltando para gráfico de linha
        data: {
            labels: window.SollerData.contracts.labels,
            datasets: [
                {
                    label: '2023',
                    data: window.SollerData.contracts.data[2023],
                    borderColor: '#00A8FF',
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6
                },
                {
                    label: '2024',
                    data: window.SollerData.contracts.data[2024],
                    borderColor: '#FF375F',
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6
                },
                {
                    label: '2025',
                    data: window.SollerData.contracts.data[2025],
                    borderColor: '#00FF84',
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                title: {
                    display: false // Removendo título do gráfico
                },
                legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: false,
                        padding: 20,
                        font: {
                            size: 12
                        }, color: '#666666'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.parsed.y === null) {
                                return context.dataset.label + ': Sem dados';
                            }
                            return context.dataset.label + ': ' + context.parsed.y + ' contratos';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: 150,
                    ticks: {
                        stepSize: 15,
                        color: '#666'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        color: '#666'
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function createGMVChart() {
    const gmvCtx = document.getElementById('gmvChart');
    if (!gmvCtx) return;

    // Destruir gráfico existente de forma segura
    const existingChart = Chart.getChart(gmvCtx);
    if (existingChart) {
        existingChart.destroy();
    }

    // Verificar dados
    if (!window.SollerData.gmv || !window.SollerData.gmv.values || !window.SollerData.gmv.values2) {
        console.warn('Dados de GMV ou de Valor Soller não encontrados');
        return;
    }

    // Preparar dados agrupados por mês
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    // Separar dados por ano
    const data2023_gmv = window.SollerData.gmv.values.slice(0, 12);
    const data2024_gmv = window.SollerData.gmv.values.slice(12, 24);
    const data2025_gmv = window.SollerData.gmv.values.slice(24, 36);

    const data2023_soller = window.SollerData.gmv.values2.slice(0, 12);
    const data2024_soller = window.SollerData.gmv.values2.slice(12, 24);
    const data2025_soller = window.SollerData.gmv.values2.slice(24, 36);

    // Dados de margem (se existirem)
    const data2023_margin = window.SollerData.gmv.values3 ? window.SollerData.gmv.values3.slice(0, 12) : null;
    const data2024_margin = window.SollerData.gmv.values3 ? window.SollerData.gmv.values3.slice(12, 24) : null;
    const data2025_margin = window.SollerData.gmv.values3 ? window.SollerData.gmv.values3.slice(24, 36) : null;

    const chartConfig = {
        type: 'bar', // Tipo principal do gráfico
        data: {
            labels: months,
            datasets: [
                // Datasets de GMV como barras
                {
                    label: 'GMV 2023',
                    data: data2023_gmv,
                    type: 'bar',
                    backgroundColor: '#00A8FF',
                    borderRadius: 4,
                    yAxisID: 'y',
                    order: 1
                },
                {
                    label: 'GMV 2024',
                    data: data2024_gmv,
                    type: 'bar',
                    backgroundColor: '#FF375F',
                    borderRadius: 4,
                    yAxisID: 'y',
                    order: 1
                },
                {
                    label: 'GMV 2025',
                    data: data2025_gmv.map((val, idx) => idx < 7 ? val : null),
                    type: 'bar',
                    backgroundColor: '#00FF84',
                    borderRadius: 4,
                    yAxisID: 'y',
                    order: 1
                },
                // Datasets de Soller como linhas
                {
                    label: 'Soller 2023',
                    data: data2023_soller,
                    type: 'line',
                    borderColor: '#00A8FF',
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    yAxisID: 'y2',
                    order: 0
                },
                {
                    label: 'Soller 2024',
                    data: data2024_soller,
                    type: 'line',
                    borderColor: '#FF375F',
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    yAxisID: 'y2',
                    order: 0
                },
                {
                    label: 'Soller 2025',
                    data: data2025_soller.map((val, idx) => idx < 7 ? val : null),
                    type: 'line',
                    borderColor: '#00FF84',
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    yAxisID: 'y2',
                    order: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            layout: {
                padding: {
                    right: 40
                }
            },
            plugins: {
                title: {
                    display: false
                },
                legend: {
                    display: true,
                    position: 'top',
                    align: 'middle',
                    labels: {
                        usePointStyle: false,
                        padding: 10,
                        font: {
                            size: 12
                        },
                        color: '#f4f4f4',
                        // Lógica para gerar as legendas agrupadas na ordem GMV, Soller
                        generateLabels: function(chart) {
                            const datasets = chart.data.datasets;
                            const customLabels = [];

                            // Adicionar o cabeçalho 'GMV'
                            customLabels.push({ text: 'GMV', category: 'GMV', fontColor: '#666666', fillStyle: 'transparent', strokeStyle: 'transparent', hidden: false });

                            // Adicionar os anos de GMV (ordem decrescente)
                            datasets.forEach((dataset, index) => {
                                if (dataset.label.includes('GMV')) {
                                    customLabels.push({
                                        text: dataset.label.split(' ')[1],
                                        fillStyle: dataset.backgroundColor,
                                        strokeStyle: 'transparent',
                                        hidden: !chart.isDatasetVisible(index),
                                        datasetIndex: index,
                                        fontColor: '#666666'
                                    });
                                }
                            });

                            // Adicionar espaço extra entre os grupos
                            customLabels.push({ text: ' ', fontColor: '#f4f4f4', fillStyle: 'transparent', strokeStyle: 'transparent', hidden: false, extraPadding: true });
                            customLabels.push({ text: ' ', fontColor: '#f4f4f4', fillStyle: 'transparent', strokeStyle: 'transparent', hidden: false, extraPadding: true });

                            // Adicionar o cabeçalho 'Soller'
                            customLabels.push({ text: 'Soller', category: 'Soller', fontColor: '#666666', fillStyle: 'transparent', strokeStyle: 'transparent', hidden: false });

                            // Adicionar os anos de Soller (ordem decrescente)
                            datasets.forEach((dataset, index) => {
                                if (dataset.label.includes('Soller')) {
                                    customLabels.push({
                                        text: dataset.label.split(' ')[1],
                                        fillStyle: 'transparent',
                                        strokeStyle: dataset.borderColor,
                                        lineWidth: 3,
                                        hidden: !chart.isDatasetVisible(index),
                                        datasetIndex: index,
                                        fontColor: '#666666'
                                    });
                                }
                            });
                            return customLabels;
                        },
                        filter: function(item) {
                            return item.text !== '';
                        }
                    },
                    // Lógica aprimorada para o clique nas legendas
                    onClick: (e, legendItem, legend) => {
                        const ci = legend.chart;

                        // Ignora cliques em itens de espaço ou cabeçalhos que não são categorias
                        if (legendItem.text === ' ') return;

                        if (legendItem.category) {
                            // Clicou no cabeçalho (GMV ou Soller)
                            const category = legendItem.category;
                            let datasetsToToggle = ci.data.datasets.filter(ds => ds.label.includes(category));

                            // Verifica se todos os datasets da categoria estão visíveis
                            let allVisible = datasetsToToggle.every((ds, idx) => ci.isDatasetVisible(idx));

                            // Se todos estiverem visíveis, esconde todos. Se pelo menos um estiver escondido, mostra todos.
                            datasetsToToggle.forEach((dataset, idx) => {
                                const datasetIndex = ci.data.datasets.indexOf(dataset);
                                ci.setDatasetVisibility(datasetIndex, !allVisible);
                            });
                        } else {
                            // Clicou em um ano individual
                            ci.setDatasetVisibility(legendItem.datasetIndex, !ci.isDatasetVisible(legendItem.datasetIndex));
                        }

                        ci.update();
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 12
                    },
                    padding: 14,
                    displayColors: false, // Desabilitar as cores padrão
                    callbacks: {
                        // Callback para o título do tooltip
                        title: function(tooltipItems) {
                            return tooltipItems[0].label;
                        },
                        // Remover labels padrão
                        label: function() {
                            return null;
                        },
                        // Adicionar conteúdo customizado após o título
                        afterTitle: function(tooltipItems) {
                            const monthIndex = tooltipItems[0].dataIndex;
                            const chart = tooltipItems[0].chart;
                            const lines = [];
                            
                            // Definir cores dos anos
                            const yearColors = {
                                '2025': '🟢',
                                '2024': '🔴',
                                '2023': '🔵'
                            };
                            
                            // GMV - sempre mostrar se houver dados
                            lines.push('GMV');
                            
                            // Verificar e adicionar GMV 2025
                            if (monthIndex < 7 && data2025_gmv[monthIndex] && chart.isDatasetVisible(2)) {
                                const value = new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(data2025_gmv[monthIndex]);
                                lines.push(`${yearColors['2025']} 2025: ${value}`);
                            }
                            
                            // Verificar e adicionar GMV 2024
                            if (data2024_gmv[monthIndex] && chart.isDatasetVisible(1)) {
                                const value = new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(data2024_gmv[monthIndex]);
                                lines.push(`${yearColors['2024']} 2024: ${value}`);
                            }
                            
                            // Verificar e adicionar GMV 2023
                            if (data2023_gmv[monthIndex] && chart.isDatasetVisible(0)) {
                                const value = new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(data2023_gmv[monthIndex]);
                                lines.push(`${yearColors['2023']} 2023: ${value}`);
                            }
                            
                            // Adicionar espaçamento entre GMV e Soller
                            lines.push('');
                            
                            // Soller - sempre mostrar se houver dados
                            lines.push('Soller');
                            
                            // Armazenar quais anos de Soller estão visíveis
                            const sollerVisibility = {
                                '2025': false,
                                '2024': false,
                                '2023': false
                            };
                            
                            // Verificar e adicionar Soller 2025
                            if (monthIndex < 7 && data2025_soller[monthIndex] && chart.isDatasetVisible(5)) {
                                sollerVisibility['2025'] = true;
                                const value = new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(data2025_soller[monthIndex]);
                                lines.push(`${yearColors['2025']} 2025: ${value}`);
                            }
                            
                            // Verificar e adicionar Soller 2024
                            if (data2024_soller[monthIndex] && chart.isDatasetVisible(4)) {
                                sollerVisibility['2024'] = true;
                                const value = new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(data2024_soller[monthIndex]);
                                lines.push(`${yearColors['2024']} 2024: ${value}`);
                            }
                            
                            // Verificar e adicionar Soller 2023
                            if (data2023_soller[monthIndex] && chart.isDatasetVisible(3)) {
                                sollerVisibility['2023'] = true;
                                const value = new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(data2023_soller[monthIndex]);
                                lines.push(`${yearColors['2023']} 2023: ${value}`);
                            }
                            
                            // Margem - só mostrar se houver dados E se o respectivo Soller estiver visível
                            if (window.SollerData.gmv.values3) {
                                let hasMargin = false;
                                const marginLines = [];
                                
                                // Verificar Margem 2025
                                if (monthIndex < 7 && data2025_margin && data2025_margin[monthIndex] > 0 && sollerVisibility['2025']) {
                                    hasMargin = true;
                                    marginLines.push(`${yearColors['2025']} 2025: ${data2025_margin[monthIndex].toFixed(1)}%`);
                                }
                                
                                // Verificar Margem 2024
                                if (data2024_margin && data2024_margin[monthIndex] > 0 && sollerVisibility['2024']) {
                                    hasMargin = true;
                                    marginLines.push(`${yearColors['2024']} 2024: ${data2024_margin[monthIndex].toFixed(1)}%`);
                                }
                                
                                // Verificar Margem 2023
                                if (data2023_margin && data2023_margin[monthIndex] > 0 && sollerVisibility['2023']) {
                                    hasMargin = true;
                                    marginLines.push(`${yearColors['2023']} 2023: ${data2023_margin[monthIndex].toFixed(1)}%`);
                                }
                                
                                // Só adicionar seção de Margem se houver dados para mostrar
                                if (hasMargin) {
                                    // Adicionar espaçamento antes de Margem
                                    lines.push('');
                                    lines.push('Margem');
                                    lines.push(...marginLines);
                                }
                            }
                            
                            return lines;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    position: 'left',
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + (value / 1000000).toFixed(1) + 'M';
                        },
                        color: '#666'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y2: {
                    beginAtZero: true,
                    position: 'right',
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + (value / 1000).toFixed(0) + 'K';
                        },
                        color: '#666'
                    },
                    grid: {
                        display: false
                    }
                },
                x: {
                    ticks: {
                        color: '#666'
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    };
    
    gmvCtx.chart = new Chart(gmvCtx.getContext('2d'), chartConfig);
}

// Função createCharts global para compatibilidade
window.createCharts = function() {
    createAllCharts();

};
