---
title: "HashMap 深度解析"
description: "从源码角度分析 Java HashMap 的实现原理"
pubDate: 2025-01-15
order: 1
---

# HashMap 深度解析

HashMap 是 Java 中最常用的数据结构之一。本文将从源码角度分析其核心实现。

## 底层数据结构

HashMap 在 JDK 8 之后采用了 **数组 + 链表 + 红黑树** 的结构。

```java
transient Node<K,V>[] table;

static class Node<K,V> implements Map.Entry<K,V> {
    final int hash;
    final K key;
    V value;
    Node<K,V> next;
}
```

## 哈希计算

HashMap 对 key 的 hashCode 做了扰动处理，以减少哈希冲突：

```java
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

这是一篇示例文章，实际内容待补充。
