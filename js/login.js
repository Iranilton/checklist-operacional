// ===== TROCAR TELAS =====
function mostrarLogin() {
  document.getElementById("areaOperador").style.display = "none";
  document.getElementById("areaUsuario").style.display = "block";
}

function voltarOperador() {
  document.getElementById("areaOperador").style.display = "block";
  document.getElementById("areaUsuario").style.display = "none";
}

// ===== OPERADOR =====
function entrarOperador() {
  const nome = document.getElementById("nomeOperador").value;

  if (!nome) {
    alert("Informe o nome do operador");
    return;
  }

  localStorage.setItem("operador", nome);
  window.location = "operador.html";
}

// ===== MANUTENÇÃO / GESTÃO =====
async function login() {
  const user = document.getElementById("usuario").value;
  const pass = document.getElementById("senha").value;

  if (!user || !pass) {
    alert("Informe usuário e senha");
    return;
  }

  try {
    const res = await fetch("usuarios.json");
    const dados = await res.json();

    const encontrado = dados.usuarios.find(
      u => u.usuario === user && u.senha === pass
    );

    if (!encontrado) {
      alert("Login inválido");
      return;
    }

    localStorage.setItem("usuarioLogado", encontrado.tipo);

    if (encontrado.tipo === "manutencao")
      window.location = "manutencao.html";

    if (encontrado.tipo === "gestao")
      window.location = "gestao.html";

  } catch {
    alert("Erro ao carregar usuários");
  }
}