import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const dataDir = join(root, 'data');
const dataFile = join(dataDir, 'store.json');
const distDir = join(root, 'dist');
mkdirSync(dataDir, { recursive: true });

const starter = [
  {
    id: 'internship',
    title: 'Отклик на стажировку',
    description:
      'Мы ищем любопытных и увлечённых студентов. Расскажите о себе — это займёт всего пару минут.',
    fields: [
      {
        id: 'name',
        label: 'Как к вам обращаться?',
        type: 'text',
        required: true,
        placeholder: 'Имя и фамилия',
      },
      {
        id: 'email',
        label: 'Электронная почта',
        type: 'email',
        required: true,
        placeholder: 'you@example.com',
      },
      {
        id: 'portfolio',
        label: 'Ссылка на портфолио или резюме',
        type: 'url',
        required: false,
        placeholder: 'https://',
      },
      {
        id: 'about',
        label: 'Расскажите немного о себе',
        type: 'textarea',
        required: true,
        placeholder: 'Опыт, интересы, что хотелось бы попробовать…',
      },
    ],
    published: true,
    createdAt: new Date().toISOString(),
    responses: [],
  },
];

if (!existsSync(dataFile))
  writeFileSync(dataFile, JSON.stringify({ forms: starter }, null, 2));
function readStore() {
  try {
    return JSON.parse(readFileSync(dataFile, 'utf8'));
  } catch {
    return { forms: [] };
  }
}
function writeStore(store) {
  writeFileSync(dataFile, JSON.stringify(store, null, 2));
}
function respond(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(type.startsWith('application/json') ? JSON.stringify(body) : body);
}
async function body(req) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 1_000_000) throw new Error('Request too large');
  }
  return raw ? JSON.parse(raw) : {};
}
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
};

const server = createServer(async (req, res) => {
  const url = new URL(
    req.url || '/',
    `http://${req.headers.host || 'localhost'}`,
  );
  const parts = url.pathname.split('/').filter(Boolean);
  try {
    if (parts[0] === 'api') {
      const store = readStore();
      if (req.method === 'GET' && parts.length === 2 && parts[1] === 'forms')
        return respond(res, 200, store.forms);
      if (req.method === 'POST' && parts.length === 2 && parts[1] === 'forms') {
        const form = await body(req);
        if (!form.id || !form.title || !Array.isArray(form.fields))
          return respond(res, 400, { error: 'Invalid form' });
        store.forms.unshift({
          ...form,
          responses: [],
          createdAt: form.createdAt || new Date().toISOString(),
        });
        writeStore(store);
        return respond(res, 201, store.forms[0]);
      }
      if (parts[1] === 'forms' && parts[2]) {
        const form = store.forms.find(item => item.id === parts[2]);
        if (!form) return respond(res, 404, { error: 'Form not found' });
        if (req.method === 'DELETE' && parts.length === 3) {
          store.forms = store.forms.filter(item => item.id !== form.id);
          writeStore(store);
          return respond(res, 200, { id: form.id });
        }
        if (req.method === 'PUT' && parts.length === 3) {
          const update = await body(req);
          Object.assign(form, {
            title: String(update.title || '').slice(0, 140),
            description: String(update.description || '').slice(0, 1000),
            fields: Array.isArray(update.fields)
              ? update.fields.slice(0, 50)
              : form.fields,
          });
          writeStore(store);
          return respond(res, 200, form);
        }
        if (req.method === 'PATCH' && parts[3] === 'publish') {
          const update = await body(req);
          form.published = Boolean(update.published);
          writeStore(store);
          return respond(res, 200, form);
        }
        if (req.method === 'POST' && parts[3] === 'responses') {
          if (!form.published)
            return respond(res, 403, { error: 'Form is not published' });
          const { values = {} } = await body(req);
          if (!values || typeof values !== 'object' || Array.isArray(values))
            return respond(res, 400, { error: 'Invalid answers' });
          for (const field of form.fields) {
            if (field.required && !String(values[field.id] || '').trim())
              return respond(res, 400, { error: `${field.label} is required` });
            if (String(values[field.id] || '').length > 5000)
              return respond(res, 400, { error: 'Answer is too long' });
          }
          const response = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            values: Object.fromEntries(
              form.fields.map(field => [
                field.id,
                String(values[field.id] || '').slice(0, 5000),
              ]),
            ),
          };
          form.responses.unshift(response);
          writeStore(store);
          return respond(res, 201, response);
        }
      }
      return respond(res, 404, { error: 'Route not found' });
    }
    const isHomePage = url.pathname === '/';
    const isAdminPage = url.pathname === '/admin' || url.pathname === '/admin/';
    const isPublicPage = /^\/f\/[a-z\d-]+(?:\/sent)?\/?$/i.test(url.pathname);
    if (req.method === 'GET' && (isHomePage || isAdminPage || isPublicPage)) {
      const index = join(distDir, 'index.html');
      if (!existsSync(index))
        return respond(
          res,
          503,
          'Run npm start to build the app.',
          'text/plain; charset=utf-8',
        );
      return respond(res, 200, readFileSync(index), mime['.html']);
    }
    const filePath = normalize(
      join(distDir, url.pathname === '/' ? 'index.html' : url.pathname),
    );
    if (!filePath.startsWith(distDir))
      return respond(res, 403, 'Forbidden', 'text/plain; charset=utf-8');
    if (existsSync(filePath) && !url.pathname.endsWith('/'))
      return respond(
        res,
        200,
        readFileSync(filePath),
        mime[extname(filePath)] || 'application/octet-stream',
      );
    const index = join(distDir, 'index.html');
    if (!existsSync(index))
      return respond(
        res,
        503,
        'Run npm start to build the app.',
        'text/plain; charset=utf-8',
      );
    respond(res, 200, readFileSync(index), mime['.html']);
  } catch (error) {
    respond(res, error instanceof SyntaxError ? 400 : 500, {
      error: error.message || 'Internal server error',
    });
  }
});

const port = Number(process.env.PORT || 3000);
server.listen(port, '127.0.0.1', () =>
  console.log(`Forme is ready at http://localhost:${port}`),
);
