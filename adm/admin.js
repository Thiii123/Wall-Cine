// O campo 'genre' é usado para pesquisa (contém todas as palavras-chave).
// O campo 'display_genre' é usado APENAS para o que será exibido na tela.

const allMovies = [
    { 
        title: "O Poderoso Chefão", 
        url: "filmes/poderoso_chefao.html",
        // Campo para OTIMIZAR A PESQUISA (Palavras-chave escondidas)
        genre: "Crime, Drama, Clássico, Máfia, Melhores Filmes",
        // Campo para EXIBIÇÃO VISUAL (O que o usuário vê)
        display_genre: "Crime, Drama",
        actors: "Marlon Brando, Al Pacino",
        image_path: "images/chefao.jpg" 
    },
    { 
        title: "A Origem", 
        url: "filmes/a_origem.html",
        genre: "Ficção Científica, Ação, Thriller, Sonhos, Leonardo DiCaprio",
        display_genre: "Ficção Científica, Ação",
        actors: "Leonardo DiCaprio, Joseph Gordon-Levitt",
        image_path: "images/origem.jpg" 
    },
    { 
        title: "O Chamado", 
        url: "filmes/o_chamado.html",
        genre: "Terror, Horror, Sobrenatural, Suspense",
        display_genre: "Terror, Horror",
        actors: "Naomi Watts",
        image_path: "images/chamado.jpg" 
    },
    { 
        title: "La La Land", 
        url: "filmes/la_la_land.html",
        genre: "Musical, Romance, Comédia Dramática, Ryan Gosling , thiago",
        display_genre: "Musical, Romance",
        actors: "Ryan Gosling, Emma Stone",
        image_path: "images/lalaland.jpg" 
    },
    // Adicione mais filmes aqui, usando 'genre' para a pesquisa e 'display_genre' para a tela
];

const movieListElement = document.getElementById('movieList');
const searchInput = document.getElementById('searchInput');

// Função Acionada ao Clicar em uma Tag Rápida
function searchByTag(tag) {
    searchInput.value = tag;
    filterMovies();
}

// Função Principal de Pesquisa (Não muda, pois continua pesquisando no campo 'genre')
function filterMovies() {
    const searchTerm = searchInput.value.trim().toUpperCase();
    movieListElement.innerHTML = ''; 

    if (searchTerm === "") {
        return; 
    }
    
    // O filtro continua usando o campo 'genre' (o campo com todas as palavras-chave)
    const results = allMovies.filter(movie => {
        const fullText = (movie.title + " " + movie.genre + " " + movie.actors).toUpperCase();
        return fullText.includes(searchTerm);
    });

    // Renderiza os Resultados Clicáveis
    if (results.length > 0) {
        results.forEach(movie => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = movie.url; 
            
            // *************************************************************
            // * MUDANÇA AQUI: Usamos movie.display_genre para a exibição! *
            // *************************************************************
            const genresArray = movie.display_genre.split(', ');
            
            let tagsHtml = genresArray.map(tag => 
                // A tag que corresponde à pesquisa é destacada
                `<span class="genre-tag ${movie.genre.toUpperCase().includes(searchTerm) ? 'highlighted-tag' : ''}">${tag}</span>`
            ).join(''); 

            link.innerHTML = `
                <img src="${movie.image_path}" alt="Pôster do filme ${movie.title}" class="movie-poster">
                <div class="movie-info">
                    <span class="movie-title">${movie.title}</span>
                    <div class="movie-tags">
                        ${tagsHtml}
                    </div>
                    <span class="movie-details">
                        Atores: ${movie.actors.split(',')[0].trim()}...
                    </span>
                </div>
            `;
            
            listItem.appendChild(link);
            movieListElement.appendChild(listItem);
        });
    } else {
        const noResult = document.createElement('li');
        noResult.textContent = `Nenhum resultado encontrado para "${searchTerm}".`;
        noResult.className = 'no-results';
        movieListElement.appendChild(noResult);
    }
}