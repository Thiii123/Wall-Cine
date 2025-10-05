document.addEventListener('DOMContentLoaded', () => {
    const favoritesListContainer = document.getElementById('favorites-list');
    const noFavoritesMessage = document.getElementById('no-favorites');
    const FAVORITES_KEY = 'my_favorite_content_ids'; // A chave DEVE ser a mesma!

    // Obtém a lista de IDs salvos (do localStorage)
    const savedIds = localStorage.getItem(FAVORITES_KEY);
    const favoriteIds = savedIds ? JSON.parse(savedIds) : [];
    
    // Filtra o array de todos os conteúdos para encontrar apenas os favoritos
    const favoriteContents = ALL_CONTENT.filter(content => favoriteIds.includes(content.id));

    // Lógica de Renderização
    if (favoriteContents.length === 0) {
        noFavoritesMessage.style.display = 'block';
    } else {
        favoritesListContainer.innerHTML = favoriteContents.map(content => `
            <div class="favorite-item">
                <img src="${content.image_path}" alt="Pôster de ${content.title}" class="favorite-poster">
                <div class="favorite-info">
                    <a href="${content.url}">
                        <h3>${content.title} (${content.type})</h3>
                    </a>
                    <button 
                        data-content-id="${content.id}" 
                        onclick="removeFavoriteFromList('${content.id}')"
                        class="remove-button"
                    >
                        Remover
                    </button>
                </div>
            </div>
        `).join('');
    }
});

// Função de remoção rápida (colocada no escopo global para o onclick funcionar)
function removeFavoriteFromList(contentId) {
    const FAVORITES_KEY = 'my_favorite_content_ids';
    let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    
    // Remove o ID da lista
    favorites = favorites.filter(id => id !== contentId);
    
    // Salva a nova lista
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    
    // Recarrega a lista na tela para que o item removido desapareça
    window.location.reload(); 
}