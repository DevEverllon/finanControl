// VARIÁVEIS
const form = document.querySelector("#formTransacao");
const valorInput = document.querySelector("#valor");
const descricaoInput = document.querySelector("#descricao");
const lista = document.querySelector("#listaTransacoes");

form.addEventListener("submit", (e) => {
  e.preventDefault(); // Impede o recarregamento

  const tipo = document.getElementById("tipo").value;
  const valorBruto = parseFloat(valorInput.value);
  const valor = tipo === "despesa" ? -Math.abs(valorBruto) : Math.abs(valorBruto);
  const descricao = descricaoInput.value;
  const categoria = document.getElementById("categoria").value;
  const data = document.getElementById("data").value;

  if (!descricao || isNaN(valor) || !categoria || !data || !tipo) {
    Toastify({
      text: "Preencha todos os campos corretamente!",
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "#FF6B6B",
    }).showToast();
    return;
  }

  transacoes.push({ tipo, valor, descricao, categoria, data });
  form.reset(); // Limpa o formulário

  atualizarTudo();
});

let transacoes = [];

// CRIANDO O GRÁFICO COM CHART.js
let grafico = new Chart(document.querySelector("#graficoDespesas"), {
  type: "doughnut",
  data: {
    labels: [],
    datasets: [
      {
        label: "Despesas",
        data: [],
        backgroundColor: [],
      },
    ],
  },
});

// FUNÇÃO PARA ATUALIZAR O RESUMO
function atualizarResumo() {
  const receitas = transacoes
    .filter((t) => t.valor > 0)
    .reduce((s, t) => s + t.valor, 0);
  const despesas = transacoes
    .filter((t) => t.valor < 0)
    .reduce((s, t) => s + t.valor, 0);
  const saldo = receitas + despesas;

  document.querySelector("#saldo").textContent = `R$ ${saldo.toFixed(2)}`;
  document.querySelector("#receitas").textContent = `R$ ${receitas.toFixed(2)}`;
  document.querySelector("#despesas").textContent = `R$ ${Math.abs(despesas).toFixed(2)}`;
}

// FUNÇÃO PARA ATUALIZAR O GRÁFICO
function atualizarGrafico() {
  const despesas = transacoes.filter((t) => t.valor < 0);
  grafico.data.labels = despesas.map((t) => t.categoria);
  grafico.data.datasets[0].data = despesas.map((t) => Math.abs(t.valor));

  const cores = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
  ];

  grafico.data.datasets[0].backgroundColor = despesas.map(
    (_, i) => cores[i % cores.length]
  );

  grafico.update();
}

// FUNÇÃO PARA ATUALIZAR A LISTA
function atualizarLista() {
  lista.innerHTML = "";
  transacoes.forEach((t, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="card-list">
                <div class="list-header">
                    <strong class="title-list">${t.descricao}</strong> - ${t.categoria} <br/>
                    <small class="data-list">${t.data}</small>
                </div>
    
                <div class="list-footer">
                    R$ ${t.valor.toFixed(2)} <br/>
    
                    <div>
                        <button class="edit" onclick="editarTransacao(${index})">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
        
                        <button class="delete" onclick="removerTransacao(${index})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
    `;
    lista.appendChild(li);
  });
}

// FUNÇÃO PARA EDITAR UMA TRANSAÇÃO
function editarTransacao(index) {
  const transacao = transacoes[index];
  descricaoInput.value = transacao.descricao;
  valorInput.value = Math.abs(transacao.valor);
  document.getElementById("tipo").value = transacao.valor < 0 ? "despesa" : "receita";
  document.getElementById("categoria").value = transacao.categoria;
  document.getElementById("data").value = transacao.data;

  transacoes.splice(index, 1);
  atualizarTudo();
}

// FUNÇÃO PARA REMOVER UMA TRANSAÇÃO
function removerTransacao(index) {
  transacoes.splice(index, 1);
  atualizarTudo();
}

// FUNÇÃO PARA ATUALIZAR TUDO e SALVAR NO LOCAL STORAGE
function salvarTransacoes() {
  localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

function carregarTransacoes() {
  const dados = localStorage.getItem("transacoes");
  if (dados) transacoes = JSON.parse(dados);
}

function atualizarTudo() {
  atualizarResumo();
  atualizarLista();
  atualizarGrafico();
  salvarTransacoes();
}

carregarTransacoes();
atualizarTudo();


// EVENTO DE ENVIO DO FORMULÁRIO
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const tipo = document.getElementById("tipo").value;
  const valorBruto = parseFloat(valorInput.value);
  const valor = tipo === "despesa" ? -Math.abs(valorBruto) : Math.abs(valorBruto);
  const descricao = descricaoInput.value;
  const categoria = document.getElementById("categoria").value;
  const data = document.getElementById("data").value;

  if (!descricao || isNaN(valor) || !categoria || !data || !tipo) return;

  transacoes.push({ tipo, valor, descricao, categoria, data });
  form.reset();

  atualizarTudo();
});

// CONFIRMAÇÃO PARA FAZER EXCLUSÃO
function removerTransacao(index) {
  if (confirm("Tem certeza que deseja remover esta transação?")) {
    transacoes.splice(index, 1);
    atualizarTudo();
  }
}


atualizarTudo();