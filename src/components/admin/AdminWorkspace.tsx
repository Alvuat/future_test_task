import { useEffect, useMemo, useState } from 'react';
import type { ApplicationForm } from '../../types';
import { Icon } from '../Icon';
import { AdminSidebar } from './AdminSidebar';
import { FormEditor } from './FormEditor';
import { FormsDashboard } from './FormsDashboard';
import { ResponsesView } from './ResponsesView';
import './admin.css';

type AdminWorkspaceProps = {
  forms: ApplicationForm[];
  loading: boolean;
  error: string;
  createForm: () => Promise<ApplicationForm>;
  saveForm: (form: ApplicationForm) => Promise<ApplicationForm>;
  togglePublish: (form: ApplicationForm) => Promise<ApplicationForm>;
  deleteForm: (formId: string) => Promise<void>;
};

export function AdminWorkspace({ forms, loading, error, createForm, saveForm, togglePublish, deleteForm }: AdminWorkspaceProps) {
  const [page, setPage] = useState<'forms' | 'responses'>('forms');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editing, setEditing] = useState<ApplicationForm | null>(null);
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');
  const activeForm = forms.find(form => form.id === activeId) ?? forms[0];
  const totalAnswers = forms.reduce((sum, form) => sum + form.responses.length, 0);
  const filteredForms = useMemo(
    () => forms.filter(form => form.title.toLowerCase().includes(search.toLowerCase())),
    [forms, search],
  );

  useEffect(() => {
    if (error) setToast(error);
  }, [error]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function handleNavigate(nextPage: 'forms' | 'responses') {
    setPage(nextPage);
    setActiveId(null);
  }
  function handleViewResponses(form: ApplicationForm) {
    setPage('responses');
    setActiveId(form.id);
  }

  async function handleCreate() {
    try {
      setEditing(await createForm());
    } catch {
      setToast('Не удалось создать форму');
    }
  }
  async function handleSave(form: ApplicationForm) {
    try {
      await saveForm(form);
      setEditing(null);
      setToast('Изменения сохранены');
    } catch {
      setToast('Не удалось сохранить форму');
      throw new Error('Не удалось сохранить форму');
    }
  }
  async function handlePublish(form: ApplicationForm) {
    try {
      const updated = await togglePublish(form);
      setEditing(updated);
      setToast(updated.published ? 'Форма опубликована' : 'Публикация снята');
    } catch {
      setToast('Не удалось опубликовать форму');
      throw new Error('Не удалось опубликовать форму');
    }
  }
  async function handleDelete(form: ApplicationForm) {
    const confirmed = window.confirm(
      `Удалить форму «${form.title}» и все её отклики? Это действие нельзя отменить.`,
    );
    if (!confirmed) return;

    try {
      await deleteForm(form.id);
      if (activeId === form.id) {
        setActiveId(null);
        setPage('forms');
      }
      if (editing?.id === form.id) setEditing(null);
      setToast('Форма и её отклики удалены');
    } catch {
      setToast('Не удалось удалить форму');
    }
  }

  return (
    <div className='app-shell'>
      <AdminSidebar page={page} activeId={activeId} formCount={forms.length} totalAnswers={totalAnswers} onNavigate={handleNavigate} onCreate={() => void handleCreate()} />
      <main className='main-area'>
        <header className='topbar'>
          <div className='breadcrumbs'>
            <span>Studio North</span>
            <b>/</b>
            <strong>
              {page === 'responses'
                ? 'Отклики'
                : activeId
                  ? 'Форма'
                  : 'Мои формы'}
            </strong>
          </div>
          <div className='topbar-actions'>
            <span className='sync-indicator'>
              <i />
              Все изменения сохранены
            </span>
            <button className='avatar-small' aria-label='Профиль'>
              М
            </button>
          </div>
        </header>
        {loading ? (
          <div className='loading-area'>
            <span className='loader' />
          </div>
        ) : page === 'responses' ? (
          <ResponsesView
            forms={forms}
            onPick={form => {
              setPage('responses');
              setActiveId(form?.id ?? null);
            }}
            activeId={activeId}
          />
        ) : activeId && activeForm ? (
          <ResponsesView
            forms={[activeForm]}
            onPick={form => setActiveId(form?.id ?? null)}
            activeId={activeId}
          />
        ) : (
          <>
            <FormsDashboard forms={forms} filteredForms={filteredForms} totalAnswers={totalAnswers} search={search} onSearchChange={setSearch} onCreate={() => void handleCreate()} onViewResponses={handleViewResponses} onEditForm={setEditing} onDeleteForm={form => void handleDelete(form)} />
          </>
        )}
      </main>
      {editing && (
        <FormEditor
          form={editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
          onPublish={handlePublish}
          toast={setToast}
        />
      )}
      {toast && (
        <div className='toast'>
          <span>
            <Icon name='check' size={16} />
          </span>
          {toast}
        </div>
      )}
    </div>
  );
}
