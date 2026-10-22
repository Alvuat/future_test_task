import type { ApplicationForm } from '../types';

export function formatShortDate(value: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export function getPublicFormUrl(id: string): string {
  return `${window.location.origin}/f/${id}`;
}

export function createDraftForm(): Omit<ApplicationForm, 'responses'> {
  return {
    id: crypto.randomUUID().slice(0, 8),
    title: 'Новая форма',
    description: 'Расскажите немного о себе — мы свяжемся с вами.',
    fields: [],
    published: false,
    createdAt: new Date().toISOString(),
  };
}
