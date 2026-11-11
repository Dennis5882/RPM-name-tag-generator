"""index.html의 release-data(릴리즈 노트 원본)로 CHANGELOG.md를 만든다.

사용: python tools/make_changelog.py            → CHANGELOG.md 갱신
      python tools/make_changelog.py --notes 1.5.0  → 해당 버전 노트만 출력 (GitHub 릴리즈 본문용)
"""
import json, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
TAG = {'new': '새 기능', 'improve': '개선', 'fix': '수정'}

def releases():
    html = (ROOT / 'index.html').read_text(encoding='utf-8')
    m = re.search(r'<script type="application/json" id="release-data">(.*?)</script>', html, re.S)
    return json.loads(m.group(1))

def notes(r):
    out = []
    for t in ('new', 'improve', 'fix'):
        items = [c['text'] for c in r['changes'] if c['type'] == t]
        if items:
            out.append(f'### {TAG[t]}')
            out += [f'- {x}' for x in items]
            out.append('')
    return '\n'.join(out).rstrip() + '\n'

def main():
    rels = releases()
    if len(sys.argv) > 2 and sys.argv[1] == '--notes':
        r = next(r for r in rels if r['version'] == sys.argv[2])
        sys.stdout.reconfigure(encoding='utf-8')
        print(notes(r), end='')
        return
    md = ['# 릴리즈 노트', '', '명찰 생성기 업데이트 내역입니다. 배포 주소: https://rpm-name-tag.vercel.app/', '']
    for r in rels:
        md += [f"## v{r['version']} — {r['title']} ({r['date']})", '', notes(r)]
    (ROOT / 'CHANGELOG.md').write_text('\n'.join(md).rstrip() + '\n', encoding='utf-8')
    print(f'CHANGELOG.md: {len(rels)} releases, latest v{rels[0]["version"]}')

if __name__ == '__main__':
    main()
