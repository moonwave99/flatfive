import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t } = useTranslation();
  return (
    <header className='main-header'>
      <nav>
        <Link to='/'>{t('nav.home')}</Link>
        <Link to='/sketch?new'>{t('nav.new')}</Link>
      </nav>
      <span className='logo'>{t('title')}</span>
    </header>
  );
}
