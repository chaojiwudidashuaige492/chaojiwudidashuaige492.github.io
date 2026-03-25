---
title: "线程池原理"
description: "Java 线程池 ThreadPoolExecutor 核心原理解析"
pubDate: 2025-02-10
order: 1
---

# 线程池原理

Java 线程池 `ThreadPoolExecutor` 是并发编程中最核心的工具之一。

## 核心参数

```java
public ThreadPoolExecutor(
    int corePoolSize,
    int maximumPoolSize,
    long keepAliveTime,
    TimeUnit unit,
    BlockingQueue<Runnable> workQueue
)
```

- **corePoolSize**：核心线程数
- **maximumPoolSize**：最大线程数
- **keepAliveTime**：空闲线程存活时间
- **workQueue**：任务队列

这是一篇示例文章，实际内容待补充。
