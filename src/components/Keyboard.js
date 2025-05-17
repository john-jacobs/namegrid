import React from 'react';

const KEY_ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['Enter','Z','X','C','V','B','N','M','Backspace']
];

function Keyboard({ onKey }) {
  return (
    <div className="keyboard">
      {KEY_ROWS.map((row, i) => (
        <div className="keyboard-row" key={i}>
          {row.map((key) => (
            <button
              key={key}
              className="key"
              onClick={() => onKey(key)}
            >
              {key === 'Backspace' ? '⌫' : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;
