import React from 'react';
import './EmojiGamePage.css';

export const EmojiGamePage: React.FC = () => {
  return (
    <main className="emojis-page-container">
        <div className="title-container">
            <h1>Emoji Mode</h1>
            <p>Adivina al héroe solo con 5 emojis.</p>
        </div>
    </main>
  );
};