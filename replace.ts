import fs from 'fs';
import path from 'path';

function walkDir(dir: string, callback: (filePath: string) => void) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const replacements: [RegExp, string][] = [
  [/Khbz Dar/g, 'Darkom'],
  [/khbzdar/g, 'darkom'],
  [/Home(?![a-zA-Z0-9])/g, 'Accueil'],
  [/Shop/g, 'Boutique'],
  [/Delivery/g, 'Livraison'],
  [/SHOP/g, 'BOUTIQUE'],
  [/Contact/g, 'Contact']
];

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    for (const [regex, replacement] of replacements) {
      content = content.replace(regex, replacement);
    }
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${filePath}`);
    }
  }
});
