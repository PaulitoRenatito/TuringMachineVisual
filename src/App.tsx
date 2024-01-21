import './App.css'
import { JsonForm } from './components/json_form/JsonForm'
import { Canvas } from './components/canvas/components/Canvas'
import { useState } from 'react';
import { State, Transition } from './interfaces/State';
import { RunButtons } from './components/step_by_step/RunButtons';

function App() {

  const [states, setStates] = useState<State[] | null>(null);

  const [highlightState, setHighlightState] = useState<State | null>(null);
  const [highlightTransition, setHighlightTransition] = useState<Transition | null>(null);

  return (
    <div className='container-main'>
      <div style={{ display: 'flex' }}>
        <div className='container-top-left' >
          <Canvas states={states} highlightState={highlightState} highlightTransition={highlightTransition} />
          <RunButtons setHighlightState={setHighlightState} setHighlightTransition={setHighlightTransition} />
        </div>
        <div className='container-top-right'>
          <JsonForm setStates={setStates} />
        </div>
      </div>
      <div className='container-bottom'>

      </div>
    </div>
  )
}

export default App
