/**
 * HTML Template Generator for SSR
 * Generates the complete HTML structure with server-rendered content
 */

interface TemplateOptions {
  html: string; // Server-rendered React HTML
  scriptPath?: string; // Path to client bundle
}

export function generateHTML(options: TemplateOptions): string {
  const { html, scriptPath = '/static/bundle.js' } = options;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="React 18 SSR Project - Server-Side Rendering">
  <title>React 18 SSR Project</title>
</head>
<body>
  <div id="root">${html}</div>
  <script src="${scriptPath}"></script>
</body>
</html>
  `.trim();
}
