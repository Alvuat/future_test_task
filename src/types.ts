export type Field = {
  id: string;
  label: string;
  type: 'text' | 'email' | 'textarea' | 'url';
  required: boolean;
  placeholder?: string;
};

export type Answer = {
  id: string;
  createdAt: string;
  values: Record<string, string>;
};

export type ApplicationForm = {
  id: string;
  title: string;
  description: string;
  fields: Field[];
  published: boolean;
  createdAt: string;
  responses: Answer[];
};
