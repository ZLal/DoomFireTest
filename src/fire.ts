
enum WindDirections {
  None,    // 0
  Left,    // 1
  Right    // 2
}

let gridRow = 0;
let gridCol = 0;
let grid: number[][] = [];
let isFireActive = true;
let windDirection: WindDirections = WindDirections.None;
let fireIntensityDropRate = 1; // Current fire intensity value
let debugMode = false; // Debug mode flag
const minFireIntensity = 0; // Minimum fire intensity value
const maxFireIntensity = 36; // Maximum fire intensity value

export function toggleFire(): void {
    isFireActive = !isFireActive;
}

export function setDebugMode(enabled: boolean): void {
    debugMode = enabled;
}

export function setWindDirection(direction: WindDirections): void {
    windDirection = direction;
}

export function toggleWindDirection(): void {
    let currentDirection: number = windDirection;
    currentDirection = (currentDirection + 1) % 3; // Cycle through None, Left, Right
    windDirection = currentDirection as WindDirections;
    if (debugMode) {
        console.log(`Wind direction changed to: ${WindDirections[windDirection]}`);
    }
}

function updateFireIntensityDropRate(): void {
    if (debugMode) {
        console.log("Updating fire intensity drop rate...");
    }
    let oneFourthOfRows = Math.floor(gridRow / 6);
    if (oneFourthOfRows < 1) {
        oneFourthOfRows = 1; // Ensure at least 1
    }
    fireIntensityDropRate = Math.ceil(maxFireIntensity / (oneFourthOfRows * 5));
    if (debugMode) {
        console.log(`Grid rows: ${gridRow}, Fire intensity drop rate: ${fireIntensityDropRate}`);
    }
}

export function initializeGrid(rows: number, cols: number): void {
    if (debugMode) {
        console.log(`Initializing grid with rows: ${rows}, cols: ${cols}`);
    }
    gridRow = rows;
    gridCol = cols;
    grid = new Array(rows);
    for (let row = 0; row < rows; row++) {
        grid[row] = new Array(cols).fill(0);
    }
    updateFireIntensityDropRate();
}

export function resizeGrid(cols: number, rows: number): void {
    if (debugMode) {
        console.log(`Resizing grid to rows: ${rows}, cols: ${cols}`);
    }
    if (rows === gridRow && cols === gridCol) {
        return;
    }
    let newGrid: number[][] = new Array(rows);
    for (let row = rows; row >= 0; row--) {
        let newRow: number[] = [];
        for (let col = 0; col < cols; col++) {
            newRow.push(grid[row]?.[col] ?? 0);
        }
        newGrid[row] = newRow;
    }
    gridRow = rows;
    gridCol = cols;
    grid = newGrid;
    updateFireIntensityDropRate();
}

function shiftGridUp(): void {
    grid.shift();
    let newRow: number[];
    if (!isFireActive) {
        newRow = new Array(gridCol).fill(minFireIntensity);
    }
    else {
        newRow = [];
        for (let col = 0; col < gridCol; col++) {
            newRow.push(maxFireIntensity);
        }
    }
    grid.push(newRow);
}

function updateDraft(): void {
    if (debugMode) {
        console.log("Updating draft...");
    }
    for (let row = 0; row < gridRow - 1; row++) {
        for (let col = 0; col < gridCol; col++) {
            let windEffect = Math.floor(Math.random() * 3); // Randomly 0, 1 or 2
            // Wind effect 2/3 chance to reduce intensity
            if (windEffect < 2 || grid[row]![col]! == maxFireIntensity) {
                if (grid[row]![col]! - fireIntensityDropRate <= minFireIntensity) {
                    grid[row]![col] = minFireIntensity;
                }
                else {
                    grid[row]![col] = grid[row]![col]! - fireIntensityDropRate;
                }
            }
        }
    }
}

function updateWind(): void {
    if (windDirection === WindDirections.None) return;
    if (debugMode) {
        console.log("Updating wind...");
    }
    for (let row = 0; row < gridRow - 1; row++) {
        if (windDirection === WindDirections.Left) {
            for (let col = 0; col < gridCol; col++) {
                let windEffect = Math.floor(Math.random() * 3); // Randomly 0, 1 or 2
                if (windEffect == 2) { // 1/3 chance to shift left
                    if (col === gridCol - 1) {
                        grid[row]![col] = minFireIntensity; // Set to minimum intensity if at the right edge
                    }
                    else {
                        grid[row]![col] = grid[row]![col + 1]!
                    }
                }
            }
        }
        if (windDirection === WindDirections.Right) {
            for (let col = gridCol - 1; col >= 0; col--) {
                let windEffect = Math.floor(Math.random() * 3); // Randomly 0, 1 or 2
                if (windEffect == 2) { // 1/3 chance to shift left
                    if (col === 0) {
                        grid[row]![col] = minFireIntensity; // Set to minimum intensity if at the left edge
                    }
                    else {
                        grid[row]![col] = grid[row]![col - 1]!
                    }
                }
            }
        }
    }
}

function updateFire(): void {
    if (debugMode) {
        console.log("Updating fire...");
    }
    shiftGridUp();
    updateDraft();
    updateWind();
}

function getTextChar(fireIntensity: number): string {
    let blockNo: number = Math.ceil((fireIntensity / maxFireIntensity) * 10);
    if (fireIntensity == maxFireIntensity) {
        return "<span style=\"color: #ffffff;\">█</span>";
    }
    switch (blockNo) {
        case 0: return " ";

        case 1: return "<span style=\"color: #750000;\">.</span>";
        case 2: return "<span style=\"color: #ad0303;\">:</span>";

        case 3: return "<span style=\"color: #ad0303;\">░</span>";
        case 4: return "<span style=\"color: #de0202;\">░</span>";
        case 5: return "<span style=\"color: #ffa200;\">░</span>";

        case 6: return "<span style=\"color: #ffa200;\">▒</span>";
        case 7: return "<span style=\"color: #ffa200;\">▒</span>";
        case 8: return "<span style=\"color: #ffff00;\">▒</span>";

        case 9: return "<span style=\"color: #ffff00;\">▓</span>";
        case 10: return "<span style=\"color: #fafaa0;\">▓</span>";
        default: return "?";
    }
}

function getTextGrid(): string {
    if (debugMode) {
        console.log("Generating text grid...");
    }
    const lines: string[] = [];
    for (let row = 0; row < gridRow; row++) {
        let line = "";
        for (let col = 0; col < gridCol; col++) {
            line += getTextChar(grid[row]![col]!);
        }
        lines.push(line);
    }
    return lines.join("\n");
}

export function getNextFrame(): string {
    if (debugMode) {
        console.log("Getting next frame...");
    }
    updateFire();
    return getTextGrid();
}
