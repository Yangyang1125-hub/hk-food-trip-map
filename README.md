# 香港寻味地图

一个单页旅行地图，使用高德地图 JS API 2.0 搜索香港 POI，并在浏览器中保存行程点。

## 本地启动

需要 Node.js 20 或更新版本。在 PowerShell 中设置两个环境变量后运行：

```powershell
$env:AMAP_JS_API_KEY = "你的 Web端 JS API Key"
$env:AMAP_SECURITY_CODE = "你的 JS API 安全密钥"
node server.js
```

然后打开 `http://localhost:3000`。

## Render

项目包含 `render.yaml`。部署时在服务环境变量中设置 `AMAP_JS_API_KEY` 和 `AMAP_SECURITY_CODE`。安全密钥只由 `server.js` 用于 `/_AMapService` 代理，不放进网页代码。

当前旅行日期设为 2026 年 11 月 20 日至 23 日。行程点保存在浏览器本地，分享链接会把当时的行程数据放进 URL。
