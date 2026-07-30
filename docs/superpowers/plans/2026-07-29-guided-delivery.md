# Guided Delivery 总控 Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建 `$guided-delivery`，以一问一答完成共识后再交付功能，并按需整合现有四个 skills。

**Architecture:** `guided-delivery` 维护明确状态机和共识记录；它通过读取现有 skills 来获得阶段性约束，而不复制实现细节。`AGENTS.md` 将其设为默认入口；README 与安装脚本使它在本仓库和全局环境都可发现。

**Tech Stack:** Markdown、Codex skills、POSIX shell。

## Global Constraints

- 在用户明确“确认实施”前不得写入应用代码、创建依赖或运行变更命令。
- 每次只能问一个会改变设计的关键问题，且提供推荐答案与理由。
- 阻塞问题修复需要确认；非阻塞问题只记录。
- 文档使用中文；不引入外部依赖或网络操作。

---

### Task 1: 创建总控 skill

**Files:**
- Create: `skills/guided-delivery/SKILL.md`
- Create: `skills/guided-delivery/agents/openai.yaml`

**Interfaces:**
- Consumes: 初始问题、现有代码、用户回答和“确认实施”许可。
- Produces: 共识记录、分阶段工作、验证结果和交付总结。

- [ ] **Step 1: 初始化 skill 目录和 UI metadata**

使用 skill 初始化工具创建 `guided-delivery`，UI 名称为“引导式交付”，描述说明“一问一答收敛需求，确认后实施并完成审查”，默认提示词显式使用 `$guided-delivery`。

- [ ] **Step 2: 写入状态机与共识记录**

要求总控先读取 `mvp-delivery`；一次提出一个关键问题并提供推荐答案；每次回答后更新六项共识记录。记录完成后要求用户明确确认实施。

- [ ] **Step 3: 写入路由与收尾规则**

确认后读取 `feature-slice` 实施，读取 `engineering-review` 审查；失败时读取 `debug-loop`。阻塞问题等待确认修复，非阻塞问题记录。最终输出交付内容、验证、风险和下一步。

### Task 2: 更新入口和安装说明

**Files:**
- Modify: `AGENTS.md`
- Modify: `README.md`
- Modify: `install.sh`

**Interfaces:**
- Consumes: 新总控 skill。
- Produces: 默认项目路由、全局安装和 Scheduler 调用示例。

- [ ] **Step 1: 更新 `AGENTS.md`**

要求任何从初始题目开始的交付任务优先使用 `skills/guided-delivery/SKILL.md`；保留四个子 skill 的直接调用路由。

- [ ] **Step 2: 更新 `README.md`**

把 `$guided-delivery` 放到首个调用示例，说明它会一问一答、输出六项共识记录、等待“确认实施”后才实施。Scheduler 示例改用该入口。

- [ ] **Step 3: 更新 `install.sh`**

把 `guided-delivery` 加入已知 skill 循环；保持已有的备份和复制语义不变。

### Task 3: 验证

**Files:**
- Test: `skills/guided-delivery/SKILL.md`
- Test: `install.sh`

- [ ] **Step 1: 静态检查总控边界**

运行：

```bash
rg -n '一次.*问题|推荐答案|确认实施|mvp-delivery|feature-slice|engineering-review|debug-loop|阻塞|非阻塞' skills/guided-delivery/SKILL.md
```

预期：命中提问节奏、确认闸门、四个子 skill 和收尾规则。

- [ ] **Step 2: 验证安装脚本**

运行：

```bash
sh -n install.sh
target_dir=$(mktemp -d)
./install.sh "$target_dir"
find "$target_dir" -maxdepth 2 -name SKILL.md -print | sort
```

预期：打印五个 `SKILL.md`，其中包含 `guided-delivery/SKILL.md`。

- [ ] **Step 3: 验证文档和工作树**

运行：

```bash
rg -n 'guided-delivery|确认实施|Scheduler' AGENTS.md README.md
git diff --check
git status --short
```

预期：入口和确认语义在两个文档中均可见，格式检查成功，工作树仅包含本计划中的文件。
