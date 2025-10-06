const FAVORITES_KEY = 'my_favorite_content_ids';

// Função utilitária: Obtém a lista de IDs salvos
function getFavorites() {
    // Pega o JSON salvo, ou um array vazio se nada estiver salvo
    const saved = localStorage.getItem(FAVORITES_KEY);
    return saved ? JSON.parse(saved) : [];
}

// Função utilitária: Salva a lista de IDs
function saveFavorites(favoritesArray) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesArray));
}

// Função principal: Adicionar ou Remover
function toggleFavorite(buttonElement) {
    const contentId = buttonElement.getAttribute('data-content-id');
    let favorites = getFavorites();
    const isFavorite = favorites.includes(contentId);

    if (isFavorite) {
        // Remover dos favoritos
        favorites = favorites.filter(id => id !== contentId);
    } else {
        // Adicionar aos favoritos
        favorites.push(contentId);
    }

    saveFavorites(favorites);
    updateFavoriteButton(contentId);
    
    console.log(`Status do ID ${contentId} atualizado. Favoritos atuais:`, favorites);
}

// Função: Atualiza o ícone e o texto do botão
function updateFavoriteButton(contentId) {
    const favorites = getFavorites();
    const isFavorite = favorites.includes(contentId);
    const iconElement = document.getElementById(`heart-icon-${contentId}`);
    const buttonElement = document.getElementById(`favorite-button-${contentId}`);

    if (iconElement && buttonElement) {
        if (isFavorite) {
            iconElement.textContent = '❤️';
            buttonElement.innerHTML = `<span class="heart-icon">❤️</span> Remova dos Favoritos`;
        } else {
            iconElement.textContent = '🤍';
            buttonElement.innerHTML = `<span class="heart-icon">🤍</span> Adicionar aos Favoritos`;
        }
    }
}

// Inicializa o estado do botão ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    // Tenta atualizar o estado do botão para o ID hardcoded na página
    const singleButton = document.querySelector('.favorite-button');
    if (singleButton) {
        updateFavoriteButton(singleButton.getAttribute('data-content-id'));
    }
    // Opcional: Para listas, você pode iterar e atualizar todos os botões aqui
});