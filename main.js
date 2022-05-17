// Tic Tac Toe Functions
var slots = Array.from(document.getElementsByClassName('slot'));
let board = [];

const ROW_AMOUNT = 3;
const COLUMN_AMOUNT = 3;

let p1_name = "X";
let p2_name = "O";

const P1_SYMBOL = "X";
const P2_SYMBOL = "O";

let playing;
let turn = true;
let turnNum = 0;
let mode = 'pvp';

createBoard();
playing = true;

slots.forEach(slot =>
    slot.onclick = () =>
    {
        if (slot.innerHTML == "")
        {   
            // Player vs. Player
            if (mode == 'pvp')
            {
                turnNum += 1;
                    
                if (turn)
                {
                    slot.innerHTML = 'X';
                    board[slot.id] = 1;
                    checkGrid(p1_name, P1_SYMBOL);         
                }
                else if (!turn)
                {
                    slot.innerHTML = 'O';
                    board[slot.id] = 2;
                    checkGrid(p2_name, P2_SYMBOL);
                }

                turn = !turn;
            }

            // Player vs. Computer
            if (mode == 'pvc')
            {
                if (turn)
                {
                    slot.innerHTML = 'X';
                    board[slot.id] = 1;
                    checkGrid(p1_name, P1_SYMBOL);

                    turn = false;
                    turnNum += 1;

                    console.log('Computer\'s Turn');
                    if (playing)
                    {
                        var blankIndexes = getAllBlankSquares();

                        console.log(blankIndexes);

                        let bestMove = [];
                        // Best Move Notation
                        // [0] = Position in Board
                        // [1] = Brain Evaluation

                        if (blankIndexes.length > 0)
                        { 
                            board[blankIndexes[0]] = 1;

                            bestMove[0] = blankIndexes[0];
                            bestMove[1] = evaluate(board);

                            board[blankIndexes[0]] = 0;

                            blankIndexes.forEach(index =>
                            {
                                board[index] = 1;
                                var evaluation = evaluate(board);

                                console.log(index + ", " + evaluation);

                                if (evaluation > bestMove[1])
                                {
                                    bestMove[0] = index;
                                    bestMove[1] = evaluation;
                                }

                                board[index] = 0;
                            });

                            slots[bestMove[0]].innerHTML = P2_SYMBOL;
                            board[bestMove[0]] = 2;

                            checkGrid(p2_name, P2_SYMBOL);

                            turn = true;
                            turnNum += 1;
                        }
                    }
                }
            }

            // Detect Draw
            if (turnNum >= ROW_AMOUNT * COLUMN_AMOUNT) // >= 9
            {  
                draw();
            }
        }
    }
)

function checkGrid(player, symbol)
{
    let threeInARow = symbol + symbol + symbol;

    // check rows
    for (let i = 0; i < ROW_AMOUNT; i++)
    {
        if (
            slots[i * COLUMN_AMOUNT].innerHTML +
            slots[i * COLUMN_AMOUNT + 1].innerHTML +
            slots[i * COLUMN_AMOUNT + 2].innerHTML ==
            threeInARow
        )
        {
            win(player)
        }
    }
    
    // check columns
    for (let i = 0; i < COLUMN_AMOUNT; i++)
    {
        if (
            slots[i].innerHTML +
            slots[i + COLUMN_AMOUNT].innerHTML +
            slots[i + (COLUMN_AMOUNT * 2)].innerHTML ==
            threeInARow        
        )
        {
            win(player)
        }
    }

    // check diagonals
    if (
        slots[0].innerHTML +
        slots[4].innerHTML +
        slots[8].innerHTML ==
        threeInARow        
    )
    {
        win(player);
    }

    if (slots[2].innerHTML +
        slots[4].innerHTML +
        slots[6].innerHTML ==
        threeInARow
    )
    {
        win(player);
    }

}

function createBoard()
{
    for(let i = 0; i < ROW_AMOUNT * COLUMN_AMOUNT; i++)
    {
        board[i] = 0;
    }
}

function clearBoard()
{   
    turn = true;
    
    turnNum = 0;
    slots.forEach(slot =>
        slot.innerHTML = ""
    )
    for (let i = 0; i < board.length; i++)
    {
        board[i] = 0;
    }

    playing = true;
}

function win(name)
{
    if (name == p1_name)
    {
        pushResults(0); // 0 = LOSE
    }
    else if (name == p2_name)
    {
        pushResults(1); // 1 = WIN
    }
    winnerText.innerHTML = name + " Wins!";

    playing = false;
}

function draw()
{
    pushResults(0.5) // 0.5 = DRAW
    winnerText.innerHTML = "Draw!";

    playing = false;
}

// Button / Text Functions
var modeText = document.getElementById('mode');
var winnerText = document.getElementById('winner');

var pvpButton = document.getElementById('pvp');
var pvcButton = document.getElementById('pvc');
var resetButton = document.getElementById('reset');

// start with Player vs. Player mode
modeText.innerHTML = "Player vs. Player"; 

// mode buttons
pvpButton.onclick = () =>
{
    mode = "pvp";
    modeText.innerHTML = "Player vs. Player";
    clearBoard();
}

pvcButton.onclick = () =>
{
    mode = "pvc";
    modeText.innerHTML = "Player vs. Computer";
    clearBoard();
}

// reset button
resetButton.onclick = () =>
{
    clearBoard();
    winnerText.innerHTML = "";
}

// AI / Machine Learning
const net = new brain.NeuralNetwork();

const data = [
    {
        // INPUT
        // 0 - BLANK
        // 1 - X
        // 2 - O

        // OUTPUT
        // 0 - LOSE
        // 0.5 - DRAW
        // 1 - WIN

        input: [0, 0, 0,
                0, 0, 0,
                0, 0, 0],
        output: [0]
    }
]

net.train(data);

function evaluate(board)
{
    return net.run(board);
}

function getAllBlankSquares()
{
    let indexes = [];
    const val = 0;
    for (let i = 0; i < board.length; i++)
    {
        if (board[i] == val)
        {
            indexes.push(i);
        }
    }

    return indexes;
}

function pushResults(output)
{
    data.push
    (
        {
            input: board,
            output: [output]
        }
    )
    console.log(JSON.stringify(data));
}

// When it's the computer's turn (outide of click loop)
if (!turn && mode == 'pvc')
{
    console.log('Computer\'s Turn');
    var blankIndexes = getAllBlankSquares();
    let bestMove = [];
    // Best Move Notation
    // [0] = Position in Board
    // [1] = Brain Evaluation

    if (blankIndexes.length > 0)
    { 
        board[blankIndexes[0]] = 1;

        bestMove[0] = blankIndexes[0];
        bestmove[1] = evaluate(board);

        board[blankIndexes[0]] = 0;

        indexes.forEach(index =>
        {
            board[index] = 1;
            var evaluation = evaluate(board);

            if (evaluation > bestMove[1])
            {
                bestMove[0] = index;
                bestMove[1] = evaluation;
            }

            board[index] = 0;
        });

        slots[bestMove[0]].innerHTML = P2_SYMBOL;

        turn = !turn;
        turnNum += 1;
    }
}

console.log(JSON.stringify(data));
/*
console.log(net.run([2, 0, 1, 
                     2, 1, 0, 
                     0, 0, 0])[0]);
*/
