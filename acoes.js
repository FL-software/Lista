'use strict'

// Abertura e Fechamento do pop-up

const abrirModal = () => document.getElementById('modal')
    .classList.add('active')

const fecharModal = () => {
    limparCampos()
    document.getElementById('modal').classList.remove('active')
}

// Leitura e Escrita na variavel local do navegador

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_acoes')) ?? []

const setLocalStorage = (dbAcoes) => localStorage.setItem("db_acoes" , JSON.stringify(dbAcoes))

// CRUD - create read update delete

const criarAcoes = (acoes) => {
    const dbAcoes = getLocalStorage()
    dbAcoes.push(acoes)
    setLocalStorage(dbAcoes)
}

const lerAcoes = () => getLocalStorage()

const atualizarAcoes = (index, acoes) => {
    const dbAcoes = lerAcoes()
    dbAcoes[index] = acoes
    setLocalStorage(dbAcoes)
}

const deleteAcoes = (index) => {
    const dbAcoes = lerAcoes()
    dbAcoes.splice(index, 1)
    setLocalStorage(dbAcoes)
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

const saveAcoes = () => {
    if (isValidFields()) {
        const acoes = {
            nome: document.getElementById('nome').value,
            ativo: document.getElementById('ativo').checked
        }

        const index = document.getElementById('nome').dataset.index

        if (index == 'new') {
            criarAcoes(acoes)
        } else {
            atualizarAcoes(index, acoes)
        }

        atualizarTabela()
        fecharModal()
    }
}

const createRow = (acoes, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td><input type="checkbox" class="modal-box" disabled ${(acoes.ativo ? "checked" : "")}></td>
        <td>${acoes.nome}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
        </td>
    `
    document.querySelector('#tabelaAcoes>tbody').appendChild(newRow)
}

const limparTabela = () => {
    const rows = document.querySelectorAll('#tabelaAcoes>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const atualizarTabela = () => {
    const dbAcoes = lerAcoes()
    limparTabela()
    dbAcoes.forEach(createRow)
}

const preencherCampos = (acoes) => {
    document.getElementById('nome').value = acoes.nome
    document.getElementById('ativo').checked = acoes.ativo
    document.getElementById('nome').dataset.index = acoes.index 
}

const editarAcoes = (index) => {
    const acoes = lerAcoes()[index]
    acoes.index = index
    preencherCampos(acoes)
    abrirModal()
}

const editarDeletar = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editarAcoes(index)
            atualizarTabela()
        } else {
            const acoes = lerAcoes()[index]
            const response = confirm(`Deseja realmente excluir a ação ${acoes.nome}`)
            
            if (response) {
                deleteAcoes(index)
                atualizarTabela()
            }
        }
    }
}

atualizarTabela()

//Eventos

document.getElementById('cadastrarAcoes').addEventListener('click' , abrirModal)

document.getElementById('modalClose').addEventListener('click' , fecharModal)

document.getElementById('salvar').addEventListener('click' , saveAcoes)

document.querySelector('#tabelaAcoes>tbody').addEventListener('click' , editarDeletar)

document.getElementById('cancelar').addEventListener('click' , fecharModal)
