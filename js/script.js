let todosOsChaveiros = []; 

// Função assíncrona para buscar os dados no JSON
async function carregarProdutos() {
    const vitrine = document.getElementById('vitrine');
    
    try {
        const resposta = await fetch('../produtos.json');
        
        if (!resposta.ok) {
            throw new Error('Não foi possível carregar os produtos.');
        }

        const dados = await resposta.json();
        todosOsChaveiros = dados.chaveiros; // Salva os dados na variável global
        
        // Renderiza todos os produtos inicialmente
        renderizarProdutos(todosOsChaveiros);

    } catch (erro) {
        console.error("Erro no Fetch:", erro);
        vitrine.innerHTML = '<p style="color: red; text-align: center;">Erro ao carregar o catálogo de produtos.</p>';
    }
}

// Função responsável por desenhar os cards na tela
function renderizarProdutos(listaDeProdutos) {
    const vitrine = document.getElementById('vitrine');
    vitrine.innerHTML = ''; // Limpa a vitrine antes de desenhar os novos cards

    // Se a lista estiver vazia (nenhum resultado na pesquisa)
    if (listaDeProdutos.length === 0) {
        vitrine.innerHTML = '<p style="text-align: center; width: 100%; grid-column: 1 / -1; color: #555;">Nenhum chaveiro encontrado para este herói.</p>';
        return;
    }

    listaDeProdutos.forEach(produto => {
        const card = document.createElement('div');
        card.classList.add('card-produto');

        const statusBotao = produto.emEstoque ? '<button>Comprar Agora</button>' : '<button disabled>Esgotado</button>';
        const classePreco = produto.emEstoque ? 'preco' : 'preco tag-esgotado';
        const precoFormatado = produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        card.innerHTML = `
            <img src="${produto.imagem}" alt="Imagem do ${produto.nome}">
            <h3>${produto.nome}</h3>
            <p style="font-size: 0.9em; color: #555;">${produto.descricao}</p>
            <p class="${classePreco}">${precoFormatado}</p>
            ${statusBotao}
        `;

        vitrine.appendChild(card);
    });
}

// Event Listener para a barra de pesquisa
document.getElementById('searchInput').addEventListener('input', function(evento) {
    const termoPesquisa = evento.target.value.toLowerCase(); // Converte o texto digitado para minúsculo
    
    // Filtra o array original pelo nome do personagem
    const produtosFiltrados = todosOsChaveiros.filter(produto => {
        // Verifica se o termo digitado existe no nome do personagem
        return produto.personagem.toLowerCase().includes(termoPesquisa) || 
               produto.nome.toLowerCase().includes(termoPesquisa);
    });

    // Renderiza novamente a tela usando apenas os produtos filtrados
    renderizarProdutos(produtosFiltrados);
});

// Executa a função inicial assim que o script for carregado
carregarProdutos();