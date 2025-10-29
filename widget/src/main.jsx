import React from 'react';
import ReactDOM from 'react-dom/client';
import { AlbanianAgent } from './AlbanianAgent';
import './styles.css';

// For demo purposes, render to #root
const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '20px' }}>Albanian AI Agent - Demo</h1>
        <AlbanianAgent
          serverUrl={import.meta.env.VITE_BACKEND_URL || "ws://localhost:3001"}
          config={{
            systemPrompt: "Ju jeni një ndihmës i dobishëm AI në gjuhën shqipe. Përgjigjuni në mënyrë miqësore dhe të dobishme.",
            language: "sq"
          }}
        />
      </div>
    </React.StrictMode>
  );
}

// Export for embedding in other sites
export { AlbanianAgent };
