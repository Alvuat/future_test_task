import { useCallback, useEffect, useState } from 'react';
import type { ApplicationForm } from '../types';
import { apiRequest } from '../utils/api';
import { createDraftForm } from '../utils/forms';

export function useForms() {
  const [forms, setForms] = useState<ApplicationForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    try {
      setForms(await apiRequest<ApplicationForm[]>('/api/forms'));
      setError('');
    } catch {
      setError('Сервер не отвечает. Попробуйте обновить страницу.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const saveForm = useCallback(async (form: ApplicationForm) => {
    const saved = await apiRequest<ApplicationForm>(`/api/forms/${form.id}`, {
      method: 'PUT',
      body: JSON.stringify(form),
    });
    setForms(current => current.map(item => item.id === saved.id ? saved : item));
    return saved;
  }, []);

  const createForm = useCallback(async () => {
    const draft = createDraftForm();
    const created = await apiRequest<ApplicationForm>('/api/forms', {
      method: 'POST',
      body: JSON.stringify({ ...draft, responses: [] }),
    });
    setForms(current => [created, ...current]);
    return created;
  }, []);

  const togglePublish = useCallback(async (form: ApplicationForm) => {
    const updated = await apiRequest<ApplicationForm>(`/api/forms/${form.id}/publish`, {
      method: 'PATCH',
      body: JSON.stringify({ published: !form.published }),
    });
    setForms(current => current.map(item => item.id === form.id ? updated : item));
    return updated;
  }, []);

  const deleteForm = useCallback(async (formId: string) => {
    await apiRequest<{ id: string }>(`/api/forms/${formId}`, {
      method: 'DELETE',
    });
    setForms(current => current.filter(form => form.id !== formId));
  }, []);

  const submitResponse = useCallback(async (formId: string, values: Record<string, string>) => {
    await apiRequest(`/api/forms/${formId}/responses`, {
      method: 'POST',
      body: JSON.stringify({ values }),
    });
  }, []);

  return { forms, loading, error, saveForm, createForm, togglePublish, deleteForm, submitResponse };
}
