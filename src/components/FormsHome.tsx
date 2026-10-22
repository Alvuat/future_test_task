import type { ApplicationForm } from '../types';
import { formatShortDate } from '../utils/forms';
import { Icon } from './Icon';
import './FormsHome.css';

type FormsHomeProps = {
  forms: ApplicationForm[];
  loading: boolean;
  error: string;
};

export function FormsHome({ forms, loading, error }: FormsHomeProps) {
  const totalResponses = forms.reduce((total, form) => total + form.responses.length, 0);
  const publishedCount = forms.filter(form => form.published).length;

  return (
    <main className='forms-home'>
      <header className='forms-home-header'>
        <a className='brand' href='/'><span className='brand-mark'><Icon name='sparkle' size={18} /></span>forme</a>
        <a className='button button-primary' href='/admin'>Открыть админку <Icon name='arrow' size={15} /></a>
      </header>

      <section className='forms-home-hero'>
        <span className='eyebrow'>STUDIO NORTH · ФОРМЫ ОТКЛИКА</span>
        <h1>Все ваши формы<br /><span>в одном месте.</span></h1>
        <p>Проверяйте статус публикации и количество полученных откликов.</p>
      </section>

      <section className='forms-home-summary' aria-label='Сводка по формам'>
        <div><span>Всего форм</span><strong>{String(forms.length).padStart(2, '0')}</strong></div>
        <div><span>Опубликовано</span><strong>{String(publishedCount).padStart(2, '0')}</strong></div>
        <div><span>Получено откликов</span><strong>{String(totalResponses).padStart(2, '0')}</strong></div>
      </section>

      <section className='forms-home-list'>
        <div className='forms-home-list-heading'>
          <div><span className='eyebrow'>РАБОЧЕЕ ПРОСТРАНСТВО</span><h2>Список форм</h2></div>
          <span>{forms.length} {forms.length === 1 ? 'форма' : 'форм'}</span>
        </div>
        {loading ? (
          <div className='forms-home-state'><span className='loader' /></div>
        ) : error ? (
          <div className='forms-home-state'><strong>Не удалось загрузить формы</strong><p>{error}</p></div>
        ) : forms.length ? (
          <div className='forms-home-table'>
            <div className='forms-home-table-head'><span>НАЗВАНИЕ</span><span>СТАТУС</span><span>ОТКЛИКИ</span><span>СОЗДАНА</span><span /></div>
            {forms.map(form => (
              <article className='forms-home-row' key={form.id}>
                <div className='forms-home-name'><span className='forms-home-icon'><Icon name='file' size={18} /></span><span><strong>{form.title}</strong><small>{form.description}</small></span></div>
                <div><span className={form.published ? 'status-badge live' : 'status-badge draft'}><i />{form.published ? 'Опубликована' : 'Черновик'}</span></div>
                <span className='forms-home-responses'>{String(form.responses.length).padStart(2, '0')} <small>откликов</small></span>
                <span className='forms-home-date'>{formatShortDate(form.createdAt)}</span>
                <a className='forms-home-open' href='/admin' aria-label={`Открыть админку для формы «${form.title}»`}><Icon name='arrow' size={15} /></a>
              </article>
            ))}
          </div>
        ) : (
          <div className='forms-home-state'><div className='empty-icon'><Icon name='file' size={24} /></div><strong>Форм пока нет</strong><p>Перейдите в админку, чтобы создать первую форму.</p><a className='button button-primary' href='/admin'><Icon name='plus' size={16} /> Создать форму</a></div>
        )}
      </section>
      <footer className='forms-home-footer'>Сделано с <span>✦</span> Forme <a href='/admin'>Перейти к управлению <Icon name='arrow' size={13} /></a></footer>
    </main>
  );
}
