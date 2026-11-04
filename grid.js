import { initializeGrid, resizeGrid, getNextFrame, toggleFire, toggleWindDirection } from './fire.js';
const SAMPLE = "0000000000";
function getElement(id) {
    const el = document.getElementById(id);
    if (!el) {
        throw new Error(`Element with id "${id}" not found`);
    }
    return el;
}
function measureCell(grid) {
    const probe = document.createElement("span");
    probe.textContent = SAMPLE;
    grid.appendChild(probe);
    const width = probe.getBoundingClientRect().width / SAMPLE.length;
    grid.removeChild(probe);
    const height = parseFloat(getComputedStyle(grid).lineHeight);
    return { width, height };
}
function calculateSize(grid) {
    const cell = measureCell(grid);
    return {
        cols: Math.floor(grid.clientWidth / cell.width),
        rows: Math.floor(grid.clientHeight / cell.height),
    };
}
function render() {
    divDisplayGrid.innerHTML = getNextFrame();
}
let gridInitialized = false;
function gridResize() {
    //const grid = getGrid();
    const { cols, rows } = calculateSize(divDisplayGrid);
    if (gridInitialized) {
        console.log("Resizing grid...");
        resizeGrid(cols, rows);
    }
    else {
        console.log("Initializing grid...");
        initializeGrid(rows, cols);
        gridInitialized = true;
    }
}
const REFRESH_FPS = 10;
const SECOND_IN_MS = 1000;
const divDisplayGrid = getElement('divDisplayGrid');
const btnToggleFire = getElement('btnToggleFire');
const btnToggleWind = getElement('btnToggleWind');
function main() {
    // gridResize();
    // Resize the grid gets called automatically
    window.addEventListener("resize", gridResize);
    if (btnToggleFire) {
        btnToggleFire.addEventListener('click', toggleFire);
    }
    if (btnToggleWind) {
        btnToggleWind.addEventListener('click', toggleWindDirection);
    }
    let timeInMS = SECOND_IN_MS / REFRESH_FPS;
    if (timeInMS < 10) {
        timeInMS = 10; // Minimum interval of 10ms to avoid overwhelming the browser
    }
    setInterval(render, timeInMS);
}
main();
//# sourceMappingURL=grid.js.map