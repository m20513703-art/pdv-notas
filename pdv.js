"use strict";

/* =========================================================
   THOR DISTRIBUIDORA DE ALIMENTOS
   PDV - CONTROLE DE ENTREGAS
========================================================= */

const CHAVE = "thor_entregas";

let entregas = JSON.parse(localStorage.getItem(CHAVE)) || [];


/* =========================================================
   NAVEGAÇÃO
========================================================= */

function abrirTela(id) {

    document.querySelectorAll(".tela").forEach(tela => {
        tela.classList.remove("ativa");
    });

    const tela = document.getElementById(id);

    if (tela) {
        tela.classList.add("ativa");
    }

    atualizarPainel();
    mostrarEntregas();
}


/* =========================================================
   SAIR
========================================================= */

function sair() {
    if (confirm("Deseja sair do sistema?")) {
        window.location.href = "../index.html";
    }
}


/* =========================================================
   DATA ATUAL
========================================================= */

function mostrarDataHoje() {

    const elemento =
        document.getElementById("dataHoje");

    if (!elemento) {
        return;
    }

    const hoje =
        new Date().toLocaleDateString("pt-BR");

    elemento.textContent = hoje;
}


/* =========================================================
   CRIAR CAMPOS DAS NOTAS
========================================================= */

function criarCamposNotas() {

    const quantidade =
        Number(document.getElementById("quantidadeNotas").value);

    const container =
        document.getElementById("camposNotas");

    container.innerHTML = "";

    if (!quantidade) {
        return;
    }

    for (let i = 1; i <= quantidade; i++) {

        const div = document.createElement("div");

        div.className = "campo-nota";

        div.innerHTML = `
            <label>Número da Nota Fiscal ${i}</label>

            <input
                type="text"
                class="numero-nota"
                placeholder="Digite o número da NF ${i}"
                required
            >
        `;

        container.appendChild(div);
    }
}


/* =========================================================
   CRIAR NOVA ENTREGA
========================================================= */

document
    .getElementById("formEntrega")
    .addEventListener("submit", function (event) {

        event.preventDefault();

        const cliente =
            document.getElementById("cliente").value.trim();

        const quantidade =
            Number(document.getElementById("quantidadeNotas").value);

        const observacao =
            document.getElementById("observacao").value.trim();

        const camposNotas =
            document.querySelectorAll(".numero-nota");

        const notas = [];

        camposNotas.forEach(campo => {

            const numero =
                campo.value.trim();

            if (numero) {
                notas.push(numero);
            }
        });

        if (!cliente) {
            alert("Informe o nome do cliente.");
            return;
        }

        if (!quantidade) {
            alert("Informe a quantidade de notas.");
            return;
        }

        if (notas.length !== quantidade) {
            alert("Preencha todos os números das notas.");
            return;
        }


        const entrega = {

            id: Date.now(),

            codigo:
                "THOR-" +
                Math.floor(100000 + Math.random() * 900000),

            cliente: cliente,

            notas: notas,

            observacao: observacao,

            status: "pendente",

            dataCriacao:
                new Date().toLocaleString("pt-BR"),

            assinatura: null
        };


        entregas.push(entrega);

        salvar();


        alert(
            "Entrega criada com sucesso!\n\n" +
            "Código da entrega: " +
            entrega.codigo
        );


        this.reset();

        document.getElementById("camposNotas").innerHTML = "";

        abrirTela("pendentes");
    });


/* =========================================================
   SALVAR
========================================================= */

function salvar() {

    localStorage.setItem(
        CHAVE,
        JSON.stringify(entregas)
    );

    atualizarPainel();
}


/* =========================================================
   PAINEL
========================================================= */

function atualizarPainel() {

    const total =
        entregas.length;

    const pendentes =
        entregas.filter(
            entrega => entrega.status === "pendente"
        ).length;

    const concluidas =
        entregas.filter(
            entrega => entrega.status === "concluida"
        ).length;


    const totalElement =
        document.getElementById("totalEntregas");

    const pendentesElement =
        document.getElementById("totalPendentes");

    const concluidasElement =
        document.getElementById("totalConcluidas");


    if (totalElement) {
        totalElement.textContent = total;
    }

    if (pendentesElement) {
        pendentesElement.textContent = pendentes;
    }

    if (concluidasElement) {
        concluidasElement.textContent = concluidas;
    }
}


/* =========================================================
   MOSTRAR ENTREGAS
========================================================= */

function mostrarEntregas() {

    const listaPendentes =
        document.getElementById("listaPendentes");

    const listaConcluidas =
        document.getElementById("listaConcluidas");


    if (!listaPendentes || !listaConcluidas) {
        return;
    }


    listaPendentes.innerHTML = "";
    listaConcluidas.innerHTML = "";


    const pendentes =
        entregas.filter(
            entrega => entrega.status === "pendente"
        );


    const concluidas =
        entregas.filter(
            entrega => entrega.status === "concluida"
        );


    /* PENDENTES */

    if (pendentes.length === 0) {

        listaPendentes.innerHTML = `
            <div class="vazio">
                Nenhuma entrega pendente.
            </div>
        `;

    } else {

        pendentes.forEach(entrega => {

            listaPendentes.appendChild(
                criarCardEntrega(entrega)
            );

        });
    }


    /* CONCLUÍDAS */

    if (concluidas.length === 0) {

        listaConcluidas.innerHTML = `
            <div class="vazio">
                Nenhuma entrega concluída.
            </div>
        `;

    } else {

        concluidas.forEach(entrega => {

            listaConcluidas.appendChild(
                criarCardEntrega(entrega)
            );

        });
    }
}


/* =========================================================
   CARD DA ENTREGA
========================================================= */

function criarCardEntrega(entrega) {

    const div =
        document.createElement("div");

    div.className = "entrega";


    const listaNotas =
        entrega.notas
            .map(
                nota => `<strong>NF ${nota}</strong>`
            )
            .join("<br>");


    let botao = "";


    if (entrega.status === "pendente") {

        botao = `
            <button
                onclick="abrirAssinatura('${entrega.codigo}')"
            >
                ✍️ Abrir Assinatura
            </button>
        `;

    } else {

        botao = `
            <button
                onclick="verEntrega('${entrega.codigo}')"
            >
                📄 Ver Comprovante
            </button>
        `;
    }


    div.innerHTML = `

        <h3>${entrega.cliente}</h3>

        <p>
            <strong>Código:</strong>
            ${entrega.codigo}
        </p>

        <p>
            <strong>Notas fiscais:</strong><br>
            ${listaNotas}
        </p>

        ${
            entrega.observacao
            ? `
                <p>
                    <strong>Observação:</strong>
                    ${entrega.observacao}
                </p>
            `
            : ""
        }

        <p>
            <strong>Status:</strong>
            ${
                entrega.status === "pendente"
                ? "🕐 Aguardando assinatura"
                : "✅ Assinada"
            }
        </p>

        <p>
            <strong>Criada em:</strong>
            ${entrega.dataCriacao}
        </p>

        ${botao}

    `;


    return div;
}


/* =========================================================
   ABRIR TELA DE ASSINATURA
========================================================= */

function abrirAssinatura(codigo) {

    const entrega =
        entregas.find(
            item => item.codigo === codigo
        );


    if (!entrega) {
        alert("Entrega não encontrada.");
        return;
    }


    localStorage.setItem(
        "thor_entrega_atual",
        JSON.stringify(entrega)
    );


    window.location.href =
        "../index.html";
}


/* =========================================================
   VER COMPROVANTE
========================================================= */

function verEntrega(codigo) {

    const entrega =
        entregas.find(
            item => item.codigo === codigo
        );


    if (!entrega) {
        alert("Entrega não encontrada.");
        return;
    }


    let mensagem =
        "COMPROVANTE DE ENTREGA\n\n";

    mensagem +=
        "THOR DISTRIBUIDORA DE ALIMENTOS\n\n";

    mensagem +=
        "Cliente: " +
        entrega.cliente +
        "\n\n";

    mensagem +=
        "Notas fiscais:\n";

    entrega.notas.forEach(nota => {

        mensagem +=
            "NF " +
            nota +
            "\n";

    });


    if (entrega.assinatura) {

        mensagem +=
            "\nNome: " +
            entrega.assinatura.nome;

        mensagem +=
            "\nDocumento: " +
            entrega.assinatura.documento;

        mensagem +=
            "\nData da assinatura: " +
            entrega.assinatura.data;
    }


    alert(mensagem);
}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

mostrarDataHoje();

atualizarPainel();

mostrarEntregas();