const fs = require('fs');
const path = require('path');

function fixImports(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file.endsWith('.jsx')) {
            const fullPath = path.join(dir, file);
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            content = content.replace(/'(?:\.\.\/)+components\//g, "'../../components/");
            content = content.replace(/"(?:\.\.\/)+components\//g, '"../../components/');
            content = content.replace(/'(?:\.\.\/)+context\//g, "'../../context/");
            content = content.replace(/"(?:\.\.\/)+context\//g, '"../../context/');
            content = content.replace(/'(?:\.\.\/)+assets\//g, "'../../assets/");
            content = content.replace(/"(?:\.\.\/)+assets\//g, '"../../assets/');

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Fixed:', fullPath);
            }
        }
    }
}

fixImports(path.join(__dirname, 'src/pages/personal'));
fixImports(path.join(__dirname, 'src/pages/business'));
