# API 接口设计

## 认证模块

| Method | Path | 描述 | 认证 |
|--------|------|------|------|
| POST | /api/auth/register | 注册 | 否 |
| POST | /api/auth/login | 登录，返回 JWT | 否 |
| GET | /api/auth/me | 获取当前用户信息 | 是 |
| POST | /api/auth/refresh | 刷新 Token | 是 |

## 动漫模块

| Method | Path | 描述 | 认证 |
|--------|------|------|------|
| GET | /api/anime | 分页列表（支持分类筛选） | 否 |
| GET | /api/anime/[id] | 动漫详情（含剧集列表） | 否 |
| GET | /api/anime/search?q=xxx | 搜索 | 否 |
| GET | /api/anime/tags | 获取所有标签 | 否 |

## 订单模块

| Method | Path | 描述 | 认证 |
|--------|------|------|------|
| POST | /api/order | 创建订单 | 是 |
| GET | /api/order | 我的订单列表 | 是 |
| GET | /api/order/[id] | 订单详情 | 是 |
| PUT | /api/order/[id]/cancel | 取消订单 | 是 |

## 支付模块

| Method | Path | 描述 | 认证 |
|--------|------|------|------|
| POST | /api/pay/alipay/create | 创建支付宝支付 | 是 |
| POST | /api/pay/alipay/notify | 支付宝异步回调 | 否（签名验证） |
| POST | /api/pay/wechat/prepay | 微信统一下单 | 是 |
| POST | /api/pay/wechat/notify | 微信支付回调 | 否（签名验证） |
