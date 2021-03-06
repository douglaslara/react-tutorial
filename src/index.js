import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//   render() {
//     return (
//       <button
//         className="square"
//         onClick={() => this.props.onClick()}
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }

function Square(props){
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
};


class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      nextPlayer: 'X',
      stepNumber: 0,
    }
  }

  getCurrentState(history){
    return history[this.state.stepNumber];
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      nextPlayer: (step % 2) === 0 ? 'X' : 'O',
    })
  }

  render() {
    const history = this.state.history;
    const current = this.getCurrentState(history);
    const winner = this.calculateWinner(current.squares);
    let status;
    if(winner){
      status = 'Winner: ' + winner;
    }
    else {
      status = 'Next player: ' + this.state.nextPlayer;
    }

    const moves = history.map((step, move) => {
      const desc = move 
        ? 'Go to move #' + move
        : 'Go to game start';

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    })

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
            <ol>{moves}</ol>
        </div>
      </div>
    );
  }


  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = this.getCurrentState(history);
    const squares = current.squares.slice();
   
    if(this.calculateWinner(squares) || squares[i]){
      return;
    }

    const player = this.state.nextPlayer;
    squares[i] = player;
    this.setState(
      {
        history: history.concat([{
          squares: squares
      }]),
        stepNumber: history.length,
        nextPlayer: this.changePlayer(player)
      }
    );
  }
  
  changePlayer(currentPlayer){
    return currentPlayer === 'X' 
      ? 'O'
      : 'X'; 
  }

  calculateWinner(squares){
    const winningGames = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for(let i = 0 ; i < winningGames.length; i++){
      const [a, b, c] = winningGames[i];
      if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
        return squares[a];
      }
    }

    return null;
  }  
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
