import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const filePaths = new Set();
walkDir('client/src', file => {
  filePaths.add(file.replace(/\\/g, '/'));
});

// Create a map of lowercase path to true actual path
const lowerCasePathsMap = new Map();
filePaths.forEach(f => {
  lowerCasePathsMap.set(f.toLowerCase(), f);
});

let errors = 0;
walkDir('client/src', file => {
  if (file.endsWith('.ts') || file.endsWith('.tsx')) {
    const content = fs.readFileSync(file, 'utf8');
    const imports = [...content.matchAll(/from\s+['"]([^'"]+)['"]/g)];
    
    imports.forEach(match => {
      const importPath = match[1];
      if (importPath.startsWith('.')) { // relative import
        // Resolve absolute
        const dir = path.dirname(file.replace(/\\/g, '/'));
        let resolved = path.posix.join(dir, importPath);
        
        // try finding the actual file
        const possibleExtensions = ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx'];
        let found = false;
        let matchedActualPath = null;
        for (let ext of possibleExtensions) {
          const checkPath = resolved + ext;
          if (filePaths.has(checkPath)) {
            found = true;
            break;
          } else if (lowerCasePathsMap.has(checkPath.toLowerCase())) {
             found = true;
             matchedActualPath = lowerCasePathsMap.get(checkPath.toLowerCase());
             break;
          }
        }
        
        if (matchedActualPath && !filePaths.has(matchedActualPath)) {
            // this branch is technically if case sensitivity mismatch
        }
        // Let's just do a simpler check
        let exactMatch = false;
        let caseMismatch = null;
        for (let ext of possibleExtensions) {
             const checkPath = resolved + ext;
             if (filePaths.has(checkPath)) exactMatch = true;
             if (!exactMatch && lowerCasePathsMap.has(checkPath.toLowerCase())) {
                 caseMismatch = lowerCasePathsMap.get(checkPath.toLowerCase());
             }
        }
        
        if (!exactMatch && caseMismatch) {
            console.error(`Case mismatch in ${file}: imported '${importPath}' but actual is '${caseMismatch}'`);
            errors++;
        }
      }
    });
  }
});

if (errors === 0) console.log("No case mismatches found!");
