import React, { useState, useEffect, useRef } from 'react';
import './SnakeGame.css';

const SnakeGame = () => {
  const [snake, setSnake] = useState([[10, 10]]);
  const [food, setFood] = useState([15, 15]);
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const handleKeyDown = (e) => {
    switch (e.keyCode) {
      case 37:
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 38:
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 39:
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
      case 40:
        if (direction !== 'UP') setDirection('DOWN');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const moveSnake = () => {
      const newSnake = [...snake];
      const head = [...newSnake[newSnake.length - 1]];

      switch (direction) {
        case 'LEFT':
          head[0] -= 1;
          break;
        case 'UP':
          head[1] -= 1;
          break;
        case 'RIGHT':
          head[0] += 1;
          break;
        case 'DOWN':
          head[1] += 1;
          break;
        default:
          break;
      }

      // Check for collision with walls or itself
      if (head[0] < 0 || head[0] >= 20 || head[1] < 0 || head[1] >= 20 || newSnake.some(segment => segment[0] === head[0] && segment[1] === head[1])) {
        setGameOver(true);
        if (score > maxScore) {
          setMaxScore(score);
        }
        return;
      }

      newSnake.push(head);

      // Check for collision with food
      if (head[0] === food[0] && head[1] === food[1]) {
        setFood([Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)]);
        setScore(score + 1);
      } else {
        newSnake.shift();
      }

      setSnake(newSnake);
    };

    const intervalId = setInterval(moveSnake, 200);
    return () => clearInterval(intervalId);
  }, [snake, direction, food, gameOver, gameStarted, score, maxScore]);

  const startGame = () => {
    setSnake([[10, 10]]);
    setFood([15, 15]);
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setGameStarted(true);
  };

  return (
    <div className="game-container">
      <div className="menu">
        <h1>Snake Game</h1>
        <button onClick={startGame}>Start Game</button>
        <p>Max Score: {maxScore}</p>
        <p>Current Score: {score}</p>
        {gameOver && <div className="game-over">Game Over</div>}
      </div>
      <div className="game-area" tabIndex="0" onKeyDown={handleKeyDown}>
        {snake.map((segment, index) => (
          <div key={index} className="snake-segment" style={{ left: `${segment[0] * 20}px`, top: `${segment[1] * 20}px` }}></div>
        ))}
        <div className="food" style={{ left: `${food[0] * 20}px`, top: `${food[1] * 20}px` }}></div>
      </div>
    </div>
  );
};

export default SnakeGame;

