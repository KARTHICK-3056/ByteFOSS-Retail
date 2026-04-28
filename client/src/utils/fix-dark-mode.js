const fs = require('fs');
const path = require('path');

function processDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Standard background replacements
            content = content.replace(/\bbg-white\b(?!.*dark:bg-)/g, 'bg-white dark:bg-[#18181b]');
            content = content.replace(/\bbg-gray-50\b(?!.*dark:bg-)/g, 'bg-gray-50 dark:bg-[#27272a]');
            content = content.replace(/\bbg-gray-100\b(?!.*dark:bg-)/g, 'bg-gray-100 dark:bg-[#27272a]');
            content = content.replace(/\bbg-gray-200\b(?!.*dark:bg-)/g, 'bg-gray-200 dark:bg-[#3f3f46]');
            content = content.replace(/\bbg-amber-50\b(?!.*dark:bg-)/g, 'bg-amber-50 dark:bg-amber-900/20');
            
            // Hover replacements
            content = content.replace(/\bhover:bg-gray-50\b(?!.*dark:hover:bg-)/g, 'hover:bg-gray-50 dark:hover:bg-[#1f1f23]');
            content = content.replace(/\bhover:bg-gray-100\b(?!.*dark:hover:bg-)/g, 'hover:bg-gray-100 dark:hover:bg-[#1f1f23]');
            content = content.replace(/\bhover:bg-amber-50\b(?!.*dark:hover:bg-)/g, 'hover:bg-amber-50 dark:hover:bg-amber-900/30');
            
            // Manual replacements for hex backgrounds
            content = content.replace(/bg-\[#f9fafb\](?!.*dark:bg-)/g, 'bg-[#f9fafb] dark:bg-[#1f1f23]');
            content = content.replace(/bg-\[#fafafa\](?!.*dark:bg-)/g, 'bg-[#fafafa] dark:bg-[#0a0a0a]');
            
            // Standard text replacements
            content = content.replace(/\btext-gray-900\b(?!.*dark:text-)/g, 'text-gray-900 dark:text-white');
            content = content.replace(/\btext-gray-800\b(?!.*dark:text-)/g, 'text-gray-800 dark:text-gray-100');
            content = content.replace(/\btext-gray-700\b(?!.*dark:text-)/g, 'text-gray-700 dark:text-gray-300');
            content = content.replace(/\btext-gray-600\b(?!.*dark:text-)/g, 'text-gray-600 dark:text-gray-400');
            content = content.replace(/\btext-gray-500\b(?!.*dark:text-)/g, 'text-gray-500 dark:text-gray-400');
            
            // Border replacements
            content = content.replace(/\bborder-gray-100\b(?!.*dark:border-)/g, 'border-gray-100 dark:border-[#262626]');
            content = content.replace(/\bborder-gray-200\b(?!.*dark:border-)/g, 'border-gray-200 dark:border-[#262626]');
            content = content.replace(/\bborder-gray-300\b(?!.*dark:border-)/g, 'border-gray-300 dark:border-[#3f3f46]');
            
            fs.writeFileSync(fullPath, content, 'utf8');
        }
    });
}
processDir('./src');
console.log('Dark mode classes updated including AMBER and HOVER variants!');
