#!/bin/sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
. "$script_dir/install-common.sh"

target_dir=${1:-"${HOME}/.claude/skills"}
install_skills "$script_dir/skills" "$target_dir" "Claude Code"
