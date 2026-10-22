import { useState } from 'react';
import type { Answer, ApplicationForm } from '../../types';
import { formatShortDate } from '../../utils/forms';
import { Icon } from '../Icon';
import './responses.css';

export function ResponsesView({
  forms,
  onPick,
  activeId,
}: {
  forms: ApplicationForm[];
  onPick: (form: ApplicationForm | null) => void;
  activeId: string | null;
}) {
  const all = forms
    .flatMap(form => form.responses.map(response => ({ form, response })))
    .sort((a, b) => b.response.createdAt.localeCompare(a.response.createdAt));
  const [selected, setSelected] = useState<{
    form: ApplicationForm;
    response: Answer;
  } | null>(null);
  const shownForm = forms.find(form => form.id === activeId);
  return (
    <section className='responses-page'>
      <div className='responses-title'>
        <div>
          <span className='eyebrow'>ВХОДЯЩИЕ</span>
          <h1>
            Отклики <span className='soft-count'>{all.length}</span>
          </h1>
          <p>Ответы кандидатов в одном месте.</p>
        </div>
        <div className='response-filter'>
          <span>Форма</span>
          <select
            value={shownForm?.id ?? 'all'}
            onChange={event => {
              const form = forms.find(item => item.id === event.target.value);
              onPick(form ?? null);
            }}
          >
            <option value='all'>Все формы</option>
            {forms.map(form => (
              <option value={form.id} key={form.id}>
                {form.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className='response-toolbar'>
        <strong>{shownForm ? shownForm.title : 'Все отклики'}</strong>
        <span>
          {shownForm ? shownForm.responses.length : all.length} ответов
        </span>
      </div>
      {all.length ? (
        <div className='responses-table'>
          <div className='table-head'>
            <span>КАНДИДАТ</span>
            <span>ФОРМА</span>
            <span>ДАТА</span>
            <span />
          </div>
          {all
            .filter(item => !shownForm || item.form.id === shownForm.id)
            .map(({ form, response }) => {
              const first = Object.values(response.values)[0] || 'Без имени';
              const email =
                Object.values(response.values).find(value =>
                  value.includes('@'),
                ) || 'Контакт не указан';
              return (
                <button
                  className='response-row'
                  key={response.id}
                  onClick={() => setSelected({ form, response })}
                >
                  <span className='candidate-cell'>
                    <span className='candidate-avatar'>
                      {first.trim().charAt(0).toUpperCase()}
                    </span>
                    <span>
                      <strong>{first}</strong>
                      <small>{email}</small>
                    </span>
                  </span>
                  <span className='candidate-form'>{form.title}</span>
                  <span className='created-cell'>
                    {formatShortDate(response.createdAt)}
                  </span>
                  <Icon name='arrow' size={16} />
                </button>
              );
            })}
        </div>
      ) : (
        <div className='empty-table response-empty'>
          <div className='empty-icon'>
            <Icon name='people' size={24} />
          </div>
          <strong>Откликов пока нет</strong>
          <p>
            Когда кто-то заполнит опубликованную форму, ответ появится здесь.
          </p>
        </div>
      )}
      {selected && (
        <div
          className='editor-backdrop'
          onMouseDown={event => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <aside className='editor-panel answer-detail'>
            <header className='editor-header'>
              <button className='icon-button' onClick={() => setSelected(null)}>
                <Icon name='back' />
              </button>
              <div>
                <span className='eyebrow'>
                  ОТКЛИК ОТ{' '}
                  {formatShortDate(selected.response.createdAt).toUpperCase()}
                </span>
                <strong>
                  {Object.values(selected.response.values)[0] ||
                    'Ответ кандидата'}
                </strong>
              </div>
              <button className='icon-button' onClick={() => setSelected(null)}>
                ×
              </button>
            </header>
            <div className='editor-scroll'>
              <span className='eyebrow'>{selected.form.title}</span>
              <h2 className='answer-detail-title'>Ответы кандидата</h2>
              {selected.form.fields.map((field, index) => (
                <div className='detail-answer' key={field.id}>
                  <span>
                    <i>{String(index + 1).padStart(2, '0')}</i>
                    {field.label}
                  </span>
                  <p>{selected.response.values[field.id] || '—'}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

