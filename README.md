# Appointment Booking Application

Egyszerű heti naptár nézet React + TypeScript + Vite alapon.

Az alkalmazás mockolt időpont-adatokkal dolgozik, majd heti táblázatos nézetben jeleníti meg őket. Azok az órablokkok, amelyek a teljes héten üresen maradnak, összecsukható formában jelennek meg.

## Technológia

- React 19
- TypeScript
- Vite
- ESLint

## Előfeltételek

- Node.js 20+
- npm 10+

## Projekt futtatása

1. Függőségek telepítése:

```bash
npm install
```

2. Fejlesztői szerver indítása:

```bash
npm run dev
```

3. Build készítése:

```bash
npm run build
```

4. Build lokális előnézete:

```bash
npm run preview
```

5. Lint futtatása:

```bash
npm run lint
```

## Könyvtárszerkezet

```text
src/
  App.tsx
  mockApi.ts
  components/
    Calendar/
      index.tsx
      utils.ts
      types.ts
      style.css
```

## Főbb komponensek

- `App.tsx`
  - Alkalmazás gyökérkomponens.
  - Betölti az időpontokat a `fetchAppointments()` hívásával.
  - Kezeli a betöltési és hibás állapotokat.
  - A naptár komponensnek átadja az adatokat és az időintervallumot (`startHour = 8`, `endHour = 20`).

- `components/Calendar/index.tsx`
  - A heti táblázat renderelése.
  - Napok (oszlopok) előállítása.
  - Időpontok leképzése `date-hour` kulcs alapján.
  - Üres órablokkok összecsukása/kinyitása (`expandedBlocks` state).

- `components/Calendar/utils.ts`
  - Dátumok gyűjtése a héthez (`collectWeekDates`).
  - Hétnap-név és óraformátum segédek (`formatWeekdayLabel`, `formatHour`).
  - Összecsukható üres blokkok felépítése (`buildCollapsedBlocks`).

- `mockApi.ts`
  - A feladatban kapott mockApi fájl, ami szimulál egy network requestet és és definiálja az adattípust.

## Működés röviden

1. Az alkalmazás induláskor betölti az időpontokat.
2. A naptár a kapott adatokból felépíti a heti oszlopokat.
3. Az egyes órákra és napokra cellákat renderel.
4. Azokat az órasávokat, ahol a teljes héten nincs esemény, egy összecsukható sorba vonja össze.

## Tervezési kompromisszumok

- Rövidített dátum fallback
  - Ha nincs adat, egy fix hét (`2025-04-07` ... `2025-04-13`) jelenik meg.
  - Előny: mindig van legalább egy üres naptár nézet.
  - Hátrány: lehetne dinamikus az aktuális héthez képest, de ez nem volt a feladat része.