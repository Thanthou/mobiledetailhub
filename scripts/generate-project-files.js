const fs = require('fs');
const path = require('path');

// Directories and file types to ignore
const IGNORE_DIRS = [
    'node_modules',
    'dist', 'build', '.next', '.nuxt', 'out',
    '.cache', '.parcel-cache', 'coverage',
    '.git', '.github', '.vscode', '.idea',
    'public', 'assets', 'images', 'videos', 'media', 'uploads',
    '.vite', 'out', 'build', 'dist'
];

// File extensions to process (only text-based files)
const ALLOWED_EXTENSIONS = [
    '.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.txt', '.css', '.scss', '.html', '.xml',
    '.sql', '.sh', '.bat', '.ps1', '.yml', '.yaml', '.toml', '.ini', '.cfg', '.conf'
];

// File extensions to ignore
const IGNORE_EXTENSIONS = [
    '.map', '.bundle', '.egg-info', '.pyc',
    '.key', '.pem', '.crt', '.log', '.lcov',
    '.exe', '.dll', '.so', '.dylib',
    '.zip', '.tar', '.gz', '.7z', '.rar', '.bz2',
    // Image files
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp', '.bmp', '.tiff', '.tif',
    '.heic', '.heif', '.avif', '.jxl', '.jp2', '.j2k',
    // Video files
    '.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.webm', '.m4v', '.3gp', '.ogv',
    '.mts', '.m2ts', '.ts', '.vob', '.asf', '.rm', '.rmvb', '.divx', '.xvid',
    // Audio files
    '.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma', '.m4a', '.opus', '.amr',
    // Document files
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
    // Font files
    '.woff', '.woff2', '.ttf', '.eot', '.otf', '.fnt',
    // Archive and binary files
    '.bin', '.dat', '.db', '.sqlite', '.sqlite3',
    // Additional problematic files
    '.lock', '.min.js', '.min.css', '.bundle.js', '.chunk.js'
];

// Files to ignore
const IGNORE_FILES = [
    '.env', '.env.local', '.env.*',
    'secrets.json', '.DS_Store', 'Thumbs.db',
    '.gitignore', '.gitattributes',
    '*.swp', '*.swo', '*.tmp', '*.temp',
    // Lockfiles (too big, auto-generated)
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
    // Auto-generated reports
    'CODEBASE_OVERVIEW.json', 'CODEBASE_OVERVIEW.md',
    // Build and cache files
    '.vite', '.cache', 'dist', 'build', 'out'
];

// Maximum file size to process (500KB - more restrictive since we're being selective)
const MAX_FILE_SIZE = 500 * 1024;

function shouldIgnoreFile(filePath, fileName) {
    // Check if directory should be ignored (including subdirectories)
    const dirParts = filePath.split(path.sep);
    if (dirParts.some(part => IGNORE_DIRS.includes(part))) {
        return true;
    }
    
    // Check if file extension should be ignored
    const ext = path.extname(fileName).toLowerCase();
    if (IGNORE_EXTENSIONS.includes(ext)) {
        return true;
    }
    
    // Check if specific filename should be ignored
    if (IGNORE_FILES.some(pattern => {
        if (pattern.includes('*')) {
            const regex = new RegExp(pattern.replace(/\*/g, '.*'));
            return regex.test(fileName);
        }
        return fileName === pattern;
    })) {
        return true;
    }
    
    // Only process allowed file extensions
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return true;
    }
    
    // Additional safety check for common media file patterns
    const lowerFileName = fileName.toLowerCase();
    if (lowerFileName.includes('image') || lowerFileName.includes('video') || 
        lowerFileName.includes('media') || lowerFileName.includes('asset') ||
        lowerFileName.includes('hero') || lowerFileName.includes('brand') ||
        lowerFileName.includes('logo') || lowerFileName.includes('icon')) {
        return true;
    }
    
    // Skip files that are likely auto-generated or build artifacts
    if (lowerFileName.includes('bundle') || lowerFileName.includes('chunk') ||
        lowerFileName.includes('vendor') || lowerFileName.includes('runtime') ||
        lowerFileName.includes('polyfill') || lowerFileName.includes('shim')) {
        return true;
    }
    
    return false;
}

function readFileContents(filePath) {
    try {
        const stats = fs.statSync(filePath);
        
        // Check file size
        if (stats.size > MAX_FILE_SIZE) {
            return `[File too large: ${(stats.size / 1024 / 1024).toFixed(2)}MB - Skipped]`;
        }
        
        // Try to read as text, fallback to binary check
        const buffer = fs.readFileSync(filePath);
        
        // Check if file is binary by looking for null bytes
        if (buffer.includes(0)) {
            return `[Binary file detected - Skipped]`;
        }
        
        return buffer.toString('utf8');
    } catch (error) {
        return `[Error reading file: ${error.message}]`;
    }
}

function processDirectory(dirPath, basePath = '') {
    const files = [];
    const fileStructure = {};
    let skippedCount = 0;
    
    try {
        const items = fs.readdirSync(dirPath);
        
        for (const item of items) {
            const fullPath = path.join(dirPath, item);
            const relativePath = path.join(basePath, item);
            
            // Skip hidden files and directories
            if (item.startsWith('.')) {
                skippedCount++;
                continue;
            }
            
            try {
                const stat = fs.statSync(fullPath);
                
                if (shouldIgnoreFile(fullPath, item)) {
                    skippedCount++;
                    continue;
                }
                
                if (stat.isDirectory()) {
                    const subResults = processDirectory(fullPath, relativePath);
                    files.push(...subResults.files);
                    Object.assign(fileStructure, subResults.fileStructure);
                } else {
                    files.push({
                        path: relativePath,
                        fullPath: fullPath,
                        content: readFileContents(fullPath)
                    });
                    fileStructure[item] = relativePath;
                }
            } catch (error) {
                console.log(`❌ Error processing ${fullPath}: ${error.message}`);
            }
        }
    } catch (error) {
        console.log(`❌ Error processing directory ${dirPath}: ${error.message}`);
    }
    
    return { files, fileStructure, skippedCount };
}

function generateBackendFile() {
    console.log('📁 Processing backend directory...');
    const backendPath = path.join(__dirname, '..', 'backend');
    const { files, skippedCount } = processDirectory(backendPath, 'backend');
    
    console.log(`📊 Found ${files.length} files to process (skipped ${skippedCount})`);
    
    let backendContent = 'BACKEND FILES CONTENT\n';
    backendContent += '='.repeat(50) + '\n\n';
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`📝 Processing ${i + 1}/${files.length}: ${file.path}`);
        
        backendContent += `FILE: ${file.path}\n`;
        backendContent += '-'.repeat(30) + '\n';
        backendContent += file.content;
        backendContent += '\n\n' + '='.repeat(50) + '\n\n';
    }
    
    return backendContent;
}

function generateFrontendFile() {
    console.log('📁 Processing frontend directory...');
    const frontendPath = path.join(__dirname, '..', 'frontend');
    const { files, skippedCount } = processDirectory(frontendPath, 'frontend');
    
    console.log(`📊 Found ${files.length} files to process (skipped ${skippedCount})`);
    
    let frontendContent = 'FRONTEND FILES CONTENT\n';
    frontendContent += '='.repeat(50) + '\n\n';
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`📝 Processing ${i + 1}/${files.length}: ${file.path}`);
        
        frontendContent += `FILE: ${file.path}\n`;
        frontendContent += '-'.repeat(30) + '\n';
        frontendContent += file.content;
        frontendContent += '\n\n' + '='.repeat(50) + '\n\n';
    }
    
    return frontendContent;
}

function generateFileStructure() {
    console.log('📁 Generating file structure...');
    const rootPath = path.join(__dirname, '..');
    const { fileStructure, skippedCount } = processDirectory(rootPath);
    
    console.log(`📊 File structure generated (skipped ${skippedCount} files/directories)`);
    return JSON.stringify(fileStructure, null, 2);
}

function generateRootFile() {
    console.log('📁 Processing root level files...');
    const rootPath = path.join(__dirname, '..');
    const items = fs.readdirSync(rootPath);
    
    let rootContent = 'ROOT LEVEL FILES CONTENT\n';
    rootContent += '='.repeat(50) + '\n\n';
    
    for (const item of items) {
        const fullPath = path.join(rootPath, item);
        
        if (shouldIgnoreFile(fullPath, item)) {
            continue;
        }
        
        const stat = fs.statSync(fullPath);
        if (stat.isFile()) {
            rootContent += `FILE: ${item}\n`;
            rootContent += '-'.repeat(30) + '\n';
            rootContent += readFileContents(fullPath);
            rootContent += '\n\n' + '='.repeat(50) + '\n\n';
        }
    }
    
    return rootContent;
}

function generateCodebaseOverview() {
    console.log('📊 Generating codebase overview...');
    const rootPath = path.join(__dirname, '..');
    
    const overview = {
        timestamp: new Date().toISOString(),
        project: {
            name: 'mobiledetailhub',
            version: '1.0.0',
            description: 'Mobile Detail Hub - Multi-business detailing services platform'
        },
        structure: {
            root: processDirectory(rootPath),
            frontend: processDirectory(path.join(rootPath, 'frontend'), 'frontend'),
            backend: processDirectory(path.join(rootPath, 'backend'), 'backend')
        },
        summary: {
            totalFiles: 0,
            totalDirectories: 0,
            frontendFiles: 0,
            backendFiles: 0,
            rootFiles: 0
        }
    };
    
    // Count files in each section
    overview.summary.frontendFiles = overview.structure.frontend.files.length;
    overview.summary.backendFiles = overview.structure.backend.files.length;
    overview.summary.rootFiles = overview.structure.root.files.length;
    overview.summary.totalFiles = overview.summary.frontendFiles + overview.summary.backendFiles + overview.summary.rootFiles;
    
    // Count directories (simplified approach)
    const countDirectories = (structure) => {
        let count = 0;
        for (const key in structure.fileStructure) {
            if (structure.fileStructure[key].includes('/')) {
                count++;
            }
        }
        return count;
    };
    
    overview.summary.totalDirectories = countDirectories(overview.structure.root) + 
                                      countDirectories(overview.structure.frontend) + 
                                      countDirectories(overview.structure.backend);
    
    return overview;
}

function cleanupOldFiles(chatgptDir) {
    const oldFiles = ['backend.txt', 'frontend.txt', 'filestructure.json', 'rootfile.txt'];
    for (const file of oldFiles) {
        const filePath = path.join(chatgptDir, file);
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                console.log(`🗑️  Removed old ${file}`);
            } catch (error) {
                console.log(`⚠️  Could not remove old ${file}: ${error.message}`);
            }
        }
    }
}

function main() {
    console.log('🚀 Starting project file generation...');
    console.log(`📏 Maximum file size: ${(MAX_FILE_SIZE / 1024).toFixed(0)}KB`);
    console.log(`📁 Allowed extensions: ${ALLOWED_EXTENSIONS.join(', ')}`);
    console.log(`🚫 Ignored directories: ${IGNORE_DIRS.join(', ')}`);
    console.log(`🚫 Ignored file types: ${IGNORE_EXTENSIONS.length} types (images, videos, binaries, etc.)`);
    console.log(`🚫 Ignored files: Lockfiles, auto-generated reports, build artifacts`);
    console.log('');
    
    // Ensure chatgpt directory exists
    const chatgptDir = path.join(__dirname, '..', 'chatgpt');
    if (!fs.existsSync(chatgptDir)) {
        fs.mkdirSync(chatgptDir, { recursive: true });
        console.log('✅ Created chatgpt directory');
    } else {
        // Clean up old files
        console.log('🗑️  Cleaning up old files...');
        cleanupOldFiles(chatgptDir);
    }
    
    try {
        // Generate backend.txt
        console.log('📝 Generating backend.txt...');
        const backendContent = generateBackendFile();
        fs.writeFileSync(path.join(chatgptDir, 'backend.txt'), backendContent);
        console.log(`✅ backend.txt generated successfully (${(backendContent.length / 1024).toFixed(1)}KB)`);
        
        // Generate frontend.txt
        console.log('📝 Generating frontend.txt...');
        const frontendContent = generateFrontendFile();
        fs.writeFileSync(path.join(chatgptDir, 'frontend.txt'), frontendContent);
        console.log(`✅ frontend.txt generated successfully (${(frontendContent.length / 1024 / 1024).toFixed(1)}MB)`);
        
        // Generate filestructure.json
        console.log('📝 Generating filestructure.json...');
        const fileStructure = generateFileStructure();
        fs.writeFileSync(path.join(chatgptDir, 'filestructure.json'), fileStructure);
        console.log(`✅ filestructure.json generated successfully (${(fileStructure.length / 1024).toFixed(1)}KB)`);
        
        // Generate rootfile.txt
        console.log('📝 Generating rootfile.txt...');
        const rootContent = generateRootFile();
        fs.writeFileSync(path.join(chatgptDir, 'rootfile.txt'), rootContent);
        console.log(`✅ rootfile.txt generated successfully (${(rootContent.length / 1024).toFixed(1)}KB)`);
        
        // Generate codebase_overview.json
        console.log('📊 Generating codebase_overview.json...');
        const codebaseOverview = generateCodebaseOverview();
        fs.writeFileSync(path.join(chatgptDir, 'codebase_overview.json'), JSON.stringify(codebaseOverview, null, 2));
        console.log(`✅ codebase_overview.json generated successfully (${(JSON.stringify(codebaseOverview).length / 1024).toFixed(1)}KB)`);
        
        console.log('\n🎉 All files generated successfully in chatgpt directory!');
        
    } catch (error) {
        console.log(`❌ Error during generation: ${error.message}`);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    generateBackendFile,
    generateFrontendFile,
    generateFileStructure,
    generateRootFile,
    generateCodebaseOverview,
    cleanupOldFiles
};
