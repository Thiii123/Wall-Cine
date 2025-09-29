// ====================================================================
// FIREBASE E FUNÇÕES AUXILIARES - IMPORTS CENTRALIZADOS (CORREÇÃO)
// ====================================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged,
    signOut, 
    updateProfile,
    sendEmailVerification,
    // AGORA TODAS AS FUNÇÕES ESTÃO IMPORTADAS EM UM SÓ LUGAR
    sendPasswordResetEmail 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ====================================================================
// CONFIGURAÇÃO DO PROJETO E REDIRECIONAMENTO
// ====================================================================

// 🚨 1. URL DE DESTINO APÓS O LOGIN BEM-SUCEDIDO
const REDIRECT_URL = "indexprin.html"; 

// 🚨 2. SUAS CREDENCIAIS DO FIREBASE
const firebaseConfig = {
     apiKey: "AIzaSyCv2a3-3KUi4ZQKOK-G9ud5HZtWYiLCzZ4",
  authDomain: "wall-cine.firebaseapp.com",
  projectId: "wall-cine",
  storageBucket: "wall-cine.firebasestorage.app",
  messagingSenderId: "1000366296251",
  appId: "1:1000366296251:web:5d3fd5667c8b82cccb6d9e"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// Função auxiliar para mostrar/esconder erros
function displayError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = message ? 'block' : 'none';
    }
}


// ====================================================================
// GESTÃO DE ESTADO E REDIRECIONAMENTO AUTOMÁTICO
// ====================================================================

onAuthStateChanged(auth, (user) => {
    const currentPath = window.location.pathname;
    // Usando os nomes que você forneceu para as páginas de autenticação
    const isAuthPage = currentPath.includes('index1.html') || currentPath.includes('index.html');

    if (user && isAuthPage) {
        window.location.href = REDIRECT_URL;
    } 
});


// ====================================================================
// LÓGICA DE CADASTRO 
// ====================================================================

const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        displayError('emailError', '');
        displayError('passwordError', '');

        const name = document.getElementById('name').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: name });
            await sendEmailVerification(user);

            alert('Cadastro realizado! Um link de verificação foi enviado para seu e-mail. Faça login para continuar.');
            // Redireciona para a página de login
            window.location.href = 'index1.html'; 

        } catch (error) {
            const errorCode = error.code;
            
            switch (errorCode) {
                case 'auth/email-already-in-use':
                    displayError('emailError', 'Este e-mail já está em uso.');
                    break;
                case 'auth/invalid-email':
                    displayError('emailError', 'O formato do e-mail é inválido.');
                    break;
                case 'auth/weak-password':
                    displayError('passwordError', 'A senha deve ter pelo menos 6 caracteres.');
                    break;
                default:
                    alert(`Erro ao cadastrar: ${error.message}`);
                    break;
            }
        }
    });
}


// ====================================================================
// LÓGICA DE LOGIN (AGORA COM VALIDAÇÃO DE E-MAIL)
// ====================================================================

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        displayError('loginError', '');

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // VERIFICAÇÃO DE E-MAIL
            if (user.emailVerified) {
                // E-mail verificado: login liberado
                window.location.href = REDIRECT_URL; 
            } else {
                // E-mail NÃO verificado: Bloqueia o login e avisa o usuário.
                await signOut(auth); 
                displayError('loginError', 'Sua conta não foi verificada. Por favor, cheque seu e-mail para ativar sua conta.');
            }
            
        } catch (error) {
            // Trata erros como senha ou email inválidos.
            const errorMessage = 'Email ou senha inválidos. Por favor, tente novamente.';
            displayError('loginError', errorMessage);
        }
    });
}


// ====================================================================
// LÓGICA DE REDEFINIÇÃO DE SENHA
// ====================================================================

const resetPasswordLink = document.getElementById('resetPasswordLink');
if (resetPasswordLink) {
    resetPasswordLink.addEventListener('click', async (e) => {
        e.preventDefault();
        
        // Pega o email do campo de login
        const emailInput = document.getElementById('loginEmail');
        const email = emailInput ? emailInput.value : '';
        
        if (!email) {
            alert('Por favor, digite seu e-mail no campo de login primeiro.');
            return;
        }

        try {
            // Usa o 'sendPasswordResetEmail' importado no topo
            await sendPasswordResetEmail(auth, email);
            alert(`Instruções de redefinição de senha foram enviadas para ${email}. Verifique sua caixa de entrada.`);
        } catch (error) {
            alert('Ocorreu um erro ao enviar o e-mail. Verifique se o endereço está correto.');
            console.error(error);
        }
    });
}


// ====================================================================
// LÓGICA DE LOGOUT
// ====================================================================

const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
        try {
            await signOut(auth); 
            // Redireciona para a página de login
            window.location.href = 'index1.html'; 
        } catch (error) {
            alert('Erro ao fazer logout: ' + error.message);
        }
    });
}