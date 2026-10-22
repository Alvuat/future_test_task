import { useState } from 'react';
import type { ApplicationForm, Field } from '../../types';
import { getPublicFormUrl } from '../../utils/forms';
import { Icon } from '../Icon';
import './editor.css';

export function FormEditor({
  form: original,
  onClose,
  onSave,
  onPublish,
  toast,
}: {
  form: ApplicationForm;
  onClose: () => void;
  onSave: (form: ApplicationForm) => Promise<void>;
  onPublish: (form: ApplicationForm) => Promise<void>;
  toast: (message: string) => void;
}) {
  const [form, setForm] = useState(original);
  const [saving, setSaving] = useState(false);
  const update = (key: keyof ApplicationForm, value: unknown) =>
    setForm(current => ({ ...current, [key]: value }));
  const updateField = (id: string, key: keyof Field, value: unknown) =>
    update(
      'fields',
      form.fields.map(field =>
        field.id === id ? { ...field, [key]: value } : field,
      ),
    );
  const addField = () =>
    update('fields', [
      ...form.fields,
      {
        id: crypto.randomUUID().slice(0, 8),
        label: 'Новый вопрос',
        type: 'text',
        required: false,
        placeholder: '',
      },
    ]);
  const save = async () => {
    setSaving(true);
    try {
      await onSave(form);
    } catch {
      toast('Не удалось сохранить форму');
    } finally {
      setSaving(false);
    }
  };
  const publish = async () => {
    try {
      await onSave(form);
      await onPublish(form);
    } catch {
      toast('Не удалось опубликовать форму');
    }
  };
  return (
    <div
      className='editor-backdrop'
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside className='editor-panel'>
        <header className='editor-header'>
          <button className='icon-button editor-back' onClick={onClose}>
            <Icon name='back' />
          </button>
          <div>
            <span className='eyebrow'>КОНСТРУКТОР ФОРМ</span>
            <strong>{form.title || 'Без названия'}</strong>
          </div>
          <button
            className='icon-button'
            onClick={onClose}
            aria-label='Закрыть'
          >
            ×
          </button>
        </header>
        <div className='editor-scroll'>
          <div className='editor-intro'>
            <span className='editor-illustration'>
              <Icon name='sparkle' size={27} />
            </span>
            <span className='eyebrow'>НАСТРОЙТЕ СВОЮ ФОРМУ</span>
            <h2>
              Хорошие вопросы —<br />
              хорошие знакомства.
            </h2>
            <p>Соберите всё нужное, чтобы найти подходящих кандидатов.</p>
          </div>
          <label className='editor-label'>
            НАЗВАНИЕ ФОРМЫ
            <input
              value={form.title}
              onChange={event => update('title', event.target.value)}
              placeholder='Например, отклик на стажировку'
            />
          </label>
          <label className='editor-label'>
            КОРОТКОЕ ОПИСАНИЕ
            <textarea
              rows={3}
              value={form.description}
              onChange={event => update('description', event.target.value)}
              placeholder='Что нужно знать перед заполнением?'
            />
          </label>
          <div className='editor-fields-heading'>
            <div>
              <span className='eyebrow'>ВОПРОСЫ</span>
              <strong>{form.fields.length} поля</strong>
            </div>
            <button className='add-field-button' onClick={addField}>
              <Icon name='plus' size={16} /> Добавить поле
            </button>
          </div>
          {form.fields.map((field, index) => (
            <div className='field-editor' key={field.id}>
              <div className='field-editor-top'>
                <span className='field-index'>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <input
                  aria-label='Текст вопроса'
                  value={field.label}
                  onChange={event =>
                    updateField(field.id, 'label', event.target.value)
                  }
                />
                <button
                  className='icon-button delete-field'
                  title='Удалить вопрос'
                  onClick={() =>
                    update(
                      'fields',
                      form.fields.filter(item => item.id !== field.id),
                    )
                  }
                >
                  <Icon name='trash' size={17} />
                </button>
              </div>
              <div className='field-editor-options'>
                <select
                  value={field.type}
                  onChange={event =>
                    updateField(field.id, 'type', event.target.value)
                  }
                >
                  <option value='text'>Короткий ответ</option>
                  <option value='email'>Электронная почта</option>
                  <option value='url'>Ссылка</option>
                  <option value='textarea'>Развёрнутый ответ</option>
                </select>
                <label>
                  <input
                    type='checkbox'
                    checked={field.required}
                    onChange={event =>
                      updateField(field.id, 'required', event.target.checked)
                    }
                  />{' '}
                  Обязательный
                </label>
              </div>
              <input
                className='placeholder-input'
                value={field.placeholder || ''}
                onChange={event =>
                  updateField(field.id, 'placeholder', event.target.value)
                }
                placeholder='Подсказка для ответа (необязательно)'
              />
            </div>
          ))}
          {!form.fields.length && (
            <button className='first-field' onClick={addField}>
              <span>＋</span>
              <strong>Добавьте первый вопрос</strong>
              <small>Имя, контакт, портфолио или любой свой вопрос</small>
            </button>
          )}
          {form.published && (
            <div className='share-panel'>
              <div>
                <span className='status-dot' />
                <strong>Форма опубликована</strong>
              </div>
              <p>Любой, у кого есть ссылка, сможет оставить отклик.</p>
              <div className='share-link'>
                <a
                  className='share-url'
                  href={getPublicFormUrl(form.id)}
                  target='_blank'
                  rel='noreferrer'
                  title='Открыть публичную форму'
                >
                  {getPublicFormUrl(form.id).replace(/^https?:\/\//, '')}
                </a>
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(getPublicFormUrl(form.id));
                      toast('Ссылка скопирована');
                    } catch {
                      toast('Не удалось скопировать ссылку');
                    }
                  }}
                >
                  <Icon name='copy' size={15} /> Копировать
                </button>
              </div>
            </div>
          )}
        </div>
        <footer className='editor-footer'>
          <button
            className='button button-secondary'
            onClick={() => void save()}
            disabled={saving}
          >
            Сохранить
          </button>
          <button
            className='button button-primary'
            onClick={() => void publish()}
          >
            {form.published ? 'Сохранить и опубликовать' : 'Опубликовать форму'}{' '}
            <Icon name='arrow' size={15} />
          </button>
        </footer>
      </aside>
    </div>
  );
}

