import { $, loadingSpinner, backdrop, iframe } from './common.js'; // Import common functions

// Get the code editor elements
document.addEventListener('DOMContentLoaded', () => {
    const htmlCode = document.getElementById('htmlCode');
    const javascriptCode = document.getElementById('javascriptCode');
    const cssCode = document.getElementById('cssCode');

    // Attach event listeners
    [htmlCode, javascriptCode, cssCode].forEach(element => {
        element.addEventListener('keydown', handleKeyDown);
        element.addEventListener('input', () => update(0));
    });
});

// Handle tab key press
function handleKeyDown(event) {
    if (event.keyCode === 9) {  // Tab key
        var v = this.value;
        var s = this.selectionStart;
        var e = this.selectionEnd;
        this.value = v.substring(0, s) + '\t' + v.substring(e);
        this.selectionStart = this.selectionEnd = s + 1;
        return false;
    }
    if (event.keyCode === 8) {  // Backspace key
        update(1);
    }
}

// Import CSS from Agregore theme
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




var j=0;

//Function for live Rendering
export function update(i) {
    if(i==0){
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

    else if(i==1){

        let htmlCode=document.getElementById("htmlCode").value;
        let html=htmlCode.slice(0,htmlCode.length);
        document.getElementById("htmlCode").value=html;
        j=1;

    }
}

// Show or hide the loading spinner
export function showSpinner(show) {
    backdrop.style.display = show ? 'block' : 'none';
    loadingSpinner.style.display = show ? 'block' : 'none';
}