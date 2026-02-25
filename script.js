function trocarTipo(){
let tipo=document.getElementById("tipo").value

document.getElementById("loginOperador").classList.add("hidden")
document.getElementById("loginUsuario").classList.add("hidden")

if(tipo==="operador"){
document.getElementById("loginOperador").classList.remove("hidden")
}else{
document.getElementById("loginUsuario").classList.remove("hidden")
}
}

function entrar(){

let tipo=document.getElementById("tipo").value

if(tipo==="operador"){

usuarioAtual=document.getElementById("nomeOperador").value
tipoUsuario="operador"

if(!usuarioAtual){
alert("Digite seu nome")
return
}

}else{

let usuario=document.getElementById("usuario").value
let senha=document.getElementById("senha").value

// login simples de teste
if(usuario==="manutencao" && senha==="123"){
tipoUsuario="manutencao"
usuarioAtual=usuario
}else if(usuario==="gestao" && senha==="123"){
tipoUsuario="gestao"
usuarioAtual=usuario
}else{
alert("Usuário ou senha inválido")
return
}
}

document.getElementById("login").classList.add("hidden")

if(tipoUsuario==="operador"){
document.getElementById("operador").classList.remove("hidden")
}

if(tipoUsuario==="manutencao"){
mostrarListaManutencao()
mostrarListaGestao()
document.getElementById("manutencao").classList.remove("hidden")
document.getElementById("gestao").classList.remove("hidden")
}

if(tipoUsuario==="gestao"){
mostrarListaGestao()
document.getElementById("gestao").classList.remove("hidden")
}
}
