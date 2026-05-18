#!/bin/bash

cd "$(dirname "$0")"

MESSAGES=(
    "Refine behavioral architecture"
    "Improve mobile interaction flow"
    "Polish adaptive UI foundation"
    "Enhance motion semantics"
    "Refine energy-aware primitives"
    "Improve behavioral UX systems"
    "Stabilize mobile foundation"
    "Refine interaction ergonomics"
    "Improve shared core infrastructure"
    "Enhance recovery-focused UX"
    "Polish emotional pacing system"
    "Improve mobile behavioral flows"
)

while true
do
    git pull origin main --rebase

    git add .

    if ! git diff --cached --quiet; then

        RANDOM_INDEX=$((RANDOM % ${#MESSAGES[@]}))
        COMMIT_MESSAGE="${MESSAGES[$RANDOM_INDEX]}"

        git commit -m "$COMMIT_MESSAGE"

        git push origin main

        echo "Changes committed and pushed:"
        echo "$COMMIT_MESSAGE"
    else
        echo "No changes to commit."
    fi

    sleep 300
done