# Canvas Unlimited – Study Notes

## Project overview
Canvas Unlimited is a small browser-based drawing playground built as a static website with plain HTML, CSS, and JavaScript. The core interaction model is text-based drawing: users enter text, then place or paint that text onto the page with clicks and mouse movement.

## File-level structure
- `index.html`: Declares the UI controls (text GUI, background color controls, upload/remove/save/clear buttons) and includes all scripts.
- `style.css`: Styles fixed-position controls, the floating text GUI, and basic mobile responsive behavior.
- `script.js`: Main drawing workflow (text submission, click-to-place, drag-to-draw, undo, clear, GUI movement, export-to-PNG logic).
- `upload.js`: Image upload flow and image placement/removal behavior.
- `background.js`: Background color picker toggle and body background update behavior.

## Runtime behavior
1. User opens “Text Art” GUI and submits text.
2. GUI closes; clicks place centered text labels at cursor position.
3. Mouse drag creates repeated text elements while held down.
4. User can adjust text color, font, and size before placement.
5. Ctrl+Z (or mobile undo button) removes latest text element.
6. Save exports a cropped PNG around all drawn text and uploaded images.

## Key implementation notes
- Drawn text is represented as absolutely positioned DOM elements (`.pasted-text`) rather than canvas primitives.
- Save uses an offscreen `<canvas>` to re-render visible text and images into a downloadable PNG.
- Image removal currently targets all `<img>` tags in the document, which includes non-canvas UI images/icons.
- Background script references `isDrawing` from `script.js` as a global side effect.

## Risks and improvement opportunities
- **Global coupling**: `background.js` depends on state from `script.js`.
- **Element targeting**: Removing all `img` tags can unintentionally delete non-user assets.
- **Input typo**: `bolor-picker` id appears to be an accidental misspelling.
- **No build/test pipeline**: Repo is currently static with no automated validation.

## Suggested next steps
- Scope uploaded images under a dedicated class/container and remove only those.
- Introduce lightweight modularization (or ES modules) to reduce global state coupling.
- Add simple smoke tests (Playwright or Cypress) for core interactions.
- Align naming (`bolor-picker` -> `color-picker`) and clean minor UI positioning constants.
