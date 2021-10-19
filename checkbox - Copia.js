'use strict';

const getLocalStorage = () => JSON.parse(localStorage.getItem ('db_movimentacao')) ?? [];
const setLocalStorage = (dbMovimentacao) => localStorage.setItem ('db_movimentacao', JSON.stringify(dbMovimentacao));

const criarItem = (tarefa, status, indice) => {
    const item = document.createElement('label');
    item.classList.add('todo__item');
    item.innerHTML = `
    <input type="checkbox" ${status} data-indice=${indice}>
    <div>${tarefa}</div>
    <input type="button" value="X" data-indice=${indice}>
    `;
    document.getElementById('db_movimentacao').appendChild(item);
}

const limparTarefas = () => {
    const db_movimentacao = document.getElementById('db_movimentacao');
    while (db_movimentacao.firstChild) {
        db_movimentacao.removeChild(db_movimentacao.lastChild);
    }
}

const atualizarTela = () => {
    limparTarefas();
    const dbMovimentacao = getLocalStorage();
    dbMovimentacao.forEach ((item, indice) => criarItem (item.tarefa, item.status, indice));
}

const inserirItem = (evento) => {
    const tecla = evento.key;
    const texto = evento.target.value;
    if (tecla === 'Enter') {
        const dbMovimentacao = getLocalStorage();
        dbMovimentacao.push ({'tarefa': texto, 'status': ''});
        setLocalStorage(dbMovimentacao);
        atualizarTela();
        evento.target.value='';
    }
}

const removerItem = (indice) => {
    const dbMovimentacao = getLocalStorage();
    dbMovimentacao.splice (indice, 1);
    setLocalStorage(dbMovimentacao);
    atualizarTela();
}

const atualizarItem = (indice) => {
    const dbMovimentacao = getLocalStorage();
    dbMovimentacao[indice].status = dbMovimentacao[indice].status === '' ? 'checked' : '';
    setLocalStorage(dbMovimentacao);
    atualizarTela();
}

const clickItem = (evento) => {
    const elemento = evento.target;
    if (elemento.type === 'button') {
        const indice = elemento.dataset.indice;
        removerItem(indice);
    }else if (elemento.type === 'checkbox') {
        const indice = elemento.dataset.indice;
        atualizarItem (indice);
    }

}

document.getElementById('newItem').addEventListener('keypress', inserirItem);
document.getElementById('db_movimentacao').addEventListener('click', clickItem);

atualizarTela();