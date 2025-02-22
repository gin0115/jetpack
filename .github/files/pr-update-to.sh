#!/bin/bash

set -eo pipefail

function die {
	echo "::error::$*"
	exit 1
}

[[ "$GITHUB_EVENT_NAME" == "push" ]] || die "Must be a push event"
[[ "$GITHUB_REF" == "refs/heads/master" ]] || die "Must be a push to master"

export GIT_AUTHOR_NAME=matticbot
export GIT_AUTHOR_EMAIL=matticbot@users.noreply.github.com
export GIT_COMMITTER_NAME=matticbot
export GIT_COMMITTER_EMAIL=matticbot@users.noreply.github.com

declare -A TAGS
function update_tag {
	if [[ -z "${TAGS[$1]}" ]]; then
		echo "Updating tag $1!"
		git tag --force "$1" HEAD
		TAGS[$1]=1
	fi
}

cd $(dirname "${BASH_SOURCE[0]}")/../..
BASE="$PWD"

# If this commit updated a changelog, assume it was a release and update the tag.
echo "Checking for changes to changelogs..."
FILES=()
for FILE in projects/*/*/composer.json; do
	PROJECT="${FILE%/composer.json}"
	cd "$BASE/$PROJECT"
	FILES+=( "$(realpath -m --relative-to="$BASE" "$(jq -r '.extra.changelogger.changelog // "CHANGELOG.md"' composer.json)")" )
done
cd "$BASE"
for F in $(git diff --name-only HEAD^..HEAD "${FILES[@]}"); do
	update_tag "pr-update-to-${F%/*}"
	# TODO: Remove this once the action uses the above tags.
	update_tag "pr-update-to"
done

# If this commit changed tool versions, update the tag so PRs get rechecked with the new versions.
echo "Checking for changes to .github/versions.sh..."
git diff --exit-code --name-only HEAD^..HEAD .github/versions.sh || update_tag "pr-update-to"

if [[ ${#TAGS[*]} -le 0 ]]; then
	echo 'Done, no tag updates needed.'
	exit 0
fi

echo "Pushing tag updates..."
git push --force origin "${!TAGS[@]}"
echo 'Done!'
