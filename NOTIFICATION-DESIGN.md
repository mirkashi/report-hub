# Notification Component Design Document

## Visual Design Overview

The notification component implements a **professional, skeuomorphic design** that matches the overall aesthetic of the Report Hub application.

## Design Elements

### 1. **Overlay Background**
- Semi-transparent dark overlay (rgba(0, 0, 0, 0.5))
- Covers entire viewport
- Centers notification card
- Smooth fade-in transition

### 2. **Notification Card**
- **Background**: Cream/beige gradient mimicking real paper
  - Top: #faf8f2 (lighter cream)
  - Bottom: #f5f0e6 (darker cream)
- **Texture**: Subtle noise overlay for realistic paper texture
- **Border**: 2px embossed border with rgba(212, 197, 169, 0.4)
- **Size**: Max-width 500px, 90% on mobile
- **Padding**: 32px on desktop, 24px on mobile

### 3. **Realistic Shadows**
The card has multiple layered shadows for depth:
- Primary shadow: 0 30px 60px rgba(0, 0, 0, 0.5)
- Secondary shadow: 0 10px 20px rgba(0, 0, 0, 0.3)
- Inner highlight: inset 0 1px 0 rgba(255, 255, 255, 0.8)
- Inner shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.1)

### 4. **Icon Circle**
- **Size**: 64px diameter (48px on mobile)
- **Shape**: Perfect circle with embossed effect
- **Colors** (gradient based on type):
  - Success: Green gradient (#48bb78 to #38a169)
  - Error: Red gradient (#f56565 to #e53e3e)
  - Warning: Yellow gradient (#ecc94b to #d69e2e)
  - Info: Blue gradient (#63b3ed to #4299e1)
- **Icon**: Large, bold symbol (✓, ✕, ⚠, ℹ)
  - Font size: 32px (24px on mobile)
  - Color: White with subtle shadow

### 5. **Typography**
- **Title**:
  - Font: Georgia (serif) for professional look
  - Size: 1.5rem (1.25rem on mobile)
  - Color: #2d1b0f (dark brown)
  - Weight: 700 (bold)
  - Effect: Subtle embossed text shadow
  
- **Message**:
  - Size: 1rem (0.95rem on mobile)
  - Color: #4a3728 (medium brown)
  - Line height: 1.6 for readability
  - Opacity: 0.9

### 6. **Close Button**
- **Size**: 32px circle
- **Position**: Top-right corner (16px from edges)
- **Background**: Beige gradient (#e2d5c1 to #c9b89a)
- **Icon**: Bold ✕ symbol
- **Hover Effect**: Darker gradient and subtle press effect
- **Active Effect**: Inset shadow for pressed appearance

### 7. **Animations**

#### Entrance Animation
1. Initial state: opacity 0, scale 0.7, translateY -20px
2. Visible state: opacity 1, scale 1, translateY 0
3. Duration: 0.4s
4. Easing: cubic-bezier(0.34, 1.56, 0.64, 1) - bouncy effect

#### Exit Animation
1. Final state: opacity 0, scale 0.9, translateY 10px
2. Duration: 0.3s
3. Easing: ease-out

### 8. **Responsive Design**
- Mobile (< 768px):
  - Reduced padding (24px vs 32px)
  - Smaller icon circle (48px vs 64px)
  - Smaller icon (24px vs 32px)
  - Smaller title (1.25rem vs 1.5rem)
  - Smaller message (0.95rem vs 1rem)

## Usage Example

### Success Notification (Account Created)
```jsx
<Notification
  type="success"
  title="Account Created Successfully!"
  message="Your account has been created. Please log in to continue."
  onClose={() => navigate('/login')}
  duration={4000}
/>
```

### Visual Flow
1. **User submits registration form**
   - Form validates
   - API call succeeds
   
2. **Notification appears**
   - Dark overlay fades in (300ms)
   - Card scales up and fades in with bounce (400ms)
   - Shows green checkmark icon
   - Displays success message
   
3. **Auto-close timer starts**
   - Runs for 4 seconds
   - User can manually close anytime
   
4. **Notification closes**
   - Card scales down and fades out (300ms)
   - Overlay fades out
   - Callback triggers navigation to login page

## Design Principles Applied

1. **Skeuomorphism**: 
   - Realistic paper texture
   - Physical depth with shadows
   - 3D button effects
   
2. **Visual Hierarchy**:
   - Large, colorful icon draws attention
   - Bold title communicates main message
   - Secondary message provides context
   
3. **Accessibility**:
   - aria-label on close button
   - Sufficient color contrast
   - Clear focus states
   
4. **User Experience**:
   - Auto-close reduces interaction burden
   - Manual close option for user control
   - Smooth animations feel polished
   - Clear feedback on success

## Color Palette

### Success (Default for registration)
- Icon circle: Green (#38a169)
- Complements the warm brown/beige theme
- Conveys positive outcome

### Paper Background
- Cream (#faf8f2, #f5f0e6)
- Matches skeuomorphic design system
- Professional and elegant

### Text Colors
- Title: Dark brown (#2d1b0f)
- Message: Medium brown (#4a3728)
- Harmonizes with background

## Technical Implementation

### Component Props
- `type`: 'success' | 'error' | 'warning' | 'info'
- `title`: string (required)
- `message`: string (optional)
- `onClose`: function (optional callback)
- `duration`: number in ms (default: 5000, set to 0 to disable auto-close)

### State Management
- `isVisible`: Controls opacity and scale
- `isExiting`: Triggers exit animation

### Lifecycle
1. Component mounts
2. After 10ms: Entrance animation starts
3. After duration: Exit animation starts
4. After exit animation: onClose callback fires

## Browser Compatibility
- Modern browsers with CSS3 support
- Flexbox layout
- CSS transitions and transforms
- SVG noise texture filter

## Performance Considerations
- Lightweight (no external dependencies)
- Pure CSS animations (GPU accelerated)
- Minimal re-renders with useCallback
- Cleanup timers on unmount
