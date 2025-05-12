## Theming - Agregore Browser

Agregore provides CSS variables for themeing the browser at the URL `agregore://theme/vars.css`.

The contents of this look something like:

```css
:root {
  --ag-color-purple: #6e2de5;
  --ag-color-black: #111;
  --ag-color-white: #f2f2f2;
  --ag-color-green: #2de56e;
}

:root {
  --ag-theme-font-family: system-ui;
  --ag-theme-background: var(--ag-color-black);
  --ag-theme-text: var(--ag-color-white);
  --ag-theme-primary: var(--ag-color-purple);
  --ag-theme-secondary: var(--ag-color-green);
}
```

These can be imported anywhere you'd like to use browser styling.

Specifically, you should try to use the `--ag-theme-*` variables for the page when possible.

You can also make use of the `agregore://theme/style.css` which adds some default styling to stuff like headers, the background/text colors, and links.

This is useful for styling markdown pages or other pages with basic HTML. You probably shouldn't include this if you're doing something fancy with styling as the styles may change over time.

The style includes a class called `agregore-header-anchor` which can be used on anchors within headers for linking to headings. Checkout the markdown extension

### Customization

The `--ag-theme-*` variables can me modified in the `.agregorerc` file by clicking `Help > Edit Configuration File` and adding the following content:

```javascript
  {
    "theme": {
      "font-family": "system-ui",
      "background": "var(--ag-color-black)",
      "text": "var(--ag-color-white)",
      "primary": "var(--ag-color-purple)",
      "secondary": "var(--ag-color-green)"
    }
  }
```

You can replace the various values with any valid CSS values like Hex codes: `#FFAABB`, or `rgb()`.

More styles will be added here as needed. If you feel we should standardize on some sort of style, feel free to open an issue talking about what it is and why it should be added.

## Syntax Highlighting Font

Agregore now uses a custom font for syntax highlighting in code blocks. The font file is located at `browser://theme/FontWithASyntaxHighlighter-Regular.woff2`.

To use this font for `code` elements, you can include the following CSS in your stylesheet:

```css
@font-face {
  font-family: "FontWithASyntaxHighlighter";
  src: url("browser://theme/FontWithASyntaxHighlighter-Regular.woff2") format("woff2");
}

code {
  font-family: "FontWithASyntaxHighlighter", monospace;
}
```

This font provides built-in syntax highlighting for code blocks, making it easier to read and understand code snippets.

## Theme Protocol (`browser://theme/`)

### Overview

The `browser://theme/` protocol provides a standardized way for web applications to access browser-level CSS styles and theme variables in Agregore and other compatible browsers, such as [Peersky](https://peersky.p2plabs.xyz/). This protocol ensures consistent theming across different browsers by serving CSS files with a common set of variables. It allows developers to build applications that adapt to the browser's theme without needing browser-specific code, making it suitable for any browser that implements the protocol.

## Purpose

The goal of the `browser://theme/` protocol is to:

- Enable cross-browser compatibility for theming in any browser, including p2p browsers like Peersky and Agregore.
- Provide a unified set of theme variables using standardized `--browser-theme-` prefixes.
- Allow web applications to import styles or variables without hardcoding browser-specific protocols (e.g., `peersky://` or `agregore://`).

## Implementation

### Protocol Handler

The `browser://theme/` protocol is implemented in Peersky via a custom Electron protocol handler (`theme-handler.js`). It serves CSS files from the `src/pages/theme/` directory when requests are made to URLs like `browser://theme/vars.css` or `browser://theme/base.css`.

- **Location**: Files are stored in `src/pages/theme/` (e.g., `vars.css`, `base.css`, `index.css`).
- **URL Structure**: Requests to `browser://theme/<filename>` map to `src/pages/theme/<filename>`.
- **Example**: `browser://theme/vars.css` serves `src/pages/theme/vars.css`.

### Theme Variable Standardization

The `browser://theme/` protocol provides standardized theme variables prefixed with `--browser-theme-`, such as `--browser-theme-font-family`, `--browser-theme-background`, `--browser-theme-text-color`, `--browser-theme-primary-highlight`, and `--browser-theme-secondary-highlight`. These variables allow web applications to adapt to the host browser's theme without needing browser-specific code.

Each browser implements these standardized variables by mapping them to their internal theme variables. For example:

- In Peersky, `--browser-theme-background` is mapped to `--base01`, which is part of the Base16 color palette [Base16 Framework](https://github.com/chriskempson/base16).
- In Agregore, `--browser-theme-background` is mapped to `--ag-theme-background`, which is defined in Agregore's theme configuration.

This ensures that applications built for one browser can work seamlessly in another, as long as they use the standardized `--browser-theme-` variables.

### Cross-Browser Compatibility

The `browser://theme/` protocol enables apps built for one browser to work seamlessly in another by providing standardized theme variables prefixed with `--browser-theme-`. These variables are mapped to each browser's internal theme variables, ensuring consistent theming across different browsers.

For example:

- In Peersky, `--browser-theme-background` is mapped to `--base01`, which is part of the Base16 color palette.
- In Agregore, `--browser-theme-background` is mapped to `--ag-theme-background`, which is defined in Agregore's theme configuration.

As a result, an app using `--browser-theme-background` will render with the appropriate background color for each browser, whether it's based on Base16 (as in Peersky) or another theme system (as in Agregore).

Additionally, apps can use the full set of variables provided by each browser for more advanced theming, but for cross-browser compatibility, it's recommended to use the standardized `--browser-theme-` variables.

## Usage

### Importing Theme Styles

Web applications can import theme styles or variables using `<style>` tags or `<link>` elements. Examples:

- **Import Variables**:

  ```html
  <style>
    @import url("browser://theme/vars.css");
    body {
      background-color: var(--browser-theme-background);
      color: var(--browser-theme-text-color);
    }
  </style>
  ```

- **Import Default Styles**:

  ```html
  <link rel="stylesheet" href="browser://theme/style.css" />
  ```

- **Use Peersky Variables in Agregore**:
  ```html
  <style>
    @import url("browser://theme/vars.css");
    body {
      background-color: var(
        --browser-theme-background); /* Maps to --ag-theme-background in Agregore */
    }
  </style>
  ```

---

[Back](/)
