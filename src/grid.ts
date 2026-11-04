import { initializeGrid, resizeGrid, getNextFrame, toggleFire, toggleWindDirection } from './fire.js';

const SAMPLE = "0000000000";

function getElement<T extends HTMLElement>(id: string): T {
    const el = document.getElementById(id);
    if (!el) {
        throw new Error(`Element with id "${id}" not found`);
    }
    return el as T;
}

function measureCell(grid: HTMLDivElement): { width: number; height: number } {
    const probe = document.createElement("span");
    probe.textContent = SAMPLE;
    grid.appendChild(probe);
    const width = probe.getBoundingClientRect().width / SAMPLE.length;
    grid.removeChild(probe);

    const height = parseFloat(getComputedStyle(grid).lineHeight);
    return { width, height };
}

function calculateSize(grid: HTMLDivElement): { cols: number; rows: number } {
    const cell = measureCell(grid);
    return {
        cols: Math.floor(grid.clientWidth / cell.width),
        rows: Math.floor(grid.clientHeight / cell.height),
    };
}

function render(): void {
    divDisplayGrid.innerHTML = getNextFrame();
}

let gridInitialized = false;
function gridResize(): void {
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
const divDisplayGrid = getElement<HTMLDivElement>('divDisplayGrid');
const btnToggleFire = getElement<HTMLButtonElement>('btnToggleFire');
const btnToggleWind = getElement<HTMLButtonElement>('btnToggleWind');

function main(): void {
    // gridResize();
    // Resize the grid gets called automatically
    window.addEventListener("resize", gridResize);
    if (btnToggleFire) {
        btnToggleFire.addEventListener('click', toggleFire);
    }
    if (btnToggleWind) {
        btnToggleWind.addEventListener('click', toggleWindDirection);
    }

    let timeInMS: number = SECOND_IN_MS / REFRESH_FPS;
    if (timeInMS < 10) {
        timeInMS = 10; // Minimum interval of 10ms to avoid overwhelming the browser
    }
    setInterval(render, timeInMS);
}

main();
