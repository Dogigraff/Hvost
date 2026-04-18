# MASTER.md — Patch: Web Layout with Sidebar

Применить к текущему `design-system/MASTER.md`. Это не полная замена, а **добавление и замена конкретных секций**.

---

## ЗАМЕНИТЬ раздел "Responsive Behavior" полностью:

## Responsive Behavior

**Тип продукта:** полноценный web-сайт (не Telegram WebApp, не мобильный контейнер)

**Breakpoints:**
- `mobile` — `< 768px`
- `tablet` — `768px - 1023px`
- `desktop` — `>= 1024px`

**Правила:**
- Landing и Auth: desktop-first design, адаптивный до mobile
- `/app/*`: два лейаута
  - `desktop` (`>= 1024px`): двухколоночный — sidebar 280px + main content
  - `tablet` (`768-1023px`): sidebar collapsed до 72px (только иконки), main content расширяется
  - `mobile` (`< 768px`): sidebar скрыт, открывается как drawer через hamburger; BottomNav видна
- Main content внутри `/app` центрируется, `max-width: 720px`, с отступами `24px` на боках (на desktop с учетом sidebar)
- Landing использует широкий layout: hero full-width, features в 3 колонки на desktop, 1 на mobile
- Touch target min: `44x44px` на всех viewport

**App Shell structure (desktop):**
```
+---------------------------+--------------------------------------------+
|                           |                                            |
|  SIDEBAR (280px fixed)    |  MAIN (flex: 1, centered content 720px)    |
|                           |                                            |
|  [Brand / Logo]           |  [Page content]                            |
|                           |                                            |
|  [Nav items]              |                                            |
|  [Dogs list]              |                                            |
|                           |                                            |
|  [User block — sticky     |                                            |
|   bottom]                 |                                            |
|                           |                                            |
+---------------------------+--------------------------------------------+
```

**App Shell structure (mobile):**
```
+------------------------------------------+
|  [Mobile header: burger + logo + avatar] |
+------------------------------------------+
|                                          |
|  [Main content, full width]              |
|                                          |
|                                          |
+------------------------------------------+
|  [Bottom nav: 4 items, fixed]            |
+------------------------------------------+
```

---

## ДОБАВИТЬ новую секцию "Layout Components":

## Layout Components

### Sidebar (desktop/tablet only)

**Dimensions:**
- Desktop: `width: 280px`, `height: 100vh`, fixed left
- Tablet: `width: 72px` (collapsed), только иконки, подпись в tooltip
- Mobile: hidden, drawer при клике на burger

**Structure (top to bottom):**

1. **Brand block** (top, `padding: 24px 20px`)
   - Лапка-иконка SVG 32px + "Хвост" (Nunito 700, 22px)
   - Клик → `/app`

2. **Primary nav** (`padding: 8px`)
   - 3 item: Главная (Home icon), Чат (MessageCircle icon), Профиль (User icon)
   - Item: `height: 44px`, `padding: 0 12px`, `border-radius: var(--radius-md)`, иконка 20px + label
   - Active: `background: var(--color-primary-subtle)`, `color: var(--color-text)`, левая 3px полоса `--color-primary`
   - Hover: `background: var(--color-surface-subtle)`

3. **Separator** (`margin: 8px 20px`, `height: 1px`, `background: var(--color-border)`)

4. **Dogs section** (`padding: 8px`)
   - Header: "Мои собаки" (caption, text-muted, `padding: 12px 12px 8px`)
   - List of dog items:
     - `height: 52px`, `padding: 6px 12px`, `border-radius: var(--radius-md)`
     - Avatar 40px rounded-full (signed URL или fallback — инициал имени на `--color-primary-subtle`)
     - Name (body-sm, 500)
     - Active dog: `background: var(--color-primary-subtle)`, border-left 3px `--color-primary`
   - Hover: `background: var(--color-surface-subtle)`
   - В конце списка: "+ Добавить" как ghost button → `/app/dogs/new`

5. **User block** (sticky bottom, `padding: 16px 12px`, `border-top: 1px solid var(--color-border)`)
   - Avatar 36px + display_name (body-sm) + email (caption text-muted) — в две строки
   - Справа кнопка-иконка settings (шестеренка) → `/app/profile`
   - Хит-эрия всего блока кликабельна → `/app/profile`
   - Hover: `background: var(--color-surface-subtle)`

**Visual:**
- Background: `var(--color-surface)` (в light — белый, в dark — `--color-surface`)
- Right border: `1px solid var(--color-border)`
- Scroll внутри dogs list если собак много (max-height, `overflow-y: auto`)

### TopBar (landing + auth only)

- Height: `72px`, `padding: 0 32px`
- Background: transparent на landing hero, `var(--color-surface)` на остальных
- Содержимое: Лого слева, ThemeToggle + "Войти" + "Регистрация" справа
- Mobile (`<768px`): burger menu для nav ссылок landing

### MobileHeader (inside /app, mobile only)

- Height: `56px`, `padding: 0 16px`
- Sticky top, `background: var(--color-surface)` с `backdrop-filter: blur(12px)`
- Border-bottom `1px var(--color-border)`
- Содержимое: burger слева → открывает Sidebar как drawer, лого по центру, avatar справа → `/app/profile`

### BottomNav (mobile only)

- Hidden на `>=768px`
- Остается как есть, но добавить `hidden md:hidden` или media query в CSS
- Ссылки: как раньше (Главная, Собаки → текущая собака, Чат → чат текущей собаки, Профиль)

### Main Content Area

**Desktop:**
- `margin-left: 280px` (чтобы уступить место sidebar)
- Tablet: `margin-left: 72px`
- Mobile: `margin-left: 0`

**Inside main:**
- Content wrapper: `max-width: 720px`, `margin: 0 auto`, `padding: 32px 24px`
- На mobile: `padding: 16px` + `padding-bottom: 88px` (чтобы контент не ехал под bottom nav)

---

## ДОБАВИТЬ новую секцию "Page Patterns":

## Page Patterns

### Landing `/`

**Desktop-first:**
- Hero section: full viewport width, `min-height: 80vh`, центрированный контент max-width 1200px
  - Левая половина: headline (`text-display`, 48-56px), subheadline (20px text-muted), 2 CTA button (primary + ghost)
  - Правая половина: маскот-иллюстрация (TODO: mascot/hero.svg) в круге `--color-primary-subtle` 480x480
  - Mobile: stack в одну колонку, маскот сверху, текст снизу
- Features: 3-column grid (desktop), 1-column (mobile), карточки с иконкой в круге, заголовком, описанием
- CTA final: большая центральная секция на `--color-primary-subtle`, "Начните бесплатно", primary button lg

**Layout:**
- TopBar sticky сверху
- Container max-width: `1200px`, `padding: 0 32px` desktop / `16px` mobile

### Auth `/auth/*`

- Центрированная карточка `max-width: 440px` на фоне `--color-bg`
- На desktop слева можно показать декоративный блок с маскотом (60/40 split) — но опционально, проверим в MVP
- TopBar минимальный (только лого)

### App pages `/app/*`

Используют **AppShell** (sidebar + main area).

Внутри main:
- Page header: h1 (28px Nunito 800) + optional subtitle или action button справа
- Content blocks, gap `--space-lg` между секциями
- Максимум 720px ширина — читаемо и не разваливается на больших экранах

---

## ДОБАВИТЬ в "Anti-Patterns":

- Узкий мобильный контейнер `max-width: 480px` на desktop — выглядит как Telegram WebApp, не используем
- Весь layout одним столбцом на desktop — теряется воздух и ощущение web-продукта
- Sidebar без активного состояния — пользователь не понимает где находится
- Дублирование навигации (sidebar + bottom nav видны одновременно) — один видим на десктопе, другой на мобилке, но не вместе

---

## ДОБАВИТЬ в "Pre-Delivery Checklist":

- [ ] На десктопе (`>=1024px`) виден sidebar шириной 280px
- [ ] На таблете (`768-1023px`) sidebar collapsed до 72px
- [ ] На мобилке (`<768px`) sidebar скрыт, burger открывает drawer, BottomNav виден
- [ ] Content в /app центрирован с max-width 720px
- [ ] Landing выглядит как полноценный web-сайт (не мобильный контейнер на десктопе)
- [ ] Sidebar: active state для текущего раздела И текущей собаки
- [ ] Dogs list в sidebar прокручивается если собак больше 5
- [ ] User block в sidebar sticky bottom

---

## ЗАМЕНИТЬ в "Agent Prompt Guide" блок "Always":

**Always:**
- Используй `AppShell` layout для всех /app/* страниц (sidebar + main)
- `bg-bg`, `bg-surface`, `text-text`, `text-text-muted`, `bg-primary text-primary-fg`
- Font families через Tailwind `font-heading` (Nunito) / `font-body` (Manrope)
- Радиусы и тени из token scale
- Framer-motion с standard easing
- На десктопе в /app контент ограничен `max-width: 720px` и центрирован
- Landing использует широкий layout `max-width: 1200px`, не `480px`
