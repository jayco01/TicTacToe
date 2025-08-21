import { useState } from "react";

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares= history[currentMove];
  
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return(
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <ol>{ moves }</ol>
      </div>
    </div>
  );
}

function Board({ xIsNext, squares, onPlay}) {
  function handleClick(i) {
    if(squares[i] || calculateWinnner(squares)){
      return;
    }

    const nextSquares = squares.slice();

    if(xIsNext){
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  
  const result = calculateWinnner(squares);
  const winner = (result === null)? null : result.winner;
  const winningBoxes = (result === null)? Array(3).fill(-1) : result.boxes;

  const boxes = Array.from({length:3}, () => Array(3).fill(null));

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X": "O");
  }

  return (
    <div>
      {boxes.map((row, rowIndex) => (

        <div className="board-row" key={rowIndex}>
          
          {row.map((cell, colIndex) => (

            <div className="square" key={`${rowIndex}-${colIndex}`}>
              <Square value={squares[(rowIndex * 3) + colIndex]} onSquareClick={() => handleClick((rowIndex * 3) + colIndex)} clazz="square" wBoxes={winningBoxes} boxNum={(rowIndex * 3) + colIndex}/>
            </div>
          
          ))}
        </div>
      ))}
    </div>
  );
}

function calculateWinnner(squares) {
    const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for(let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {

      return { winner:squares[a], boxes:[a,b,c] };
    }
  }
  return null;
}

function Square({value, onSquareClick, clazz, wBoxes, boxNum}) {
  if (wBoxes[0] == boxNum || wBoxes[1] == boxNum || wBoxes[2] == boxNum) {
     clazz = "highlight"
  }
 
  return (
    <button className={clazz} onClick={onSquareClick}>
      {value}
    </button> 
  );
}

