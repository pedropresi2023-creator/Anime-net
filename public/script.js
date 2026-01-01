// Seletores existentes
const cards = document.querySelectorAll('.card');
const modal = document.getElementById('animeModal');
const modalImg = document.getElementById('modal-img');
const modalInfo = document.getElementById('modal-info');
const modalTitle = document.getElementById('modal-title');
const closeModal = document.getElementById('closeModal');
const watchNow = document.getElementById('watchNow');

// Seletores novos
const logoBtn = document.querySelector('header button'); // Botão do Logo
const searchInput = document.querySelector('header input[type="text"]'); // Barra de pesquisa
const profileBtn = document.querySelector('header input[type="image"]'); // Foto de perfil
const sidebar = document.getElementById('settingsSidebar');
const closeSidebar = document.getElementById('closeSidebar');

let selectedAnime = null;

// 1. VOLTAR AO INÍCIO (Animação Premium com Easing)
logoBtn.addEventListener('click', () => {
    const duration = 1000; // Tempo da animação em milissegundos (1 segundo)
    const start = window.pageYOffset;
    const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

    // Função de Easing (Cubic Out) - É isso que faz começar rápido e parar suave
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function scrollStep(now) {
        const time = now - startTime;
        const fraction = easeOutCubic(Math.min(time / duration, 1));

        window.scroll(0, start - (start * fraction));

        if (time < duration) {
            requestAnimationFrame(scrollStep);
        }
    }

    requestAnimationFrame(scrollStep);
});

// 2. --- SISTEMA DE PESQUISA ---
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const title = card.getAttribute('data-title').toLowerCase();
        // Esconde o card se não bater com a pesquisa
        if (title.includes(term)) {
            card.style.display = "block";
            card.style.opacity = "1";
        } else {
            card.style.display = "none";
            card.style.opacity = "0";
        }
    });
});

// --- SALVAR ÚLTIMO ASSISTIDO ---
watchNow.addEventListener('click', () => {
    if (selectedAnime) {
        // Guarda no navegador qual foi o último
        localStorage.setItem('lastWatched', selectedAnime);
        window.location.href = `player.html?anime=${encodeURIComponent(selectedAnime)}&ep=1`;
    }
});

// 3. MENU LATERAL (Configurações)
profileBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Evita comportamento de submit
    sidebar.classList.add('active');
});

closeSidebar.addEventListener('click', () => {
    sidebar.classList.remove('active');
});

// Fechar sidebar ao clicar fora dela
window.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && e.target !== profileBtn) {
        sidebar.classList.remove('active');
    }
});

// 4. LÓGICA DO MODAL (Mantida e corrigida)
cards.forEach(card => {
    card.addEventListener('click', () => {
        // Pega o valor exatamente como está no HTML
        selectedAnime = card.getAttribute('data-anime');

        modalImg.src = card.getAttribute('data-img');
        modalTitle.innerText = card.getAttribute('data-title');
        modalInfo.innerText = card.getAttribute('data-info');
        modal.classList.add('active');
    });
});

// E substitua o watchNow por este:
watchNow.addEventListener('click', () => {
    if (selectedAnime) {
        // encodeURIComponent serve para o navegador aceitar o espaço do "one piece" na URL
        window.location.href = `player.html?anime=${encodeURIComponent(selectedAnime)}&ep=1`;
    }
});

watchNow.addEventListener('click', () => {
    if (selectedAnime) {
        // Apenas transforma em minúsculo, sem trocar espaço por hífen
        const animeId = selectedAnime.toLowerCase();
        window.location.href = `player.html?anime=${encodeURIComponent(animeId)}&ep=1`;
    }
});
closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
});
// Novos seletores para o Banner
const bannerWatchBtn = document.getElementById('bannerWatch');
const bannerInfoBtn = document.getElementById('bannerInfo');
const bleachModal = document.getElementById('bleachInfoModal');
const closeBleachModal = document.getElementById('closeBleachModal');
const watchBleachFromInfo = document.getElementById('watchBleachFromInfo');

// 1. Botão "Assistir Agora" do Banner (Vai direto para o player)
bannerWatchBtn.addEventListener('click', () => {
    window.location.href = `player.html?anime=bleach&ep=1`;
});

// 2. Botão "Mais Informações" do Banner (Abre o modal de Bleach)
bannerInfoBtn.addEventListener('click', () => {
    bleachModal.classList.add('active');
});

// 3. Fechar o modal de Bleach
closeBleachModal.addEventListener('click', () => {
    bleachModal.classList.remove('active');
});

// 4. Botão "Assistir Agora" dentro do modal de informações
watchBleachFromInfo.addEventListener('click', () => {
    window.location.href = `player.html?anime=bleach&ep=1`;
});

// Fechar modal de Bleach se clicar fora dele (opcional)
window.addEventListener('click', (e) => {
    if (e.target === bleachModal) {
        bleachModal.classList.remove('active');
    }
});
// Seletores para a Foto de Perfil
const pfpUpload = document.getElementById('pfpUpload');
const sidebarPfp = document.getElementById('sidebarPfp');
const headerPfp = document.querySelector('header input[type="image"]');

// 1. Carregar foto salva ao abrir a página
const savedPfp = localStorage.getItem('userPfp');
if (savedPfp) {
    headerPfp.src = savedPfp;
    sidebarPfp.src = savedPfp;
}

// 2. Evento de upload de nova foto
pfpUpload.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function (event) {
            const base64Image = event.target.result;

            // Atualiza visualmente na hora
            headerPfp.src = base64Image;
            sidebarPfp.src = base64Image;

            // Salva no "banco de dados" do navegador
            localStorage.setItem('userPfp', base64Image);
        };

        reader.readAsDataURL(file); // Converte imagem para texto longo (Base64)
    }
});
// --- SISTEMA DE HISTÓRICO CORRIGIDO ---

// 1. Função para salvar o anime na lista de "Continuar Assistindo"
watchNow.onclick = () => {
    if (selectedAnime) {
        // Pega a lista atual ou cria uma vazia
        let history = JSON.parse(localStorage.getItem('animeHistory') || '[]');

        // Remove o anime se ele já estiver na lista (para ele subir para o topo)
        history = history.filter(item => item.id !== selectedAnime);

        // Adiciona o novo anime no início da lista
        const animeData = {
            id: selectedAnime,
            title: modalTitle.innerText,
            img: modalImg.src,
            info: modalInfo.innerText
        };
        history.unshift(animeData);

        // Limita a 6 animes no histórico
        if (history.length > 6) history.pop();

        // Salva a lista completa
        localStorage.setItem('animeHistory', JSON.stringify(history));

        // Pega o último episódio assistido desse anime específico
        const savedEp = localStorage.getItem(`lastEp_${selectedAnime}`) || 1;
        
        // Redireciona
        window.location.href = `player.html?anime=${encodeURIComponent(selectedAnime)}&ep=${savedEp}`;
    }
};

// 2. Função para mostrar a lista na Home
function displayContinueWatching() {
    const history = JSON.parse(localStorage.getItem('animeHistory') || '[]');
    const section = document.getElementById('continue-watching-section');
    const container = document.getElementById('continue-container');

    if (history.length > 0) {
        section.style.display = 'block';
        container.innerHTML = ""; // Limpa para não duplicar

        history.forEach(anime => {
            const lastEp = localStorage.getItem(`lastEp_${anime.id}`) || 1;
            
            const card = document.createElement('div');
            card.className = "card";
            card.innerHTML = `
                <img src="${anime.img}" alt="${anime.title}">
                <div style="position:absolute; bottom:0; background:rgba(255,59,59,0.9); width:100%; text-align:center; font-size:11px; padding:4px 0;">
                    Episódio ${lastEp}
                </div>
            `;

            // Clique no card do histórico abre o modal dele
            card.onclick = () => {
                selectedAnime = anime.id;
                modalImg.src = anime.img;
                modalTitle.innerText = anime.title;
                modalInfo.innerText = anime.info;
                modal.classList.add('active');
            };

            container.appendChild(card);
        });
    } else {
        section.style.display = 'none';
    }
}

// Executa ao carregar
displayContinueWatching();
// Função auxiliar para pegar o nome do usuário logado
const getUsername = () => localStorage.getItem('currentUser') || 'guest';

// --- SALVAR NO HISTÓRICO ESPECÍFICO DO USUÁRIO ---
watchNow.onclick = () => {
    if (selectedAnime) {
        const user = getUsername();
        const historyKey = `animeHistory_${user}`; // Chave única por usuário
        
        let history = JSON.parse(localStorage.getItem(historyKey) || '[]');

        history = history.filter(item => item.id !== selectedAnime);

        history.unshift({
            id: selectedAnime,
            title: modalTitle.innerText,
            img: modalImg.src,
            info: modalInfo.innerText
        });

        if (history.length > 6) history.pop();

        localStorage.setItem(historyKey, JSON.stringify(history));

        // Salva o episódio também com o nome do usuário para não misturar
        const savedEp = localStorage.getItem(`lastEp_${user}_${selectedAnime}`) || 1;
        window.location.href = `player.html?anime=${encodeURIComponent(selectedAnime)}&ep=${savedEp}`;
    }
};

// --- MOSTRAR O HISTÓRICO DO USUÁRIO LOGADO ---
function displayContinueWatching() {
    const user = getUsername();
    const historyKey = `animeHistory_${user}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    
    const section = document.getElementById('continue-watching-section');
    const container = document.getElementById('continue-container');

    if (history.length > 0) {
        section.style.display = 'block';
        container.innerHTML = "";

        history.forEach(anime => {
            // Busca o episódio específico deste usuário
            const lastEp = localStorage.getItem(`lastEp_${user}_${anime.id}`) || 1;
            
            const card = document.createElement('div');
            card.className = "card";
            card.innerHTML = `
                <img src="${anime.img}" alt="${anime.title}">
                <div style="position:absolute; bottom:0; background:rgba(255,59,59,0.9); width:100%; text-align:center; font-size:11px; padding:4px 0;">
                    Episódio ${lastEp}
                </div>
            `;

            card.onclick = () => {
                selectedAnime = anime.id;
                modalImg.src = anime.img;
                modalTitle.innerText = anime.title;
                modalInfo.innerText = anime.info;
                modal.classList.add('active');
            };

            container.appendChild(card);
        });
    } else {
        section.style.display = 'none';
    }
}
function logout() {
    localStorage.removeItem('currentUser'); // Remove quem está logado
    window.location.href = 'login.html';
}