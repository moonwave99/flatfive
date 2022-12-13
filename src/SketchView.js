import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useHotkeys } from 'react-hotkeys-hook';
import Editor from '@monaco-editor/react';
import MusicScore from './MusicScore';
import IconButton from './IconButton';
import Piano from './Piano';
import useTone from './hooks/useTone';
import useTitle from './hooks/useTitle';
import { DEFAULT_BPM } from './lib/parser';
import { encodeSketch, decodeSketch } from './lib/utils';
import { useStore } from './store/store';
import { INITAL_SKETCH_SOURCE } from './store/slices/sketchSlice';

import '../node_modules/@moonwave99/paino/src/styles/paino.css';
import './styles.css';

export default function SketchView() {
  const editorRef = useRef(null);
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [source, setSource] = useState(INITAL_SKETCH_SOURCE);
  const [bpm, setBpm] = useState(DEFAULT_BPM);

  const {
    currentSketch,
    updateCurrentSlice,
    newSketch,
    showPiano,
    togglePiano,
  } = useStore();

  const { chords, meta } = currentSketch;

  useEffect(() => {
    setBpm(meta.bpm);
  }, [meta.bpm]);

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
      newSketch();
      return;
    }
    try {
      const newSource = decodeSketch(searchParams.get('p'));
      setSource(newSource);
      onChange(newSource);
    } catch (error) {
      console.log('SketchView: Error decoding data', error);
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

  useTitle(meta.title || 'New sketch');
  useHotkeys(
    'meta+d',
    (event) => {
      event.preventDefault();
      togglePiano();
    },
    { scopes: ['sketch'] }
  );
  useHotkeys('space', toggle, { scopes: ['sketch'] });

  function onChange(value) {
    if (value === INITAL_SKETCH_SOURCE) {
      return;
    }
    try {
      updateCurrentSlice(value);
      const p = encodeSketch(value);
      if (!p) {
        return;
      }
      setSearchParams({ p });
    } catch (error) {
      console.log('SketchView: Error encoding data', error);
    }
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
              onClick={() => togglePiano()}
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
