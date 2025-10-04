document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger-menu');
    const sideMenu = document.getElementById('side-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    // Função para abrir o menu
    function openMenu() {
        sideMenu.classList.add('active');
        menuOverlay.classList.add('active');
        // Opcional: Impede o scroll no corpo quando o menu está aberto
        document.body.style.overflow = 'hidden'; 
    }

    // Função para fechar o menu
    function closeMenu() {
        sideMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        // Opcional: Restaura o scroll do corpo
        document.body.style.overflow = 'auto'; 
    }

    // 1. Abrir/Fechar ao clicar no ícone hambúrguer
    hamburger.addEventListener('click', () => {
        // Verifica se o menu está fechado para decidir se abre ou fecha
        if (!sideMenu.classList.contains('active')) {
            openMenu();
        } else {
            closeMenu();
        }
    });
    
    // 2. Fechar ao clicar no overlay de fundo
    menuOverlay.addEventListener('click', closeMenu);

    // 3. Fechar ao clicar em um link do menu (opcional)
    document.querySelectorAll('.side-menu .nav-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // 4. Fechar ao pressionar a tecla ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && sideMenu.classList.contains('active')) {
            closeMenu();
        }
    });
});