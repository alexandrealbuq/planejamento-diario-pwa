console.log("script.js carregado");

const form = document.getElementById("form-compromisso");
const tituloInput = document.getElementById("titulo");
const dataInput = document.getElementById("data");
const horaInput = document.getElementById("hora");
const lista = document.getElementById("lista-compromissos");
const emptyState = document.getElementById("empty-state");
const botoesFiltro = document.querySelectorAll(".filters button");

let compromissos = [];
let filtroAtual = "todos";

/* =========================
   EVENTO DO FORMULÁRIO
========================= */
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const titulo = tituloInput.value.trim();
  const data = dataInput.value;
  const hora = horaInput.value;

  if (!titulo || !data || !hora) return;

  compromissos.push({
    titulo,
    data,
    hora,
    concluido: false
  });
  
  salvarNoLocalStorage();
  renderizarCompromissos();
  form.reset();
});

/* =========================
   EVENTOS DOS FILTROS
========================= */
botoesFiltro.forEach(botao => {
  botao.addEventListener("click", function () {
    botoesFiltro.forEach(b => b.classList.remove("active"));
    this.classList.add("active");

    filtroAtual = this.dataset.filter;
    renderizarCompromissos();
  });
});

/* =========================
   RENDERIZAÇÃO
========================= */
function renderizarCompromissos() {
  lista.innerHTML = "";

  if (compromissos.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  let compromissosFiltrados = compromissos;

  if (filtroAtual === "pendentes") {
    compromissosFiltrados = compromissos.filter(item => !item.concluido);
  }

  if (filtroAtual === "concluidos") {
    compromissosFiltrados = compromissos.filter(item => item.concluido);
  }

  compromissosFiltrados.forEach((item, index) => {
    const li = document.createElement("li");
    li.classList.add("item");

    if (item.concluido) {
      li.classList.add("concluido");
    }

li.innerHTML = `
  <div class="texto">
    <strong>${item.titulo}</strong>
    <span>${item.data} às ${item.hora}</span>
  </div>

  <div class="acoes">
    <button class="editar">✏️</button>
    <button class="excluir">🗑️</button>
  </div>
`;
const botaoExcluir = li.querySelector(".excluir");

botaoExcluir.addEventListener("click", function (event) {
  event.stopPropagation(); // impede marcar como concluído

  compromissos.splice(index, 1);


  salvarNoLocalStorage();
  renderizarCompromissos();
});
const botaoEditar = li.querySelector(".editar");

botaoEditar.addEventListener("click", function (event) {
  event.stopPropagation();

  const novoTitulo = prompt("Editar título:", item.titulo);
  if (!novoTitulo) return;

  const novaData = prompt("Editar data (YYYY-MM-DD):", item.data);
  if (!novaData) return;

  const novaHora = prompt("Editar hora (HH:MM):", item.hora);
  if (!novaHora) return;

  item.titulo = novoTitulo;
  item.data = novaData;
  item.hora = novaHora;

  salvarNoLocalStorage();
  renderizarCompromissos();
});


    li.addEventListener("click", function () {
      item.concluido = !item.concluido;
      salvarNoLocalStorage();
      renderizarCompromissos();
    });

    lista.appendChild(li);
  });
}
function salvarNoLocalStorage() {
  localStorage.setItem("compromissos", JSON.stringify(compromissos));
}
function carregarDoLocalStorage() {
  const dados = localStorage.getItem("compromissos");

  if (dados) {
    compromissos = JSON.parse(dados);
    renderizarCompromissos();
  }
}


carregarDoLocalStorage();

let deferredPrompt;
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.hidden = false;
});

installBtn.addEventListener("click", async () => {
  installBtn.hidden = true;
  deferredPrompt.prompt();

  const { outcome } = await deferredPrompt.userChoice;
  console.log("Instalação:", outcome);

  deferredPrompt = null;
});
