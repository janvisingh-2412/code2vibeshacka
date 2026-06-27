import re
from pathlib import Path

link_map = {
    'Dashboard': 'index.html',
    'Report Issue': 'report_issue.html',
    'Map View': 'community_map.html',
    'Community': 'community.html',
    'Analytics': 'analytics.html',
    'History': 'history.html',
    'Assistant': 'ai_assistant.html',
    'AI Assistant': 'ai_assistant.html',
}

active_page = {
    'index.html': 'Dashboard',
    'report_issue.html': 'Report Issue',
    'analytics.html': 'Analytics',
    'community_map.html': 'Map View',
    'community.html': 'Community',
    'history.html': 'History',
    'ai_assistant.html': 'Assistant',
}

active_classes = 'text-primary border-b-2 border-primary bg-primary/10 shadow-[0_0_20px_rgba(138,235,255,0.25)]'
active_sidebar_classes = 'text-primary bg-gradient-to-r from-primary/20 to-secondary/20 border-r-4 border-primary shadow-[0_0_20px_rgba(138,235,255,0.25)]'

files = list(active_page.keys())

pattern = re.compile(r'(<a\b[^>]*\bhref=(?P<quote>["\"])#(?P=quote)[^>]*>)(.*?)</a>', re.S)

for filename in files:
    path = Path(filename)
    text = path.read_text(encoding='utf-8')
    changed = [False]

    def replace_anchor(m):
        open_tag = m.group(1)
        content = m.group(2)
        inner_text = re.sub(r'<[^>]+>', '', content).strip()
        normalized = ' '.join(inner_text.split())
        if normalized not in link_map:
            return m.group(0)
        target = link_map[normalized]
        if 'href="#"' in open_tag or "href='#'" in open_tag:
            open_tag = re.sub(r'href=(?P<quote>["\"])#(?P=quote)', lambda m: f'href={m.group(1)}{target}{m.group(1)}', open_tag)
            changed[0] = True
        # Add active classes if this is the current page's active nav item
        if active_page.get(filename) == normalized:
            if 'class=' in open_tag:
                def add_classes(class_match):
                    existing = class_match.group(1)
                    if active_classes not in existing:
                        return f'class="{existing} {active_classes}"'
                    return class_match.group(0)
                open_tag = re.sub(r'class=["\"]([^"\"]*)["\"]', add_classes, open_tag)
            else:
                open_tag = open_tag.replace('>', f' class="{active_classes}">', 1)
            # Also add sidebar-style classes when appropriate
            if 'rounded-xl' in open_tag or 'flex items-center' in open_tag:
                if active_sidebar_classes not in open_tag:
                    open_tag = open_tag.replace('rounded-xl', f'rounded-xl {active_sidebar_classes}', 1)
            changed[0] = True
        return open_tag + content + '</a>'

    text = pattern.sub(replace_anchor, text)

    if filename == 'index.html':
        text = text.replace(
            '<button class="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 px-6 py-2 rounded-full font-label-md text-primary hover:scale-95 transition-all">Report Issue</button>',
            '<a href="report_issue.html" class="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 px-6 py-2 rounded-full font-label-md text-primary hover:scale-95 transition-all inline-flex items-center justify-center">Report Issue</a>'
        )

    if changed[0]:
        path.write_text(text, encoding='utf-8')
        print(f'Updated {filename}')
    else:
        print(f'No nav changes needed for {filename}')
