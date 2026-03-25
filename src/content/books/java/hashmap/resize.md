---
title: "HashMap 扩容机制"
description: "分析 HashMap 的 resize 过程"
pubDate: 2025-01-20
order: 2
---

# HashMap 扩容机制

当 HashMap 中的元素数量超过阈值（capacity * loadFactor）时，会触发扩容。

## 扩容过程

1. 创建一个容量为原来 2 倍的新数组
2. 将旧数组中的元素重新分配到新数组中
3. 更新阈值

```java
final Node<K,V>[] resize() {
    // 扩容核心逻辑
}
```

这是一篇示例文章，实际内容待补充。
