const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/Home.css',
  'src/pages/LogMeal.css',
  'src/pages/Insights.css'
];

const replacements = [
  { regex: /#121212|#0F172A/gi, replacement: 'var(--bg-color)' },
  { regex: /#1E1E24|#1E293B/gi, replacement: 'var(--surface-color)' },
  { regex: /#2D2D30|#3F3F46|#2D2D35|#17171A/gi, replacement: 'var(--surface-highlight)' }
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Apply replacements
    replacements.forEach(({ regex, replacement }) => {
      content = content.replace(regex, replacement);
    });

    // Special case for gradient that need variables directly
    content = content.replace(/linear-gradient\(180deg, var\(--surface-highlight\) 0%, var\(--surface-highlight\) 100%\)/g, 'var(--surface-color)');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`Not found: ${file}`);
  }
});
