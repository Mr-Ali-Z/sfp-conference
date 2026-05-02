# Space Frontiers Pakistan — National Commercial Space Conference 2026

Static website built for Pearson BTEC HND Computing Level 4, Unit 13: Website Design & Development, Activity 3.

## Stack

- HTML5 (semantic landmarks)
- CSS3 (custom design system, no Bootstrap dependency)
- Vanilla JavaScript (no frameworks)
- Google Fonts: Space Grotesk + Inter

## Pages

- `index.html` — Home / hero / overview
- `agenda.html` — 3-day agenda with day tabs and track filter
- `speakers.html` — Speaker grid with expandable bios
- `register.html` — Registration form with client-side validation
- `expo.html` — Booth tiers and confirmed exhibitors

## Local preview

```bash
cd site
python3 -m http.server 8000
# open http://localhost:8000/
```

## Deployment

GitHub Pages from this directory. The `.nojekyll` file disables Jekyll processing.
