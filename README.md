📋 Sistema Web de Checklist Operacional (Offline)

Sistema web simples para checklist operacional diário de equipamentos, com validação pela manutenção, agendamento de intervenções e histórico.

Projetado para ambiente industrial offline, rodando na rede local sem necessidade de banco de dados ou instalação complexa.

🎯 Objetivo

Permitir que:

👷 Operadores realizem checklists diários de equipamentos

🛠 Manutenção valide checklists e agende intervenções

📊 Gestão visualize histórico

📁 Dados sejam armazenados localmente sem banco de dados

⚙️ Características

✅ Funciona offline (rede local)
✅ Sem banco de dados
✅ Armazenamento local (localStorage)
✅ Usuários importados por arquivo
✅ Checklist por equipamento
✅ Histórico de verificações
✅ Agendamento de intervenção
✅ Interface simples para uso industrial
✅ Sistema leve e portátil

👥 Perfis de Usuário
👷 Operador (padrão)

Informa apenas o nome

Preenche checklist do equipamento

Pode registrar observações

Envia checklist para validação

🛠 Manutenção

Login com usuário e senha

Visualiza checklists pendentes

Valida checklist com data

Agenda intervenção com data

Visualiza intervenções agendadas

📊 Gestão

Login com usuário e senha

Visualiza histórico geral

🏗 Estrutura do Projeto
sistema-checklist/

index.html
operador.html
manutencao.html
gestao.html

usuarios.json
equipamentos.json

js/
  login.js
  operador.js
  manutencao.js
  gestao.js
  storage.js

css/
  style.css
📄 Arquivos de Configuração
usuarios.json

Define usuários do sistema:

{
  "usuarios": [
    { "usuario": "manutencao", "senha": "123", "tipo": "manutencao" },
    { "usuario": "gestao", "senha": "123", "tipo": "gestao" }
  ]
}
equipamentos.json

Define equipamentos e checklists:

{
  "equipamentos": [
    {
      "nome": "Compressor",
      "checklist": [
        "Sem vazamento",
        "Sem ruído anormal"
      ]
    }
  ]
}
🚀 Como Executar
Opção 1 — Servidor portátil (recomendado para indústria)

Baixe um servidor web portátil (ex: HFS).

Coloque a pasta do projeto dentro.

Abra o endereço no navegador.

Permite funcionamento completo com arquivos JSON.

Opção 2 — VS Code (desenvolvimento)

Instale extensão Live Server

Clique com botão direito em index.html

Abrir com Live Server

⚠️ Não recomendado

Abrir diretamente com:

file://

Pode bloquear leitura de arquivos JSON.

💾 Armazenamento de Dados

O sistema salva dados em:

localStorage do navegador

Inclui:

checklists enviados

validações

intervenções agendadas

histórico

🔄 Fluxo do Sistema

Operador acessa sistema

Informa nome

Preenche checklist

Sistema registra como pendente

Manutenção valida ou agenda intervenção

Gestão acompanha histórico

🔮 Melhorias Futuras (Planejadas)

Exportação automática CSV

Prioridade de intervenção

Dashboard de indicadores

Histórico por equipamento

Controle de permissões

Alertas de falhas críticas

Sistema multiusuário em rede

Persistência em arquivos CSV

Interface estilo HMI industrial

🏭 Uso Industrial

Este sistema foi projetado para:

ambientes com restrições de instalação

máquinas sem acesso à internet

redes internas industriais

controle operacional de equipamentos

📜 Licença

Uso livre para estudo e adaptação.

Se você quiser, no próximo passo posso te gerar também:

✅ README com imagens da interface
✅ diagrama de funcionamento do sistema
✅ manual do operador e manutenção
✅ guia de instalação industrial
✅ documentação técnica do código
