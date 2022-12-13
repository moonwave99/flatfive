import { Routes, Route } from 'react-router-dom';
import Header from './Header';
import HomeView from './HomeView';
import SketchView from './SketchView';
import '../node_modules/@moonwave99/paino/src/styles/paino.css';
import './styles.css';

export default function App() {
  return (
    <div className='app'>
      <Header />
      <main>
        <Routes>
          <Route path='/' element={<HomeView />} />
          <Route path='/sketch' element={<SketchView />} />
        </Routes>
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
