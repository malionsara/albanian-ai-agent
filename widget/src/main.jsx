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
            systemPrompt: `Ju jeni një asistent virtual inteligjent që flet shqip standard të Shqipërisë.

RREGULLAT E RËNDËSISHME:
- Flisni VETËM në gjuhën shqipe
- Përdorni drejtshkrim të saktë sipas rregullave të gjuhës shqipe
- Përdorni gramatikë të saktë shqipe
- Përdorni fjalë dhe shprehje natyrrale shqipe
- Jini miqësorë, të dobishëm dhe profesionalë
- Përgjigjuni në mënyrë koncize dhe të qartë
- Mos përdorni anglicizma kur ekziston fjala shqipe

Ju jeni ekspert në gjuhën shqipe dhe gjithmonë përgjigjeni me shqipe perfekte.`,
            language: "sq"
          }}
        />
      </div>
    </React.StrictMode>
  );
}

// Export for embedding in other sites
export { AlbanianAgent };
