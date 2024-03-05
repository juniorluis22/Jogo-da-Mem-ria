// Botão Jogar
document.querySelector(".btn-jogar").addEventListener("click", () => {
  // Obter valores dos input dos jogadores
  let jogador1Nome = document.querySelector("#jogador1").value;
  let jogador2Nome = document.querySelector("#jogador2").value;

  if (jogador1Nome.length == "" && jogador2Nome.length == "") {
    alert("Digite os nomes dos jogadores!");
  } else {
    // Remover tela nome de jogador
    document.querySelector("section.inicio-do-jogo").style.display = "none";
    // Abrir tela do jogo
    document.querySelector(".jogo-da-memoria").style.display = "flex";
  }

  // Exibir os nomes dos jogadores
  document.querySelector(".nome1").innerHTML = jogador1Nome;
  document.querySelector(".nome2").innerHTML = jogador2Nome;

  // Armazenar nomes dos jogadores para referência posterior
  jogador1 = jogador1Nome;
  jogador2 = jogador2Nome;
});

// Variáveis para armazenar os nomes dos jogadores
let jogador1 = "";
let jogador2 = "";

// JOGO DA MEMÓRIA
const cartas = document.querySelectorAll(".carta");
let zerarJogo = 0;
let umaCarta;
let duasCarta;
let desabilitarArea = false;
let jogadorAtual = 1; // Começa com o jogador 1
let pontosJogador1 = 0;
let pontosJogador2 = 0;

// Função para alternar a borda destacada entre os jogadores
function alternarBordaJogador() {
  if (jogadorAtual === 1) {
    document.querySelector(".jogador1-vitorias").classList.add("destacado");
    document.querySelector(".jogador2-vitorias").classList.remove("destacado");
  } else {
    document.querySelector(".jogador1-vitorias").classList.remove("destacado");
    document.querySelector(".jogador2-vitorias").classList.add("destacado");
  }
}

// Iniciar do tempo
let inicioDotempo;

//Pegou o Click da Carta
function virarCarta(e) {
  // Iniciar o tempo somente se ainda não tiver sido iniciado
  if (!inicioDotempo) {
    inicioDotempo = new Date().getTime();
    // Iniciar a atualização do tempo
    setInterval(updateTempo, 500); // Atualiza o tempo a cada segundo
  }

  let clicouNaCarta = e.target;
  if (clicouNaCarta !== umaCarta && !desabilitarArea) {
    clicouNaCarta.classList.add("virar");

    if (!umaCarta) {
      umaCarta = clicouNaCarta;
      alternarBordaJogador(); // Adiciona a classe 'destacado' antes de cada jogada
      return;
    }

    duasCarta = clicouNaCarta;
    desabilitarArea = true;

    let imgUmaCarta = umaCarta.querySelector("img").src;
    let imgDuasCarta = duasCarta.querySelector("img").src;
    duasCartasIguais(imgUmaCarta, imgDuasCarta);
  }
}
function todasCartasViradas() {
  return document.querySelectorAll(".virar").length === 16;
}

function alternarJogador() {
  jogadorAtual = jogadorAtual === 1 ? 2 : 1; // Alternar entre os jogadores
  alternarBordaJogador(); // Adiciona a classe 'destacado' antes de cada jogada
}

function duasCartasIguais(img1, img2) {
  if (img1 === img2) {
    zerarJogo++;

    if (zerarJogo == 8 && todasCartasViradas()) {
      if (jogadorAtual === 1) {
        pontosJogador1++;
        document.querySelector(".jogador1-vitorias").innerHTML = pontosJogador1;
        indicarJogadorGanhador(1);
      } else {
        pontosJogador2++;
        document.querySelector(".jogador2-vitorias").innerHTML = pontosJogador2;
        indicarJogadorGanhador(2);
      }

      setTimeout(() => {
        return cartaAleatoria();
      }, 1000);
    }

    umaCarta.removeEventListener("click", virarCarta);
    duasCarta.removeEventListener("click", virarCarta);
    umaCarta = duasCarta = "";
    return (desabilitarArea = false);
  }

  setTimeout(() => {
    umaCarta.classList.add("agitar");
    duasCarta.classList.add("agitar");
  }, 400);

  setTimeout(() => {
    umaCarta.classList.remove("agitar", "virar");
    duasCarta.classList.remove("agitar", "virar");
    umaCarta = duasCarta = "";
    desabilitarArea = false;
    alternarJogador(); // Alternar para o próximo jogador após um erro
  }, 1200);
}

function cartaAleatoria() {
  zerarJogo = 0;
  umaCarta = duasCarta = "";
  desabilitarArea = false;

  let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
  arr.sort(() => (Math.random() > 0.5 ? 1 : -1));

  cartas.forEach((carta, index) => {
    carta.classList.remove("virar");
    let imgTag = carta.querySelector("img");
    imgTag.src = `./images/img-${arr[index]}.png`;
    carta.addEventListener("click", virarCarta);
  });
}

cartaAleatoria();

cartas.forEach((carta) => {
  carta.addEventListener("click", virarCarta);
});

// Variável para armazenar o intervalo de tempo
let intervaloTempo;

function updateTempo() {
  if (inicioDotempo) {
    let horaAtual = new Date().getTime();
    let tempoDecorrido = horaAtual - inicioDotempo;
    let segundos = Math.floor(tempoDecorrido / 1000);
    let minutos = Math.floor(segundos / 60);
    let horas = Math.floor(minutos / 60);

    // Formatar o tempo
    segundos %= 60;
    minutos %= 60;

    // Exibir o tempo na tela
    let formatoDoTempo = `${pad(horas)}:${pad(minutos)}:${pad(segundos)}`;
    document.querySelector(".contagem").innerHTML = formatoDoTempo;
  }
}

function pad(value) {
  return value < 10 ? "0" + value : value;
}

function indicarJogadorGanhador(jogador) {
  // Obter o nome do jogador vencedor
  let nomeGanhador = jogador === 1 ? jogador1 : jogador2;

  // Selecionar a div de mensagem
  const divMensagem = document.getElementById("mensagem");

  // Inserir a mensagem na div
  divMensagem.textContent = `${nomeGanhador}, ganhou um ponto!`;

  // Exibir a overlay
  document.getElementById("overlay").style.display = "flex";

  // Pausar o tempo
  clearInterval(intervaloTempo);
  inicioDotempo = new Date().getTime(); // Reiniciar o tempo

  // Remover a overlay após alguns segundos
  setTimeout(() => {
    document.getElementById("overlay").style.display = "none";
    // Reiniciar o tempo e começar a atualizá-lo novamente quando uma carta for clicada
    inicioDotempo = null;
  }, 1000); // Remover após 1 segundos
}
// Botão Voltar
document.querySelector(".btn-voltar").addEventListener("click", () => {
  location.reload();
});

// Botão Reiniciar
document.querySelector(".btn-reiniciar").addEventListener("click", () => {
  cartaAleatoria();
  // Pausar o tempo
  clearInterval(intervaloTempo);
  inicioDotempo = new Date().getTime(); // Reiniciar o tempo
  updateTempo(); // Atualizar o tempo na tela após reiniciar
  document.querySelector(".jogador1-vitorias").classList.remove("destacado");
  document.querySelector(".jogador2-vitorias").classList.remove("destacado");
  jogadorAtual = 1;
  // Começar a atualizar o tempo novamente
  inicioDotempo = null;
});
