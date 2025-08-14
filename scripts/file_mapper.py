#!/usr/bin/env python3
"""
File Mapper Script
Maps every file to its filepath relative to the root (mdh) directory,
excluding trivial directories and files.
"""

import os
import json
from pathlib import Path
from typing import Dict, List, Set

# Directories to exclude (trivial content)
EXCLUDED_DIRS = {
    'node_modules',
    '.git',
    'dist',
    'build',
    '.next',
    '.nuxt',
    'coverage',
    '.nyc_output',
    '__pycache__',
    '.pytest_cache',
    '.mypy_cache',
    '.cache',
    'tmp',
    'temp',
    'logs',
    '.vercel',
    '.vscode',
    '.idea',
    '.DS_Store',
    'Thumbs.db'
}

# File extensions to exclude (trivial files)
EXCLUDED_EXTENSIONS = {
    '.log',
    '.tmp',
    '.temp',
    '.cache',
    '.lock',
    '.map',
    '.min.js',
    '.min.css',
    '.bundle.js',
    '.chunk.js'
}

# Files to exclude by name
EXCLUDED_FILES = {
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    '.env.local',
    '.env.production',
    '.env.development',
    '.env.test',
    '*.min.js',
    '*.min.css'
}

def should_exclude_path(path: Path, root_path: Path) -> bool:
    """Check if a path should be excluded from the mapping."""
    # Convert to relative path for checking
    try:
        rel_path = path.relative_to(root_path)
    except ValueError:
        return True
    
    # Check if any part of the path is in excluded dirs
    for part in rel_path.parts:
        if part in EXCLUDED_DIRS:
            return True
    
    # Check file extensions
    if path.is_file():
        if path.suffix in EXCLUDED_EXTENSIONS:
            return True
        
        # Check excluded filenames
        if path.name in EXCLUDED_FILES:
            return True
    
    return False

def map_files_to_paths(root_dir: str = ".") -> Dict[str, str]:
    """
    Map every file to its relative filepath from the root directory.
    
    Args:
        root_dir: The root directory to start mapping from (default: current directory)
    
    Returns:
        Dictionary mapping file paths to their relative paths from root
    """
    root_path = Path(root_dir).resolve()
    file_mapping = {}
    
    print(f"Mapping files from root directory: {root_path}")
    print(f"Excluding directories: {', '.join(sorted(EXCLUDED_DIRS))}")
    print(f"Excluding file extensions: {', '.join(sorted(EXCLUDED_EXTENSIONS))}")
    print("-" * 60)
    
    for path in root_path.rglob('*'):
        if should_exclude_path(path, root_path):
            continue
            
        if path.is_file():
            try:
                relative_path = str(path.relative_to(root_path))
                file_mapping[relative_path] = relative_path
            except ValueError:
                continue
    
    return file_mapping

def save_mapping_to_file(mapping: Dict[str, str], output_file: str = "file_mapping.json"):
    """Save the file mapping to a JSON file."""
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(mapping, f, indent=2, ensure_ascii=False)
    print(f"\nFile mapping saved to: {output_file}")

def print_mapping_summary(mapping: Dict[str, str]):
    """Print a summary of the file mapping."""
    print(f"\nMapping Summary:")
    print(f"Total files mapped: {len(mapping)}")
    
    # Group by directory
    dir_counts = {}
    for file_path in mapping.keys():
        dir_path = str(Path(file_path).parent)
        if dir_path == ".":
            dir_path = "root"
        dir_counts[dir_path] = dir_counts.get(dir_path, 0) + 1
    
    print(f"\nFiles per directory:")
    for dir_path, count in sorted(dir_counts.items()):
        print(f"  {dir_path}: {count} files")
    
    # Show some examples
    print(f"\nExample files:")
    for i, file_path in enumerate(sorted(mapping.keys())[:10]):
        print(f"  {file_path}")
    if len(mapping) > 10:
        print(f"  ... and {len(mapping) - 10} more files")

def main():
    """Main function to run the file mapper."""
    try:
        # Map files to paths
        file_mapping = map_files_to_paths()
        
        # Print summary
        print_mapping_summary(file_mapping)
        
        # Save to file
        save_mapping_to_file(file_mapping)
        
        # Also save a more detailed version with file info
        detailed_mapping = {}
        root_path = Path(".").resolve()
        
        for file_path, rel_path in file_mapping.items():
            full_path = root_path / file_path
            if full_path.exists():
                stat = full_path.stat()
                detailed_mapping[rel_path] = {
                    "relative_path": rel_path,
                    "size_bytes": stat.st_size,
                    "modified": stat.st_mtime,
                    "is_file": full_path.is_file(),
                    "is_dir": full_path.is_dir()
                }
        
        with open("detailed_file_mapping.json", 'w', encoding='utf-8') as f:
            json.dump(detailed_mapping, f, indent=2, ensure_ascii=False)
        print(f"Detailed mapping saved to: detailed_file_mapping.json")
        
    except Exception as e:
        print(f"Error: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())
