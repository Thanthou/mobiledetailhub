#!/bin/bash
# commit-with-changelog.sh
# Usage: ./scripts/commit-with-changelog.sh "Your commit message here"

if [ -z "$1" ]; then
    echo "❌ Error: Commit message required"
    echo "Usage: ./scripts/commit-with-changelog.sh \"Your commit message\""
    exit 1
fi

COMMIT_MESSAGE="$1"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
CHANGELOG_FILE="gitlogs/CHANGES_$TIMESTAMP.md"

# Create gitlogs directory if it doesn't exist
mkdir -p gitlogs

echo "📝 Generating changelog..."

# Get the list of changed files
CHANGED_FILES=$(git diff --cached --name-status)
if [ -z "$CHANGED_FILES" ]; then
    echo "⚠️  No staged changes found. Staging all changes..."
    git add .
    CHANGED_FILES=$(git diff --cached --name-status)
fi

# Create the changelog content
cat > "$CHANGELOG_FILE" << EOF
# Changelog - $TIMESTAMP

## Commit Message
$COMMIT_MESSAGE

## Changed Files
\`\`\`
$CHANGED_FILES
\`\`\`

## Detailed Changes

EOF

# Append detailed diff
git diff --cached >> "$CHANGELOG_FILE"

echo "✅ Changelog written to: $CHANGELOG_FILE"

# Perform git operations
echo ""
echo "🔄 Staging changes..."
git add .

echo "💾 Committing..."
git commit -m "$COMMIT_MESSAGE"

if [ $? -eq 0 ]; then
    echo "✅ Committed successfully"
    
    echo ""
    echo "🚀 Pushing to remote..."
    git push
    
    if [ $? -eq 0 ]; then
        echo "✅ Pushed successfully"
    else
        echo "❌ Push failed"
        exit 1
    fi
else
    echo "❌ Commit failed"
    exit 1
fi

echo ""
echo "📋 Summary:"
echo "  - Changelog: $CHANGELOG_FILE"
echo "  - Commit: $COMMIT_MESSAGE"

