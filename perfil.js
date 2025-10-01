// Função para mostrar a prévia da imagem selecionada (Mantida)
function previewFile() {
    const preview = document.getElementById('newProfilePreview');
    const file = document.getElementById('fileInput').files[0];
    const reader = new FileReader(); 

    if (file) {
        reader.readAsDataURL(file); 
    }

    reader.onloadend = function () {
        preview.src = reader.result; 
    }
}

// Função para "salvar" a imagem
function saveProfilePicture() {
    const file = document.getElementById('fileInput').files[0];
    if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            // CRÍTICO: Salva a imagem no armazenamento local
            localStorage.setItem('profileImageBase64', reader.result);
            alert('Foto de perfil salva com sucesso!');
            
            // CORREÇÃO APLICADA AQUI! Redireciona para o index5.html
            window.location.href = 'index5.html'; 
        }
    } else {
        alert('Por favor, selecione uma imagem para salvar.');
    }
}