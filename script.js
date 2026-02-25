function getDados(){
return JSON.parse(localStorage.getItem("checklists")||"[]")
}

function salvarDados(dados){
localStorage.setItem("checklists",JSON.stringify(dados))
}

let usuarioAtual=""
let tipoUsuario=""

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
let sel=document.getElementById("nome").selectedOptions[0]
usuarioAtual=sel.value
tipoUsuario=sel.dataset.tipo
}

document.getElementById("login").classList.add("hidden")

if(tipoUsuario=="operador"){
document.getElementById("operador").classList.remove("hidden")
}

if(tipoUsuario=="manutencao"){
mostrarListaManutencao()
mostrarListaGestao()
document.getElementById("manutencao").classList.remove("hidden")
document.getElementById("gestao").classList.remove("hidden")
}

if(tipoUsuario=="gestao"){
mostrarListaGestao()
document.getElementById("gestao").classList.remove("hidden")
}
}

function enviarChecklist(){

let equipamento=document.getElementById("equipamento").value
let obs=document.getElementById("obs").value

let respostas=[]
document.querySelectorAll(".item").forEach(i=>{
respostas.push(i.checked)
})

let dados=getDados()

dados.push({
id:Date.now(),
operador:usuarioAtual,
equipamento:equipamento,
respostas:respostas,
obs:obs,
status:"pendente",
intervencao:null,
data:new Date().toLocaleString()
})

salvarDados(dados)
alert("Checklist enviado!")
location.reload()
}

function mostrarListaManutencao(){

let dados=getDados()
let lista=document.getElementById("listaManutencao")
lista.innerHTML=""

dados.filter(d=>d.status==="pendente").forEach(d=>{

let div=document.createElement("div")
div.innerHTML=`
Equipamento: ${d.equipamento}<br>
Operador: ${d.operador}<br>
Data: ${d.data}<br>
Obs: ${d.obs||"-"}<br>
<button onclick="agendar(${d.id})">Agendar intervenção</button>
<hr>
`
lista.appendChild(div)
})
}

function agendar(id){

let dados=getDados()
let item=dados.find(d=>d.id===id)

let desc=prompt("Descreva a intervenção:")
if(!desc) return

item.status="intervencao"
item.intervencao=desc

salvarDados(dados)
alert("Intervenção registrada")
location.reload()
}

function mostrarListaGestao(){

let dados=getDados()
let lista=document.getElementById("listaGestao")
lista.innerHTML=""

dados.forEach(d=>{

let div=document.createElement("div")

div.innerHTML=`
Equipamento: ${d.equipamento}<br>
Operador: ${d.operador}<br>
Status: ${d.status}<br>
Intervenção: ${d.intervencao||"-"}<br>
Data: ${d.data}
<hr>
`

lista.appendChild(div)
})
}