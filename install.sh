#!/bin/sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
source_dir="$script_dir/skills"
target_dir=${1:-"${HOME}/.codex/skills"}
timestamp=$(date +%Y%m%d%H%M%S)

mkdir -p "$target_dir"

for skill_name in mvp-delivery feature-slice engineering-review debug-loop; do
  source_skill="$source_dir/$skill_name"
  target_skill="$target_dir/$skill_name"

  if [ ! -f "$source_skill/SKILL.md" ]; then
    echo "缺少源 skill：$source_skill/SKILL.md" >&2
    exit 1
  fi

  if [ -e "$target_skill" ]; then
    backup_skill="$target_dir/$skill_name.backup-$timestamp"
    suffix=1
    while [ -e "$backup_skill" ]; do
      backup_skill="$target_dir/$skill_name.backup-$timestamp-$suffix"
      suffix=$((suffix + 1))
    done
    mv "$target_skill" "$backup_skill"
    echo "已备份：$backup_skill"
  fi

  cp -R "$source_skill" "$target_skill"
  echo "已安装：$target_skill"
done

echo '完成。请在新开的 Codex 会话中使用 $mvp-delivery、$feature-slice、$engineering-review 或 $debug-loop。'
