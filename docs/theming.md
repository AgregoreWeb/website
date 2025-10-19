## Theming - Agregore Browser

## For Users

Webapps made for Agregore (and Persky) use a standard for pulling styles controlled by thr browser itself.
This lets users customize the look and feel of not just thr browser but also all the apps.
You can customize it by visiting agregore://settings/theme and messing with the color pickers.

### Sharing

You can also share any themes you made by copying the JSON somewhere (in the popup opened by the ? button in the top right), or load a theme by pasing the JSON text anywhere in the theme editor page.

If you have a cool theme you'd like to share with others, please add it [to the website](https://github.com/AgregoreWeb/website/edit/main/docs/theming.md).

### Theme Examples

Here are some example themes you can try out:

#### Agregore - Dark

```
{
  "theme": {
    "font-family": "system-ui",
    "background": "#111111",
    "text": "#f2f2f2",
    "page": "#111111",
    "primary": "#6e2de5",
    "secondary": "#2de56e",
    "border-radius": "0.25em"
  }
}
```

#### Agregore - Light

```
{
  "theme": {
    "font-family": "system-ui",
    "background": "#f2f2f2",
    "text": "#111111",
    "page": "#f2f2f2",
    "primary": "#6e2de5",
    "secondary": "#2de56e",
    "border-radius": "0.25em"
  }
}
```

#### Clown Theme

(Warning this will make your eyes bleed)

```
{
  "theme": {
    "font-family": "Arial",
    "background": "#0000ff",
    "text": "#00ff00",
    "page": "#ff0000",
    "primary": "#ffff00",
    "secondary": "#ffffff",
    "border-radius": "1em"
  }
}
```

## For Developers

### Theme Protocol (`browser://theme/`)

The `browser://theme/` protocol provides a standardized way for web applications to access browser-level CSS styles and theme variables in Agregore and other compatible browsers, such as [Peersky](https://peersky.p2plabs.xyz/). This protocol ensures consistent theming across different browsers by serving CSS files with a common set of variables. It allows developers to build applications that adapt to the browser's theme without needing browser-specific code, making it suitable for any browser that implements the protocol.

#### Purpose

The goal of the `browser://theme/` protocol is to:

- Enable cross-browser compatibility for theming in any browser, including p2p browsers like Peersky and Agregore.
- Provide a unified set of theme variables using standardized `--browser-theme-` prefixes.
- Allow web applications to import styles or variables without hardcoding browser-specific protocols (e.g., `peersky://` or `agregore://`).

#### Protocol Handler

The `browser://theme/` protocol is implemented in Peersky via a custom Electron protocol handler (`theme-handler.js`). It serves CSS files from the `src/pages/theme/` directory when requests are made to URLs like `browser://theme/vars.css` or `browser://theme/base.css`.

- **Location**: Files are stored in `src/pages/theme/` (e.g., `vars.css`, `base.css`, `index.css`).
- **URL Structure**: Requests to `browser://theme/<filename>` map to `src/pages/theme/<filename>`.
- **Example**: `browser://theme/vars.css` serves `src/pages/theme/vars.css`.

#### Theme Variable Standardization

The `browser://theme/` protocol provides standardized theme variables prefixed with `--browser-theme-`, such as `--browser-theme-font-family`, `--browser-theme-background`, `--browser-theme-text-color`, `--browser-theme-primary-highlight`, and `--browser-theme-secondary-highlight`. These variables allow web applications to adapt to the host browser's theme without needing browser-specific code.

Each browser implements these standardized variables by mapping them to their internal theme variables.

This ensures that applications built for one browser can work seamlessly in another, as long as they use the standardized `--browser-theme-` variables.

The list of know browser variables is as follows:

```
--browser-theme-font-family: The font to use for the entire page
--browser-theme-text-color: Text color to use for the entire page
--browser-theme-page-background: Background for the page itself
--browser-theme-background: Background to use for boxes like inputs and dialogs
--browser-theme-primary-highlight: Primary highlight color, used for code blocks, buttons, etc
--browser-theme-secondary-highlight: Secondary highlight color, for selected text, borders
--browser-theme-border-radius: Border radius applied to boxes like buttons or fieldsets
--browser-theme-border-color: Color of borders, defaults to secondary highlight
```

#### Importing Theme Styles

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

Use this if you want full control over the page's style but want to respect some user preferences

- **Import Default Styles**:

```html
<link rel="stylesheet" href="browser://theme/style.css" />
```

Use this if you want the default style for the page / buttons / etc. You can then focus more on the general structure of the page and leave the styling details to the browser.

#### Cross-Browser Compatibility

The `browser://theme/` protocol enables apps built for one browser to work seamlessly in another by providing standardized theme variables prefixed with `--browser-theme-`. These variables are mapped to each browser's internal theme variables, ensuring consistent theming across different browsers.

For example:

- In Peersky, `--browser-theme-background` is mapped to `--base01`, which is part of the Base16 color palette.
- In Agregore, `--browser-theme-background` is mapped to `--ag-theme-background`, which is defined in Agregore's theme configuration.

As a result, an app using `--browser-theme-background` will render with the appropriate background color for each browser, whether it's based on Base16 (as in Peersky) or another theme system (as in Agregore).

Additionally, apps can use the full set of variables provided by each browser for more advanced theming, but for cross-browser compatibility, it's recommended to use the standardized `--browser-theme-` variables.

### Customization

The `--browser-theme-*` variables can me modified in the `.agregorerc` file by clicking `Help > Edit Configuration File` and adding the following content:

```json
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

---

[Back](/)
