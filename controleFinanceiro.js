'use strict'

// Abertura e Fechamento do pop-up

const abrirModal = () => document.getElementById('modal')
    .classList.add('active')

const fecharModal = () => {
    limparCampos()
    document.getElementById('modal').classList.remove('active')
}

// Leitura e Escrita na variavel local do navegador

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_movimentacoes')) ?? []

const setLocalStorage = (dbMovimentacoes) => localStorage.setItem("db_movimentacoes" , JSON.stringify(dbMovimentacoes))

// CRUD - create read update delete

const criarMovimentacoes = (movimentacoes) => {
    const dbMovimentacoes = getLocalStorage()
    dbMovimentacoes.push(movimentacoes)
    setLocalStorage(dbMovimentacoes)
}

const lerMovimentacoes = () => getLocalStorage()

const atualizarMovimentacoes = (index, movimentacoes) => {
    const dbMovimentacoes = lerMovimentacoes()
    dbMovimentacoes[index] = movimentacoes
    setLocalStorage(dbMovimentacoes)
}

const deleteMovimentacoes = (index) => {
    const dbMovimentacoes = lerMovimentacoes()
    dbMovimentacoes.splice(index, 1)
    setLocalStorage(dbMovimentacoes)
}

//Interação com o Layout

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

const limparCampos = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('data').dataset.index = 'new'
}

const saveMovimentacoes = () => {
    if (isValidFields()) {
        const movimentacoes = {
            data: document.getElementById('data').value,
            descricao: document.getElementById('descricao').value,
            categoria: document.getElementById('categoria').value,
            acao: document.getElementById('acao').value,
            conta: document.getElementById('conta').value,
            parcela: document.getElementById('parcela').value,
            valor: document.getElementById('valor').value
        }

        const index = document.getElementById('data').dataset.index

        if (index == 'new') {
            criarMovimentacoes(movimentacoes)
        } else {
            atualizarMovimentacoes(index, movimentacoes)
        }

        atualizarTabela()
        fecharModal()
    }
}

const createRow = (movimentacoes, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
   
        <td>${movimentacoes.data}</td>
        <td>${movimentacoes.descricao}</td>
        <td>${movimentacoes.categoria}</td>
        <td>${movimentacoes.acao}</td>
        <td>${movimentacoes.conta}</td>
        <td>${movimentacoes.parcela}</td>
        <td>${movimentacoes.valor}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
        </td>
    `
    document.querySelector('#tabelaMovimentacoes>tbody').appendChild(newRow)
}

const limparTabela = () => {
    const rows = document.querySelectorAll('#tabelaMovimentacoes>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const atualizarTabela = () => {
    const dbMovimentacoes = lerMovimentacoes()
    limparTabela()
    dbMovimentacoes.forEach(createRow)
}

const preencherCampos = (movimentacoes) => {
    document.getElementById('data').value = movimentacoes.data
    document.getElementById('descricao').value = movimentacoes.descricao
    document.getElementById('categoria').value = movimentacoes.categoria
    document.getElementById('acao').value = movimentacoes.acao
    document.getElementById('conta').value = movimentacoes.conta
    document.getElementById('parcela').value = movimentacoes.parcela
    document.getElementById('valor').value = movimentacoes.valor
    document.getElementById('data').dataset.index = movimentacoes.index
}

const editarMovimentacoes = (index) => {
    const movimentacoes = lerMovimentacoes()[index]
    movimentacoes.index = index
    preencherCampos(movimentacoes)
    abrirModal()
}

const editarDeletar = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editarMovimentacoes(index)
            atualizarTabela()
        } else {
            const movimentacoes = lerMovimentacoes()[index]
            const response = confirm(`Deseja realmente excluir a movimentação ${movimentacoes.descricao}?`)
            
            if (response) {
                deleteMovimentacoes(index)
                atualizarTabela()
            }
        }
    }
}

atualizarTabela()

//Eventos

document.getElementById('cadastrarMovimentacoes').addEventListener('click' , abrirModal)

document.getElementById('modalClose').addEventListener('click' , fecharModal)

document.getElementById('salvar').addEventListener('click' , saveMovimentacoes)

document.querySelector('#tabelaMovimentacoes>tbody').addEventListener('click' , editarDeletar)

document.getElementById('cancelar').addEventListener('click' , fecharModal)
