# Theme Transition System

This document explains the comprehensive theme transition system implemented in the Zencode application for smooth and subtle theme changes throughout the entire application.

## Overview

The theme transition system provides smooth, consistent transitions when switching between light and dark themes. It includes:

- **Global CSS transitions** for all theme-dependent properties
- **Utility classes** for different transition speeds
- **Preserve options** that don't conflict with existing animations
- **Theme context enhancements** with transition state management
- **Component wrappers** for easy implementation

## CSS Classes

### Global Transitions

The system automatically applies transitions to all theme-dependent properties:

```css
* {
  transition:
    background-color 0.3s ease-in-out,
    color 0.3s ease-in-out,
    border-color 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out;
}
```

### Utility Classes

#### `.theme-transition`

Standard transition (0.3s) for most elements - **theme properties only**:

```jsx
<div className="theme-transition">Content with standard theme transitions</div>
```

#### `.theme-transition-fast`

Fast transition (0.15s) for interactive elements - **theme properties only**:

```jsx
<button className="theme-transition-fast">
  Interactive button with fast transitions
</button>
```

#### `.theme-transition-slow`

Slow transition (0.5s) for background elements - **theme properties only**:

```jsx
<section className="theme-transition-slow">
  Background section with slow transitions
</section>
```

### Preserve Classes (Recommended for Elements with Existing Animations)

#### `.theme-transition-preserve`

Standard transition (0.3s) that **preserves existing animations**:

```jsx
<div className="hover:scale-105 transition-all duration-300 theme-transition-preserve">
  Card with hover animation + theme transitions
</div>
```

#### `.theme-transition-preserve-fast`

Fast transition (0.15s) that **preserves existing animations**:

```jsx
<button className="hover:translate-x-1 transition-transform theme-transition-preserve-fast">
  Button with hover animation + theme transitions
</button>
```

#### `.theme-transition-preserve-slow`

Slow transition (0.5s) that **preserves existing animations**:

```jsx
<section className="hover:rotate-1 transition-all theme-transition-preserve-slow">
  Section with hover animation + theme transitions
</section>
```

## Theme Context

The theme context now includes transition state management:

```jsx
import { useTheme } from "./components/theme-context-utils";

function MyComponent() {
  const { theme, toggleTheme, isTransitioning } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      disabled={isTransitioning}
      className="theme-transition-fast"
    >
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
```

## ThemeTransitionWrapper Component

A utility component for wrapping elements with theme transitions:

```jsx
import ThemeTransitionWrapper from "./components/theme-transition-wrapper";

function MyComponent() {
  return (
    <ThemeTransitionWrapper speed="preserve" className="my-custom-class">
      <div>Content with theme transitions</div>
    </ThemeTransitionWrapper>
  );
}
```

### Props

- `speed`: "fast" | "normal" | "slow" | "preserve" | "preserve-fast" | "preserve-slow" (default: "normal")
- `className`: Additional CSS classes
- `style`: Additional inline styles
- `children`: Content to wrap

## Implementation Examples

### Buttons and Interactive Elements

```jsx
// Fast transitions for immediate feedback
<Button className="theme-transition-fast">Click me</Button>
```

### Cards with Hover Animations

```jsx
// Preserve existing hover animations
<Card className="hover:scale-105 transition-all duration-300 theme-transition-preserve">
  <CardContent>
    Card content with smooth theme transitions + hover animation
  </CardContent>
</Card>
```

### Background Sections

```jsx
// Slow transitions for background elements
<section className="theme-transition-slow bg-background">
  Background section content
</section>
```

### Icons and SVGs

```jsx
// Icons automatically get fast transitions
<Sun className="h-4 w-4 text-primary" />
<Moon className="h-4 w-4 text-muted-foreground" />
```

## Best Practices

### 1. Use Preserve Classes for Elements with Existing Animations

```jsx
// ❌ This will conflict with hover animations
<div className="hover:scale-105 transition-all theme-transition">

// ✅ This preserves existing animations
<div className="hover:scale-105 transition-all theme-transition-preserve">
```

### 2. Use Appropriate Speeds

- **Fast (0.15s)**: Buttons, links, interactive elements
- **Normal (0.3s)**: Cards, containers, text content
- **Slow (0.5s)**: Background sections, large containers
- **Preserve variants**: When elements have existing animations

### 3. Disable During Transitions

```jsx
const { isTransitioning } = useTheme();

<button disabled={isTransitioning} className="theme-transition-fast">
  Toggle Theme
</button>;
```

### 4. Provide Visual Feedback

```jsx
const { isTransitioning } = useTheme();

<div className={`theme-transition ${isTransitioning ? "opacity-75" : ""}`}>
  Content with visual feedback during transitions
</div>;
```

### 5. Consistent Implementation

Use the same transition speeds across similar elements:

```jsx
// All navigation links use fast transitions
<nav>
  <a href="#features" className="theme-transition-fast">
    Features
  </a>
  <a href="#dashboard" className="theme-transition-fast">
    Dashboard
  </a>
  <a href="#testimonials" className="theme-transition-fast">
    Testimonials
  </a>
</nav>
```

## Performance Considerations

### 1. Hardware Acceleration

The system uses `transform` and `opacity` properties which are hardware-accelerated:

```css
.theme-transition-preserve {
  transition:
    background-color 0.3s ease-in-out,
    color 0.3s ease-in-out,
    border-color 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out,
    transform 0.3s ease-in-out,
    opacity 0.3s ease-in-out;
}
```

### 2. Reduced Motion Support

For users who prefer reduced motion, consider adding:

```css
@media (prefers-reduced-motion: reduce) {
  .theme-transition,
  .theme-transition-fast,
  .theme-transition-slow,
  .theme-transition-preserve,
  .theme-transition-preserve-fast,
  .theme-transition-preserve-slow {
    transition: none;
  }
}
```

### 3. Transition State Management

The theme context prevents multiple rapid theme changes:

```jsx
const toggleTheme = () => {
  if (isTransitioning) return; // Prevent rapid toggles

  setIsTransitioning(true);
  // ... theme change logic
};
```

## Troubleshooting

### Common Issues

1. **Hover animations not working**: Use `theme-transition-preserve` classes instead
2. **Jarring transitions**: Use slower speeds for large containers
3. **Performance issues**: Avoid applying transitions to too many elements simultaneously
4. **Inconsistent timing**: Use the utility classes instead of custom transition durations

### Debug Mode

Add this to your component for debugging:

```jsx
const { theme, isTransitioning } = useTheme();

console.log("Theme:", theme, "Transitioning:", isTransitioning);
```

## Migration Guide

### From Custom Transitions

Replace custom transition classes:

```jsx
// Before
<div className="transition-colors duration-300">

// After
<div className="theme-transition">
```

### From Elements with Existing Animations

```jsx
// Before
<div className="hover:scale-105 transition-all theme-transition">

// After
<div className="hover:scale-105 transition-all theme-transition-preserve">
```

### From Inline Styles

Replace inline transition styles:

```jsx
// Before
<div style={{ transition: 'all 0.3s ease-in-out' }}>

// After
<div className="theme-transition">
```

This system provides a consistent, performant, and user-friendly theme transition experience throughout the entire Zencode application while preserving existing animations and hover effects.
