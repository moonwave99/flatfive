import { useTranslation } from 'react-i18next';
import useTitle from './hooks/useTitle';

export default function HomeView() {
  useTitle('Welcome!');
  const { t } = useTranslation();
  const heroText = t('home.hero.text', { returnObjects: true });
  const captionText = t('home.caption.text', { returnObjects: true });
  return (
    <section className='home'>
      <section className='hero'>
        <div className='hero-content'>
          <h1>{t('title')}</h1>
          {heroText.map((x, i) => (
            <p key={i}>{x}</p>
          ))}
        </div>
        <img src='/screenshot.png' alt='A screenshot of the FlatFive editor' />
      </section>
      <section className='caption'>
        <div className='container'>
          {captionText.map((x, i) => (
            <p key={i}>{x}</p>
          ))}
        </div>
      </section>
    </section>
  );
}
