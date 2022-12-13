import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Editor from '@monaco-editor/react';
import MusicScore from './MusicScore';
import IconButton from './IconButton';
import Piano from './Piano';
import useTone, { defaultBPM } from './hooks/useTone';
import useTitle from './hooks/useTitle';
import { parse } from './lib/parser';
import { encodeSketch, decodeSketch } from './lib/utils';

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

const DEFAULT_SKETCH_SOURCE = `# hello!
# see the Help section to know how to write your sketch`;

export default function SketchView() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const editorRef = useRef(null);
  const [source, setSource] = useState(DEFAULT_SKETCH_SOURCE);
  const [chords, setChords] = useState([]);
  const [meta, setMeta] = useState({});
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
  } = useTone({ chords, bpm });

  useEffect(() => {
    const newParam = searchParams.get('new');
    if (newParam !== null) {
      return;
    }
    try {
      setSource(decodeSketch(searchParams.get('p')));
    } catch (error) {
      console.log('SketchView: Error decoding data', error);
    }
  }, []);

  useEffect(() => {
    try {
      const parsed = parse(source);
      setChords(parsed.chords);
      if (!parsed.chords.length) {
        return;
      }
      setMeta(parsed.meta);
      if (parsed.meta.bpm) {
        setBpm(+parsed.meta.bpm);
      }
      const p = encodeSketch(source);
      if (!p) {
        return;
      }
      setSearchParams({ p });
    } catch (error) {
      console.log('SketchView: Error encoding data', error);
    }
  }, [source]);

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

  useTitle(meta.title || 'New sketch');

  function onChange(value) {
    setSource(value);
  }

  function getEditorHeight() {
    if (showPiano) {
      return 'calc(100vh - 3rem - 3rem - 2rem - 6rem)';
    }
    return 'calc(100vh - 3rem - 3rem - 2rem)';
  }

  function onChordClick({ measure, index }) {
    console.log('SketchView:onChordClick', measure, index);
  }

  return (
    <div className='sketch'>
      <Piano notes={currentInfo.notes} isVisible={showPiano} />
      <div className='columns'>
        <div className='container editor-container'>
          <div className='controls'></div>
          <Editor
            className='editor'
            onChange={onChange}
            theme='vs-dark'
            height={getEditorHeight()}
            width='100%'
            defaultValue={source}
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
        <div className='container score-container'>
          <div className='controls'>
            <IconButton onClick={toggle} icon={isPlaying ? 'pause' : 'play'}>
              {t('controls.playToggle')}
            </IconButton>
            <IconButton onClick={stop} icon='stop'>
              {t('controls.stop')}
            </IconButton>
            <IconButton
              toggable
              toggled={loop}
              onClick={togglePartLoop}
              icon='loop'
            >
              {t('controls.loopToggle')}
            </IconButton>
            <IconButton
              toggable
              toggled={metronomeOn}
              onClick={toggleMetronome}
              icon='metronome'
            >
              {t('controls.metronomeToggle')}
            </IconButton>
            <label>
              {t('controls.bpm')}
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
              {t('controls.pianoToggle')}
            </IconButton>
          </div>
          <MusicScore
            chords={chords}
            onChordClick={onChordClick}
            {...meta}
            {...currentInfo}
          />
        </div>
      </div>
    </div>
  );
}
