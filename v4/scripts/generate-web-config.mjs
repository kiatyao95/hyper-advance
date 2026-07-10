import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const outPath = path.join(distDir, 'web.config');

const rewriteTarget = 'index.html';

const webConfig = `<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Hyper Advance static files" stopProcessing="true">
          <match url=".*\\.(js|css|json|png|jpe?g|gif|svg|webp|ico|woff2?|ttf|eot|pdf|xml|txt|map|html|htm)$" ignoreCase="true" />
          <action type="None" />
        </rule>
        <rule name="Hyper Advance asset folders" stopProcessing="true">
          <match url="^(assets|data)/.*" ignoreCase="true" />
          <action type="None" />
        </rule>
        <rule name="Hyper Advance prerendered routes" stopProcessing="true">
          <match url="^(.*[^/])$" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{DOCUMENT_ROOT}\\{R:1}\\index.html" matchType="IsFile" />
          </conditions>
          <action type="Rewrite" url="{R:1}/index.html" />
        </rule>
        <rule name="Hyper Advance v4 SPA" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="${rewriteTarget}" />
        </rule>
      </rules>
    </rewrite>
    <defaultDocument>
      <files>
        <clear />
        <add value="index.html" />
      </files>
    </defaultDocument>
    <staticContent>
      <remove fileExtension=".webp" />
      <mimeMap fileExtension=".webp" mimeType="image/webp" />
      <remove fileExtension=".woff2" />
      <mimeMap fileExtension=".woff2" mimeType="font/woff2" />
    </staticContent>
    <httpErrors existingResponse="PassThrough" />
  </system.webServer>
</configuration>
`;

if (!fs.existsSync(path.join(distDir, 'index.html'))) {
  console.error('Missing dist/index.html — run vite build first.');
  process.exit(1);
}

fs.writeFileSync(outPath, webConfig);
console.log(`Wrote ${outPath}`);
