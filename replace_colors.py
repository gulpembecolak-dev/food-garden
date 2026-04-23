import os
import re

files = [
  'src/pages/Home.css',
  'src/pages/LogMeal.css',
  'src/pages/Insights.css'
]

replacements = [
  (re.compile(r'#121212|#0F172A', re.IGNORECASE), 'var(--bg-color)'),
  (re.compile(r'#1E1E24|#1E293B', re.IGNORECASE), 'var(--surface-color)'),
  (re.compile(r'#2D2D30|#3F3F46|#2D2D35|#17171A', re.IGNORECASE), 'var(--surface-highlight)')
]

for file in files:
    try:
        with open(file, 'r') as f:
            content = f.read()
        for regex, replacement in replacements:
            content = regex.sub(replacement, content)
            
        # Clean up gradients
        content = content.replace("linear-gradient(180deg, var(--surface-highlight) 0%, var(--surface-highlight) 100%)", "var(--surface-color)")
        
        with open(file, 'w') as f:
            f.write(content)
        print("Updated", file)
    except Exception as e:
        print("Failed", file, str(e))
