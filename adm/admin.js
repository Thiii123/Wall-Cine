// ====================================================================
// CONFIGURAÇÃO SUPABASE
// ====================================================================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// 🚨 SUBSTITUA POR SEUS DADOS REAIS DO SUPABASE
const SUPABASE_URL = 'https://gbuowxayzylevrpxefjt.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdidW93eGF5enlsZXZycHhlZmp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNzY2NjYsImV4cCI6MjA3NDY1MjY2Nn0.tx0AtB1zHLaIhPgEdzvb0vfGZ6aPqT0j_pm6Arp3rK4'; 

// 🚨 E-MAIL DE ADMINISTRADOR: SUBSTITUA PELO SEU E-MAIL REAL!
const ADMIN_EMAIL = "bits7130@gmail.com"; 

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const userList = document.getElementById('userList');
const userCount = document.getElementById('userCount');


// ====================================================================
// SEGURANÇA E PROTEÇÃO DA PÁGINA ADMIN
// ====================================================================

supabase.auth.onAuthStateChange(async (event, session) => {
    const user = session?.user;
    
    if (user && user.email === ADMIN_EMAIL) {
        // Usuário é o administrador: Libera a página e carrega a lista.
        loadUsers(); 
    } else {
        // NÃO é administrador ou está deslogado: Redireciona para o login.
        alert("Acesso Negado. Você não é um administrador.");
        // Não é necessário deslogar, pois o sistema de login já deve ter barrado
        if (event !== 'SIGNED_OUT') {
             await supabase.auth.signOut();
        }
        window.location.href = 'index6.html'; 
    }
});


// ====================================================================
// FUNÇÃO DE GERENCIAMENTO E INTERAÇÃO COM O SUPABASE
// ====================================================================

async function loadUsers() {
    userList.innerHTML = '<li>Carregando usuários...</li>';

    // Para ler a lista completa, o Admin precisa ter a política SELECT configurada.
    const { data: users, error } = await supabase
        .from('aprovacoes')
        .select('*')
        .order('created_at', { ascending: false });
        
    if (error) {
        userList.innerHTML = '<li>Erro ao carregar usuários. Verifique as Políticas RLS.</li>';
        console.error("Erro ao carregar usuários:", error);
        return;
    }
    
    userList.innerHTML = '';
    userCount.textContent = users.length;

    users.forEach((userData) => {
        const isApproved = userData.aprovado;
        const statusClass = isApproved ? 'approved' : 'pending';
        const statusText = isApproved ? 'Aprovado' : 'Pendente';
        const buttonText = isApproved ? 'Bloquear' : 'Aprovar';

        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div>
                <strong>${userData.nome || 'N/A'}</strong> (${userData.email})
            </div>
            <div>
                <span class="status ${statusClass}">${statusText}</span>
                <button data-uid="${userData.user_id}" data-status="${isApproved}" class="toggleButton">${buttonText}</button>
            </div>
        `;
        userList.appendChild(listItem);
    });

    attachButtonListeners();
}

function attachButtonListeners() {
    document.querySelectorAll('.toggleButton').forEach(button => {
        button.addEventListener('click', async (e) => {
            const btn = e.target;
            const userId = btn.getAttribute('data-uid');
            const currentStatus = btn.getAttribute('data-status') === 'true';
            const newStatus = !currentStatus;

            btn.disabled = true;
            btn.textContent = 'Aguarde...';

            try {
                // Atualiza o documento no Supabase
                // O RLS deve permitir que apenas o Admin faça este UPDATE.
                const { error } = await supabase
                    .from('aprovacoes')
                    .update({ aprovado: newStatus })
                    .eq('user_id', userId);

                if (error) throw error;

                alert(`Usuário ${newStatus ? 'Aprovado' : 'Bloqueado'} com sucesso!`);
                loadUsers();

            } catch (error) {
                alert('Erro ao atualizar status. Verifique o RLS e o e-mail do Admin: ' + error.message);
                btn.disabled = false;
                btn.textContent = currentStatus ? 'Bloquear' : 'Aprovar';
            }
        });
    });
}


// ====================================================================
// LÓGICA DE LOGOUT DO ADMIN
// ====================================================================

const adminLogoutButton = document.getElementById('adminLogoutButton');
if (adminLogoutButton) {
    adminLogoutButton.addEventListener('click', async () => {
        try {
            await supabase.auth.signOut(); 
            window.location.href = 'index6.html'; 
        } catch (error) {
            alert('Erro ao sair: ' + error.message);
        }
    });
}
