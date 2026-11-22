# WPM / TYPING TEST - FINAL FLOW SPEC

## 1. Flow Overview

### SETUP SCREEN
- Big textarea: "Paste the text you want to practice" (limit 5,000 chars)
- Options:
  - Time limit: none / 1 / 2 / 5 min
  - Allow backspace: on / off
  - Strict mode: must fix a mistake before continuing
  - Live WPM: on / off
- Quick samples: English / Hindi / Bengali paragraph
- Button: START (disabled until text is pasted)

### COUNTDOWN
- Full-screen overlay: `3 ... 2 ... 1 ... GO` (scale + fade animation)
- Typing box is locked until GO

### TYPING VIEW
- Text shown as graphemes (use `Intl.Segmenter`, critical for Hindi and Bengali conjuncts); caret on current char
- Visual status: Correct = green, Wrong = red, Upcoming = muted
- Paste, drop, cut, and autocorrect DISABLED in the typing box
- IME support: do not count intermediate composition; compare on `compositionend`
- Live display: Timer, WPM, Accuracy

### FINISH & RESULTS
- Triggers when the text is complete or time ends
- Metrics displayed:
  - Net WPM
  - Gross WPM
  - Accuracy (%)
  - Errors count
  - Time elapsed
- Visual breakdowns:
  - WPM-over-time chart
  - Slowest words
  - Most-missed keys
- Actions:
  - Retry same text
  - Retry only mistakes
  - Copy result to clipboard
  - Save result as image (Canvas, 100% local)
  - Personal bests saved in `localStorage` (try/catch protected)

---

## 2. Metric Formulas & Method Transparency
Show which method is used:
- **Gross WPM**: `(typed characters / 5) / minutes`
- **Net WPM**: `Gross WPM - (uncorrected errors / minutes)`
- **Accuracy**: `(correct keystrokes / total keystrokes) * 100`
- Mode toggle: `"5 characters = 1 word"` (standard) vs `"actual words"`
- *Disclaimer*: Govt exam rules differ (SSC, CPCT, court); label it as practice, not an official score.

---

## 3. Caution on Legacy Fonts
- Legacy Kruti Dev / Bijoy fonts are proprietary. Do not bundle them.
- Support standard Unicode typing (Inscript / phonetic).
- For legacy text, advise using the Legacy Font Converter tool.
