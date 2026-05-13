# 开发计划与时间线

按优先级分 4 个迭代，每个迭代 1-2 周：

## Iteration 1（第 1-2 周）：项目初始化 + Docker 环境 + 认证系统

**目标**：Docker 化开发环境就绪，可运行的项目骨架，用户能注册登录

### 任务清单

- [x] 编写 `Dockerfile`（Node 20 Alpine 多阶段构建）
- [x] 编写 `docker-compose.yml`（Next.js 服务 + PostgreSQL 16 Alpine）
- [x] 配置 `.dockerignore`
- [x] 配置 Prisma `datasource` 连接 Docker 内的 PostgreSQL
- [x] `docker compose up` 一键启动开发环境
- [x] 初始化 Next.js 项目，配置 TypeScript、TailwindCSS
- [x] 实现基础 UI 框架（Layout、Header、Footer）
- [x] 实现注册 API + 页面
- [x] 实现登录 API + 页面（JWT）
- [x] 实现 `AuthProvider` 全局认证上下文
- [x] 实现受保护路由中间件
- [x] 实现个人信息查看/编辑

### 完成详情

| 模块 | 文件 | 说明 |
|------|------|------|
| Docker 化 | `Dockerfile`, `docker-compose.yml`, `.dockerignore` | Node 20 Alpine 多阶段构建，Next.js + PostgreSQL 16 Alpine 编排，开发模式挂载热重载 |
| Prisma | `prisma/schema.prisma`, `src/lib/prisma.ts` | 7 个模型（User, Anime, Episode, Tag, Order, OrderItem, Payment），5 个枚举，PostgreSQL datasource |
| UI 框架 | `src/app/layout.tsx`, `components/layout/Header.tsx`, `Footer.tsx`, `Sidebar.tsx` | TailwindCSS 全局样式，响应式 Header（Logo + 导航 + 用户菜单），Footer，管理员 Sidebar |
| 注册 | `api/auth/register/route.ts`, `auth/register/page.tsx`, `RegisterForm.tsx` | bcrypt 密码加密，邮箱注册，表单验证 |
| 登录 | `api/auth/login/route.ts`, `auth/login/page.tsx`, `LoginForm.tsx` | JWT 签发，Access Token 返回，表单验证 |
| 认证上下文 | `components/AppProviders.tsx`, `components/ProtectedRoute.tsx` | AuthProvider 全局用户状态（fetch /api/auth/me），ProtectedRoute 客户端路由守卫 |
| 中间件 | `src/middleware.ts` | Edge level 保护 /api/admin/* 路由，验证 Bearer Token |
| 个人信息 | `api/auth/me/route.ts`, `auth/me/page.tsx` | JWT 鉴权获取当前用户，展示邮箱/昵称/角色 |

**产出**：`docker compose up` 一键启动，用户可注册登录

---

## Iteration 2（第 3-4 周）：动漫内容模块

**目标**：用户可以浏览和搜索动漫

### 任务清单

- [x] 编写 Anime + Episode + Tag 种子数据
- [x] 实现动漫列表页（分页、封面展示）
- [x] 实现动漫详情页（简介、标签、剧集列表）
- [x] 实现搜索功能（关键词 + 分类筛选）
- [x] 实现标签系统
- [~] 实现剧集播放页（嵌入视频播放器）
- [~] 后台：动漫 CRUD 管理页

### 完成详情

| 模块 | 文件 | 说明 |
|------|------|------|
| 种子数据 | `prisma/seed.ts` | 8 部动漫（含科幻、奇幻、恋爱、悬疑、机甲等类型），12 个分类标签，每部含剧集（部分前 3 集免费），管理员账号 |
| 动漫列表 API | `api/anime/route.ts` | GET 分页查询，支持 tag 筛选，响应含 pagination 元信息 |
| 动漫详情 API | `api/anime/[id]/route.ts` | GET 完整动漫信息 + 剧集列表（排序），404 处理 |
| 搜索 API | `api/anime/search/route.ts` | GET 关键词搜索（标题/原名/描述），tag 过滤，分页 |
| 标签 API | `api/anime/tags/route.ts` | GET 所有标签列表，按名称排序 |
| AnimeCard | `components/anime/AnimeCard.tsx` | 封面（含默认占位）、标题、年份/地区/集数、状态标签、分类标签，hover 缩放动画 |
| AnimeGrid | `components/anime/AnimeGrid.tsx` | 响应式网格（2-5 列），空状态提示，分页控件（页码省略号 + 上一页/下一页） |
| AnimeDetail | `components/anime/AnimeDetail.tsx` | 封面 + 元信息双栏布局，状态/标签（可点击跳转搜索）、年份/地区/集数、简介 |
| EpisodeList | `components/anime/EpisodeList.tsx` | 剧集网格（2-5 列），免费/价格标签，选中高亮，播放器占位 |
| SearchBar | `components/anime/SearchBar.tsx` | 关键词输入框 + 标签选择按钮组，客户端路由导航 |
| 动漫列表页 | `app/anime/page.tsx`, `AnimeGridWrapper.tsx` | Server component 直接数据库查询，客户端标签过滤 + 分页，Suspense 友好 |
| 搜索页 | `app/anime/search/page.tsx`, `SearchPageContent.tsx` | Suspense boundary 包裹，客户端搜索请求，空输入/loading/无结果三种状态 |
| 动漫详情页 | `app/anime/[id]/page.tsx` | Server component 数据获取，含 AnimeDetail + EpisodeList，notFound 处理 |
| 播放页 | `app/anime/[id]/episode/[episodeId]/page.tsx` | 基础占位页，显示动漫名和集数 |

**产出**：动漫内容可浏览、搜索、播放

---

## Iteration 3（第 5-6 周）：支付与订单

**目标**：用户可下单并完成支付

### 任务清单

- [x] 实现购物车/下单页面
- [x] 创建订单 API + 订单详情页
- [~] 集成支付宝 SDK（创建支付 + 回调处理）— 使用 Mock 代替，后续接入真实网关
- [~] 集成微信支付 SDK（统一下单 + 回调处理）— 使用 Mock 代替，后续接入真实网关
- [~] 实现支付二维码展示与轮询状态 — 使用 Mock 代替
- [x] 订单列表页（按状态筛选）
- [x] 处理边界情况：支付超时、取消订单、支付失败

### 完成详情

| 模块 | 文件 | 说明 |
|------|------|------|
| 创建订单 API | `api/order/route.ts` (POST) | JWT 鉴权，支持购买单集或整部动漫，查询 Anime/Episode 获取价格，创建 Order + OrderItem |
| 订单列表 API | `api/order/route.ts` (GET) | 当前用户订单列表，分页，按 status 筛选（全部/待支付/已支付/已取消） |
| 订单详情 API | `api/order/[id]/route.ts` (GET) | 验证订单归属（userId 匹配），返回完整订单含 items、anime、episode、payment 信息 |
| Mock 支付 API | `api/order/[id]/pay/route.ts` (POST) | 验证归属 + PENDING 状态，生成随机交易号，创建 Payment 记录，Order 状态 → PAID |
| 结算页 | `app/order/checkout/page.tsx` | 从 URL 参数读取 animeId/episodeId，展示商品名和价格，"提交订单"创建后跳转详情 |
| 订单详情页 | `app/order/[id]/page.tsx` | 展示订单编号、状态、商品列表、金额，已支付显示交易号/支付方式/时间，待支付显示"模拟支付"按钮 |
| 订单列表页 | `app/order/page.tsx` | 顶部 tabs（全部/待支付/已支付/已取消），订单表格，分页 |
| OrderStatus | `components/order/OrderStatus.tsx` | 状态徽标：待支付(amber)、已支付(green)、已取消(zinc)、退款中(blue)、已退款(purple) |
| OrderTable | `components/order/OrderTable.tsx` | 订单表格组件，展示商品、金额、状态、时间、操作链接，空状态处理 |
| CheckoutForm | `components/order/CheckoutForm.tsx` | 下单表单，展示商品 + 金额，提交订单按钮，loading/error 状态 |
| PaymentButton | `components/pay/PaymentButton.tsx` | Mock 支付按钮，点击即标记已支付，提示 Mock 模式，loading/error 状态 |
| EpisodeList 购买入口 | `components/anime/EpisodeList.tsx` | 非免费剧集添加"购买"按钮，链接到结算页 |
| 类型定义 | `types/order.ts`, `types/pay.ts` | Order、OrderItem、Payment 接口定义 |

**产出**：完整的下单→Mock支付→订单查看流程，Mock 模式不集成真实支付网关

---

## Iteration 4（第 7-8 周）：管理与打磨

**目标**：后台管理 + 体验优化

### 任务清单

- [x] 后台：订单管理（查看详情、退款处理）
- [x] 后台：用户管理（列表、详情、消费统计）
- [x] 后台：动漫管理（列表、创建、编辑、删除）
- [x] 后台仪表盘（统计概览）
- [x] 全局错误边界 + 404 页面
- [x] 骨架屏加载组件 + 各页面 loading 状态
- [x] 响应式移动端优化（Header、Admin 布局）
- [ ] 支付安全教育：防重放、签名验证、订单幂等 — 待真实支付网关集成时处理
- [ ] 部署到生产环境

### 完成详情

| 模块 | 文件 | 说明 |
|------|------|------|
| 认证辅助 | `lib/admin-auth.ts` | `requireAdmin(authorization)` 异步函数，JWT 解码 + DB 查询 user.role 校验 ADMIN 角色 |
| 订单管理 API | `api/admin/orders/route.ts` (GET) | 全部订单分页列表，status 筛选，含 user/items/payment 关联数据 |
| 订单详情 API | `api/admin/orders/[id]/route.ts` (GET) | 管理员视角完整订单详情 |
| 退款 API | `api/admin/orders/[id]/refund/route.ts` (PUT) | 校验 PAID 状态，更新 Order → REFUNDED，Payment → REFUND |
| 用户管理 API | `api/admin/users/route.ts` (GET) | 分页用户列表，role/keyword 筛选，含订单数统计 |
| 用户详情 API | `api/admin/users/[id]/route.ts` (GET) | 用户信息 + 各状态订单数 + 总消费金额 |
| 动漫管理 API | `api/admin/animes/route.ts` (GET + POST) | 分页列表（搜索/状态筛选）+ 创建（含标签绑定） |
| 动漫详情/编辑/删除 API | `api/admin/animes/[id]/route.ts` (PUT + DELETE) | 更新全部字段（含标签重绑）+ 删除 |
| 仪表盘 API | `api/admin/stats/route.ts` (GET) | 动漫数/订单数/今日订单/用户数/总收入/订单状态分布 |
| Admin 布局 | `app/admin/layout.tsx` | 侧边栏导航（仪表盘/订单/用户/动漫），移动端 hamburger 滑出菜单 + 遮罩层 |
| 仪表盘 | `app/admin/page.tsx` | 4 个统计卡片（可点击跳转）+ 订单状态分布 + 今日数据 |
| 订单管理页 | `app/admin/orders/page.tsx` | 状态 tabs 筛选，桌面表格/移动端卡片，分页 |
| 订单详情页 | `app/admin/orders/[id]/page.tsx` | 订单信息、商品列表、支付信息、退款按钮 |
| 用户管理页 | `app/admin/users/page.tsx` | 搜索框 + 角色筛选，桌面表格/移动端卡片 |
| 用户详情页 | `app/admin/users/[id]/page.tsx` | 用户信息 + 各状态订单数 + 消费统计 |
| 动漫管理页 | `app/admin/animes/page.tsx` | 搜索 + 状态筛选，桌面表格/移动端卡片，行内删除确认 |
| 创建动漫页 | `app/admin/animes/new/page.tsx` | 完整表单（标题/描述/年份/地区/状态/标签选择） |
| 编辑动漫页 | `app/admin/animes/[id]/edit/page.tsx` | 预填充表单，保存后跳转列表 |
| 全局错误边界 | `app/error.tsx` | 500 页面，显示错误信息，支持重试 + 返回首页 |
| 404 页面 | `app/not-found.tsx` | 简洁 404 提示，返回首页链接 |
| Skeleton 组件 | `components/ui/Skeleton.tsx` | 可复用骨架屏原子组件 |
| 全局加载 | `app/loading.tsx` | 10 个卡片骨架屏网格 |
| 动漫列表加载 | `app/anime/loading.tsx` | 标签 pills + 卡片网格骨架屏 |
| 动漫详情加载 | `app/anime/[id]/loading.tsx` | 双栏布局 + 剧集列表骨架屏 |
| 订单列表加载 | `app/order/loading.tsx` | tabs + 5 行卡片骨架屏 |
| Header 响应式 | `components/layout/Header.tsx` | 移动端 hamburger 菜单含全部导航项 + 管理员链接 |

**产出**：完成的后台管理系统 + 错误/加载状态覆盖 + 移动端适配
