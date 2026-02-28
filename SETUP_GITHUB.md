# GitHub Actions 設置指南

## 步驟 1: 創建 GitHub 倉庫

1. 前往 https://github.com/new
2. 輸入倉庫名稱: `dengenci-mobile`
3. 選擇 "Public" 或 "Private"
4. 點擊 "Create repository"

## 步驟 2: 推送代碼到 GitHub

```bash
cd /tmp/clean-mobile-build
git remote add origin https://github.com/YOUR_USERNAME/dengenci-mobile.git
git branch -M main
git push -u origin main
```

## 步驟 3: 設置 GitHub Secrets

前往倉庫 Settings -> Secrets and variables -> Actions，添加以下 secrets:

### 必需 Secrets:

| Secret Name | Value |
|-------------|-------|
| `SIGNING_KEY_BASE64` | (下面會教你生成) |
| `KEY_ALIAS` | `dengenci` |
| `KEY_STORE_PASSWORD` | `dengenci123` |
| `KEY_PASSWORD` | `dengenci123` |

### 生成 SIGNING_KEY_BASE64:

```bash
# 在項目目錄運行
cd /tmp/clean-mobile-build
base64 -i dengenci.keystore -o keystore.base64
cat keystore.base64 | pbcopy  # macOS 複製到剪貼板
# 或者手動複製 keystore.base64 文件內容
```

## 步驟 4: 觸發構建

1. 推送代碼後，前往 Actions 頁面
2. 點擊 "Build Android APK (Local)"
3. 點擊 "Run workflow"

## 步驟 5: 下載 APK

構建完成後:
1. 前往 Releases 頁面
2. 下載 `dengenci-v5.1.0.apk`

---

## 預計時間

- GitHub Actions 免費版構建時間: 約 10-15 分鐘
- 隊列等待時間: 視乎當前使用量

但願人長久，千里共恩賜 💜
