const tabuleiro = document.getElementById('tabuleiro');
    const somaAtualSpan = document.getElementById('somaAtual');
    const somaAlvoSpan = document.getElementById('somaAlvo');
    const nivelSpan = document.getElementById('nivelAtual');
    const mensagem = document.getElementById('mensagem');
    const fimDeJogoDiv = document.getElementById('fimDeJogo');
    const resultadoFinal = document.getElementById('resultadoFinal');

    let somaAlvo = 10;
    let somaAtual = 0;
    let nivel = 1;
    let limiteCliques = Infinity;
    let cliquesUsados = 0;
    let tempoRestante = 0;
    let cronometro = null;

    const matriz = [];
    const tamanho = 4;

    function gerarNumeroAleatorio(min = 1, max = 9) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function criarTabuleiro() {
      tabuleiro.innerHTML = '';
      matriz.length = 0;
      somaAtual = 0;
      cliquesUsados = 0;
      somaAtualSpan.textContent = somaAtual;
      mensagem.textContent = '';
      fimDeJogoDiv.style.display = 'none';

      aplicarRegrasDoNivel();

      for (let i = 0; i < tamanho; i++) {
        matriz[i] = [];
        for (let j = 0; j < tamanho; j++) {
          let valor = gerarNumeroAleatorio(-5, 15);
          if (nivel < 4) valor = Math.abs(valor);

          matriz[i][j] = { valor, selecionado: false };

          const celula = document.createElement('div');
          celula.className = 'celula';
          celula.textContent = valor;
          celula.dataset.i = i;
          celula.dataset.j = j;

          celula.onclick = () => selecionarCelula(i, j, celula);

          tabuleiro.appendChild(celula);
        }
      }
    }

    function aplicarRegrasDoNivel() {
      switch (nivel) {
        case 1:
          somaAlvo = gerarNumeroAleatorio(10, 15);
          limiteCliques = Infinity;
          break;
        case 2:
          somaAlvo = gerarNumeroAleatorio(15, 25);
          limiteCliques = Infinity;
          break;
        case 3:
          somaAlvo = gerarNumeroAleatorio(20, 30);
          limiteCliques = 5;
          break;
        case 4:
          somaAlvo = gerarNumeroAleatorio(10, 20);
          limiteCliques = 6;
          break;
        case 5:
          somaAlvo = gerarNumeroAleatorio(15, 25);
          limiteCliques = 5;
          iniciarContagemRegressiva(20); // 20 segundos
          break;
        default:
          vitoria();
          return;
      }

      nivelSpan.textContent = nivel;
      somaAlvoSpan.textContent = somaAlvo;
    }

    function selecionarCelula(i, j, elemento) {
      const celula = matriz[i][j];
      if (!celula.selecionado) {
        if (cliquesUsados >= limiteCliques) {
          derrota('❌ Limite de cliques atingido!');
          return;
        }

        celula.selecionado = true;
        somaAtual += celula.valor;
        cliquesUsados++;
        elemento.classList.add('selecionada');
        somaAtualSpan.textContent = somaAtual;

        if (somaAtual === somaAlvo) {
          mensagem.textContent = `✅ Nível ${nivel} concluído!`;
          mensagem.style.color = 'green';

          setTimeout(() => {
            nivel++;
            reiniciarJogo();
          }, 1200);
        } else if (somaAtual > somaAlvo) {
          derrota('❌ Passou da soma!');
        }
      }
    }

    function derrota(motivo) {
      mensagem.textContent = motivo;
      mensagem.style.color = 'red';
      if (cronometro) clearInterval(cronometro);
      mostrarResultadoFinal('😢 Você perdeu!');
    }

    function vitoria() {
      mensagem.textContent = '🎉 Você completou todos os níveis!';
      mensagem.style.color = 'purple';
      mostrarResultadoFinal('🏆 Parabéns! Você venceu o jogo!');
    }

    function mostrarResultadoFinal(texto) {
      resultadoFinal.textContent = texto;
      fimDeJogoDiv.style.display = 'block';
      desativarTabuleiro();
      nivel = 1;
    }

    function desativarTabuleiro() {
      const celulas = document.querySelectorAll('.celula');
      celulas.forEach(c => (c.onclick = null));
    }

    function reiniciarJogo() {
      if (cronometro) clearInterval(cronometro);
      criarTabuleiro();
    }

    function comecarDoZero() {
      nivel = 1;
      reiniciarJogo();
    }

    function iniciarContagemRegressiva(segundos) {
      tempoRestante = segundos;
      cronometro = setInterval(() => {
        mensagem.textContent = `⏳ Tempo restante: ${tempoRestante}s`;
        mensagem.style.color = 'orange';
        tempoRestante--;

        if (tempoRestante < 0) {
          clearInterval(cronometro);
          derrota('⏱ Tempo esgotado!');
        }
      }, 1000);
    }

    // Início do jogo
    criarTabuleiro();