# Så återanvänder du denna sajt som mall för nästa företag

Den här strukturen är byggd för att kunna kopieras och anpassas på några minuter utan att alla sajter ser likadana ut:

## 1. Byt färger och typsnitt (`styles.css`)
Överst i `styles.css` ligger alla designvariabler under `:root`:
- `--brand-dark`: Huvudfärg för hero, sidfot och mörka sektioner (t.ex. `#142820` skogsgrön, `#091426` asfaltsblå, `#1E1B2E` plommon/skiffer)
- `--brand-accent`: CTA-färg för knappar och detaljer (t.ex. `#e59400` mässing, `#f59e0b` säkerhetsgul)
- `--brand-paper` & `--brand-tint`: Ljus bakgrund och sekundär ytfärg
- `--font-display` & `--font-body`: Byt typsnitt genom att hämta nya med `impeccable font-fetch`

## 2. Byt företagsdata & tjänster (`site-data.js`)
Redigera `window.SITE_DATA` med det nya företagets:
- `company`: namn, e-post, telefonnummer och verksamhetsområde
- `serviceTabs`: flikarna i *"Vad behöver du hjälp med idag?"*-väljaren

## 3. Uppdatera sektionerna & bilderna (`index.html` + `assets/`)
- Byt de 3 bilderna i `assets/` mot foton som passar det nya företagets bransch.
- Uppdatera rubriker, beskrivningar, JSON-LD (`LocalBusiness`) och kryssrutorna i `#quoteForm` i `index.html` med företagets riktiga fakta.
