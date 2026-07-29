# 项目级 Skill 发现机制 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让仓库提供明确的项目级工作流说明、全局安装命令和可复制的使用入口。

**Architecture:** `AGENTS.md` 面向进入仓库的 AI，定义先读工作台、再分阶段调用 skills 的默认协议。`README.md` 面向人，说明本地项目与全局安装的区别及调用示例。`install.sh` 是唯一的确定性安装入口，将仓库内 `skills/` 的四个目录复制到用户指定的 Codex skills 目录，默认 `~/.codex/skills`。

**Tech Stack:** Markdown、POSIX shell、Git。

## Global Constraints

- 文档和提示词使用中文；不把工作流包装为面试专用工具。
- 安装脚本只处理四个已知 skills，拒绝不存在的源目录。
- 安装前创建目标目录；目标已有同名 skill 时先备份而不直接覆盖。
- 脚本不联网、不安装依赖、不提交、不推送。

---

### Task 1: 添加项目级 AI 指令

**Files:**
- Create: `AGENTS.md`

**Interfaces:**
- Consumes: 用户任务、`coding-workflow.md`、`skills/*/SKILL.md`。
- Produces: 可被项目环境读取的默认工作流。

- [ ] **Step 1: 写入工作流优先级**

创建 `AGENTS.md`，要求 AI 在修改代码前阅读 `coding-workflow.md`，并使用“澄清 → 范围/计划 → 用户确认 → 实现 → 验证 → 总结”的顺序。说明四个 skill 的路由：模糊需求用 `mvp-delivery`，现有项目功能用 `feature-slice`，审查用 `engineering-review`，故障用 `debug-loop`。

- [ ] **Step 2: 写入透明性与安全边界**

要求 AI 在写入应用代码前展示受影响文件和计划、等待确认；不自动安装依赖、不执行破坏性命令、不吞错误；外部输入和授权必须在系统边界验证。

### Task 2: 添加人类使用说明

**Files:**
- Create: `README.md`

**Interfaces:**
- Consumes: 仓库路径、Codex 目录与题目描述。
- Produces: 项目级与全局级的清晰使用入口。

- [ ] **Step 1: 解释两种发现方式**

说明 `AGENTS.md` 只在当前仓库提供默认工作流；要让其他仓库可显式调用 `$mvp-delivery`，需运行安装脚本复制到 `~/.codex/skills` 或自定义目录。

- [ ] **Step 2: 添加最短上手命令与排序示例**

给出 `./install.sh`、`./install.sh /custom/skills` 和 `$mvp-delivery` 的调用示例。排序题例子必须先要求分析比较排序下界、输入约束和方案取舍，再等待确认写代码。

### Task 3: 添加安全可重复的安装脚本

**Files:**
- Create: `install.sh`
- Test: shell 命令的临时目标目录验证。

**Interfaces:**
- Consumes: 可选的目标目录参数，默认 `~/.codex/skills`。
- Produces: 目标目录中的四个完整 skill 目录，保留已有内容的时间戳备份。

- [ ] **Step 1: 写入失败即停和目标解析逻辑**

实现 `set -eu`，将首参数或 `${HOME}/.codex/skills` 作为目标；创建目标目录；从脚本所在目录计算源 `skills/` 路径。

- [ ] **Step 2: 对每个已知 skill 实施备份与复制**

为 `mvp-delivery`、`feature-slice`、`engineering-review`、`debug-loop` 循环：确认 `SKILL.md` 存在；若目标目录同名存在，将其改名为 `<name>.backup-YYYYmmddHHMMSS`；再以 `cp -R` 复制。

- [ ] **Step 3: 验证安装行为**

运行：

```bash
target_dir=$(mktemp -d)
./install.sh "$target_dir"
find "$target_dir" -maxdepth 2 -name SKILL.md -print | sort
```

预期：恰好打印四个 `SKILL.md` 路径。再次运行相同命令后，预期每个 skill 都有一个 `.backup-` 目录且新目录仍含 `SKILL.md`。

### Task 4: 质量检查

**Files:**
- Modify: `AGENTS.md`
- Modify: `README.md`
- Modify: `install.sh`

- [ ] **Step 1: 检查 shell 语法和文档链接**

运行：

```bash
sh -n install.sh
rg -n 'coding-workflow.md|mvp-delivery|feature-slice|engineering-review|debug-loop' AGENTS.md README.md
```

预期：shell 语法成功，两个文档均引用工作台和四个 skills。

- [ ] **Step 2: 检查工作树**

运行：

```bash
git status --short
```

预期：仅包含本计划列出的文件及本计划文档。
