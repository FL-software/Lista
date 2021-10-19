'use strict'

// Abertura e Fechamento do pop-up

const abrirModal = () => document.getElementById('modal')
    .classList.add('active')

const fecharModal = () => {
    limparCampos()
    document.getElementById('modal').classList.remove('active')
}

// Leitura e Escrita na variavel local do navegador

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_contas')) ?? []

const setLocalStorage = (dbContas) => localStorage.setItem("db_contas" , JSON.stringify(dbContas))

// CRUD - create read update delete

const criarContas = (contas) => {
    const dbContas = getLocalStorage()
    dbContas.push(contas)
    setLocalStorage(dbContas)
}

const lerContas = () => getLocalStorage()

const atualizarContas = (index, contas) => {
    const dbContas = lerContas()
    dbContas[index] = contas
    setLocalStorage(dbContas)
}

const deleteContas = (index) => {
    const dbContas = lerContas()
    dbContas.splice(index, 1)
    setLocalStorage(dbContas)
}

//Interação com o Layout

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

const limparCampos = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
}

const saveContas = () => {
    if (isValidFields()) {
        const contas = {
            nome: document.getElementById('nome').value,
            ativo: document.getElementById('ativo').checked
        }

        const index = document.getElementById('nome').dataset.index

        if (index == 'new') {
            criarContas(contas)
        } else {
            atualizarContas(index, contas)
        }

        atualizarTabela()
        fecharModal()
    }
}

const createRow = (contas, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td><input type="checkbox" class="modal-box" disabled ${(contas.ativo ? "checked" : "")}></td>
        <td>${contas.nome}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
        </td>
    `
    document.querySelector('#tabelaContas>tbody').appendChild(newRow)
}

const limparTabela = () => {
    const rows = document.querySelectorAll('#tabelaContas>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const atualizarTabela = () => {
    const dbContas = lerContas()
    limparTabela()
    dbContas.forEach(createRow)
}

const preencherCampos = (contas) => {
    document.getElementById('nome').value = contas.nome
    document.getElementById('ativo').checked = contas.ativo
    document.getElementById('nome').dataset.index = contas.index 
}

const editarContas = (index) => {
    const contas = lerContas()[index]
    contas.index = index
    preencherCampos(contas)
    abrirModal()
}

const editarDeletar = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editarContas(index)
            atualizarTabela()
        } else {
            const contas = lerContas()[index]
            const response = confirm(`Deseja realmente excluir a conta ${contas.nome}`)
            
            if (response) {
                deleteContas(index)
                atualizarTabela()
            }
        }
    }
}

atualizarTabela()

//Eventos

document.getElementById('cadastrarContas').addEventListener('click' , abrirModal)

document.getElementById('modalClose').addEventListener('click' , fecharModal)

document.getElementById('salvar').addEventListener('click' , saveContas)

document.querySelector('#tabelaContas>tbody').addEventListener('click' , editarDeletar)

document.getElementById('cancelar').addEventListener('click' , fecharModal)
