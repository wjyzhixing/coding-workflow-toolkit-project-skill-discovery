#!/bin/sh
# 安装 skills 的共享逻辑，由 install-codex.sh / install-claude.sh source 使用。
# 直接运行本脚本不会做任何事；请使用对应的包装脚本。

# install_skills <source_dir> <target_dir> <client_name>
# 将 source_dir 下的若干 skill 复制到 target_dir，已存在的同名 skill 会带时间戳备份。
install_skills() {
  source_dir="$1"
  target_dir="$2"
  client_name="$3"

  if [ -z "$source_dir" ] || [ -z "$target_dir" ] || [ -z "$client_name" ]; then
    echo "用法: install_skills <source_dir> <target_dir> <client_name>" >&2
    return 2
  fi

  timestamp=$(date +%Y%m%d%H%M%S)
  mkdir -p "$target_dir"

  for skill_name in guided-delivery mvp-delivery feature-slice engineering-review debug-loop delivery-report; do
    source_skill="$source_dir/$skill_name"
    target_skill="$target_dir/$skill_name"

    if [ ! -f "$source_skill/SKILL.md" ]; then
      echo "缺少源 skill：$source_skill/SKILL.md" >&2
      return 1
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

  echo "完成。请在新开的 $client_name 会话中使用 \$guided-delivery、\$mvp-delivery、\$feature-slice、\$engineering-review、\$debug-loop 或 \$delivery-report。"
}
