function start() {
    
	//inicia a função start()

	//essa forma de chamar a função se deve a biblioteca Jquery
	//indica a div com id # inicio e chama a funcao hide do jquery
	//na pratica ele esconte a div, escondendo a mensagem inicial
	$("#inicio").hide();
	
	//cria os elementos dentro da div fundogame - que é o escopo do jogo, tudo acontece dentro desse bloco que é definido dentro do css, inclusive a posicao das divs dentro dele.
	//no css tem uma chave para cada id, dizendo a imagem e a posicao da div dentro do container pai.
	//ao criar os objetos é importante c
	$("#fundoGame").append("<div id='jogador' class='anima1'></div>");
	$("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
	$("#fundoGame").append("<div id='inimigo2' ></div>");
	$("#fundoGame").append("<div id='amigo' class='anima3'></div>");
	$("#fundoGame").append("<div id='placar'></div>");
	$("#fundoGame").append("<div id='energia'></div>");

	//Principais variáveis do jogo
	
	var jogo = {};
	//define as teclas do jogo - ver o mapa de teclas na internet  ascii
	var TECLA = {
		W: 87,
		S: 83,
		D: 68
	}
	
	//define a velocidade do helicoptero inimigo
	var velocidade=5;
	//define a velocidade do caminhao
	var velocidade2=2;
	//cria uma posicao randomica entre 0px e 334px no eixo y (vertical)
	var posicaoY = parseInt(Math.random() * 334);
	//cria um array para guardar as teclas pressionadas
	jogo.pressionou = [];
	//variavel para animar o disparo
	var podeAtirar=true;
	//variavel para finalizar o jogo
	var fimdejogo=false;
	//pontos com disparos
	var pontos=0;
	//amigos salvos
	var salvos=0;
	//amigos perdidos
	var perdidos=0;
	//energia do helicoptero
	var energiaAtual=3;
	//carrega os sons do jogo
	var somDisparo=document.getElementById("somDisparo");
	var somExplosao=document.getElementById("somExplosao");
	var musica=document.getElementById("musica");
	var somGameover=document.getElementById("somGameover");
	var somPerdido=document.getElementById("somPerdido");
	var somResgate=document.getElementById("somResgate");


	//Música em loop
	musica.addEventListener("ended", function(){ 
		musica.currentTime = 0; musica.play(); }, false);
		musica.play();
	//Verifica se o usuário pressionou alguma tecla	
	//com o Jquery uso do $ 
	//metodo keydown tecla pressionada - retorna true para a variavel
	$(document).keydown(function(e){
	jogo.pressionou[e.which] = true;
	});

	//metodo keyup tecla para cima/solta - retorna false para a variavel
	$(document).keyup(function(e){
	jogo.pressionou[e.which] = false;
	});
	
	//Game Loop
	//chama a funcao loop em cada 30 milisegundos
	jogo.timer = setInterval(loop,20);
	
	//Tudo acontece dentro do GAMELOOP DO JOGO
	function loop() {
		//faz a imagem de trás se movimente para fingir movimento
		movefundo();
		//funcao para mover o jogador dentro do loop do jogo
		movejogador();
		//funcao para mover randomicamente o inimigo (helicoptero)
		moveinimigo1();
		//funcao para mover ramdomicamente o inigo (caminhao)
		moveinimigo2();
		//funcao para mover o amigo - o personagem humano
		moveamigo();
		//funcao que testa quando as diferentes divs se colidem dentro do container fundoGame
		colisao();
		//mostra os pontos do jogo
		placar();
		//mostra a energia do helicoptero
		energia();
	} // Fim da função loop()

	//Função que movimenta o fundo do jogo
	function movefundo() {
		//transforma em inteiro o valor da posicao do bkgraundo da div id fundoGame definido no css e joga esse valor na variavel esquerda.
		//depois ele atualiza esse valor -1 pixel - movendo a div para a esquerda em um loop infinito, assim dando o efeito de movimento
		esquerda = parseInt($("#fundoGame").css("background-position"));
		$("#fundoGame").css("background-position",esquerda-1);
	} // fim da função movefundo()

	//funcao que move o jogador
	function movejogador() {
		//testa a variavel jogo.pressionou e qual tecla foi pressionada
		//através da tecla ele muda a posicao do objeto no css dando impressao de controle
		//a variavel topo recebe a posicao atual da div jogador na pagina
		if (jogo.pressionou[TECLA.W]) {
			var topo = parseInt($("#jogador").css("top"));
			$("#jogador").css("top",topo-10);
			//Testa se a posicao da div estrapolou o limite do conteiner que é a posicao 0
			//se extrapolou ele soma 10px a posicao atual
			if (topo<=0) {
				$("#jogador").css("top",topo+10);
			}
		}
		if (jogo.pressionou[TECLA.S]) {
			var topo = parseInt($("#jogador").css("top"));
			$("#jogador").css("top",topo+10);
			//limita a descida a posicao 434px da div
			if (topo>=434) {	
				$("#jogador").css("top",topo-10);
					
			}	
		}
		if (jogo.pressionou[TECLA.D]) {
			//Chama função Disparo
			disparo();
		}
	
	} // fim da função movejogador()

	//funcao para atualizar os valores das posicoes x e y no css da div inimigo1
	function moveinimigo1() {
		//joga na posicaox o valor interio atual do css propriedade left
		posicaoX = parseInt($("#inimigo1").css("left"));
		$("#inimigo1").css("left",posicaoX-velocidade);
		$("#inimigo1").css("top",posicaoY);
			//testa se a div atingiu o fim da div fundo game (a esquerda no caso) eixo x
			//se atingir ele aparece no comeco do div a direita na posicao x 694 e no eixo y a posicao é randomica
			if (posicaoX<=0) {
			posicaoY = parseInt(Math.random() * 334);
			$("#inimigo1").css("left",694);
			$("#inimigo1").css("top",posicaoY);
				
			}
	} //Fim da função moveinimigo1()

	function moveinimigo2() {
        posicaoX = parseInt($("#inimigo2").css("left"));
		$("#inimigo2").css("left",posicaoX-velocidade2);
			//testa os limites da div	
			if (posicaoX<=0) {
			$("#inimigo2").css("left",775);		
		}
	} // Fim da função moveinimigo2()

	function moveamigo() {
		posicaoX = parseInt($("#amigo").css("left"));
		$("#amigo").css("left",posicaoX+1);
			//testa  os limites da div
			if (posicaoX>906) {
			$("#amigo").css("left",0);
						
		}
	} // fim da função moveamigo()

	function disparo() {
		//verifica o status da variavel booleana pode atirar
		if (podeAtirar==true) {
			//muda o flag pode atirar
			podeAtirar=false;
			//som do disparo
			somDisparo.play();
			//ve a posicao top da div jogador
			topo = parseInt($("#jogador").css("top"))
			//ve a posicao x da div jogador
			posicaoX= parseInt($("#jogador").css("left"))
			//posiciona a saida do tiro na frente da div (helicoptero)
			//para que o tiro nao sai de tras e de cima da imagem do helicoptero
			//afinal o canhao fica no minimo na frente
			//na posicao x - compensa 190px da imagem (poe na frente da div)
			tiroX = posicaoX + 190;
			//na posicao y compensa 37px da imagem (poe no meio)
			topoTiro=topo+37;
			//com as devidas coordenadas  (x,y ou topo e x se cria dinamicamente a div com a imagem do tiro)
			//poe o "tiro" na posicao inicial
			$("#fundoGame").append("<div id='disparo'></div");
			$("#disparo").css("top",topoTiro);
			$("#disparo").css("left",tiroX);
			//agora chamamos a funcao executa disparo que ira rodar em um loop de 30 milisegundos
			var tempoDisparo=window.setInterval(executaDisparo, 30);
		} //Fecha podeAtirar
	 
		function executaDisparo() {
			//atualiza a posicao x 
			posicaoX = parseInt($("#disparo").css("left"));
			//altera o valor da div id disparo atributo left em mais 15px - é a "velocidade" do tiro
			$("#disparo").css("left",posicaoX+15); 
	
			//controla a posicao da div para que ela nao saia da area do jogo - div fundoGame
			//essa funcao fica ativa ate a div do tiro nao chegar a posicao 900px
			if (posicaoX>900) {
				//quando a div "tiro" chega ao fina da tela
				//remove a variavel do tempo			
				window.clearInterval(tempoDisparo);
				//para garantir que foi zerada faz ela receber null
				tempoDisparo=null;
				//remove a div disparo do codigo html
				$("#disparo").remove();
				//muda a flag para que um novo disparo possa ser disparada
				podeAtirar=true;
			}
		} // Fecha executaDisparo()
	} // Fecha disparo()

	function colisao() {
		//metodo collision vem da biblioteca jquery collision
		//quando duas divs se encontram esse metodo retorna varias informacoes
		//a variavel colisao1 recebe essas informacoes
		//quando nao colide a variavel fica "vazia"
		var colisao1 = ($("#jogador").collision($("#inimigo1")));
		// testa as divs jogador e inimigo1 - os helicopteros
		// jogador com o inimigo1
		var colisao2 = ($("#jogador").collision($("#inimigo2")));
		var colisao3 = ($("#disparo").collision($("#inimigo1")));
		var colisao4 = ($("#disparo").collision($("#inimigo2")));
		var colisao5 = ($("#jogador").collision($("#amigo")));
		var colisao6 = ($("#inimigo2").collision($("#amigo")));
		
		//se a varivel tem conteudo - colidiu
		// jogador com inimigo1
		if (colisao1.length>0) {
			//perde energia
			energiaAtual--;
			//som de explosao
			somExplosao.play();
			//pega as posicoes do inimigo1
			inimigo1X = parseInt($("#inimigo1").css("left"));
			inimigo1Y = parseInt($("#inimigo1").css("top"));
			//chama uma funcao passando a posicao do inimigo
			explosao1(inimigo1X,inimigo1Y);
			//ao voltar da funcao recria o inimigo em uma lugar randomico
			posicaoY = parseInt(Math.random() * 334);
			$("#inimigo1").css("left",694);
			$("#inimigo1").css("top",posicaoY);
		}

		// jogador com o inimigo2 
		if (colisao2.length>0) {
			//perde energia
			energiaAtual--;
			//som explosao
			somExplosao.play();
			inimigo2X = parseInt($("#inimigo2").css("left"));
			inimigo2Y = parseInt($("#inimigo2").css("top"));
			explosao2(inimigo2X,inimigo2Y);
			$("#inimigo2").remove();
			reposicionaInimigo2();		
		}

		// Disparo com o inimigo1
		if (colisao3.length>0) {	
			//pontos por acertar o inimigo
			pontos=pontos+100;
			//aumenta a velocidade do inimigo para ficar mais dificil
			velocidade=velocidade+0.2;
			//som de explosao
			somExplosao.play();
			inimigo1X = parseInt($("#inimigo1").css("left"));
			inimigo1Y = parseInt($("#inimigo1").css("top"));
			explosao1(inimigo1X,inimigo1Y);
			//para remover o disparo reposicionamos a div do tiro para alem dos 900px
			//assim a funcao executardisparo elimina a div e encerra
			$("#disparo").css("left",950);
			posicaoY = parseInt(Math.random() * 334);
			$("#inimigo1").css("left",694);
			$("#inimigo1").css("top",posicaoY);
		}

		// Disparo com o inimigo2
		if (colisao4.length>0) {
			//pontos por acertar o inimigo
			pontos=pontos+50;
			//aumenta a velocidade do inimigo para ficar mais dificil
			velocidade2=velocidade2+0.1;
			//som explosao
			somExplosao.play();
			inimigo2X = parseInt($("#inimigo2").css("left"));
			inimigo2Y = parseInt($("#inimigo2").css("top"));
			$("#inimigo2").remove();
			explosao2(inimigo2X,inimigo2Y);
			//move o tiro para uma posicao acima dos 900px e a funcao executardisparo elimina a div
			$("#disparo").css("left",950);
			reposicionaInimigo2();
		}

		// jogador com o amigo
		if (colisao5.length>0) {
			//pontos por acertar o inimigo
			salvos++;
			//som de resgate
			somResgate.play();
			reposicionaAmigo();
			$("#amigo").remove();
		}

		//Inimigo2 com o amigo
		if (colisao6.length>0) {
			//pontos por acertar o inimigo
			perdidos++;
			//som amigo perdido
			somPerdido.play();
			amigoX = parseInt($("#amigo").css("left"));
			amigoY = parseInt($("#amigo").css("top"));
			explosao3(amigoX,amigoY);
			$("#amigo").remove();
			reposicionaAmigo();			
		}
	} //Fim da função colisao()

	function explosao1(inimigo1X,inimigo1Y) {
		//cria uma div chamada explosao1
		$("#fundoGame").append("<div id='explosao1'></div");
		//cria um estilo colocando nesta div uma imagem de fundo
		//no caso a imagem da explosao - se puser no css em alguns browsers nao funciona
		$("#explosao1").css("background-image", "url(assets/imgs/explosao.png)");
		//para facilitar a digitacao, colocou o codigo em uma variavel div
		var div=$("#explosao1");
		//cria estilos com as informacoes cartesianas
		div.css("top", inimigo1Y);
		div.css("left", inimigo1X);
		//cria uma animacao de explosao bem lenta
		//manipula a opacidade para dar efeito
		div.animate({width:200, opacity:0}, "slow");
		//variavel de tempo de 1 segundo para remover a div explosao - para sumir a imagem da explosao
		var tempoExplosao=window.setInterval(removeExplosao, 1000);

		function removeExplosao() {
			//remove a div de explosao
			div.remove();
			//limpa a variavel de tempo
			window.clearInterval(tempoExplosao);
			//para garantir que limpor atribui null
			//em alguns browsers só o clear nao funciona e a contagem se mantem
			tempoExplosao=null;
		}		
	} // Fim da função explosao1()

	function explosao2(inimigo2X,inimigo2Y) {
		$("#fundoGame").append("<div id='explosao2'></div");
		$("#explosao2").css("background-image", "url(assets/imgs/explosao.png)");
		var div2=$("#explosao2");
		div2.css("top", inimigo2Y);
		div2.css("left", inimigo2X);
		div2.animate({width:200, opacity:0}, "slow");

		var tempoExplosao2=window.setInterval(removeExplosao2, 1000);

		function removeExplosao2() {	
			div2.remove();
			window.clearInterval(tempoExplosao2);
			tempoExplosao2=null;
		}		
	} // Fim da função explosao2()

	//Explosão3
	function explosao3(amigoX,amigoY) {
		$("#fundoGame").append("<div id='explosao3' class='anima4'></div");
		$("#explosao3").css("top",amigoY);
		$("#explosao3").css("left",amigoX);

		var tempoExplosao3=window.setInterval(resetaExplosao3, 1000);
		
		function resetaExplosao3() {
			$("#explosao3").remove();
			window.clearInterval(tempoExplosao3);
			tempoExplosao3=null;				
		}
	} // Fim da função explosao3
	
	function reposicionaInimigo2() {

		var tempoColisao4=window.setInterval(reposiciona4, 5000);

		function reposiciona4() {
			window.clearInterval(tempoColisao4);
			tempoColisao4=null;			
			if (fimdejogo==false) {	
				$("#fundoGame").append("<div id=inimigo2></div");
			}		
		}	
	}	
	
	//Reposiciona Amigo
	function reposicionaAmigo() {
	
		var tempoAmigo=window.setInterval(reposiciona6, 6000);
		
		function reposiciona6() {
			window.clearInterval(tempoAmigo);
			tempoAmigo=null;	
			if (fimdejogo==false) {
			$("#fundoGame").append("<div id='amigo' class='anima3'></div>");
			}
		}
	} // Fim da função reposicionaAmigo()

	function placar() {
		$("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");	
	} //fim da função placar()

	function energia() {
		if (energiaAtual==3) {
			$("#energia").css("background-image", "url(assets/imgs/energia3.png)");
		}
		if (energiaAtual==2) {	
			$("#energia").css("background-image", "url(assets/imgs/energia2.png)");
		}
		if (energiaAtual==1) {	
			$("#energia").css("background-image", "url(assets/imgs/energia1.png)");
		}
		if (energiaAtual==0) {
			$("#energia").css("background-image", "url(assets/imgs/energia0.png)");	
			gameOver();
		}
	} // Fim da função energia()

	//Função GAME OVER
	function gameOver() {
		//para com os reposicionamento setando o fim de jogo = true
		fimdejogo=true;
		musica.pause();
		somGameover.play();

		//para o loop do jogo zerando a variavel jogo.timer
		window.clearInterval(jogo.timer);
		jogo.timer=null;
		
		//remove todos os componentes
		$("#jogador").remove();
		$("#inimigo1").remove();
		$("#inimigo2").remove();
		$("#amigo").remove();
		$("#disparo").remove();
		
		$("#fundoGame").append("<div id='fim'></div>");
		
		//cria uma div com um onclick para reiniciar o jogo
		$("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>");
	} // Fim da função gameOver();
} // Fim da função start

//Reinicia o Jogo - no game over
//essa função reinicia o loop do start
function reiniciaJogo() {
	somGameover.pause();
	$("#fim").remove();
	start();
} //Fim da função reiniciaJogo