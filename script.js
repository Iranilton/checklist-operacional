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
