import { readFile } from 'fs';
import { readFile as readFilePromises } from 'fs/promises';

// Type definitions for better TypeScript support
type FileReadResultData = {
    success: true;
    data: string;
};

type FileReadResultError = {
    success: false;
    error: Error;
};

type FileReadResult = FileReadResultData | FileReadResultError;

type FileReadCallback = (result: FileReadResult) => void;

/**
 * Reads a file using promises with proper error handling
 * @param filePath - Path to the file to read
 * @returns Promise resolving to file content or rejecting with error
 */
async function readFileWithPromises(filePath: string): Promise<string> {
    try {
        console.log(`Reading file: ${filePath}`);
        const fileContent = await readFilePromises(filePath, 'utf-8');
        console.log(`Successfully read ${fileContent.length} characters from ${filePath}`);
        return fileContent;
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        throw error; // Re-throw to let caller handle it
    }
}

/**
 * Reads a file using callbacks with proper error handling
 * @param filePath - Path to the file to read
 * @param callback - Callback function to handle result
 */
function readFileWithCallbacks(filePath: string, callback: FileReadCallback): void {
    console.log(`Reading file with callback: ${filePath}`);

    readFile(filePath, 'utf-8', (error: NodeJS.ErrnoException | null, data: Buffer | string) => {
        if (error) {
            console.error(`Error reading file ${filePath}:`, error.message);
            callback({
                success: false,
                error: error
            });
        } else {
            const content = typeof data === 'string' ? data : data.toString('utf-8');
            console.log(`Successfully read ${content.length} characters from ${filePath}`);
            callback({
                success: true,
                data: content
            });
        }
    });
}

/**
 * Main async function demonstrating promise usage
 */
async function hello(): Promise<void> {
    try {
        const fileContent = await readFileWithPromises('./hello.txt');
        console.log('File content:', fileContent);

        // You can also process the content here
        const lines = fileContent.split('\n');
        console.log(`File has ${lines.length} lines`);

    } catch (error) {
        console.error('Failed to read file with promises:', error);
        // Handle the error appropriately - maybe show a user-friendly message
        console.log('Please check that hello.txt exists and is readable');
    }
}

/**
 * Alternative version using callbacks
 */
function helloWithCallbacks(): void {
    readFileWithCallbacks('./hello.txt', (result: FileReadResult) => {
        if (result.success) {
            console.log('File content (callback):', result.data);

            // Process the content
            const lines = result.data.split('\n');
            console.log(`File has ${lines.length} lines`);
        } else {
            console.error('Failed to read file with callbacks:', result.error.message);
            console.log('Please check that hello.txt exists and is readable');
        }
    });
}

/**
 * Advanced example: Reading multiple files with error handling
 */
async function readMultipleFiles(filePaths: string[]): Promise<{[key: string]: string | Error}> {
    const results: {[key: string]: string | Error} = {};

    // Use Promise.allSettled to handle partial failures
    const promises = filePaths.map(async (filePath) => {
        try {
            const content = await readFileWithPromises(filePath);
            results[filePath] = content;
        } catch (error) {
            results[filePath] = error as Error;
        }
    });

    await Promise.allSettled(promises);
    return results;
}

// Usage examples
async function main(): Promise<void> {
    console.log('=== Promise-based approach ===');
    await hello();

    console.log('\n=== Callback-based approach ===');
    helloWithCallbacks();

    console.log('\n=== Multiple files approach ===');
    const fileResults = await readMultipleFiles(['./hello.txt', './nonexistent.txt']);
    for (const [filePath, result] of Object.entries(fileResults)) {
        if (result instanceof Error) {
            console.log(`${filePath}: Failed - ${result.message}`);
        } else {
            console.log(`${filePath}: Success - ${result.length} chars`);
        }
    }
}

// Export functions for use in other modules
export {
    readFileWithPromises,
    readFileWithCallbacks,
    readMultipleFiles,
    FileReadResult,
    FileReadCallback
};

// Uncomment the line below to run this file directly with: npx ts-node promises.ts
// main().catch(console.error);

// Example usage:
// 1. Compile to JavaScript: npx tsc promises.ts
// 2. Run: node promises.js
//
// Or run directly with ts-node:
// npx ts-node promises.ts

