document.addEventListener('DOMContentLoaded', () => {
    // 1. Pega os elementos do HTML
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');

    // 2. Adiciona um "ouvinte de evento" ao botão do hambúrguer
    hamburger.addEventListener('click', () => {
        // 3. Alterna a classe 'active' no menu
        // Se a classe existe, remove; se não existe, adiciona.
        navMenu.classList.toggle('active');
        
        // Opcional: Adiciona/Remove uma classe no próprio botão para animá-lo 
        // (ex: transformando as barras em um 'X')
        hamburger.classList.toggle('is-active'); 
    });
    
    // Opcional: Fecha o menu ao clicar em qualquer link (útil no mobile)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('is-active');
        });
    });
});