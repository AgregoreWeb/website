import { $, loadingSpinner, backdrop, iframe } from './common.js'; // Import common functions

// Get the code editor elements
document.addEventListener('DOMContentLoaded', () => {
    const htmlCode = document.getElementById('htmlCode');
    const javascriptCode = document.getElementById('javascriptCode');
    const cssCode = document.getElementById('cssCode');

    // Attach event listeners
    [htmlCode, javascriptCode, cssCode].forEach(element => {
        element.addEventListener('input', () => update());
    });
});

// Import CSS from Agregore theme to use in the iframe preview
export let basicCSS = `
@import url("agregore://theme/vars.css");
            body, * {
                font-size: 1.2rem;
                margin: 0;
                padding: 0;
                font-family: var(--ag-theme-font-family);
                background: var(--ag-theme-background);
                color: var(--ag-theme-text);
            }
`;

//Function for live Rendering
export function update() {
    let htmlCode = $('#htmlCode').value;
    console.log('HTML Code:', htmlCode);
    let cssCode = $('#cssCode').value;
    console.log('CSS Code:', cssCode);
    let javascriptCode = $('#javascriptCode').value;
    console.log('JavaScript Code:', javascriptCode);
    // Assemble all elements and Include the basic CSS from Agregore theme
    let iframeContent = `
    <style>${basicCSS}</style>
    <style>${cssCode}</style>
    <script>${javascriptCode}</script>
    ${htmlCode}
    `;
    
    let iframeDoc = iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(iframeContent);
    iframeDoc.close();
}


// Show or hide the loading spinner
export function showSpinner(show) {
    backdrop.style.display = show ? 'block' : 'none';
    loadingSpinner.style.display = show ? 'block' : 'none';
}