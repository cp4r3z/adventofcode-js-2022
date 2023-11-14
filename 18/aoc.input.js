import * as path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

async function readIfExists(path) {
    try {
        await fs.access(path);
        const original = await fs.readFile(path, 'utf8');
        const sanitized = original
        .trim()
        .replaceAll('\r', '');
        return sanitized;
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
