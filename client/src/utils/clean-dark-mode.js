const fs = require('fs');
const path = require('path');

function processDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Clean up duplicated dark mode classes
            // For example, replace 'dark:bg-[#18181b] dark:bg-[#27272a]' with just 'dark:bg-[#18181b]'
            content = content.replace(/dark:bg-\[#18181b\] dark:bg-\[#27272a\]/g, 'dark:bg-[#18181b]');
            content = content.replace(/dark:bg-\[#27272a\] dark:bg-\[#18181b\]/g, 'dark:bg-[#27272a]');
            
            // Fix hover conflicts
            content = content.replace(/hover:bg-gray-50 dark:hover:bg-\[#1f1f23\]/g, 'dark:hover:bg-[#1f1f23]');
            
            fs.writeFileSync(fullPath, content, 'utf8');
        }
    });
}
processDir('./src');
console.log('JSX Cleaned up!');
