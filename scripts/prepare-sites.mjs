import { mkdir, readFile, writeFile } from 'node:fs/promises';

const html = await readFile('dist/index.html', 'utf8');
const hosting = await readFile('.openai/hosting.json', 'utf8');

await mkdir('dist/server', { recursive: true });
await mkdir('dist/.openai', { recursive: true });

await writeFile('dist/.openai/hosting.json', hosting);
await writeFile(
  'dist/server/index.js',
  `const html = ${JSON.stringify(html)};\n\nexport default {\n  async fetch(request) {\n    const { pathname } = new URL(request.url);\n\n    if (pathname !== '/' && pathname !== '/index.html') {\n      return new Response('Not found', { status: 404 });\n    }\n\n    return new Response(html, {\n      headers: {\n        'content-type': 'text/html; charset=utf-8',\n        'cache-control': 'public, max-age=300'\n      }\n    });\n  }\n};\n`
);
