//TODO: Add check detection, 
//elimination of any moves that result in players own king being put in check, 
//fix pawn promotion to not use prompt
//add onclick functions to handle moves
function gameBoard() {
    this.turn = 1;
    this.tiles = [];
    for (var y = 0; y < 8; y++) {
        let rowArr = new Array();
        for (var x = 0; x < 8; x++) {
            let zB = "";
            let zW = "";
            let sqColor = "";
            let algebraic = "";
			const letter = ["a", "b", "c", "d", "e", "f", "g", "h"];
			algebraic += letter[x];
            algebraic += (8 - y).toString();
            if (x < 4) {
                zB = "q";
                zW = "q";
            }
            else {
                zB = "k";
                zW = "k";
            }
            function chessNotation(p, c) {
                if (c) {
                    return zB + p + (y+1).toString();
                }
                else {
                    return zW + p + (8-y).toString();
                }
            }
            switch(x){
                case 0:
                case 7:
                    zB = chessNotation("r", 1);
                    zW = chessNotation("r", 0);
                    break;
                case 1:
                case 6:
                    zB = chessNotation("n", 1);
                    zW = chessNotation("n", 0);
                    break;
                case 2:
                case 5:
                    zB = chessNotation("b", 1);
                    zW = chessNotation("b", 0);
                    break;
                case 3:
                case 4:
                    zB = chessNotation("", 1);
                    zW = chessNotation("", 0);
                    break;
            }
            if ((x + y) % 2 == 0) {
                sqColor = "white";
            }
            else {
                sqColor = "black";
            }
            rowArr.push({positionB: zB, positionW: zW, notation: algebraic, color: sqColor});
        }
        this.tiles.push(rowArr);
        this.players = [];
        this.players.push(new Player("black", this));
        this.players.push(new Player("white", this));
        this.tile = function(x, y) {
            return this.tiles[y][x];
        }
        this.draw = function() {
            let canv = document.getElementById("chess-board");
            let out_str = "<table>";
            for (var o = 0; o < this.tiles.length; o++) {
                out_str += "<tr>";
                for (var t = 0; t < this.tiles[o].length; t++) {
                    out_str += "<td id='' class='" + this.tiles[o][t].color + "' onclick='pieceMovement(this)' data-cord-x='" + t + "' data-cord-y='" + o + "'>";
                    for (var v = 0; v < this.players.length; v++){
                        for (var u = 0; u < this.players[v].pieces.length; u++) {
                            if (this.players[v].pieces[u].x == t && this.players[v].pieces[u].y == o) {
                                out_str += this.players[v].pieces[u].charCode;
                            }
                        }
                    }
                    out_str += "</td>";
                }
                out_str += "</tr>";
            }
            out_str += "</table>";
            canv.innerHTML = out_str;
        }
    }
}

function Player(c, board) {
    this.color = c;
    this.Board = board;
    this.pieces = [];
    let x = 0;
    let y = 0;
    for (var i = 0; i < 16; i++) {
        switch(i) {
            case 0:
                x = 4;
				y = this.color == "black" ? 0 : 7;
                piece = "King";
                break;
            case 1:
                x = 3;
				y = this.color == "black" ? 0 : 7;
                piece = "Queen";
                break;
            case 2:
            case 3:
				x = i == 3 ? 5 : 2;
				y = this.color == "black" ? 0 : 7;
                piece = "Bishop";
                break;
            case 4:
            case 5:
				x = i == 5 ? 6 : 1;
				y = this.color == "black" ? 0 : 7;
				piece = "Knight";
                break;
            case 6:
            case 7:
				x = i == 7 ? 7 : 0;
				y = this.color == "black" ? 0 : 7;
                piece = "Rook";
                break;
            default:
                x = 15 - i;
				y = this.color == "black" ? 1 : 6;
                piece = "Pawn";
                break;
        }
        this.pieces.push(new gamePiece(x, y, piece, this));
    }
}

function gamePiece(x, y, p, player) {
    this.x = x;
    this.y = y;
    this.Player = player;
    switch(p) {
        case "King":
            this.charCode = ((this.Player.color == "black")?"&#9818\;":"&#9812\;");
            this.rank = "k";
            this.first = true;
            break;
        case "Queen":
            this.charCode = ((this.Player.color == "black")?"&#9819\;":"&#9813\;");
            this.rank = "q";
            break;
        case "Bishop":
            this.charCode = ((this.Player.color == "black")?"&#9821\;":"&#9815\;");
            this.rank = "b";
            break;
        case "Knight":
            this.charCode = ((this.Player.color == "black")?"&#9822\;":"&#9816\;");
            this.rank = "n";
            break;
        case "Rook":
            this.charCode = ((this.Player.color == "black")?"&#9820\;":"&#9814\;");
            this.rank = "r";
            this.first = true;
            break;
        case "Pawn":
            this.charCode = ((this.Player.color == "black")?"&#9823\;":"&#9817\;");
            this.rank = "p";
            this.first = true;
            this.en_passant = false;
            break;
    }
    this.whereIs = function (arr, x, y) {
        for (var i=0; i < arr.length; i++) {
            if (arr[i].x == x && arr[i].y == y) {
                return true;
            }
        }
        return false;
    }
    this.thereIs = function (arr, x, y) {
        for (var i=0; i <arr.length; i++) {
            if (arr[i].x == x && arr[i].y == y) {
                if (arr[i].rank == "p") {
                    return arr[i].en_passant;
                }
            }
        }
    }
    this.moveFilter = function (arr) {
        let arr2 = [];
        let playerIndex = ((this.Player.color=="black")?1:0);
        for (var h = 0; h < arr.length; h++) {
            if (this.whereIs(this.Player.pieces, (this.x + arr[h][0]), (this.y + arr[h][1]))) {
                break;
            }
            if (this.whereIs(this.Player.Board.players[playerIndex].pieces, (this.x + arr[h][0]), (this.y + arr[h][1]))) {
                arr2.push(arr[h]);
                break;
            }
            if (this.y + arr[h][1] > 7 || this.y + arr[h][1] < 0 || this.x + arr[h][0] > 7 || this.x + arr[h][0] < 0) {
                break;
            }            
            else {
                if (arr[h].length > 0) {
                    arr2.push(arr[h]);
                }
            }
        }
        return arr2;
    }
    this.threat = function() {
        let move_list = [];
        let playerIndex = ((this.Player.color=="black")?1:0);
        if (this.rank == "k") {
            // castling
            if (this.first) { // king hasn't moved
                for (var i = 0; i < this.Player.pieces.length; i++) {
                    if (this.Player.pieces[i].rank == "r") { // and at least one rook's not captured
                        if (this.Player.pieces[i].x == 0 && this.Player.pieces[i].first) {// check that the rook is still queenside, unmoved
                            //if no pieces reside queenside at [-1, 0], [-2, 0], and [-3, 0]
                            if (
                                !(this.whereIs(this.Player.pieces, this.x -1, this.y)) && !(this.whereIs(this.Player.Board.players[playerIndex].pieces, this.x -1, this.y)) &&
                                !(this.whereIs(this.Player.pieces, this.x -2, this.y)) && !(this.whereIs(this.Player.Board.players[playerIndex].pieces, this.x -2, this.y)) &&
                                !(this.whereIs(this.Player.pieces, this.x -3, this.y)) && !(this.whereIs(this.Player.Board.players[playerIndex].pieces, this.x -3, this.y))
                            ) {
                                move_list.push(this.moveFilter([[-2, 0]], this.Player));
                            }
                        }
                        if (this.Player.pieces[i].x == 7 && this.Player.pieces[i].first) {// check that the rook is still kingside, unmoved
                            //if no pieces reside kingside at [1, 0], and [2, 0]
                            if (
                                !(this.whereIs(this.Player.pieces, this.x + 1, this.y)) && !(this.whereIs(this.Player.Board.players[playerIndex].pieces, this.x + 1, this.y)) &&
                                !(this.whereIs(this.Player.pieces, this.x + 2, this.y)) && !(this.whereIs(this.Player.Board.players[playerIndex].pieces, this.x + 2, this.y))
                            ) {
                                move_list.push(this.moveFilter([[2, 0]], this.Player));
                            }
                        }
                    }
                }
            }
            move_list.push(this.moveFilter([[-1, -1]], this.Player));
            move_list.push(this.moveFilter([[1, -1]], this.Player));
            move_list.push(this.moveFilter([[-1, 1]], this.Player));
            move_list.push(this.moveFilter([[1, 1]], this.Player));
            move_list.push(this.moveFilter([[0, -1]], this.Player));
            move_list.push(this.moveFilter([[-1, 0]], this.Player));
            move_list.push(this.moveFilter([[0, 1]], this.Player));
            move_list.push(this.moveFilter([[1, 0]], this.Player));
        }
        if (this.rank == "q") {
            move_list.push(this.moveFilter([[-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7]], this.Player));
            move_list.push(this.moveFilter([[1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7]], this.Player));
            move_list.push(this.moveFilter([[-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7]], this.Player));
            move_list.push(this.moveFilter([[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7]], this.Player));
            move_list.push(this.moveFilter([[0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7]], this.Player));
            move_list.push(this.moveFilter([[-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0]], this.Player));
            move_list.push(this.moveFilter([[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7]], this.Player));
            move_list.push(this.moveFilter([[1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]], this.Player));
        }
        if (this.rank == "b") {
            move_list.push(this.moveFilter([[-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7]], this.Player));
            move_list.push(this.moveFilter([[1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7]], this.Player));
            move_list.push(this.moveFilter([[-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7]], this.Player));
            move_list.push(this.moveFilter([[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7]], this.Player));
        }
        if (this.rank == "n") {
            move_list.push(this.moveFilter([[-1, -2]], this.Player));
            move_list.push(this.moveFilter([[1, -2]], this.Player));
            move_list.push(this.moveFilter([[-2, -1]], this.Player));
            move_list.push(this.moveFilter([[2, -1]], this.Player));
            move_list.push(this.moveFilter([[-2, 1]], this.Player));
            move_list.push(this.moveFilter([[2, 1]], this.Player));
            move_list.push(this.moveFilter([[-1, 2]], this.Player));
            move_list.push(this.moveFilter([[1, 2]], this.Player));
        }
        if (this.rank == "r") {
            move_list.push(this.moveFilter([[0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7]], this.Player));
            move_list.push(this.moveFilter([[-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0]], this.Player));
            move_list.push(this.moveFilter([[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7]], this.Player));
            move_list.push(this.moveFilter([[1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]], this.Player));
        }
        if (this.rank == "p") {
            if (this.y == (playerIndex? 4: 3)) {
                if (
                    this.whereIs(this.Player.Board.players[playerIndex].pieces, this.x - 1, this.y) &&
                    this.thereIs(this.Player.Board.players[playerIndex].pieces, this.x - 1, this.y)
                ) {
                    move_list.push(this.moveFilter([[-1, (playerIndex ? 1 : -1)]], this.Player));
                }
                if (
                    this.whereIs(this.Player.Board.players[playerIndex].pieces, this.x + 1, this.y) &&
                    this.thereIs(this.Player.Board.players[playerIndex].pieces, this.x + 1, this.y) 
                ) {
                    move_list.push(this.moveFilter([[1, (playerIndex? 1 : -1)]], this.Player));
                }
            }
            if (this.whereIs(this.Player.Board.players[playerIndex].pieces, this.x - 1, this.y + (playerIndex ? 1 : -1))) {
                move_list.push(this.moveFilter([[-1, (playerIndex ? 1 : -1)]], this.Player));
            }
            if (this.whereIs(this.Player.Board.players[playerIndex].pieces, this.x + 1, this.y + (playerIndex ? 1 : -1))) {
                move_list.push(this.moveFilter([[1, (playerIndex ? 1 : -1)]], this.Player));
            }
            if (this.first) {
                move_list.push(this.moveFilter([[0, (playerIndex ? 1 : -1)], [0, (playerIndex ? 2 : -2)]], this.Player));
            }
            else {
                move_list.push(this.moveFilter([[0, (playerIndex ? 1 : -1)]], this.Player));
            }
        }
        return move_list;
    }
    this.move = function(x, y) {
        if (((this.Player.color == "black")? 0 : 1) == this.Player.Board.turn) {
            let moved = false;
            let inthreat = this.threat();            
            for (var i = 0; i < inthreat.length; i++) {
                let coords = inthreat[i];
                for (var j = 0; j < coords.length; j++) {
                    if (coords[j].length == 2) {
                        if (x == coords[j][0] && y == coords[j][1]) {
                            this.x = this.x + coords[j][0];
                            this.y = this.y + coords[j][1];
                            moved = true;
                        }
                    }
                }
            }
            if (moved) {
                let playerIndex = ((this.Player.color == "black")? 1 : 0);
                // en passant - Also confirmed working, paws off
                if (this.rank == "p" && this.y == (playerIndex ? 5 : 2)) {
                    if (this.thereIs(this.Player.Board.players[playerIndex].pieces, this.x, (playerIndex ? 4: 3))) {
                        for (var n = 0; n < this.Player.Board.players[playerIndex].pieces.length; n++) {
                            if (
                                this.Player.Board.players[playerIndex].pieces[n].x == this.x &&
                                this.Player.Board.players[playerIndex].pieces[n].y == (playerIndex ? 4: 3)
                            ) {
                                this.Player.Board.players[playerIndex].pieces.splice(n, 1);
                            }
                        }
                    }
                }
                for (var l = 0; l < this.Player.Board.players.length; l ++) {
                    for (var m = 0; m < this.Player.Board.players[l].pieces.length; m ++){
                        if (this.Player.Board.players[l].pieces[m].hasOwnProperty('en_passant')) {
                            this.Player.Board.players[l].pieces[m].en_passant = false;
                        }
                    }
                }
                // en passant eligible - Confirmed working, paws off, except to add immediately before this a function to turn all en_passant to false
                if (this.rank == "p" && this.first && this.y == (playerIndex? 3: 4)) {
                    this.en_passant = true;
                }
                // pawn promotion? Obviously, don't use prompt, but test this and see if it works
                if (this.rank == "p" && this.y == (playerIndex? 7: 0)) {
                    let p = prompt("q=Queen b=Bishop n=Knight r=Rook").toLowerCase();
                    switch(p) {
                        case "q":
                            this.charCode = (playerIndex?"&#9819\;":"&#9813\;");
                            this.rank = "q";
                            break;
                        case "b":
                            this.charCode = (playerIndex?"&#9821\;":"&#9815\;");
                            this.rank = "b";
                            break;
                        case "n":
                            this.charCode = (playerIndex?"&#9822\;":"&#9816\;");
                            this.rank = "n";
                            break;
                        case "r":
                            this.charCode = (playerIndex?"&#9820\;":"&#9814\;");
                            this.rank = "r";
                            break;
                    }
                }
                if (this.rank == "k" || this.rank == "r" || this.rank == "p") {
                    // Castling
                    if (this.rank == "k" && this.first) {
                        // check if in position (2 squares towards rook) and move rook to the other side of the king
                        if (this.x == 2) { //queenside
                            for (var i = 0; i < this.Player.pieces.length; i++) {
                                if (this.Player.pieces[i].rank == "r" && this.Player.pieces[i].x == 0) {
                                    this.Player.pieces[i].first = false;
                                    this.Player.pieces[i].x = this.x + 1;
                                }
                            }
                        }
                        if (this.x == 6) { //kingside
                            for (var i = 0; i < this.Player.pieces.length; i ++) {
                                if (this.Player.pieces[i].rank == "r" && this.Player.pieces[i].x == 7) {
                                    this.Player.pieces[i].first = false;
                                    this.Player.pieces[i].x = this.x - 1;
                                }
                            }
                        }
                    }
                    
                    if (this.first) {
                        this.first = false;
                    }
                }
                // Works, seriously, don't touch it
                //if occupied by piece of the opposite color..
                if (this.whereIs(this.Player.Board.players[playerIndex].pieces, this.x, this.y)) {
                    for (var n = 0; n < this.Player.Board.players[playerIndex].pieces.length; n++) {
                        if (
                            this.Player.Board.players[playerIndex].pieces[n].x == this.x &&
                            this.Player.Board.players[playerIndex].pieces[n].y == this.y
                        ) {
                            this.Player.Board.players[playerIndex].pieces.splice(n, 1); //capture the piece of the opposite by removing it
                        }
                    }
                }
                if (this.Player.Board.players[playerIndex].pieces[0].rank == "k") {//if the opponent still has a king
                    this.Player.Board.turn = playerIndex;
                }
            }
        }
        myBoard.draw();
    }
}
let myBoard = new gameBoard();
myBoard.draw();
let turn = 'w';

let activeTile = {cordX: -1, cordY: -1}; //Track active tile

function pieceMovement(tile){
    let cordX = Number(tile.getAttribute("data-cord-x"));
    let cordY = Number(tile.getAttribute("data-cord-y"));
    let active = false;
    let p = (turn == 'w') ? 1 : 0;

    for(let i = 0; i < myBoard.players[p].pieces.length && active == false; i++)
    {
        active = myBoard.players[p].pieces[i].x == cordX && myBoard.players[p].pieces[i].y == cordY;
    }

    if(activeTile.cordX === -1 && activeTile.cordY === -1){
        //Active the clicked Tile
        if(active){
            tile.id = "active";
            activeTile.cordX = cordX;
            activeTile.cordY = cordY;
        }
    } 
    else if(activeTile.cordX === cordX && activeTile.cordY === cordY){
        //De-active same tile is clicked
        tile.id = '';
        activeTile.cordX = -1;
        activeTile.cordY = -1;
    }
    else {
        //Change Turn
        let prevTile = document.getElementsByTagName('tr')[activeTile.cordY].getElementsByTagName('td')[activeTile.cordX];
        prevTile.id = '';
        activeTile.cordX = -1;
        activeTile.cordY = -1;
        turn = (turn === 'w') ? 'b':'w';
        console.log(turn);
    }
}
//Handles
let bking = myBoard.players[0].pieces[0];
let bqueen = myBoard.players[0].pieces[1];
let bqbishop = myBoard.players[0].pieces[2];
let bkbishop = myBoard.players[0].pieces[3];
let bqknight = myBoard.players[0].pieces[4];
let bkknight = myBoard.players[0].pieces[5];
let bqrook = myBoard.players[0].pieces[6];
let bkrook = myBoard.players[0].pieces[7];
let bkp4 = myBoard.players[0].pieces[8];
let bkp3 = myBoard.players[0].pieces[9];
let bkp2 = myBoard.players[0].pieces[10];
let bkp1 = myBoard.players[0].pieces[11];
let bqp1 = myBoard.players[0].pieces[12];
let bqp2 = myBoard.players[0].pieces[13];
let bqp3 = myBoard.players[0].pieces[14];
let bqp4 = myBoard.players[0].pieces[15];

let wking = myBoard.players[1].pieces[0];
let wqueen = myBoard.players[1].pieces[1];
let wqbishop = myBoard.players[1].pieces[2];
let wkbishop = myBoard.players[1].pieces[3];
let wqknight = myBoard.players[1].pieces[4];
let wkknight = myBoard.players[1].pieces[5];
let wqrook = myBoard.players[1].pieces[6];
let wkrook = myBoard.players[1].pieces[7];
let wkp4 = myBoard.players[1].pieces[8];
let wkp3 = myBoard.players[1].pieces[9];
let wkp2 = myBoard.players[1].pieces[10];
let wkp1 = myBoard.players[1].pieces[11];
let wqp1 = myBoard.players[1].pieces[12];
let wqp2 = myBoard.players[1].pieces[13];
let wqp3 = myBoard.players[1].pieces[14];
let wqp4 = myBoard.players[1].pieces[15];

function chess_help() {
    console.log("Murph Strange, Wizard's Chess v0.1 work in progress edition");
    console.log("Does not work on all browsers, notably mobile browsers as they lack web console access");
    console.log("And you kinda need that to move the pieces for now. Will add mouse controls later. Promise.");
    console.log();
    console.log("Moving the pieces is a simple matter of calling the piece's move function, passing x and y changes as parameters.");
    console.log("For example:");
    console.log("wkp1.move(0, -2);");
    console.log("will move the White King's Pawn 1 (thats the pawn directly in front of the white king) no spaces left or right (x change), and two spaces up (y change)");
    console.log("changes x and y are represented as a number of spaces from the pieces current location, x is a left/right change, y is an up/down change");
    console.log("Negative values for x change are left, positive are right");
    console.log("Negative values for y change are up, positive are down");
    console.log("Pieces can only make legal moves (and those that put their own king in check, that function's not written yet)");
    console.log("Castling is a king move. En Passant is a legal recognized move. You can only move pieces of the player whose turn it is");
    console.log("the shortcut naming convention for pieces is first letter of the player's color followed by Either the piece name, as in king and queen");
    console.log("or the first letter of the side that piece is on, king or queen side, for bishops, knights, and rooks. Pawns are further ranked by number, 4 being the outer edge");
    console.log("So, a white queen move would be wqueen.move(-3, 3);, a black knight on the king's side would move with bkknight(1, 2); and the third pawn on the white queen's side");
    console.log("is just wqp3.move(0, -1);")

}