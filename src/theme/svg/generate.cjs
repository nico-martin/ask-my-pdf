const fs = require('fs');
const path = require('path');

const svgFolderPath = './icons';
const outputFilePath = './icons.ts';
const reservedKeywords = ['delete'];

const toCamelCase = (str) =>
    str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());

const toSnakeCase = (str) =>
    str
        .split('-')
        .map((str) => str.toUpperCase())
        .join('_');

fs.readdir(svgFolderPath, (err, files) => {
  if (err) {
    console.error('Error reading SVG folder:', err);
    return;
  }

  const importStatements = [];
  const icons = [];
  const iconEnum = [];

  files.forEach((file) => {
    if (file.endsWith('.svg')) {
      const iconFile = path.basename(file, '.svg');
      let iconName = toCamelCase(iconFile);
      if (reservedKeywords.includes(iconName)) {
        iconName = iconName + 'Icon';
      }
      const iconSnakeCase = toSnakeCase(iconFile);
      importStatements.push(
          `import ${iconName} from '${svgFolderPath}/${file}?react';`
      );
      iconEnum.push(`${iconSnakeCase} = '${iconFile}',`);
      icons.push(`'${iconFile}': ${iconName},`);
    }
  });

  const contents = [
    '/* This file was generated automatically with the ./generate.js script */',
    importStatements.join('\n'),
    `export enum IconName {\n${iconEnum.map((e) => `  ${e}`).join('\n')}\n}`,
    `const icons: Record<string, any> = {\n${icons
        .map((e) => `  ${e}`)
        .join('\n')}\n};`,
    'export default icons;',
  ];

  fs.writeFile(outputFilePath, contents.join('\n\n'), (writeErr) => {
    if (writeErr) {
      console.error('Error writing icons.ts:', writeErr);
      return;
    }
    console.log('icons.ts file generated successfully!');
  });
});
