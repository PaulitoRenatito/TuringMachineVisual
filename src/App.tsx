import './App.css'
import { JsonForm } from './components/json_form/JsonForm'
import { Canvas } from './components/canvas/components/Canvas'
import { useState } from 'react';
import { RunButtons } from './components/step_by_step/RunButtons';
import { StateContextProvider } from './services/states/state.context';
import { StateData, TransitionData } from './services/states/state.types';

function App() {

  const [highlightState, setHighlightState] = useState<StateData | null>(null);
  const [highlightTransition, setHighlightTransition] = useState<TransitionData | null>(null);

  return (
    <StateContextProvider>
      <div className='container-main'>
        <div style={{ display: 'flex' }}>
          <div className='container-top-left' >
            <Canvas highlightState={highlightState} highlightTransition={highlightTransition} />
            <RunButtons setHighlightState={setHighlightState} setHighlightTransition={setHighlightTransition} />
          </div>
          <div className='container-top-right'>
            <JsonForm />
          </div>
        </div>
        <div className='container-bottom'>

        </div>
      </div>
    </StateContextProvider>
  )
}

export default App
