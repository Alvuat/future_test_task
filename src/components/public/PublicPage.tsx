import { useState } from 'react';
import type { FormEvent } from 'react';
import type { ApplicationForm } from '../../types';
import { Icon } from '../Icon';
import './public.css';

type PublicPageProps = {
  forms: ApplicationForm[];
  loading: boolean;
  formId: string;
  submitResponse: (formId: string, values: Record<string, string>) => Promise<void>;
};

export function PublicPage({ forms, loading, formId, submitResponse }: PublicPageProps) {
  const [submissionError, setSubmissionError] = useState('');
  const form = forms.find(item => item.id === formId);
  const isSent = window.location.pathname.endsWith('/sent');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries()) as Record<string, string>;
    try {
      await submitResponse(form.id, values);
      window.location.href = `/f/${form.id}/sent`;
    } catch {
      setSubmissionError('Не получилось отправить ответы. Попробуйте ещё раз.');
    }
  }

  if (loading) {
    return <div className='loading-screen'><span className='loader' /></div>;
  }

  if (isSent) {
    return (
      <main className='public-wrap'>
        <section className='success-card'>
          <div className='success-mark'><Icon name='check' size={28} /></div>
          <span className='eyebrow'>ГОТОВО</span>
          <h1>Спасибо за отклик!</h1>
          <p>Ваши ответы уже у нас. Если появится подходящая возможность, мы напишем вам на почту.</p>
          <a href='/admin' className='text-link'>Создать форму в Forme <Icon name='arrow' size={15} /></a>
        </section>
        <footer className='public-footer'>Сделано с <span>✦</span> Forme</footer>
      </main>
    );
  }

  if (!form || !form.published) {
    return (
      <main className='public-wrap'>
        <section className='success-card'>
          <div className='success-mark muted-mark'><Icon name='file' size={26} /></div>
          <h1>Форма недоступна</h1>
          <p>Похоже, ссылка устарела или форма пока не опубликована.</p>
          <a href='/admin' className='text-link'>Перейти в Forme <Icon name='arrow' size={15} /></a>
        </section>
      </main>
    );
  }

  return (
    <main className='public-wrap'>
      <header className='public-brand'>
        <a href='/admin' className='brand'><span className='brand-mark'><Icon name='sparkle' size={18} /></span>forme</a>
        <span>ФОРМА ОТКЛИКА</span>
      </header>
      <section className='public-card'>
        <div className='form-cover'>
          <div className='cover-orb orb-one' /><div className='cover-orb orb-two' />
          <span className='cover-tag'>НАЧНИТЕ ЗДЕСЬ</span>
          <span className='cover-number'>01 <i /> {String(form.fields.length).padStart(2, '0')}</span>
        </div>
        <div className='public-card-content'>
          <span className='eyebrow'>{form.fields.length} ВОПРОСА · ~2 МИНУТЫ</span>
          <h1>{form.title}</h1>
          <p className='public-description'>{form.description}</p>
          <form onSubmit={handleSubmit} className='answer-form'>
            {form.fields.map((field, index) => (
              <label className='answer-field' key={field.id}>
                <span><i>{String(index + 1).padStart(2, '0')}</i>{field.label}{field.required && <b> *</b>}</span>
                {field.type === 'textarea'
                  ? <textarea name={field.id} required={field.required} placeholder={field.placeholder || 'Ваш ответ…'} rows={4} />
                  : <input name={field.id} type={field.type} required={field.required} placeholder={field.placeholder || 'Ваш ответ…'} />}
              </label>
            ))}
            {!form.fields.length && <p className='empty-question-note'>Менеджер пока не добавил вопросы в эту форму.</p>}
            {submissionError && <p className='submission-error' role='alert'>{submissionError}</p>}
            <button className='button button-primary submit-button' type='submit' disabled={!form.fields.length}>Отправить отклик <span>↗</span></button>
            <p className='privacy-note'>Нажимая «Отправить», вы соглашаетесь на обработку данных для связи с вами.</p>
          </form>
        </div>
      </section>
      <footer className='public-footer'>Сделано с <span>✦</span> Forme</footer>
    </main>
  );
}
