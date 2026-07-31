# 长期规格沉淀：`$guided-delivery` 尾部演示

这个示例承接 [Scheduler 的 `$guided-delivery` 对话演示](./scheduler-guided-delivery-demo.md)，展示任务在交付报告阶段触发"长期规格沉淀"分支的预期行为。重点不是写代码，而是看 AI 如何判断信号、推荐沉淀、等待确认、生成 OpenSpec 风格的 spec 与 change proposal。

## 0. 前置：交付报告已生成

假设 Scheduler 任务已走完澄清、确认、最小切片、验证与审查，`$delivery-report` 在项目根的 `scheduler/交付报告.md` 写入了中文交付报告，并在对话中给出摘要。

## 1. AI 检查沉淀信号并推荐

```text
交付报告已写入 scheduler/交付报告.md。

沉淀判断：本任务适合沉淀为长期规格。

信号：
- 跨任务复用的契约：add(task, { signal, priority }) 签名、queued -> running -> fulfilled | rejected | cancelled 状态机、AbortSignal 取消语义，都是后续并发调度场景会复用的契约；
- 团队共识载体：优先级数值越大越先执行、同优先级 FIFO、单任务失败不影响其他任务，是团队约定的稳定规则。

建议 capability 名：scheduler。
是否生成 spec 和 change proposal？
```

你的回答：

```text
生成。
```

## 2. AI 创建 spec 与 change proposal

```text
已检查 openspec/specs/scheduler/spec.md：不存在，新建。

已创建：
- openspec/specs/scheduler/spec.md：描述 Scheduler 的 Requirements 与 Scenarios（ GIVEN / WHEN / THEN ）。
- openspec/changes/2026-07-30-scheduler/proposal.md：本次变更的 Why、What Changes、Impact，Why 引用 scheduler/交付报告.md。

spec 是累加的：后续若再做 scheduler 相关需求，会读现有 spec 并合并新的 requirements 与 scenarios，不删除已有内容；冲突处标注“本次变更”。
change 是一次性的：每次沉淀生成一个带日期的 proposal，避免覆盖。

不执行 commit、push、PR；openspec/ 下的文件只通过本确认流程创建。
```

## 3. spec.md 的预期内容

```markdown
---
name: scheduler
category: concurrency
last_updated: 2026-07-30
---

# Scheduler

## Requirements
- REQ-1: 最大并发数为构造时传入的 limit，必须为正整数。
- REQ-2: add 返回 Promise，支持 { priority, signal } 选项。
- REQ-3: 优先级数值越大越先执行；同优先级 FIFO。
- REQ-4: 排队任务收到 abort 后从队列移除并以 AbortError reject。
- REQ-5: 运行任务收到 signal 后协作取消；单任务失败不影响其他任务。

## Scenarios

### 优先级与并发上限
- **GIVEN** limit=2，队列中有三个任务优先级 1、3、2
- **WHEN** 调度开始
- **THEN** 前两个槽位执行优先级 3 和 2 的任务，优先级 1 的任务排队

### 排队任务取消
- **GIVEN** 任务 A 在队列中等待
- **WHEN** 调用方 abort 传入的 signal
- **THEN** A 从队列移除，add 返回的 Promise 以 AbortError reject，不占用执行槽位

### 运行任务失败隔离
- **GIVEN** 任务 B 正在运行
- **WHEN** B 抛错或 reject
- **THEN** B 的 Promise reject，槽位释放，队列中下一个任务被调度
```

## 4. proposal.md 的预期内容

```markdown
---
name: 2026-07-30-scheduler
type: feature
status: proposed
---

# 引入 Scheduler 并发调度能力

## Why
首次确立并发调度的 API、状态机与取消语义，作为后续并发场景的复用基础。详见 ../scheduler/交付报告.md。

## What Changes
- 新增 capability：scheduler
- 确立 add(task, { signal, priority }) 签名与 queued -> running -> fulfilled | rejected | cancelled 状态机
- 确立优先级、FIFO、失败隔离、AbortSignal 协作取消语义

## Impact
- Specs: scheduler
- Files: 实现文件由 feature-slice 阶段确定，本 proposal 只记录规格层面变更
```

## 5. 负向用例：无信号时跳过

```text
$guided-delivery

把首页 hero 区标题从“欢迎使用”改成“立即开始”。
```

走完澄清、确认、最小切片后，`$delivery-report` 生成交付报告。AI 检查信号：

- 跨任务复用的契约？无，纯文案修改；
- 反复出现的问题？无；
- 团队共识载体？无；
- 外部消费者？无。

无信号 -> 跳过沉淀判断，不主动询问，原流程结束。不创建任何 `openspec/` 文件。

## 实际调用的最短版本

```text
$guided-delivery

实现一个 TypeScript Scheduler：最大并发数 limit；add 返回 Promise；支持优先级、取消；单任务失败不影响其他任务。

每次只问一个会影响设计的问题，并给出推荐答案。形成完整共识记录后，等待我输入“确认实施”再进入代码。交付报告生成后，若判断适合沉淀为长期规格，给出推荐并等我确认再生成 openspec/ 文件。
```
