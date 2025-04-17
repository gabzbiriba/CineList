const root = document.getElementById("root");

let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

function getFilmesUsuario() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuario) return [];
    return JSON.parse(localStorage.getItem(`filmes_${usuario.usuario}`)) || [];
}

function salvarFilmesUsuario(filmes) {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (usuario) {
        localStorage.setItem(`filmes_${usuario.usuario}`, JSON.stringify(filmes));
    }
}

function Conteudo(...elementos) {
    const main = document.createElement("main");
    elementos.forEach((elemento) => main.append(elemento));
    return main;
}

function Rodape(texto) {
    const paragrafo = document.createElement("p");
    paragrafo.innerText = texto;
    const footer = document.createElement("footer");
    footer.append(paragrafo);
    return footer;
}

function Titulo(texto) {
    const h1 = document.createElement("h1");
    h1.innerText = texto;
    return h1;
}

function Icone(origem = "logo.png", texto = "Logo") {
    const img = document.createElement("img");
    img.setAttribute("src", origem);
    img.setAttribute("alt", texto);
    return img;
}

function Input(id, tipo, rotulo) {
    const label = document.createElement("label");
    label.setAttribute("for", id);
    label.innerText = rotulo;
    const input = document.createElement("input");
    input.setAttribute("type", tipo);
    input.setAttribute("id", id);
    input.setAttribute("name", id);
    const div = document.createElement("div");
    div.append(label, input);
    return div;
}

function InputSubmit(valor) {
    const input = document.createElement("input");
    input.setAttribute("type", "submit");
    input.setAttribute("value", valor);
    return input;
}

function Link(rota, texto) {
    const a = document.createElement("a");
    a.setAttribute("href", "#");
    a.innerText = texto;
    a.addEventListener("click", (event) => {
        event.preventDefault();
        Navega(rota);
    });
    return a;
}

function salvarUsuarios() {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function FormCadastroConta() {
    const form = document.createElement("form");
    form.setAttribute("action", "#");
    form.setAttribute("method", "post");

    const inputUsuario = Input("novo-usuario", "text", "Novo Usuário");
    const inputSenha = Input("nova-senha", "password", "Nova Senha");
    const inputCadastrar = InputSubmit("Cadastrar");

    form.append(inputUsuario, inputSenha, inputCadastrar);
    form.addEventListener("submit", onCadastroConta);

    return form;
}

function onCadastroConta(event) {
    event.preventDefault();

    const usuario = document.getElementById("novo-usuario").value.trim();
    const senha = document.getElementById("nova-senha").value.trim();

    if (!usuario || !senha) {
        alert("Preencha todos os campos!");
        return;
    }

    const existe = usuarios.some(u => u.usuario === usuario);
    if (existe) {
        alert("Usuário já existe!");
        return;
    }

    usuarios.push({ usuario, senha });
    salvarUsuarios();
    alert("Cadastro realizado com sucesso!");
    Navega("/login");
}

function PageCadastroConta() {
    const logo = Icone("./imagens/pipocalaranja.png");
    const titulo = Titulo("Criar Conta");
    const form = FormCadastroConta();
    const linkLogin = Link("/login", "Voltar ao Login");
    const linkContainer = document.createElement("div");
    linkContainer.className = "link-container";
    linkContainer.appendChild(linkLogin);

    const conteudo = Conteudo(logo, titulo, form, linkContainer);

    root.innerHTML = "";
    root.append(conteudo, Rodape("CineList © 2025"));
    document.title = "Cadastro de Conta - CineList";
}

function FormLogin() {
    const form = document.createElement("form");
    form.setAttribute("action", "#");
    form.setAttribute("method", "post");
    const inputUsuario = Input("usuario", "text", "Usuário");
    const inputSenha = Input("senha", "password", "Senha");
    const inputEntrar = InputSubmit("Entrar");
    form.append(inputUsuario, inputSenha, inputEntrar);
    form.addEventListener("submit", onLogin);
    return form;
}

function onLogin(event) {
    event.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value.trim();

    const usuarioEncontrado = usuarios.find(u => u.usuario === usuario && u.senha === senha);

    if (usuarioEncontrado) {
        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));
        Navega("/cadastro");
    } else {
        alert("Usuário ou senha inválidos!");
    }
}

function PageLogin() {
    const logo = Icone("./imagens/pipocalaranja.png");
    const titulo = Titulo("CineList - Login");
    const form = FormLogin();
    const linkCadastroConta = Link("/criar-conta", "Criar uma conta");
    const linkContainer = document.createElement("div");
    linkContainer.className = "link-container";
    linkContainer.appendChild(linkCadastroConta);

    const conteudo = Conteudo(logo, titulo, form, linkContainer);
    root.innerHTML = "";
    root.append(conteudo, Rodape("CineList © 2025"));
    document.title = "Login - CineList";
}

function FormFilme() {
    const form = document.createElement("form");
    form.setAttribute("action", "#");
    form.setAttribute("method", "post");
    const inputTitulo = Input("titulo", "text", "Título do Filme");
    const inputGenero = Input("genero", "text", "Gênero");
    const inputDescricao = Input("descricao", "text", "Avaliação");
    const inputAdicionar = InputSubmit("Adicionar Filme");
    form.append(inputTitulo, inputGenero, inputDescricao, inputAdicionar);
    form.addEventListener("submit", onAdicionarFilme);
    return form;
}

function ListagemFilmes() {
    const filmes = getFilmesUsuario();

    const tabela = document.createElement("table");
    tabela.setAttribute("id", "tabela-filmes");

    const cabecalho = document.createElement("thead");
    const linhaCabecalho = document.createElement("tr");
    const colTitulo = document.createElement("th");
    colTitulo.innerText = "Título";
    const colGenero = document.createElement("th");
    colGenero.innerText = "Gênero";
    const colDescricao = document.createElement("th");
    colDescricao.innerText = "Descrição";
    const colFavorito = document.createElement("th");
    colFavorito.innerText = "Favorito";
    const colAcoes = document.createElement("th");
    colAcoes.innerText = "Ações";

    linhaCabecalho.append(colTitulo, colGenero, colDescricao, colFavorito, colAcoes);
    cabecalho.append(linhaCabecalho);
    tabela.append(cabecalho);

    const corpoTabela = document.createElement("tbody");

    filmes.forEach((filme, index) => {
        const linha = document.createElement("tr");

        const celulaTitulo = document.createElement("td");
        celulaTitulo.innerText = filme.titulo;
        const celulaGenero = document.createElement("td");
        celulaGenero.innerText = filme.genero;
        const celulaDescricao = document.createElement("td");
        celulaDescricao.innerText = filme.descricao;

        const celulaFavorito = document.createElement("td");
        const botaoFavorito = document.createElement("button");
        botaoFavorito.innerText = filme.favorito ? "★" : "☆";
        botaoFavorito.addEventListener("click", () => {
            filmes[index].favorito = !filmes[index].favorito;
            salvarFilmesUsuario(filmes);
            AtualizaListagem();
        });
        celulaFavorito.appendChild(botaoFavorito);

        const celulaAcoes = document.createElement("td");
        const botaoRemover = document.createElement("button");
        botaoRemover.innerText = "Remover";
        botaoRemover.addEventListener("click", () => {
            filmes.splice(index, 1);
            salvarFilmesUsuario(filmes);
            AtualizaListagem();
        });
        celulaAcoes.appendChild(botaoRemover);

        linha.append(celulaTitulo, celulaGenero, celulaDescricao, celulaFavorito, celulaAcoes);
        corpoTabela.append(linha);
    });

    tabela.append(corpoTabela);
    return tabela;
}

function AtualizaListagem() {
    const listaExistente = document.getElementById("tabela-filmes");
    if (listaExistente) listaExistente.remove();
    const novaLista = ListagemFilmes();
    const container = document.getElementById("listagem-container");
    container.append(novaLista);
}

function onAdicionarFilme(event) {
    event.preventDefault();
    const titulo = document.getElementById("titulo").value.trim();
    const genero = document.getElementById("genero").value.trim();
    const descricao = document.getElementById("descricao").value.trim();

    if (!titulo || !genero || !descricao) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    let filmes = getFilmesUsuario();
    filmes.push({ titulo, genero, descricao, favorito: false });
    salvarFilmesUsuario(filmes);
    AtualizaListagem();
    event.target.reset();
}

function PageCadastroFilmes() {
    const titulo = Titulo("Adicionar Filme");
    const form = FormFilme();
    const listagemContainer = document.createElement("div");
    listagemContainer.setAttribute("id", "listagem-container");
    const lista = ListagemFilmes();
    listagemContainer.append(lista);

    const linkContainer = document.createElement("div");
    linkContainer.setAttribute("class", "link-container");

    const linkFavoritos = Link("/favoritos", "Ver Favoritos");
    const linkLogout = Link("/login", "Sair");

    linkContainer.append(linkFavoritos, linkLogout);

    const conteudo = Conteudo(titulo, form, listagemContainer, linkContainer);
    root.innerHTML = "";
    root.append(conteudo, Rodape("CineList © 2025"));
    document.title = "Cadastro - CineList";
}

function PageFavoritos() {
    const titulo = Titulo("Filmes Favoritos");
    const listagemContainer = document.createElement("div");
    listagemContainer.setAttribute("id", "listagem-container");

    const filmes = getFilmesUsuario().filter(filme => filme.favorito);
    if (filmes.length > 0) {
        const lista = document.createElement("table");
        lista.setAttribute("id", "tabela-filmes");

        const cabecalho = document.createElement("thead");
        const linhaCabecalho = document.createElement("tr");
        const colTitulo = document.createElement("th");
        colTitulo.innerText = "Título";
        const colGenero = document.createElement("th");
        colGenero.innerText = "Gênero";
        const colDescricao = document.createElement("th");
        colDescricao.innerText = "Descrição";

        linhaCabecalho.append(colTitulo, colGenero, colDescricao);
        cabecalho.append(linhaCabecalho);
        lista.append(cabecalho);

        const corpoTabela = document.createElement("tbody");

        filmes.forEach(filme => {
            const linha = document.createElement("tr");
            const celulaTitulo = document.createElement("td");
            celulaTitulo.innerText = filme.titulo;
            const celulaGenero = document.createElement("td");
            celulaGenero.innerText = filme.genero;
            const celulaDescricao = document.createElement("td");
            celulaDescricao.innerText = filme.descricao;
            linha.append(celulaTitulo, celulaGenero, celulaDescricao);
            corpoTabela.append(linha);
        });

        lista.append(corpoTabela);
        listagemContainer.append(lista);
    } else {
        const mensagem = document.createElement("p");
        mensagem.innerText = "Nenhum filme favorito encontrado.";
        listagemContainer.append(mensagem);
    }

    const linkContainer = document.createElement("div");
    linkContainer.setAttribute("class", "link-container");

    const linkCadastro = Link("/cadastro", "Voltar ao Cadastro");
    const linkLogout = Link("/login", "Sair");

    linkContainer.append(linkCadastro, linkLogout);

    const conteudo = Conteudo(titulo, listagemContainer, linkContainer);
    root.innerHTML = "";
    root.append(conteudo, Rodape("CineList © 2025"));
    document.title = "Favoritos - CineList";
}

function Navega(rota) {
    if (rota === "/login") {
        localStorage.removeItem("usuarioLogado");
        PageLogin();
    } else if (rota === "/cadastro") {
        PageCadastroFilmes();
    } else if (rota === "/favoritos") {
        PageFavoritos();
    } else if (rota === "/criar-conta") {
        PageCadastroConta();
    } else {
        root.innerHTML = "<p>Página não encontrada!</p>";
    }
}

Navega("/login");