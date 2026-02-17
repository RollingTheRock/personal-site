---
title: "Homepage Redesign - Every.to Style Implementation"
date: 2026-02-17
category: frontend
tags: [astro, tailwindcss, animation, typography, responsive-design]
difficulty: intermediate
status: completed
---

# Homepage Redesign - Every.to Style Implementation

## Problem/Goal Statement

The original homepage design needed a complete visual overhaul to achieve a premium, editorial aesthetic inspired by Every.to. The key objectives were:

1. **Header Redesign**: Create a clean, minimal header with left-aligned navigation trigger and centered logo
2. **Sidebar Navigation**: Transform from right-slide to left-slide drawer with backdrop blur effect
3. **Hero Section**: Design an elegant hero with decorative avatar, sophisticated typography, and interactive subscription CTA
4. **Typography Enhancement**: Introduce Cormorant Garamond for elegant tagline display
5. **Visual Rhythm**: Add section dividers to create clear content hierarchy
6. **Footer Simplification**: Remove redundant subscription section for cleaner layout

## Technical Approach

### Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **CSS Custom Properties for Theming** | Enables seamless dark/light mode switching without JavaScript framework dependencies |
| **IntersectionObserver for Scroll Animations** | Native browser API, performant and doesn't block main thread |
| **CSS Keyframe Animations** | Hardware-accelerated, works without JavaScript for initial page load |
| **Google Fonts + Local Fonts Hybrid** | Cormorant Garamond loaded from Google for reliability, Chinese fonts local for performance |
| **Backdrop Filter for Menu Overlay** | Modern CSS feature creating premium glass-morphism effect |

### Animation Strategy

Three-phase animation approach:
1. **Page Load**: Sequential fade-in animations with staggered delays (200ms, 400ms, 600ms)
2. **Scroll Triggers**: IntersectionObserver reveals content as user scrolls
3. **Interaction**: Smooth transitions for hover states and form expansion

## Implementation Details

### 1. Header with Left Hamburger and Centered Logo

**File**: `src/pages/index.astro`

The header uses absolute positioning to place the hamburger menu on the left while keeping the logo centered:

```astro
<header class="relative w-full pt-12 pb-6 opacity-0-init animate-fade-in-down">
  <div class="container-wide relative flex items-center justify-center">
    <!-- Hamburger menu button - absolute positioned left -->
    <button
      type="button"
      class="absolute left-0 p-2 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
      aria-label="打开菜单"
      onclick="window.openMobileMenu()"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>

    <!-- Centered Logo -->
    <Logo />
  </div>
</header>

<!-- Full-width Divider -->
<div class="w-full border-b border-[var(--border-color)]"></div>
```

**Key Techniques**:
- `relative` container with `absolute left-0` hamburger button
- `flex items-center justify-center` centers the logo regardless of hamburger width
- Full-width divider creates visual separation

### 2. Left-Slide Mobile Menu with Backdrop Blur

**File**: `src/components/MobileMenu.astro`

```astro
<!-- Mobile Menu Overlay with backdrop blur -->
<div
  id="menu-overlay"
  class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] opacity-0 pointer-events-none transition-opacity duration-300"
  onclick="window.closeMobileMenu()"
>
</div>

<!-- Mobile Menu Panel - Slides from left -->
<aside
  id="mobile-menu-panel"
  class="fixed top-0 left-0 w-[300px] h-screen z-[1000] transform -translate-x-full transition-transform duration-300 ease-out"
  style="background: rgba(10, 10, 10, 0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);"
>
```

**JavaScript Control Functions**:

```javascript
window.openMobileMenu = function() {
  const panel = document.getElementById('mobile-menu-panel');
  const overlay = document.getElementById('menu-overlay');

  if (panel && overlay) {
    panel.classList.remove('-translate-x-full');
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
  }
};

window.closeMobileMenu = function() {
  const panel = document.getElementById('mobile-menu-panel');
  const overlay = document.getElementById('menu-overlay');

  if (panel && overlay) {
    panel.classList.add('-translate-x-full');
    overlay.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
  }
};
```

**Key Features**:
- `-translate-x-full` initially hides panel off-screen to the left
- `backdrop-blur-sm` creates frosted glass effect on overlay
- `pointer-events-none` prevents interaction when overlay is hidden
- Body scroll lock prevents background scrolling when menu is open
- ESC key support for accessibility

### 3. Hero Section with Expandable Subscribe Form

**File**: `src/components/HeroSection.astro`

#### Decorative Avatar with Vintage Texture

```astro
<div class="relative inline-block">
  <!-- Decorative background layer - vintage texture -->
  <div
    class="absolute rounded-full -z-10"
    style="
      width: calc(100% + 20px);
      height: calc(100% + 20px);
      top: 10px;
      left: 10px;
      background: repeating-linear-gradient(
        45deg,
        rgba(168, 85, 247, 0.1) 0px,
        rgba(168, 85, 247, 0.1) 2px,
        transparent 2px,
        transparent 8px
      ),
      radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.15) 0%, transparent 50%);
    "
  ></div>

  <!-- Avatar -->
  <img
    src={avatarSrc}
    alt="头像"
    width="192"
    height="192"
    class="w-44 h-44 md:w-48 md:h-48 rounded-full object-cover relative z-10"
    style="
      border: 2px dashed #A855F7;
      box-shadow: 0 0 30px rgba(168, 85, 247, 0.3);
    "
  />
</div>
```

#### Gradient Border Subscribe Button

```astro
<button
  id="hero-subscribe-btn"
  type="button"
  class="relative inline-flex items-center justify-center px-8 py-3 text-base font-medium text-[var(--text-primary)] transition-all duration-300 rounded-full group"
  style="
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(6, 182, 212, 0.1));
  "
>
  <!-- Gradient border -->
  <span
    class="absolute inset-0 rounded-full p-[2px]"
    style="background: linear-gradient(135deg, #A855F7, #06B6D4);"
  >
    <span class="absolute inset-[2px] rounded-full bg-[var(--bg-primary)]"></span>
  </span>
  <span class="relative z-10 flex items-center gap-2">
    <svg><!-- mail icon --></svg>
    Subscribe
  </span>
</button>
```

**Technique**: The gradient border uses a padding-box technique - outer span has gradient background with padding, inner span covers center with solid background color.

#### Expandable Form with CSS Transitions

```astro
<div
  id="hero-subscribe-form"
  class="max-w-md mx-auto mt-6 overflow-hidden transition-all duration-500 ease-out opacity-0 max-h-0"
>
  <form onsubmit="event.preventDefault(); handleHeroSubscribe(event);">
    <!-- form content -->
  </form>
</div>
```

```javascript
document.addEventListener('DOMContentLoaded', function() {
  const subscribeBtn = document.getElementById('hero-subscribe-btn');
  const subscribeForm = document.getElementById('hero-subscribe-form');

  subscribeBtn.addEventListener('click', function() {
    const isExpanded = subscribeForm.classList.contains('opacity-100');

    if (isExpanded) {
      subscribeForm.classList.remove('opacity-100', 'max-h-48');
      subscribeForm.classList.add('opacity-0', 'max-h-0');
    } else {
      subscribeForm.classList.remove('opacity-0', 'max-h-0');
      subscribeForm.classList.add('opacity-100', 'max-h-48');
      // Focus on email input after animation
      setTimeout(() => {
        const emailInput = subscribeForm.querySelector('input[type="email"]');
        if (emailInput) emailInput.focus();
      }, 300);
    }
  });
});
```

### 4. Typography System with Cormorant Garamond

**File**: `src/styles/global.css`

```css
/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&display=swap');

:root {
  /* Font Variables */
  --font-serif: 'Playfair Display', 'Noto Sans SC', Georgia, 'SimSun', sans-serif;
  --font-sans: 'Noto Sans SC', system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --font-tagline: 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
  --font-hero-tagline: 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
}

/* Hero Tagline - Cormorant Garamond */
.hero-tagline {
  font-family: var(--font-hero-tagline) !important;
  font-weight: 600;
  font-style: italic;
  letter-spacing: 0.02em;
}
```

**Font Stack Strategy**:
- **Display/Headlines**: Playfair Display (English) + Noto Sans SC Black (Chinese)
- **Body Text**: Noto Sans SC with system fallbacks
- **Tagline**: Cormorant Garamond for elegant, editorial feel

### 5. Animation System

**File**: `src/styles/global.css`

```css
/* Keyframe Definitions */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Animation Classes */
.animate-fade-in-down {
  animation: fadeInDown 0.5s ease-out forwards;
}

.animate-scale-in {
  animation: scaleIn 0.5s ease-out forwards;
}

/* Delay Utilities */
.delay-200 { animation-delay: 200ms; }
.delay-400 { animation-delay: 400ms; }
.delay-600 { animation-delay: 600ms; }

/* Initial State */
.opacity-0-init {
  opacity: 0;
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-down,
  .animate-scale-in {
    animation: none;
    opacity: 1;
  }
}
```

**Scroll Animation with IntersectionObserver**:

```javascript
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      const parent = entry.target.parentElement;
      const siblings = parent ? Array.from(parent.children) : [];
      const siblingIndex = siblings.indexOf(entry.target);
      const delay = siblingIndex * 100;

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      observer.unobserve(entry.target);
    }
  });
}, observerOptions);
```

### 6. Section Dividers

**File**: `src/pages/index.astro`

```astro
<!-- Main Content -->
<main class="flex-1 page-transition">
  <!-- Hero Section -->
  <div class="pt-8">
    <HeroSection />
  </div>

  <!-- Divider between Hero and Cards -->
  <div class="container-wide">
    <div class="border-b border-[var(--border-color)]"></div>
  </div>

  <!-- Category Cards -->
  <CategoryCards class="pt-16" />

  <!-- Divider between Cards and Featured Blog -->
  <div class="container-wide">
    <div class="border-b border-[var(--border-color)] mt-16"></div>
  </div>

  <!-- Featured Posts -->
  <FeaturedPosts class="pt-16" />

  <!-- More dividers... -->
</main>
```

## Key Code Snippets

### CSS Custom Properties for Theming

```css
:root {
  /* Light Mode */
  --bg-primary: #FFFFFF;
  --bg-secondary: #FAFAFA;
  --text-primary: #1A1A1A;
  --text-secondary: #555555;
  --text-muted: #888888;
  --border-color: #E5E5E5;
}

[data-theme="dark"] {
  /* Dark Mode */
  --bg-primary: #0A0A0A;
  --bg-secondary: #111111;
  --text-primary: #EEEEEE;
  --text-secondary: #A0A0A0;
  --border-color: #2A2A2A;
}
```

### Gradient Border Button Pattern

```html
<button class="relative rounded-full">
  <!-- Border layer -->
  <span class="absolute inset-0 rounded-full p-[2px] bg-gradient-to-r from-purple-500 to-cyan-500">
    <!-- Inner fill -->
    <span class="absolute inset-[2px] rounded-full bg-white"></span>
  </span>
  <!-- Content -->
  <span class="relative z-10">Button Text</span>
</button>
```

### Accessible Mobile Menu

```javascript
// Close on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.closeMobileMenu();
  }
});

// Focus trap (simplified - production would need full focus management)
// Click outside to close
// aria-hidden management for screen readers
```

## Lessons Learned

### 1. CSS Variable Inheritance

**Challenge**: Tailwind classes with arbitrary values like `bg-[var(--bg-primary)]` work well, but need fallback values for older browsers.

**Solution**: Define variables at `:root` level and use `@apply` in components for consistency.

### 2. Animation Performance

**Challenge**: Complex animations can cause jank on mobile devices.

**Solution**:
- Use `transform` and `opacity` only (GPU-accelerated)
- Add `will-change` sparingly
- Implement `prefers-reduced-motion` support

### 3. Font Loading Strategy

**Challenge**: Google Fonts can cause layout shift (CLS) if not handled properly.

**Solution**:
- Use `font-display: swap` for local fonts
- Preload critical fonts: `<link rel="preload">`
- Set explicit `width` and `height` on text containers

### 4. Backdrop Filter Support

**Challenge**: `backdrop-filter` is not supported in Firefox without flag.

**Solution**: Provide solid color fallback:

```css
.mobile-menu {
  background: rgba(10, 10, 10, 0.95); /* Fallback */
  backdrop-filter: blur(20px); /* Enhancement */
}
```

### 5. Form Accessibility

**Challenge**: Expandable forms need proper ARIA attributes.

**Solution**:
- Use `aria-expanded` on trigger button
- Manage `aria-hidden` on form container
- Ensure focus management (focus into form when opened, return when closed)

## Files Modified

| File | Changes |
|------|---------|
| `src/pages/index.astro` | New header layout, section dividers, scroll animations |
| `src/components/HeroSection.astro` | Complete redesign with avatar, tagline, expandable form |
| `src/components/MobileMenu.astro` | Left-slide panel, backdrop blur, theme toggle |
| `src/components/Footer.astro` | Removed subscription section |
| `src/styles/global.css` | Added Cormorant Garamond, animation keyframes, font utilities |
| `public/fonts/CormorantGaramond-*.woff2` | Added local font files |

## References

- [Every.to](https://every.to/) - Design inspiration
- [Astro Documentation](https://docs.astro.build/) - Framework reference
- [Tailwind CSS Documentation](https://tailwindcss.com/) - Utility classes
- [Google Fonts - Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond)
- [MDN - Backdrop Filter](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)
- [MDN - Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

## Related Solutions

- [Chinese Serif Font Fix](./chinese-serif-font-fix.md) - Font fallback strategies
- [Container Width System](./container-width-system.md) - Responsive layout approach
- [Local Fonts Setup](./local-fonts-setup.md) - Self-hosted font configuration
