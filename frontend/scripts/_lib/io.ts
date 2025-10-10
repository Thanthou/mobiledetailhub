/**
 * Shared I/O Utilities for Scripts
 * Centralized file reading, writing, and directory operations
 */

import fs from 'fs';
import { glob } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Read JSON file with error handling
 */
export function readJson(filePath: string): unknown {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content) as unknown;
  } catch (error) {
    console.error(`Failed to read JSON file: ${filePath}`, error);
    return null;
  }
}

/**
 * Write JSON file with pretty formatting
 */
export function writeJson(filePath: string, data: unknown, pretty: boolean = true): boolean {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const content = pretty 
      ? JSON.stringify(data, null, 2)
      : JSON.stringify(data);
    
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    console.error(`Failed to write JSON file: ${filePath}`, error);
    return false;
  }
}

/**
 * Read text file
 */
export function readFile(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Failed to read file: ${filePath}`, error);
    return null;
  }
}

/**
 * Write text file
 */
export function writeFile(filePath: string, content: string): boolean {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    console.error(`Failed to write file: ${filePath}`, error);
    return false;
  }
}

/**
 * Find files matching a pattern using glob
 */
export async function findFiles(pattern: string, options: { cwd?: string } = {}): Promise<string[]> {
  try {
    return await glob(pattern, {
      cwd: options.cwd || process.cwd(),
      absolute: true,
    });
  } catch (error) {
    console.error(`Failed to find files: ${pattern}`, error);
    return [];
  }
}

/**
 * Synchronous file finder
 */
export function findFilesSync(pattern: string, options: { cwd?: string } = {}): string[] {
  try {
    return glob.sync(pattern, {
      cwd: options.cwd || process.cwd(),
      absolute: true,
    });
  } catch (error) {
    console.error(`Failed to find files: ${pattern}`, error);
    return [];
  }
}

/**
 * Walk directory recursively
 */
export function* walkDirectory(dir: string, filter?: (file: string) => boolean): Generator<string> {
  if (!fs.existsSync(dir)) {
    return;
  }
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      yield* walkDirectory(fullPath, filter);
    } else if (!filter || filter(fullPath)) {
      yield fullPath;
    }
  }
}

/**
 * Load all JSON files from a directory
 */
export function loadJsonFiles(dir: string, options: {
  recursive?: boolean;
  filter?: (filename: string) => boolean;
} = {}): Array<{ path: string; data: unknown; filename: string }> {
  const { recursive = true, filter } = options;
  const results: Array<{ path: string; data: unknown; filename: string }> = [];
  
  if (!fs.existsSync(dir)) {
    return results;
  }
  
  const walker = recursive 
    ? walkDirectory(dir, (f) => f.endsWith('.json') && (!filter || filter(f)))
    : fs.readdirSync(dir)
        .filter(f => f.endsWith('.json') && (!filter || filter(f)))
        .map(f => path.join(dir, f));
  
  for (const filePath of walker) {
    const data = readJson(filePath);
    if (data) {
      results.push({
        path: filePath,
        data,
        filename: path.basename(filePath),
      });
    }
  }
  
  return results;
}

/**
 * Get script directory helper (for __dirname in ESM)
 */
export function getScriptDir(importMetaUrl: string): string {
  const filename = fileURLToPath(importMetaUrl);
  return path.dirname(filename);
}

/**
 * Resolve path relative to project root
 */
export function resolveFromRoot(...paths: string[]): string {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const root = path.resolve(scriptDir, '../../..');
  return path.resolve(root, ...paths);
}

/**
 * Check if file exists
 */
export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

/**
 * Ensure directory exists
 */
export function ensureDir(dirPath: string): boolean {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    return true;
  } catch (error) {
    console.error(`Failed to create directory: ${dirPath}`, error);
    return false;
  }
}

