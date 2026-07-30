# Scheduler：`$guided-delivery` 对话演示

这个示例展示总控 skill 的预期行为。重点不是让 AI 一次写完代码，而是让它先用一问一答把会影响实现的语义定下来。

## 0. 你给出的初始问题

```text
$guided-delivery

实现一个 TypeScript Scheduler：最大并发数 limit；add 返回 Promise；支持优先级、取消；单任务失败不影响其他任务。
```

## 1. 它只问第一个关键问题

```text
第一个问题：取消的 API 和运行中任务的语义是什么？

推荐：让 add(task, { signal }) 返回普通 Promise，调用方通过 AbortController 取消。
原因：这样严格满足“add 返回 Promise”，也使用标准 AbortSignal 语义。尚未开始的任务可以从队列移除；已经开始的任务无法被 Scheduler 强杀，只将 signal 传给任务，由任务协作退出。

你接受这个语义吗？
```

你的回答：

```text
接受。
```

## 2. 它更新记录，再问下一题

```text
共识记录（持续更新）
- 取消：调用方传入 AbortSignal；排队任务直接取消，运行任务协作取消。

下一个问题：优先级相同的任务如何排序？

推荐：同优先级 FIFO；优先级数值越大越先执行。
原因：规则稳定、容易验证，也避免后加入的任务饿死同优先级的先入任务。

是否接受？
```

你的回答：

```text
接受。
```

## 3. 它继续逐项收敛

它还会依次确认，而不是一次抛出所有问题：

1. `limit` 是否必须为正整数？推荐：构造时拒绝非正整数。
2. 任务函数签名？推荐：`(signal: AbortSignal) => Promise<T>`。
3. 取消的 Promise 结果？推荐：以 `AbortError` reject，便于调用方统一 `catch`。
4. 失败语义？推荐：每个任务独立 settle；在 `finally` 释放并发槽位并继续 drain。
5. 本题最小验收？推荐：并发上限、优先级/FIFO、排队取消、失败后继续、同步抛错五类测试。

## 4. 它展示完整共识记录

```text
共识记录

1. 目标用户路径
   调用方创建 Scheduler(limit)，通过 add 提交异步任务；任务按优先级运行，调用方 await 各自 Promise。

2. 最小范围与非目标
   范围：并发限制、优先级、FIFO、AbortSignal 取消、独立成功/失败。
   非目标：动态修改 limit、持久化队列、任务超时、跨进程调度、强制终止任意运行 Promise。

3. API / 数据与状态语义
   new Scheduler(limit)
   add<T>(task: (signal: AbortSignal) => Promise<T>, options?: { priority?: number; signal?: AbortSignal }): Promise<T>
   状态：queued → running → fulfilled | rejected | cancelled。

4. 关键边界与失败语义
   limit 必须为正整数；更大 priority 先执行，同优先级 FIFO；排队任务收到 abort 后从队列移除并以 AbortError reject；运行任务收到 signal 后协作取消；任务抛错或 reject 都只影响自身，finally 释放槽位并继续调度。

5. 验收测试
   activeCount 从不超过 limit；优先级/FIFO 正确；排队取消不执行任务；失败后其他任务继续；同步 throw 和异步 reject 都释放槽位。

6. 取舍与计划
   本题用数组队列 + 选择最高优先级，代码最短且足以覆盖限时需求；队列很大时再替换为 heap。先写测试，再写最小 Scheduler，最后审查竞态。

如果以上正确，请输入“确认实施”。
```

## 5. 你确认后才实施

你的回答：

```text
确认实施。
```

随后 `$guided-delivery` 会读取 `feature-slice`，先展示文件范围、关键不变量与测试计划；得到这一步的确认后才写代码。

实现完成后，它会自动进行 `engineering-review`。若测试失败或出现竞态，再读取 `debug-loop`，先复现与收集证据；不会直接猜一个修复。

## 实际调用的最短版本

```text
$guided-delivery

实现一个 TypeScript Scheduler：最大并发数 limit；add 返回 Promise；支持优先级、取消；单任务失败不影响其他任务。

每次只问一个会影响设计的问题，并给出推荐答案。形成完整共识记录后，等待我输入“确认实施”再进入代码。
```
