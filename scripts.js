//variaveis e constantes globais
const board = document.getElementById("board");//tabuleiro do movimento
const ctx = board.getContext("2d");//contexto de plotagem no tabuleiro
const nrowcol = 11;//numero de linhas e colunas
const cellSize = board.width/nrowcol;//tamanho do quadriculado
const dropsong = new Audio("songs/drop.wav");//som ao arrastar os cards
const bgmusic = new Audio("songs/jigsaw-puzzle-background.mp3");//musica de fundo
const stepsong = new Audio("songs/plasterbrain__ui-cute-select-major-6th.flac");//som ao executar cada card
const gunsong = new Audio("songs/gun-firing-single-shot.mp3");//som ao atirar no modo zumbi
const personimg = document.createElement('img');//imagem que representa o personagem na tabuleiro
personimg.src="imgs/person.png";//imagem que representa o personagem na tabuleiro
const atiradorimg = document.createElement('img');//imagem que representa o personagem na tabuleiro
atiradorimg.src="imgs/atirador.png";//imagem que representa o personagem na tabuleiro
const zumbimg = document.createElement('img');//imagem dos zumbis
zumbimg.src="imgs/zumbi.png";//imagem dos zumbis
bgmusic.loop = true;//musica tocada em loop
bgmusic.volume = 0.2;//volume inicial da musica baixo
let countinstruct = 0;//conta o numero de instruções executadas
let speed = (document.getElementById("inspeed").max - document.getElementById("inspeed").value +200);//velocidade de execução automatica das instruções
let tracing;//numero do traçada a ser desenhado (somente para o modo movimento)
let mazeing=-1;//numero do labirinto a ser desenhado (somente para o modo movimento)
let interval;//rotulo do setInterval
let typegame = "";//tipo de jogo escolhido
let seqcards=[];//sequencia de instruções
let person = {px:0,py:0,dx:0,dy:1,ag:0};//personagem, posição e direção que está virado
let zumbis = [];//armazena os dados dos zumbis
//labirintos - 0 "#f5f5f5" pista - 1 "#202020" parede - 2 "#f5f520" chegada
const mazes = [
    [
      [1,2,1,0,0,0,0,0,1,0,1],
      [0,0,0,1,0,1,1,0,0,0,0],
      [0,1,0,1,0,1,0,0,1,1,1],
      [0,0,1,1,0,0,0,1,0,0,0],
      [1,0,1,0,0,0,1,0,0,1,0],
      [1,0,1,0,1,0,1,1,0,1,0],
      [0,0,1,0,1,0,0,1,0,1,0],
      [0,1,0,0,1,1,1,1,0,1,0],
      [0,0,1,0,0,0,0,0,0,1,0],
      [1,0,1,1,1,1,1,1,1,1,0],
      [1,0,0,0,0,0,0,0,0,0,0]
    ],
    [
      [0,1,0,0,0,1,1,1,1,1,1],
      [0,1,0,1,0,1,0,0,0,0,1],
      [0,0,0,1,0,0,0,1,1,0,1],
      [0,1,1,0,1,1,1,0,1,0,1],
      [0,0,1,0,0,0,1,0,0,0,2],
      [1,0,0,1,0,0,0,1,1,0,1],
      [0,1,0,1,0,1,0,0,1,0,0],
      [0,1,0,1,0,1,0,1,0,1,0],
      [0,1,0,1,1,1,0,0,0,1,0],
      [0,0,0,0,0,0,0,1,1,1,0],
      [0,1,1,1,0,1,1,0,0,0,0]
    ],
    [
      [0,0,0,0,1,0,0,0,0,0,0],
      [0,1,1,0,1,0,1,1,1,1,0],
      [0,1,1,0,1,0,1,0,2,1,0],
      [0,1,1,0,1,0,1,0,1,1,0],
      [0,1,1,0,1,0,1,0,1,1,0],
      [0,1,1,0,1,0,1,0,1,1,0],
      [0,1,1,0,1,1,1,0,1,1,0],
      [0,1,1,0,0,0,0,0,1,1,0],
      [0,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,1,1,1,1,1,1,1,0],
      [0,0,0,0,0,0,0,0,0,0,0]
    ],
    [
      [0,2,1,0,0,0,1,0,0,0,0],
      [0,1,1,0,1,0,1,0,1,1,0],
      [0,0,1,0,1,0,1,0,1,0,0],
      [1,0,1,0,1,0,1,0,1,0,1],
      [0,0,1,0,1,0,1,0,1,0,0],
      [0,1,1,0,1,0,1,0,1,1,0],
      [0,0,1,0,1,1,1,0,1,0,0],
      [1,0,1,0,0,0,0,0,1,0,1],
      [0,0,1,1,1,1,1,1,1,0,0],
      [0,1,0,0,0,1,0,0,0,1,0],
      [0,0,0,1,0,0,0,1,0,0,0]
    ],
    [
      [1,1,1,1,1,1,1,1,1,1,2],
      [1,0,0,0,0,0,0,0,0,1,0],
      [1,0,1,1,1,1,1,1,0,1,0],
      [1,0,1,0,0,0,0,1,0,1,0],
      [1,0,1,0,1,1,0,1,0,1,0],
      [1,0,1,0,1,0,0,1,0,1,0],
      [1,0,1,0,1,1,1,1,0,1,0],
      [1,0,1,0,0,0,0,0,0,1,0],
      [1,0,1,1,1,1,1,1,1,1,0],
      [1,0,0,0,0,0,0,0,0,0,0],
      [1,1,1,1,1,1,1,1,1,1,1]
    ],
    [
      [0,0,0,0,0,1,0,0,0,0,0],
      [0,1,0,0,1,0,0,1,0,0,1],
      [1,0,0,1,0,0,1,0,0,1,0],
      [0,0,1,0,0,1,0,0,1,0,0],
      [0,1,0,0,1,0,0,1,0,0,0],
      [0,0,0,1,0,0,1,0,0,1,0],
      [0,0,1,0,1,1,2,0,1,0,0],
      [0,1,0,0,0,0,1,1,0,0,0],
      [0,0,0,1,0,1,1,0,0,1,0],
      [0,1,1,0,0,1,0,0,1,0,0],
      [0,1,0,0,0,0,0,1,0,0,1]
    ],
    [
      [0,0,1,0,0,0,0,0,0,0,0],
      [0,1,1,0,1,0,1,1,1,1,0],
      [0,1,1,0,1,0,1,1,1,1,1],
      [0,1,1,0,1,0,0,0,0,0,0],
      [0,1,1,0,1,1,1,1,1,1,0],
      [0,0,0,0,1,0,1,0,0,0,0],
      [0,1,1,1,1,0,1,0,1,1,0],
      [0,0,0,0,1,0,1,0,1,1,0],
      [1,1,1,0,1,0,1,0,1,1,0],
      [2,1,1,0,1,0,1,0,1,1,0],
      [0,0,0,0,1,0,0,0,1,0,0]
    ],
    [
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,1,1,1,1,1,1,1,0,0],
      [0,1,0,0,0,0,0,0,0,1,0],
      [0,1,0,1,0,1,0,1,0,1,0],
      [0,1,0,1,1,0,1,1,0,1,0],
      [2,1,0,0,0,0,1,0,0,0,0],
      [0,1,0,1,0,1,0,1,0,1,0],
      [0,1,0,1,1,0,1,1,0,1,0],
      [0,1,0,0,0,0,0,0,0,1,0],
      [0,0,1,1,1,1,1,1,1,0,0],
      [0,0,0,0,0,0,0,0,0,0,0]
    ],
    [
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,1,1,1,1,1,1,1,1,1,0],
      [0,0,0,0,0,0,0,0,2,0,0],
      [1,1,1,0,1,1,1,0,1,1,1],
      [0,0,1,0,1,0,1,0,0,0,0],
      [0,0,1,0,1,0,1,0,0,1,0],
      [0,0,1,0,1,0,1,0,0,1,0],
      [0,1,1,0,1,0,1,1,1,1,0],
      [0,1,0,0,1,0,0,0,0,0,0],
      [0,1,0,1,1,0,1,0,1,1,1],
      [0,1,0,0,0,0,1,0,0,0,0]
    ]
  ]

//controles de volume
document.getElementById('mute-audio').addEventListener('click',()=>{
    dropsong.volume = 0;
    bgmusic.volume = 0;
    stepsong.volume = 0;
});
document.getElementById('down-audio').addEventListener('click',()=>{
    if (dropsong.volume >= 0.1) dropsong.volume -= 0.1;
    if (bgmusic.volume >= 0.1) bgmusic.volume -= 0.1;
    if (stepsong.volume >= 0.1) stepsong.volume -= 0.1;
});
document.getElementById('up-audio').addEventListener('click',()=>{
    if (dropsong.volume <= 0.9) dropsong.volume += 0.1;
    if (bgmusic.volume <= 0.9) bgmusic.volume += 0.1;
    if (stepsong.volume <= 0.9) stepsong.volume += 0.1;
});
document.getElementById('max-audio').addEventListener('click',()=>{
    dropsong.volume = 1;
    bgmusic.volume = 1;
    stepsong.volume = 1;
});

//funções referentes ao drag and drop
function dropCopy(ev){
    ev.preventDefault();
    if(ev.target.id=="algol"){
        let id = ev.dataTransfer.getData("text");
        let nodeCopy = document.getElementById(id).cloneNode(true);
        nodeCopy.id = "intr"+countinstruct++;
        ev.currentTarget.style.background = "transparent";
        ev.target.appendChild(nodeCopy);
        dropsong.play();
    }
}
function deleteitem(itemid){
    if(itemid.composedPath()[1].id == "algol"){
        document.getElementById(itemid.composedPath()[0].id).remove();
        dropsong.play();
    }
}
function dragoverhandler(ev) {
 ev.currentTarget.style.background = "lightblue";
 ev.preventDefault();
}
function dragstarthandler(ev) {
 ev.currentTarget.style.border = "dashed 1px silver";
 ev.dataTransfer.setData("text", ev.target.id); 
}
//funções referentes ao duplo click
function doubloClickCp(ev){
    //se estiver no algoritimo, deleta
    if(ev.target.parentElement.id=="algol"){
        document.getElementById(ev.target.id).remove();
        dropsong.play();
    }else if(ev.target.parentElement.id=="instructionslist"){//se estiver na base, copia para o algoritimo
        let nodeCopy = document.getElementById(ev.target.id).cloneNode(true);
        nodeCopy.id = "intr"+countinstruct++;
        document.getElementById("algol").appendChild(nodeCopy);
        dropsong.play();
    }
}

//configura velocidade do jogo (somente quando se escolhe tipo ritimo)
function changespeed(){
    speed = (document.getElementById("inspeed").max - document.getElementById("inspeed").value +200);
}
//configuração do tipo de jogo escolhido
function initgame(ev){
    typegame = ev.target.id
    document.getElementById('modalinit').style.display = "none";
    document.getElementById('modaltutorial').classList.remove("modalnone");
    document.getElementById('modaltutorial').classList.add("modaltutorial");
    document.getElementById('tutF').classList.add("tutnone");
    document.getElementById('tutL').classList.add("tutnone");
    document.getElementById('tutM').classList.add("tutnone");
    document.getElementById('tutR').classList.add("tutnone");
    document.getElementById('tutZ').classList.add("tutnone");
    let cards = document.getElementsByClassName('instruction')
    switch (typegame){
        case "btACF":
            for( let i=0; i<cards.length; i++){
                cards[i].classList.remove('notinst');
            }
            document.getElementById('modalboard').classList.add('modalnone');
            document.getElementById('modalboard').classList.remove('modalshow');
            document.getElementById('tutF').classList.remove("tutnone");
        break;
        case "btACL":
            for( let i=0; i<cards.length; i++){
                if (i==1||i==3||i==6||i==7||i==11||i==12||i==13){
                    cards[i].classList.add('notinst');
                }else{
                    cards[i].classList.remove('notinst');
                }
            }
            document.getElementById('modalboard').classList.remove('modalnone');
            document.getElementById('modalboard').classList.add('modalshow');
            document.getElementById('tutL').classList.remove("tutnone");
            drawMaze();
            drawPerson();
        break;
        case "btACM":
            for( let i=0; i<cards.length; i++){
                if (i==1||i==3||i==6||i==7||i==13){
                    cards[i].classList.add('notinst');
                }else{
                    cards[i].classList.remove('notinst');
                }
            }
            document.getElementById('modalboard').classList.remove('modalnone');
            document.getElementById('modalboard').classList.add('modalshow');
            document.getElementById('tutM').classList.remove("tutnone");
            drawInCanva();
            drawPerson();
        break;
        case "btACR":
            for( let i=0; i<cards.length; i++){
                cards[i].classList.remove('notinst');
            }
            document.getElementById('modalboard').classList.add('modalnone');
            document.getElementById("inspeed").classList.remove("inspeed");
            document.getElementById('modalboard').classList.remove('modalshow');
            document.getElementById('tutR').classList.remove("tutnone");
        break;
        case "btACZ":
            document.querySelector('body').classList.add('nightmare');
            document.getElementById('modalboard').classList.add('nightmare');
            bgmusic.src = "songs/BlackMas-BrianBolger.mp3";
            personimg.src = atiradorimg.src;
            drawPerson();
            for( let i=0; i<cards.length; i++){
                if (i==1||i==3||i==6||i==11||i==12){
                    cards[i].classList.add('notinst');
                }else{
                    cards[i].classList.remove('notinst');
                }
            }
            document.getElementById('modalboard').classList.remove('modalnone');
            document.getElementById('modalboard').classList.add('modalshow');
            document.getElementById('tutZ').classList.remove("tutnone");
            drawZumbi();
            drawPerson();
        break;
        default:
            for( let i=0; i<cards.length; i++){
                if (i==1||i==3||i==6||i==7||i==11||i==12||i==13){
                    cards[i].classList.add('notinst');
                }else{
                    cards[i].classList.remove('notinst');
                }
            }
            document.getElementById('modalboard').classList.remove('modalnone');
        break;
    }
    bgmusic.play();
}
function clouseTutorial(){
    document.getElementById('modaltutorial').classList.remove("modaltutorial");
    document.getElementById('modaltutorial').classList.add("modalnone");
}
//desenha gride no tabuleiro
function drawGrid(){
    //limpa toda a tela
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, board.width, board.height);
    //estiliza a linha do gride
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    // Desenha as linhas horizontais do grid
  for (let y = 0; y <= board.height; y += cellSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(board.width, y);
    ctx.stroke();
  }
    // Desenha as linhas verticais do grid
  for (let x = 0; x <= board.width; x += cellSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, board.height);
    ctx.stroke();
  }
}
//apaga celula do tabuleiro
function clearCell(){
    const px = (board.width/2)+(cellSize*person.px)-(personimg.width/2);
    const py = (board.height/2)-(cellSize*person.py)-(personimg.height/2);
    ctx.fillStyle = "#f5f5f5a0";
    ctx.fillRect(px+1, py+1, cellSize-2, cellSize-2);
    return {px,py};
}
//imprime personagem no tabuleiro
function drawPerson(){
    const px = (board.width/2)+(cellSize*person.px)-(personimg.width/2);
    const py = (board.height/2)-(cellSize*person.py)-(personimg.height/2);
    const cx = (board.width/2)+(cellSize*person.px);
    const cy = (board.height/2)-(cellSize*person.py);
    ctx.translate(cx,cy);
    ctx.rotate(person.ag);
    ctx.translate(-cx,-cy);
    ctx.drawImage(personimg,px,py);
    ctx.translate(cx,cy);
    ctx.rotate(-person.ag);
    ctx.translate(-cx,-cy);
    return {px,py};
}
drawGrid();
//funções de cada card
function gireEsquerda(){
    this.card = "Gire Esquerda";
    this.rum = function(per){
        this.dx = -per.dy;
        this.dy = per.dx;
        per.dx = this.dx;
        per.dy = this.dy;
        per.ag -= Math.PI/2;
        return per;
    }
    this.imgcard = function(){
         return 'imgs/gireEsquerda.png';
    }
    return "Gire Esquerda"
}
function gireDireita(){
    this.card = "Gire Direita";
    this.rum = function(per){
        this.dx = per.dy;
        this.dy = -per.dx;
        per.dx = this.dx;
        per.dy = this.dy;
        per.ag += Math.PI/2;
        return per
    }
    this.imgcard = function(){
        return 'imgs/gireDireita.png';
    }
    return "Gire Direita"
}
function girDireita(angulo){
    this.card = "Gire Direita";
    this.angulo = angulo;
    this.radianos = (this.angulo * Math.PI / 180);
    this.rum = function (per){
        this.dx = (per.dx * Math.cos(this.radianos) + per.dy * Math.sin(this.radianos));
        this.dy = -(per.dx * Math.sin(this.radianos) - per.dy * Math.cos(this.radianos));
        per.dx = this.dx;
        per.dy = this.dy;
        per.ag += this.radianos;
        return per
    }
    this.imgcard = function(){
            document.getElementById("currentAction").innerHTML = this.angulo+"º¬>";
        return 'imgs/girDireita.png';
    }
    return "Gire "+angulo+"graus para Direita"
}
function girEsquerda(angulo){
    this.card = "Gire Esquerda";
    this.angulo = angulo;
    this.radianos = -(this.angulo * Math.PI / 180);
    this.rum = function (per){
        this.dx = (per.dx * Math.cos(this.radianos) + per.dy * Math.sin(this.radianos));
        this.dy = -(per.dx * Math.sin(this.radianos) - per.dy * Math.cos(this.radianos));
        per.dx = this.dx;
        per.dy = this.dy;
        per.ag += this.radianos;
        return per;
    }
    this.imgcard = function(){
        document.getElementById("currentAction").innerHTML = "<¬"+this.angulo+"º";
        return 'imgs/girEsquerda.png';
    }
    return "Gire "+angulo+"graus para Esquerda"
}
function meiaVolta(){
    this.card = "Meia Volta";
    this.rum = function(per){
        this.dx = -per.dx;
        this.dy = -per.dy;
        per.dx = this.dx;
        per.dy = this.dy;
        per.ag += Math.PI;
        return per;
    }
    this.imgcard = function(){
        return 'imgs/meiaVolta.png';
    }
    return "Meia Volta"
}
function paraFrente(){
    this.card = "Para Frente";
    this.rum = function(per){
        per.px += per.dx;
        per.py += per.dy;
        return per;
    }
    this.imgcard = function(){
        return 'imgs/paraFrente.png';
    }
    return "Passo para Frente"
}
function paraTras(){
    this.card = "Para Tras";
    this.rum = function(per){
        per.px -= per.dx;
        per.py -= per.dy;
        return per;
    }
    this.imgcard = function(){
        return 'imgs/paraTras.png';
    }
    return "Passo para Tras"
}
function paraEsquerda(){
    this.card = "Para Esquerda";
    this.rum = function(per){
        per.px += per.dy;
        per.py += per.dx;
        return per;
    }
    this.imgcard = function(){
        return 'imgs/paraEsquerda.png';
    }
    return "Passo para Esquerda"
}
function paraDireita(){
    this.card = "Para Direita";
    this.rum = function(per){
        per.px -= per.dy;
        per.py -= per.dx;
        return per;
    }
    this.imgcard = function(){
        return 'imgs/paraDireita.png';
    }
    return "Passo para Direita"
}
function coringa(){
    this.card = "CORINGA";
    this.rum = function(per){
        alert("CORINGA");
        return per;    
    }
    this.imgcard = function(){
        return 'imgs/coringa.png';
    }
    return "CORINGA"
}
function acao(text){
    this.card = "Acao";
    this.text = text
    this.rum = function(per){
        alert(this.text.toUpperCase());
        return per;    
    }
    this.imgcard = function(){
        document.getElementById("currentAction").innerHTML = this.text;
        return 'imgs/acao.png';
    }
    return "AÇÂO"
}

// executa o algoritimo do usuario
function playAlgo(){
    //preencher o vetor seqcards
    let nodes = document.getElementById('algol').childNodes;
    let nodeslist = [];
    let opemclouseBlock = 0
    for(let i=0; i<nodes.length; i++){
        let param = nodes[i].children[0] ? nodes[i].children[0].value : "";
        if (nodes[i].attributes.name.nodeValue == "abreBloco") {
            opemclouseBlock++;
        }else if(nodes[i].attributes.name.nodeValue == "fechaBloco") {
            opemclouseBlock--;
        }
        if (opemclouseBlock < 0){
            alert('Não é possivel fechar ")" um bloco de codigo não aberto "("');
            restart();
            return;
        }
        nodeslist.push({func:nodes[i].attributes.name.nodeValue , param: param});
    }
    if (opemclouseBlock != 0){
        alert('Todos os blocos de codigo aberto "(" devem ser fechados ")"');
        restart();
        return;
    }
    //compila o seqcards
    seqcards.push(...(writeInst(nodeslist,0)));
    //configura modals e executar o seqcards
    seqcards = rumInstF(seqcards);
    countinstruct = 0;
        switch (typegame){
            case "btACF":
                document.getElementById('modalboard').classList.add('modalimg');
                document.getElementById("btnext").addEventListener('click',rumInstFF);
                rumInstFF();
            break;
            case "btACL":
                document.getElementById('modalboard').classList.add('modalplay');
                clearCell();
                drawPerson();
                document.getElementById("btnext").addEventListener('click',rumInstL);
                interval = setInterval(rumInstL,1000);
            break;
            case "btACM":
                document.getElementById('modalboard').classList.add('modalplay');
                clearCell();
                drawPerson();
                document.getElementById("btnext").addEventListener('click',rumInstM);
                interval = setInterval(rumInstM,1000);
            break;
            case "btACR":
                document.getElementById('modalboard').classList.add('modalimg');
                document.getElementById("btnext").addEventListener('click',rumInstFF);
                document.getElementById("currentAction").innerHTML = "Preparar";
                document.getElementById("currentAction").style = `background-image: none;`;
                interval = setInterval(rumInstFF,speed);
            break;
            case "btACZ":
                document.getElementById('modalboard').classList.add('modalplay');
                clearCell();
                drawPerson();
                document.getElementById("btnext").addEventListener('click',rumInstZ);
                interval = setInterval(rumInstZ,1000);
            break;
            default:
                document.getElementById('modalboard').classList.remove('modalplay');
                document.getElementById('modalboard').classList.remove('modalimg');
            break;
        }
}

//compila a sequencia de operações
function writeInst(nodeslist, start){
    let position = start;
    let repite = 0;
    let listfunc = [];
    while(nodeslist.length>position){
        let ins = nodeslist[position]
        switch(ins.func){
            case "gireEsquerda":
            case "paraEsquerda":
            case "paraFrente":
            case "paraDireita":
            case "gireDireita":
            case "meiaVolta":
            case "paraTras":
            case "coringa":
            case "girDireita":
            case "girEsquerda":
            case "acao":
                let inst = new (eval(ins.func))(ins.param);
                listfunc.push(inst);
                repite -= (repite>0)? 1 : 0;
                position += (repite>0)? 0 : 1;
            break;
            case "repita":
                position ++;
                repite = ins.param;
            break;
            case "abreBloco":
                let bl = writeInst(nodeslist,position+1);
                listfunc.push(bl);
                repite -= (repite>0)? 1 : 0;
                position += (repite>0)? 0 : (bl.length + 2);
            break;
            case "fechaBloco":
                return listfunc;
            break;
            default:
                console.log("instrução invalida");
                position++;
            break;
        }
    }
    return listfunc;
}

//função reiniciar
function restart(){
    countinstruct = 0;
    typegame = "";
    seqcards = [];
    person = {px:0,py:0,dx:0,dy:1,ag:0};
    zumbis = [];
    drawGrid();
    document.getElementById('modalinit').style.display = "flex";
    document.getElementById('modalboard').classList.add('modalnone');
    document.getElementById("inspeed").classList.add("inspeed");
    clearInterval(interval);
    let cards = document.getElementsByClassName('instruction');
    bgmusic.pause();
    for( let i=0; i<cards.length; i++){
        cards[i].classList.remove('notinst');
    }
    document.getElementById('modalboard').classList.remove('modalplay');
    document.getElementById('modalboard').classList.remove('modalimg');
    document.getElementById('modalboard').classList.remove('modalshow');
    let nodes = document.getElementById('algol').childNodes;
    for(let i=0; i<nodes.length; i){
        nodes[0].remove();
    }
}
//função retornar para a tela de edição do algoritimo
function previous(){
    countinstruct = 0;
    person = {px:0,py:0,dx:0,dy:1,ag:0};
    drawGrid();
    document.getElementById('modalboard').classList.remove('modalplay');
    document.getElementById('modalboard').classList.remove('modalimg');
    if(typegame=="btACL" || typegame=="btACM" || typegame=="btACZ") 
        document.getElementById('modalboard').classList.add('modalshow');
    if(typegame=="btACR") document.getElementById("inspeed").classList.remove("inspeed");
    if(typegame=="btACM") drawInCanva(tracing);
    if(typegame=="btACL") drawMaze(mazeing);
    if(typegame=="btACZ") drawZumbi(zumbis.length);
    document.getElementById("currentAction").innerHTML = "";
    document.getElementById("currentAction").style = "background-image: none;";
    clearInterval(interval);
    seqcards=[];
    drawPerson();
}    

//executa a sequencia de operações
function rumInstF(seq){
    let sq = [];
    for(let i=0; i<seq.length; i++){
        if(Array.isArray(seq[i])){
            sq.push(...rumInstF(seq[i]));
        }else{
            sq.push(seq[i]);
        }
    }
    return sq;
}
//btACF - livre - não mostra tabuleiro, somente sequencia de imagens
//btACR - AlgoRitmo - Coreografia
function rumInstFF(){
    document.getElementById("currentAction").innerHTML = "";
    if (seqcards.length>0 && countinstruct<seqcards.length)
        document.getElementById("currentAction").style = `background-image: url('${seqcards[countinstruct].imgcard()}');`
    stepsong.play();
    if (typegame=="btACF"||typegame=="btACR"){
        countinstruct = (countinstruct+1)%seqcards.length;
    }else{
        if (countinstruct<seqcards.length){
            countinstruct++;
        }else{
            clearInterval(interval);
        }
    }
}
//btACL - AlgoLabirinto - percorrer um caminho
//função para desenhar um labirinto
function drawMaze(m=-1){
    mazeing = (m<0) ? Math.ceil(Math.random()*(mazes.length-1)) : m;
    // Muda a cor da célula correspondente
   mazes[mazeing].forEach((element, row) => {
        element.forEach((elem, col) => {
            if (elem === 0) ctx.fillStyle = "#f5f5f5";//pista
            if (elem === 1) ctx.fillStyle = "#202020";//parede
            if (elem === 2) ctx.fillStyle = "#f5f520";//chegada
            ctx.fillRect(col*cellSize+1, row*cellSize+1, cellSize-2, cellSize-2);
        });
    });
}
function rumInstL(){
    clearCell();
    const px = person.px;
    const py = person.py;
    if (seqcards.length>0 && countinstruct < seqcards.length){
        person = seqcards[countinstruct].rum(person);
        drawPerson();
    }
    if ((person.px<-5)||(person.px>5)||(person.py<-5)||(person.py>5)||
        (mazes[mazeing][5-person.py][5+person.px]==1)){
        clearCell();
        const pxx = (board.width/2)+(cellSize*person.px)-(personimg.width/2);
        const pyy = (board.height/2)-(cellSize*person.py)-(personimg.height/2);
        ctx.fillStyle = "#202020a0";
        ctx.fillRect(pxx+1, pyy+1, cellSize-2, cellSize-2);
        person.px = px;
        person.py = py;
        drawPerson();
    }
    rumInstFF();
}
//btACM - AlgoMovimento - fazer um desenho
function rumInstM(){
    clearCell();
    if (seqcards.length>0 && countinstruct < seqcards.length){
        person = seqcards[countinstruct].rum(person);
        drawPerson();
    }
    rumInstFF();
}
//funções de desenhar no tabuleiro
function drawInCanva(m=undefined){
    tracing = (!m) ? Math.ceil(Math.random()*7) : m;
    switch (tracing){
        case 1: drawCircle(); break;
        case 2: drawSquare(); break;
        case 3: drawTriangle(); break;
        case 4: drawRectTriangle(); break;
        case 5: drawLozenge(); break;
        case 6: drawHexagono(); break;
        case 7: drawLadder(); break;
        default: drawInCanva(); break;
    }
}
function drawCircle(){
    // Desenha um círculo
    ctx.beginPath();
    ctx.arc(165, 165, 120, 0, 2 * Math.PI);
    ctx.strokeStyle = "#505050";
    ctx.lineWidth = 5;
    ctx.stroke();  
}
function drawSquare(){
    // Desenha um quadrado
    ctx.beginPath();
    ctx.moveTo(75, 75);
    ctx.lineTo(255, 75);
    ctx.lineTo(255, 255);
    ctx.lineTo(75, 255);
    ctx.closePath();
    ctx.strokeStyle = "#505050";
    ctx.lineWidth = 5;
    ctx.stroke();
}
function drawTriangle(){
    // Desenha um Triâgulo Equilátero
    ctx.beginPath();
    ctx.moveTo(165, 45);
    ctx.lineTo(285, 255);
    ctx.lineTo(45, 255);
    ctx.closePath();
    ctx.strokeStyle = "#505050";
    ctx.lineWidth = 5;
    ctx.stroke();
}
function drawRectTriangle(){
    // Desenha um Triâgulo Retângulo
    ctx.beginPath();
    ctx.moveTo(15, 15);
    ctx.lineTo(315, 15);
    ctx.lineTo(15, 315);
    ctx.closePath();
    ctx.strokeStyle = "#505050";
    ctx.lineWidth = 5;
    ctx.stroke();
}
function drawLozenge(){
    // Desenha um losângulo
    ctx.beginPath();
    ctx.moveTo(165, 15);
    ctx.lineTo(255, 165);
    ctx.lineTo(165, 315);
    ctx.lineTo(75, 165);
    ctx.closePath();
    ctx.strokeStyle = "#505050";
    ctx.lineWidth = 5;
    ctx.stroke();
}
function drawHexagono(){
    // Desenha um hexágono
    const x = 165;
    const y = 165;
    const size = 120;
    ctx.beginPath();
    ctx.moveTo(x + size * Math.cos(0), y + size * Math.sin(0));
    for (let i = 1; i <= 6; i++) {
      ctx.lineTo(x + size * Math.cos(i * 2 * Math.PI / 6), y + size * Math.sin(i * 2 * Math.PI / 6));
    }
    ctx.closePath();
    ctx.strokeStyle = "#505050";
    ctx.lineWidth = 5;
    ctx.stroke();
}
function drawLadder(){
    // Desenha um losângulo
    ctx.beginPath();
    ctx.moveTo(165, 165);
    ctx.lineTo(195, 165);
    ctx.lineTo(195, 195);
    ctx.lineTo(225, 195);
    ctx.lineTo(225, 225);
    ctx.lineTo(255, 225);
    ctx.lineTo(255, 255);
    ctx.lineTo(285, 255);
    ctx.lineTo(285, 285);
    ctx.lineTo(315, 285);
    ctx.lineTo(315, 315);
    ctx.lineTo(15, 315);
    ctx.lineTo(15, 15);
    ctx.lineTo(45, 15);
    ctx.lineTo(45, 45);
    ctx.lineTo(75, 45);
    ctx.lineTo(75, 75);
    ctx.lineTo(105, 75);
    ctx.lineTo(105, 105);
    ctx.lineTo(135, 105);
    ctx.lineTo(135, 135);
    ctx.lineTo(165, 135);
    ctx.closePath();
    ctx.strokeStyle = "#505050";
    ctx.lineWidth = 5;
    ctx.stroke();
}
//btACZ - Algozumbi - tiro e labirinto
//função para plotar os zumbis na tela
function drawZumbi(m=0){
    const n = (m>0) ? m : Math.ceil(Math.random()*10);//sorteia o numero de zumbis
    let col, row, dire, px, py, cx, cy;
    if(m==0){
        for(let i=0;i<n;i++){
            col = Math.ceil(Math.random()*nrowcol)-6;
            row = Math.ceil(Math.random()*nrowcol)-6;
            dire = (Math.PI/2)*Math.round(Math.random()*3);
            zumbis.push({col: col, row: row, dire: dire});
        }
    }
    for(let i=0;i<n;i++){
        if (col != person.px || row != person.py){
            px = (board.width/2)+(cellSize*zumbis[i].col)-(zumbimg.width/2);
            py = (board.height/2)-(cellSize*zumbis[i].row)-(zumbimg.height/2);
            cx = (board.width/2)+(cellSize*zumbis[i].col);
            cy = (board.height/2)-(cellSize*zumbis[i].row);
            ctx.translate(cx,cy);
            ctx.rotate(zumbis[i].dire);
            ctx.translate(-cx,-cy);
            ctx.drawImage(zumbimg,px,py);
            ctx.translate(cx,cy);
            ctx.rotate(-zumbis[i].dire);
            ctx.translate(-cx,-cy);
        }
    }
}
function rumInstZ(){
    const px = (board.width/2)+(cellSize*person.px);
    const py = (board.height/2)-(cellSize*person.py);
    const dx = 3*cellSize*person.dx;
    const dy = -3*cellSize*person.dy;
    clearCell();
    if (seqcards.length>0 && countinstruct < seqcards.length){
        if (seqcards[countinstruct].card == "CORINGA"){
            gunsong.play();
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px+dx, py+dy);
            ctx.closePath();
            ctx.strokeStyle = "#a050ff";
            ctx.lineWidth = 2;
            ctx.stroke();
        }else{
            person = seqcards[countinstruct].rum(person);
        }
    }
    zumbis.forEach((item)=>{
        if ((person.px == item.col) && (person.py == item.row)){
            personimg.src = zumbimg.src;
        }
    });
    drawPerson();
    rumInstFF();
}
/*
as opções de jogo serão:
btACF - livre - não mostra tabuleiro, somente sequencia
btACL - AlgoLabirinto - percorrer um caminho
btACM - AlgoMovimento - fazer um desenho
btACR - AlgoRitmo - Coreografia
btACZ - Algozumbi - tiro e labirinto
*/
