# Scripts, fonts and names

The pairing (a serif for reading, IBM Plex Sans for UI, IBM Plex Mono for eyebrows and readouts) stays everywhere. Each further script adds one serif and one sans from Google Fonts, loaded only on pages where the script occurs, and tagged with `lang` so the browser picks the right forms.

| Script | Serif (reading, titles) | Sans (UI, labels) | Mono readouts | Notes |
|---|---|---|---|---|
| Latin, incl. extended, Cyrillic, Greek | Source Serif 4 | IBM Plex Sans | IBM Plex Mono | Covers Twi ɔ ɛ ŋ, Māori macrons, ogonek; check the Diné glottal (ʼ) and ʻokina glyph by glyph at build |
| Japanese | Shippori Mincho (display) + Source Serif 4 | IBM Plex Sans JP | Plex Mono for numerals | `lang="ja"`; vertical setting only when the object is vertical |
| Chinese | Noto Serif SC / TC | IBM Plex Sans SC / TC | Plex Mono for numerals | `lang="zh-Hans"` or `zh-Hant`; Shippori Mincho is never used for Chinese |
| Korean | Noto Serif KR | IBM Plex Sans KR | Plex Mono for numerals | `lang="ko"` |
| Arabic | Noto Naskh Arabic | IBM Plex Sans Arabic | Plex Sans Arabic (Plex Mono has no Arabic) | `dir="auto"` on the run; Hijri dates beside CE |
| Hebrew | Frank Ruhl Libre | IBM Plex Sans Hebrew | Plex Sans Hebrew | `dir="auto"` on the run |
| Devanagari | Tiro Devanagari Hindi / Sanskrit | IBM Plex Sans Devanagari | Plex Sans Devanagari | `lang="hi"` / `sa` |
| Thai, Khmer, Burmese, Tamil, Bengali and others | Noto Serif of the script | Noto Sans of the script | the Noto Sans | add to this table when a unit reaches the script |

Rules:
- The UI is left-to-right everywhere; quoted runs in a right-to-left script are isolated (`dir="auto"`, `unicode-bidi: isolate`). The span list's axis, the journey bar and the stepper never mirror.
- A script without an italic (Arabic, Hebrew, CJK) sets the title's idea-half in `--ink-2` instead; never faux-italic, never faux-bold.
- Numerals in readouts follow the source once: "1585–95 · 993–1004 AH" uses Western digits; Eastern Arabic digits appear only inside a quoted run.
- Names are set as the community writes them: Chinese, Korean, Japanese, Hungarian family-first; Arabic name chains uncut; the own name first and the record's exonym after it in quotation marks ("Diné; the record: 'Navajo'"; "Po've'ka, Maria Martinez"). The holder's word for a person ("priest-king") appears once, quoted and attributed.
- Transliteration follows the source the unit cites and is named once on the page ("Hepburn", "pinyin", "ALA-LC").
- Line length stays ≤ 68 characters in every script; CJK body at 17 px with 1.8 line height.
