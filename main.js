// Adicione estas correções no início do main.js, após a importação dos dados

// Garantir que SollerData esteja disponível globalmente
window.SollerData = window.SollerData || {};

// Função para renderizar análise de agências com verificação de dados
function renderAgencyAnalysis() {
    const agencyContainer = document.getElementById('agencyAnalysis');
    if (!agencyContainer) {
        console.warn('Elemento agencyAnalysis não encontrado');
        return;
    }
    
    // Verificar se os dados existem
    if (!window.SollerData || !window.SollerData.agencies) {
        console.warn('Dados de agências não encontrados');
        agencyContainer.innerHTML = '<p>Dados de agências não disponíveis</p>';
        return;
    }
    
    // Estado da ordenação
    let sortColumn = 'contracts';
    let sortDirection = 'desc';
    
    function renderTable() {
    // Ordenar dados
    const sortedAgencies = [...window.SollerData.agencies].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (sortDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    agencyContainer.innerHTML = `
        <div class="agency-table-container">
            <table class="agency-table">
                <thead>
                    <tr>
                        <th>Agência</th>
                        <th class="sortable" onclick="window.sortAgencyTable('contracts')">
                            Contratos que fechamos com a agência
                            ${sortColumn === 'contracts' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                        </th>
                        <th class="sortable" onclick="window.sortAgencyTable('avgMargin')">
                            Média de % Terceiro
                            ${sortColumn === 'avgMargin' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                        </th>
                        <th class="sortable" onclick="window.sortAgencyTable('avgMarginSoller')">
                            Média de % Soller
                            ${sortColumn === 'avgMarginSoller' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                        </th>
                        <th class="sortable" onclick="window.sortAgencyTable('totalValue')">
                            Valor Total dos Contratos
                            ${sortColumn === 'totalValue' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedAgencies.map(agency => `
                        <tr class="${agency.avgMargin >= 101 ? 'high-margin' : ''}">
                            <td>${agency.name}</td>
                            <td class="text-center">${agency.contracts}</td>
                            <td class="text-center">${agency.avgMargin.toFixed(2)}%</td>
                            <td class="text-center">${agency.avgMarginSoller.toFixed(2)}%</td>
                            <td class="text-center">${agency.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>                          
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}
    
    // Função global para ordenação
    window.sortAgencyTable = function(column) {
        if (sortColumn === column) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = column;
            sortDirection = 'desc';
        }
        renderTable();
    };
    
    renderTable();
}

// Função para renderizar ciclo de vendas com verificação
function renderSalesCycleAnalysis() {
    const cycleContainer = document.getElementById('salesCycleAnalysis');
    if (!cycleContainer) {
        console.warn('Elemento salesCycleAnalysis não encontrado');
        return;
    }
    
    // Verificar se os dados existem
    if (!window.SollerData || !window.SollerData.salesCycle || !window.SollerData.salesCycle.bySize) {
        console.warn('Dados de ciclo de vendas não encontrados');
        cycleContainer.innerHTML = '<p>Dados de ciclo de vendas não disponíveis</p>';
        return;
    }
    
    cycleContainer.innerHTML = `
        <div class="cycle-cards-grid">
            ${Object.entries(window.SollerData.salesCycle.bySize).map(([size, data]) => `
                <div class="cycle-card">
                    <h4>${size === 'small' ? 'Pequenas' : size === 'medium' ? 'Médias' : 'Grandes'} Empresas</h4>
                    <div class="metric">
                        <span>Média:</span>
                        <strong>${data.average} dias</strong>
                    </div>
                    <div class="metric">
                        <span>Mediana:</span>
                        <strong>${data.median} dias</strong>
                    </div>
                    <div class="outliers">
                        <h5>Outliers:</h5>
                        ${data.outliers.map(o => `
                            <div class="outlier">
                                ${o.company}: <span style="color: var(--danger-red);">${o.days} dias</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Função para criar o gráfico de nichos com verificação
function createNichesChart() {
    const nichesCtx = document.getElementById('nichesChart');
    if (!nichesCtx) {
        console.warn('Canvas nichesChart não encontrado');
        return;
    }
    
    // Verificar se os dados existem
    if (!window.SollerData || !window.SollerData.niches || !window.SollerData.niches.quarterly) {
        console.warn('Dados de nichos não encontrados');
        return;
    }
    
    // Destruir gráfico existente se houver
    if (nichesCtx.chart) {
        nichesCtx.chart.destroy();
    }
    
    nichesCtx.chart = new Chart(nichesCtx.getContext('2d'), {
        type: 'line',
        data: {
            labels: window.SollerData.niches.quarterly.quarters,
            datasets: [
                {
                    label: 'Márcia Fernandes',
                    data: window.SollerData.niches.quarterly.data.moda,
                    borderColor: '#7c3aed',
                    backgroundColor: 'rgba(124, 58, 237, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Aline Marquez',
                    data: window.SollerData.niches.quarterly.data.saude,
                    borderColor: '#16a34a',
                    backgroundColor: 'rgba(22, 163, 74, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Ellen Milgrau',
                    data: window.SollerData.niches.quarterly.data.beleza,
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Camila Dias',
                    data: window.SollerData.niches.quarterly.data.acessorios,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Edson Celulari',
                    data: window.SollerData.niches.quarterly.data.alimentacao,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
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
                    display: true,
                    text: 'Desde 2023',
                    font: { size: 16, weight: 'bold' },  color: '#666666'
                },
                legend: {
        labels: {
            color: '#666666' // Define a cor branca na legenda
        }
    },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + 
                                new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                }).format(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + (value / 1000) + 'K';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Valor (R$)'
                    }
                }
            }
        }
    });
}

function createNichesChart1() {
    const nichesCtx = document.getElementById('nichesChart1');
    if (!nichesCtx) {
        console.warn('Canvas nichesChart não encontrado');
        return;
    }
    
    // Verificar se os dados existem
    if (!window.SollerData || !window.SollerData.niches || !window.SollerData.niches.quarterly) {
        console.warn('Dados de nichos não encontrados');
        return;
    }
    
    // Destruir gráfico existente se houver
    if (nichesCtx.chart) {
        nichesCtx.chart.destroy();
    }
    
    nichesCtx.chart = new Chart(nichesCtx.getContext('2d'), {
        type: 'line',
        data: {
            labels: window.SollerData.niches.quarterly.quarters,
            datasets: [
                {
                    label: 'Marcia Fernandes',
                    data: window.SollerData.niches.quarterly.data1.moda,
                    borderColor: '#7c3aed',
                    backgroundColor: 'rgba(124, 58, 237, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Camila Dias',
                    data: window.SollerData.niches.quarterly.data1.saude,
                    borderColor: '#16a34a',
                    backgroundColor: 'rgba(22, 163, 74, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Aline Marquez',
                    data: window.SollerData.niches.quarterly.data1.beleza,
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Fernanda Cintra',
                    data: window.SollerData.niches.quarterly.data1.acessorios,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Pedro Novaes',
                    data: window.SollerData.niches.quarterly.data1.alimentacao,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
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
                    display: true,
                    text: 'Em 2025',
                    font: { size: 16, weight: 'bold' },  color: '#666666'
                },
                legend: {
        labels: {
            color: '#666666' // Define a cor branca na legenda
        }
    },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + 
                                new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                }).format(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + (value / 1000) + 'K';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Valor (R$)'
                    }
                }
            }
        }
    });
}

function createNichesChart2() {
    const nichesCtx = document.getElementById('nichesChart2');
    if (!nichesCtx) {
        console.warn('Canvas nichesChart não encontrado');
        return;
    }
    
    // Verificar se os dados existem
    if (!window.SollerData || !window.SollerData.niches || !window.SollerData.niches.quarterly) {
        console.warn('Dados de nichos não encontrados');
        return;
    }
    
    // Destruir gráfico existente se houver
    if (nichesCtx.chart) {
        nichesCtx.chart.destroy();
    }
    
    nichesCtx.chart = new Chart(nichesCtx.getContext('2d'), {
        type: 'line',
        data: {
            labels: window.SollerData.niches.quarterly.quarters,
            datasets: [
                {
                    label: 'Márcia Fernandes',
                    data: window.SollerData.niches.quarterly.data2.moda,
                    borderColor: '#7c3aed',
                    backgroundColor: 'rgba(124, 58, 237, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Aline Marquez',
                    data: window.SollerData.niches.quarterly.data2.saude,
                    borderColor: '#16a34a',
                    backgroundColor: 'rgba(22, 163, 74, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Ellen Milgrau',
                    data: window.SollerData.niches.quarterly.data2.beleza,
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Camila Dias',
                    data: window.SollerData.niches.quarterly.data2.acessorios,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Carol Peixinho',
                    data: window.SollerData.niches.quarterly.data2.alimentacao,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
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
                    display: true,
                    text: 'Em 2024',
                    font: { size: 16, weight: 'bold' },  color: '#666666'
                },
                legend: {
        labels: {
            color: '#666666' // Define a cor branca na legenda
        }
    },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + 
                                new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                }).format(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + (value / 1000) + 'K';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Valor (R$)'
                    }
                }
            }
        }
    });
}

function createNichesChart3() {
    const nichesCtx = document.getElementById('nichesChart3');
    if (!nichesCtx) {
        console.warn('Canvas nichesChart não encontrado');
        return;
    }
    
    // Verificar se os dados existem
    if (!window.SollerData || !window.SollerData.niches || !window.SollerData.niches.quarterly) {
        console.warn('Dados de nichos não encontrados');
        return;
    }
    
    // Destruir gráfico existente se houver
    if (nichesCtx.chart) {
        nichesCtx.chart.destroy();
    }
    
    nichesCtx.chart = new Chart(nichesCtx.getContext('2d'), {
        type: 'line',
        data: {
            labels: window.SollerData.niches.quarterly.quarters,
            datasets: [
                {
                    label: 'Márcia Fernandes',
                    data: window.SollerData.niches.quarterly.data3.moda,
                    borderColor: '#7c3aed',
                    backgroundColor: 'rgba(124, 58, 237, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Ellen Milgrau',
                    data: window.SollerData.niches.quarterly.data3.saude,
                    borderColor: '#16a34a',
                    backgroundColor: 'rgba(22, 163, 74, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Edson Celulari',
                    data: window.SollerData.niches.quarterly.data3.beleza,
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Carol Peixinho',
                    data: window.SollerData.niches.quarterly.data3.acessorios,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Aline Marquez',
                    data: window.SollerData.niches.quarterly.data3.alimentacao,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
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
                    display: true,
                    text: 'Em 2023',
                    font: { size: 16, weight: 'bold' },  color: '#666666'
                },
                legend: {
        labels: {
            color: '#666666' // Define a cor branca na legenda
        }
    },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + 
                                new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                }).format(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + (value / 1000) + 'K';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Valor (R$)'
                    }
                }
            }
        }
    });
}

function createNichesChart4() {
    const nichesCtx = document.getElementById('nichesChart4');
    if (!nichesCtx) {
        console.warn('Canvas nichesChart não encontrado');
        return;
    }
    
    // Verificar se os dados existem
    if (!window.SollerData || !window.SollerData.niches || !window.SollerData.niches.quarterly) {
        console.warn('Dados de nichos não encontrados');
        return;
    }
    
    // Destruir gráfico existente se houver
    if (nichesCtx.chart) {
        nichesCtx.chart.destroy();
    }
    
    nichesCtx.chart = new Chart(nichesCtx.getContext('2d'), {
        type: 'line',
        data: {
            labels: window.SollerData.niches.quarterly.quarters,
            datasets: [
                {
                    label: 'Camila Dias',
                    data: window.SollerData.niches.quarterly.data4.moda,
                    borderColor: '#7c3aed',
                    backgroundColor: 'rgba(124, 58, 237, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Fernanda Cintra',
                    data: window.SollerData.niches.quarterly.data4.saude,
                    borderColor: '#16a34a',
                    backgroundColor: 'rgba(22, 163, 74, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Gabi Sobral',
                    data: window.SollerData.niches.quarterly.data4.beleza,
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Duda Guerra',
                    data: window.SollerData.niches.quarterly.data4.acessorios,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Pedro Novaes',
                    data: window.SollerData.niches.quarterly.data4.alimentacao,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
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
                    display: true,
                    text: 'Valor absoluto (2025 menos 2024)',
                    font: { size: 16, weight: 'bold' },  color: '#666666'
                },
                legend: {
        labels: {
            color: '#666666' // Define a cor branca na legenda
        }
    },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + 
                                new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                }).format(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + (value / 1000) + 'K';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Valor (R$)'
                    }
                }
            }
        }
    });
}

function createNichesChart5() {
    const nichesCtx = document.getElementById('nichesChart5');
    if (!nichesCtx) {
        console.warn('Canvas nichesChart não encontrado');
        return;
    }
    
    // Verificar se os dados existem
    if (!window.SollerData || !window.SollerData.niches || !window.SollerData.niches.quarterly) {
        console.warn('Dados de nichos não encontrados');
        return;
    }
    
    // Destruir gráfico existente se houver
    if (nichesCtx.chart) {
        nichesCtx.chart.destroy();
    }
    
    nichesCtx.chart = new Chart(nichesCtx.getContext('2d'), {
        type: 'line',
        data: {
            labels: window.SollerData.niches.quarterly.quarters,
            datasets: [
                {
                    label: 'Duda Guerra',
                    data: window.SollerData.niches.quarterly.data5.moda,
                    borderColor: '#7c3aed',
                    backgroundColor: 'rgba(124, 58, 237, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Sophia Cit',
                    data: window.SollerData.niches.quarterly.data5.saude,
                    borderColor: '#16a34a',
                    backgroundColor: 'rgba(22, 163, 74, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Bia Napolitano',
                    data: window.SollerData.niches.quarterly.data5.beleza,
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Fernanda Cintra',
                    data: window.SollerData.niches.quarterly.data5.acessorios,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Gabi Sobral',
                    data: window.SollerData.niches.quarterly.data5.alimentacao,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
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
                    display: true,
                    text: 'Multiplicador (2025 sobre 2024)',
                    font: { size: 16, weight: 'bold' },  color: '#666666'
                },
                legend: {
        labels: {
            color: '#666666' // Define a cor branca na legenda
        }
    },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + 
                                new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                }).format(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + (value / 1000) + 'K';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Valor (R$)'
                    }
                }
            }
        }
    });
}

// Função para renderizar o Q2 2025 no Tech Stack Roadmap
function renderTechRoadmap() {
    const techStackContainer = document.querySelector('.roadmap-timeline');
    if (!techStackContainer) {
        console.warn('Elemento .roadmap-timeline não encontrado para renderizar Tech Roadmap.');
        return;
    }

    // Remover qualquer Q2 2025 estático ou anterior para evitar duplicação
    const existingQ2 = techStackContainer.querySelector('.roadmap-phase.current');
    if (existingQ2) {
        existingQ2.remove();
    }

    // Verificar se os dados de tech stack existem no SollerData
    if (!window.SollerData || !window.SollerData.techStack || !window.SollerData.techStack.current) {
        console.warn('Dados de tech stack (current) não encontrados em SollerData. Pulando renderização do Q2 2025.');
        return;
    }

    // Criar o quadro do Q2 2025 (Atual) a partir dos dados dinâmicos
    const currentQuarterHTML = `
        <div class="roadmap-phase current">
            <h4>Q2 2025</h4>
            <ul>
                ${window.SollerData.techStack.current.map(tech => `
                    <li class="${tech.status}">
                        ${tech.name} ${tech.adoption < 100 ? `(${tech.adoption}%)` : ''}
                        ${tech.risk ? `<span class="risk-badge">${tech.risk}</span>` : ''}
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
    
    // Inserir como primeiro elemento na timeline
    techStackContainer.insertAdjacentHTML('afterbegin', currentQuarterHTML);

    console.log('Q2 2025 Tech Stack renderizado com sucesso!');
}

// Função initializeDashboard atualizada com verificações
function initializeDashboard() {
    console.log('Inicializando dashboard...');
    
    // Verificar se SollerData existe
    if (!window.SollerData) {
        console.error('SollerData não encontrado! Verifique se o data.js foi carregado corretamente.');
        return;
    }
    
    // Criar gráficos
    if (typeof createCharts === 'function') {
        createCharts();
    } else {
        console.warn('Função createCharts não encontrada');
    }
    
    // Renderizar componentes com verificações
    try {
        if (typeof renderWarRoomInitiatives === 'function') renderWarRoomInitiatives();
    } catch (e) {
        console.warn('Erro ao renderizar War Room:', e);
    }
    
    try {
        if (typeof updateDynamicMetrics === 'function') updateDynamicMetrics();
    } catch (e) {
        console.warn('Erro ao atualizar métricas:', e);
    }
    
    try {
        if (typeof renderLeadSourceAnalysis === 'function') renderLeadSourceAnalysis();
    } catch (e) {
        console.warn('Erro ao renderizar análise de leads:', e);
    }
    
    try {
        if (typeof renderMarginAnalysis === 'function') renderMarginAnalysis();
    } catch (e) {
        console.warn('Erro ao renderizar análise de margens:', e);
    }
    
    try {
        if (typeof renderTechRoadmap === 'function') renderTechRoadmap();
    } catch (e) {
        console.warn('Erro ao renderizar roadmap:', e);
    }
    
    // Renderizar novos componentes
    try {
        renderAgencyAnalysis();
    } catch (e) {
        console.error('Erro ao renderizar análise de agências:', e);
    }
    
    try {
        renderSalesCycleAnalysis();
    } catch (e) {
        console.error('Erro ao renderizar ciclo de vendas:', e);
    }
    
    // Criar gráfico de nichos
    try {
        createNichesChart();
    } catch (e) {
        console.error('Erro ao criar gráfico de nichos:', e);
    }

    try {
        createNichesChart1();
    } catch (e) {
        console.error('Erro ao criar gráfico de nichos:', e);
    }

    try {
        createNichesChart2();
    } catch (e) {
        console.error('Erro ao criar gráfico de nichos:', e);
    }

    try {
        createNichesChart3();
    } catch (e) {
        console.error('Erro ao criar gráfico de nichos:', e);
    }

    try {
        createNichesChart4();
    } catch (e) {
        console.error('Erro ao criar gráfico de nichos:', e);
    }

    try {
        createNichesChart5();
    } catch (e) {
        console.error('Erro ao criar gráfico de nichos:', e);
    }
    
    // Inicializar navegação
    if (typeof initializeTabNavigation === 'function') {
        initializeTabNavigation();
    }
    
    // Adicionar animações de entrada
    if (typeof animateOnScroll === 'function') {
        animateOnScroll();
    }
    
    console.log('Dashboard inicializado');
}

// Garantir que o dashboard seja inicializado quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDashboard);
} else {
    // DOM já está carregado
    setTimeout(initializeDashboard, 100); // Pequeno delay para garantir que todos os scripts foram carregados
}