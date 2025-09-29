
  

  
    // Configuração do Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyAER4NoMoZvecgIv_fha6c2wy0KyuK7y7k",
      authDomain: "acender-um-led.firebaseapp.com",
      projectId: "acender-um-led",
      storageBucket: "acender-um-led.firebasestorage.app",
      messagingSenderId: "939277131899",
      appId: "1:939277131899:web:54035a70ff39ed931582de"
    };

    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    function limparMensagens() {
      document.querySelectorAll(".error, .success").forEach(el => el.textContent = "");
    }

    // Cadastro
    function cadastrar() {
      limparMensagens();

      const nome = document.getElementById("nome").value.trim();
      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("senha").value.trim();

      let erro = false;

      if (!nome) { document.getElementById("nomeError").textContent = "Digite seu nome."; erro = true; }
      if (!email) { document.getElementById("emailError").textContent = "Digite seu email."; erro = true; }
      if (!senha) { document.getElementById("senhaError").textContent = "Digite sua senha."; erro = true; }

      if (erro) return;

      auth.createUserWithEmailAndPassword(email, senha)
        .then((userCredential) => {
          const user = userCredential.user;

          user.updateProfile({ displayName: nome });

          db.collection("usuarios").doc(user.uid).set({
            nome: nome,
            email: email,
            criadoEm: firebase.firestore.FieldValue.serverTimestamp()
          });

          user.sendEmailVerification().then(() => {
            document.getElementById("cadastroMsg").innerHTML = `<p class="success">Conta criada! Verifique seu e-mail para confirmar.</p>`;
          });
        })
        .catch((error) => {
          document.getElementById("cadastroMsg").innerHTML = `<p class="error">Erro: ${error.message}</p>`;
        });
    }

    // Login
    function login() {
      limparMensagens();

      const email = document.getElementById("emailLogin").value.trim();
      const senha = document.getElementById("senhaLogin").value.trim();

      let erro = false;
      if (!email) { document.getElementById("emailLoginError").textContent = "Digite seu email."; erro = true; }
      if (!senha) { document.getElementById("senhaLoginError").textContent = "Digite sua senha."; erro = true; }
      if (erro) return;

      auth.signInWithEmailAndPassword(email, senha)
        .then((userCredential) => {
          const user = userCredential.user;

          if (user.emailVerified) {
            db.collection("usuarios").doc(user.uid).get().then((doc) => {
              if (doc.exists) {
                document.getElementById("loginMsg").innerHTML =
                  `<p class="success">Bem-vindo, ${doc.data().nome}!</p>`;
              } else {
                document.getElementById("loginMsg").innerHTML =
                  `<p class="success">Bem-vindo, ${user.displayName || "Usuário"}!</p>`;
              }
            });

            setTimeout(() => {
              window.location.href = "indexprin.html";
            }, 2000);
          } else {
            document.getElementById("loginMsg").innerHTML = `<p class="error">Confirme seu e-mail antes de fazer login.</p>`;
            auth.signOut();
          }
        })
        .catch((error) => {
          document.getElementById("loginMsg").innerHTML = `<p class="error">Erro: ${error.message}</p>`;
        });
    }

    // Mostrar recuperação
    function mostrarRecuperacao() {
      document.getElementById("loginDiv").classList.add("hidden");
      document.getElementById("recuperarSenhaDiv").classList.remove("hidden");
    }

    // Voltar para login
    function voltarLogin() {
      document.getElementById("recuperarSenhaDiv").classList.add("hidden");
      document.getElementById("loginDiv").classList.remove("hidden");
    }

    // Recuperar senha
    function recuperarSenha() {
      const email = document.getElementById("emailRecuperar").value.trim();
      const msgDiv = document.getElementById("recuperarMsg");

      msgDiv.textContent = "";

      if (!email) {
        msgDiv.innerHTML = `<p class="error">Digite um e-mail válido.</p>`;
        return;
      }

      auth.sendPasswordResetEmail(email)
        .then(() => {
          msgDiv.innerHTML = `<p class="success">Um link de redefinição foi enviado para ${email}. Verifique sua caixa de entrada!</p>`;
        })
        .catch((error) => {
          msgDiv.innerHTML = `<p class="error">Erro: ${error.message}</p>`;
        });
    }
