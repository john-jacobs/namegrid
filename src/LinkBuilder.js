import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

function LinkBuilder() {
  const [name, setName] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!name) return;
    const encoded = btoa(name.toLowerCase());
    const url = `${window.location.origin}/?word=${encoded}`;
    setGeneratedUrl(url);
  };

  const handleCopy = () => {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="app">
      <h1>Build a NameGrid Link</h1>
      <form onSubmit={handleGenerate}>
        <input
          type="text"
          placeholder="Enter baby name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Generate Link</button>
      </form>

      {generatedUrl && (
        <div className="result">
          <p>Share this link:</p>
          <input
            type="text"
            readOnly
            value={generatedUrl}
            onClick={(e) => e.target.select()}
          />
          <button onClick={handleCopy} style={{ marginTop: '0.5rem' }}>
            Copy Link
          </button>

          <div style={{ marginTop: '1rem' }}>
            <QRCodeSVG value={generatedUrl} size={150} />
            <p>Scan me to play!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LinkBuilder;
