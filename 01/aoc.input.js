import * as path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

async function readIfExists(path) {
    try {
        await fs.access(path);
        return await fs.readFile(path, 'utf8'); // Top level await!? Coool...
    } catch {
        return '';
    }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let fileName = 'tinput.txt';
let filePath = path.resolve(__dirname, fileName);
export const tinput = await readIfExists(filePath);

fileName = 'input.txt';
filePath = path.resolve(__dirname, fileName);
export const input = await readIfExists(filePath);
