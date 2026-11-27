# 发送快捷键

[English](README.md) | [中文](README.zh.md)

选择 DeepSeek Harness 消息框的发送方式。

| 模式 | Enter | 发送键 |
|---|---|---|
| 默认 | 发送 | `Enter` |
| 编辑友好 | 换行 | `Shift + Enter` 或 `Ctrl + Enter` |

## 安装

1. 在 DeepSeek Harness 中打开 **插件**。
2. 选择 **安装插件**。
3. 输入 `dsh-composer-send-key` 并确认。

包直接从 npm 安装，不需要本地路径。也可以在终端执行：

```sh
dsh plugin --profile <profile> add dsh-composer-send-key
```

## 使用

打开 **设置 → 发送快捷键**。页面只有两项：

- **默认** — `Enter` 发送，`Shift + Enter` 换行。
- **编辑友好模式** — `Enter` 换行；下方选择用 `Shift + Enter` 还是 `Ctrl + Enter` 发送。

修改立即生效，并保存在当前配置档案中。你也可以直接写在 profile patch 里：

```yaml
- id: composer-send-key
  name: 'dsh-composer-send-key'
  config:
    mode: edit-friendly # 或 default
    combo: shift # 或 ctrl
```

## 行为

- 只作用于消息发送框。右侧栏终端、搜索框和其他输入框保持各自的 `Enter` 行为。
- **默认模式**不改动内置键盘处理。
- **编辑友好模式**下只有一个快捷键会发送：你选择的 `Shift + Enter` 或 `Ctrl + Enter`。其余 Enter 组合一律换行，包括 `⌘ + Enter` 以及内置的 `Ctrl/⌘ + Enter` 加速发送。
- 命令/候选菜单打开时，选中的快捷键确认高亮项，其余组合换行。
- 输入法合成不受影响：用于结束候选的 `Enter` 不会发送，也不会多插入换行。
- 运行中消息框的排队/插话偏好、发送按钮和快捷键参考页保持原样。
- 停用或移除插件后恢复默认行为。

## 开发

项目使用 TypeScript。Host 与 Client 源码在 `src/`，构建产物在 `lib/`：

```sh
pnpm install
pnpm build      # 先类型检查，再打包 lib/index.js 和 lib/client.js
pnpm typecheck
```

`src/index.ts` 是 Host 侧（两个 volatile 配置项）。`src/client/` 包含设置页、文案和仅作用于消息框的按键守卫。Client 打包为单个自包含文件，通过页面模块加载器注册。

本插件依赖消息框内部 DOM（`[data-composer-card]`）与键盘处理。升级 DeepSeek Harness 后请重新验证；若内部结构变化，插件会退回内置行为，而不是破坏输入。
