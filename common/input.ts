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

//const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const tinput = async (dirname:string)=> await readIfExists(path.resolve(dirname, 'tinput.txt'));
export const input = async (dirname:string)=> await readIfExists(path.resolve(dirname, 'input.txt'));
