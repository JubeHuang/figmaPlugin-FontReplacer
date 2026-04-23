# Font Replacer

一款 Figma 外掛，用於批次替換設計檔案中的字體。支援整個檔案或單一頁面範圍，自動偵測已使用的字體，並在目標字體缺少對應字重時提供 fallback 讓使用者自行選擇。

## 功能

- 自動掃描檔案中所有已使用的字體與字重
- 支援「整個檔案」或「當前頁面」兩種替換範圍
- 目標字體支援即時搜尋篩選
- 一次可設定多組字體替換對照
- 當目標字體缺少對應字重時，自動提示選擇替代樣式
- 支援重新偵測，新增文字後無需重啟外掛

## 截圖

![Font Replacer UI](https://github.com/JubeHuang/figmaPlugin-FontReplacer/blob/main/src/assets/FontReplacerUI.png)

## 安裝與開發

### 前置需求

- [Node.js](https://nodejs.org/)（v18+）
- [Figma 桌面版](https://www.figma.com/downloads/)

### 安裝步驟

```bash
git clone https://github.com/your-username/font-replacer.git
cd font-replacer
npm install
```

### 建構

```bash
npm run build
```

這會將 `code.ts` 透過 esbuild 打包成 Figma 可執行的 `code.js`。

### 在 Figma 中載入

1. 打開 Figma 桌面版
2. 進入任意檔案，從選單選擇 **Plugins → Development → Import plugin from manifest...**
3. 選擇本專案中的 `manifest.json`
4. 外掛會出現在 **Plugins → Development** 選單中

## 使用教學

### 1. 開啟外掛

在 Figma 中，從選單選擇 **Plugins → Development → Font Replacer**，外掛會自動掃描檔案中所有已使用的字體。

### 2. 選擇替換範圍

在「替換範圍」區塊中選擇：

- **整個檔案** — 掃描並替換所有頁面中的文字
- **當前頁面** — 僅處理目前所在的頁面

### 3. 設定字體對照

每一組「對照」代表一個替換規則：

- **左側下拉選單** — 選擇要被替換的來源字體
- **右側搜尋框** — 輸入並選擇目標字體（支援即時搜尋）

如果來源字體有多個字重（例如 Regular、Bold），可以在下方的字重選單中指定。

點擊 **+ 新增替換對照** 可以同時設定多組替換規則。

### 4. 執行替換

確認對照設定後，點擊 **執行替換**。

如果目標字體缺少與來源字體對應的字重，外掛會彈出提示，讓你手動選擇最接近的替代字重，選好後再次點擊執行即可。

替換完成後會顯示「已替換 N 個文字物件」的訊息。

### 5. 重新偵測字體

如果你在外掛開啟後新增了文字圖層或匯入了新元件，點擊「替換範圍」旁的 **↻ 重新偵測** 按鈕，即可重新掃描已使用的字體列表，無需關閉再重開外掛。

## 專案結構

```
├── manifest.json          # Figma 外掛設定檔
├── code.ts                # 外掛主邏輯（打包入口）
├── ui.html                # 外掛 UI 介面
├── src/
│   ├── types.ts           # TypeScript 型別定義
│   ├── logic/
│   │   ├── fontScanner.ts # 字體掃描與去重
│   │   └── styleMatcher.ts# 字重比對與 fallback
│   └── __tests__/         # 測試檔案
├── package.json
└── tsconfig.json
```

## 指令

| 指令 | 說明 |
|------|------|
| `npm run build` | 打包 code.ts → code.js |
| `npm run typecheck` | TypeScript 型別檢查 |
| `npm run lint` | ESLint 程式碼檢查 |
| `npm run lint:fix` | 自動修復 lint 問題 |

## License

MIT
