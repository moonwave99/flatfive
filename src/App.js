import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

import MusicScore from './MusicScore';
import useTone, { defaultBPM } from './useTone';
import { parse } from './lib/parser';
import Header from './Header';
import IconButton from './IconButton';
import Piano from './Piano';
import '../node_modules/@moonwave99/paino/src/styles/paino.css';
import './styles.css';

const DEFAULT_VALUE = `// my first sketch
Cmaj7   d: 1/4, l: IΔ
C#dim7  d: 1/4, l: #i°7
Dm7     d: 1/4, l: ii7
D#dim7  d: 1/4, l: #ii°7
Em7     d: 1/2, l: iii7
A7      d: 1/2, l: V7/ii
Dm7     d: 1/2, l: ii7
G7      d: 1/2, l: V7
C6/9    d: 1/2, l: I6/9
-       d: 1/2`;

export default function App() {
  const editorRef = useRef(null);
  const [part, setPart] = useState(parse('// hello'));
  const [bpm, setBpm] = useState(defaultBPM);
  const [showPiano, setShowPiano] = useState(true);
  const {
    toggle,
    stop,
    toggleMetronome,
    isPlaying,
    loop,
    metronomeOn,
    togglePartLoop,
    currentInfo,
  } = useTone({ part, bpm });

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('p');
    try {
      const data = decodeURIComponent(escape(window.atob(p)));
      setPart(parse(data));
    } catch (error) {
      console.log('App: Error parsing query string', error);
      setPart(parse(DEFAULT_VALUE));
    }
  }, []);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }
    editorRef.current.setSelection({
      startColumn: 0,
      endColumn: 100,
      startLineNumber: currentInfo.line,
      endLineNumber: currentInfo.line,
    });
  }, [editorRef, currentInfo.line]);

  function onChange(value) {
    try {
      const parsed = parse(value);
      setPart(parsed);
    } catch (error) {
      console.log('App: Error parsing data', error);
    }
  }

  function getEditorHeight() {
    if (showPiano) {
      return 'calc(100vh - 3rem - 3rem - 2rem - 6rem)';
    }
    return 'calc(100vh - 3rem - 3rem - 2rem)';
  }

  function onChordClick({ measure, index }) {
    console.log('App:onChordClick', measure, index);
  }

  return (
    <div className='app'>
      <Header />
      <main>
        <Piano notes={currentInfo.notes} isVisible={showPiano} />
        <div className='columns'>
          <div className='container'>
            <div className='controls'></div>
            <Editor
              className='editor'
              onChange={onChange}
              theme='vs-dark'
              height={getEditorHeight()}
              width='100%'
              defaultValue={DEFAULT_VALUE}
              defaultLanguage='yaml'
              onMount={(editor) => (editorRef.current = editor)}
              options={{
                minimap: false,
                readOnly: isPlaying,
                fontSize: '16px',
                roundedSelection: false,
                scrollBeyondLastLine: false,
              }}
            />
          </div>
          <div className='container'>
            <div className='controls'>
              <IconButton onClick={toggle} icon={isPlaying ? 'pause' : 'play'}>
                Play / Pause
              </IconButton>
              <IconButton onClick={stop} icon='stop'>
                Stop
              </IconButton>
              <IconButton
                toggable
                toggled={loop}
                onClick={togglePartLoop}
                icon='loop'
              >
                Toggle Loop
              </IconButton>
              <IconButton
                toggable
                toggled={metronomeOn}
                onClick={toggleMetronome}
                icon='metronome'
              >
                Toggle Metronome
              </IconButton>
              <label>
                BPM
                <input
                  disabled={isPlaying}
                  type='number'
                  value={bpm}
                  onChange={(event) => setBpm(+event.target.value)}
                />
              </label>
              <IconButton
                toggable
                toggled={showPiano}
                onClick={() => setShowPiano(!showPiano)}
                icon='piano'
              >
                Show / Hide Piano
              </IconButton>
            </div>
            <MusicScore
              part={part}
              onChordClick={onChordClick}
              {...currentInfo}
            />
          </div>
        </div>
      </main>
      <footer>
        2022{' '}
        <a
          href='https://www.diegocaponera.com'
          rel='noopener noreferrer'
          target='_blank'
        >
          mwlabs
        </a>
        .
      </footer>
    </div>
  );
}
