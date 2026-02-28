// ===== ENTRAR COMO OPERADOR =====
function entrarOperador() {
    const nome = document.getElementById("nomeOperador").value.trim();
    if (!nome) {
        console.log("Digite seu nome!");
        return;
    }
    localStorage.setItem("nomeOperador", nome);
    window.location.href = "operador.html";
}

// ===== MOSTRAR LOGIN =====
function mostrarLogin() {
    document.getElementById("areaOperador").style.display = "none";
    document.getElementById("areaUsuario").style.display = "flex";
}

// ===== VOLTAR PARA OPERADOR =====
function voltarOperador() {
    document.getElementById("areaUsuario").style.display = "none";
    document.getElementById("areaOperador").style.display = "flex";
}

// ===== LOGIN DE USUÁRIO COM JSON =====
async function loginUsuario() {
    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!usuario || !senha) {
        console.log("Preencha usuário e senha!");
        return;
    }

    try {
        const response = await fetch('usuarios.json');
        if (!response.ok) throw new Error("Erro ao carregar usuários");
        const data = await response.json();
        const usuarios = data.usuarios;

        const userEncontrado = usuarios.find(u => u.usuario === usuario && u.senha === senha);

        if (userEncontrado) {
            console.log(`Login bem-sucedido! Bem-vindo, ${usuario}`);
            localStorage.setItem("usuarioLogado", usuario);
            localStorage.setItem("tipoUsuario", userEncontrado.tipo);
            window.location.href = "manutencao.html";
        } else {
            console.log("Usuário ou senha incorretos!");
        }
    } catch (err) {
        console.error(err);
        console.log("Erro ao tentar validar login");
    }
}

// ===== LOGOUT =====
function logout() {
    if (confirm("Deseja sair do sistema?")) {
        localStorage.removeItem("usuarioLogado");
        localStorage.removeItem("tipoUsuario");
        localStorage.removeItem("nomeOperador");
        window.location.href = "index.html";
    }
}