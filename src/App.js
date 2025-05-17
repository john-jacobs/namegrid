import React, { useState, useEffect } from 'react';
import Keyboard from './components/Keyboard';
import './styles.css';

const NUM_GUESSES = 6;

function App() {
  const [solution, setSolution] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [statusesList, setStatusesList] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [flippedRowIndex, setFlippedRowIndex] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('word');

    if (encoded) {
      try {
        const decoded = atob(encoded).toLowerCase();
        setSolution(decoded);
      } catch (e) {
        console.error('Invalid base64 in URL:', e);
        setSolution('chuck');
      }
    } else {
      setSolution('chuck');
    }
  }, []);

  useEffect(() => {
    if (guesses.length === 0 || gameOver || !solution) return;

    const latestGuess = guesses[guesses.length - 1];
    const isCorrect = latestGuess === solution;
    const isLastGuess = guesses.length === NUM_GUESSES;

    if (isCorrect) {
      setGameOver(true);
      setStatusMessage('🎉 You guessed it!');
    } else if (isLastGuess) {
      setGameOver(true);
      setStatusMessage(`❌ Out of guesses! The name was: ${solution.toUpperCase()}`);
    }
  }, [guesses, gameOver, solution]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      handleKeyboardInput(e.key);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleGuessSubmit = () => {
    const guess = currentGuess.toLowerCase();
    if (gameOver || guess.length !== solution.length) return;

    const newStatuses = getTileStatuses(guess, solution);

    setGuesses([...guesses, guess]);
    setStatusesList([...statusesList, newStatuses]);
    setCurrentGuess('');
    setStatusMessage('');
    setFlippedRowIndex(guesses.length);
  };

  const handleKeyboardInput = (key) => {
    if (gameOver || !solution) return;

    if (key === 'Backspace') {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (key === 'Enter') {
      handleGuessSubmit();
    } else if (/^[A-Z]$/i.test(key)) {
      if (currentGuess.length < solution.length) {
        setCurrentGuess((prev) => prev + key.toLowerCase());
      }
    }
  };

  const getTileStatuses = (guess, solution) => {
    const statuses = Array(guess.length).fill('absent');
    const solutionChars = solution.split('');

    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === solution[i]) {
        statuses[i] = 'correct';
        solutionChars[i] = null;
      }
    }

    for (let i = 0; i < guess.length; i++) {
      if (statuses[i] === 'correct') continue;
      const index = solutionChars.indexOf(guess[i]);
      if (index !== -1) {
        statuses[i] = 'present';
        solutionChars[index] = null;
      }
    }

    return statuses;
  };

  const renderTile = (char, idx, status, rowIdx) => {
    const className = `tile${rowIdx === flippedRowIndex ? ' flip' : ''}${status ? ' revealed' : ''}`;
    const delay = `${idx * 120}ms`;
    return (
      <div
        key={idx}
        className={className}
        data-status={status}
        style={{ animationDelay: delay }}
      >
        {char}
      </div>
    );
  };

  return (
    <div className="app">
      <h1>Wordle for Babies</h1>

      {solution ? (
        <>
          <div className="board">
            {[...Array(NUM_GUESSES)].map((_, rowIdx) => {
              const isCurrent = rowIdx === guesses.length;
              const guess = guesses[rowIdx] || (isCurrent ? currentGuess : '');
              const statuses = statusesList[rowIdx] || [];

              return (
                <div key={rowIdx} className="guess-row">
                  {[...Array(solution.length)].map((_, colIdx) => {
                    const char = guess[colIdx] || '';
                    const status = statuses[colIdx] || '';
                    return renderTile(char, colIdx, status, rowIdx);
                  })}
                </div>
              );
            })}
          </div>

          {statusMessage && <div className="status-message">{statusMessage}</div>}

          {!gameOver && <Keyboard onKey={handleKeyboardInput} />}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
