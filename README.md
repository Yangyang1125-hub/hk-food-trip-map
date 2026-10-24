# 上海打卡

上海地点搜索、收藏和路线规划网页。使用高德地图 JS API 2.0，在页面内搜索 POI、保存地点并展示步行、公交/地铁或驾车路线。

## 本地启动

需要 Node.js 20 或更新版本。设置高德 Web端（JS API）Key 和安全密钥后运行：

```powershell
$env:AMAP_JS_API_KEY = "你的 Web端 JS API Key"
$env:AMAP_SECURITY_CODE = "你的 JS API 安全密钥"
node server.js
```

然后打开 `http://localhost:3000`。

## Render

在服务环境变量中设置 `AMAP_JS_API_KEY` 和 `AMAP_SECURITY_CODE`。安全密钥只由服务端代理使用，不放进网页代码。

地点保存在当前浏览器；分享链接会把当前收藏地点放入 URL。