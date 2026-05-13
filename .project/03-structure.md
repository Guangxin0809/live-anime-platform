# 项目目录结构

```
live-comic-platform/
├── Dockerfile                  # Next.js 多阶段构建
├── docker-compose.yml          # 编排 Next.js + PostgreSQL
├── .dockerignore
├── .env
├── .env.local
├── next.config.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── prisma/
│   ├── schema.prisma          # 数据库模型
│   └── seed.ts                # 种子数据
├── public/
│   └── images/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx         # 根布局
│   │   ├── page.tsx           # 首页
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── callback/      # OAuth 回调
│   │   ├── anime/
│   │   │   ├── page.tsx                 # 动漫列表 (server)
│   │   │   ├── AnimeGridWrapper.tsx     # 动漫列表客户端交互
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx             # 动漫详情
│   │   │   │   └── episode/
│   │   │   │       └── [episodeId]/
│   │   │   │           └── page.tsx     # 播放页 (placeholder)
│   │   │   └── search/
│   │   │       ├── page.tsx             # 搜索页 (Suspense wrapper)
│   │   │       └── SearchPageContent.tsx # 搜索页客户端逻辑
│   │   ├── order/
│   │   │   ├── page.tsx       # 订单列表
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx   # 订单详情
│   │   │   └── checkout/
│   │   │       └── page.tsx   # 下单页
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── animes/
│   │   │   ├── orders/
│   │   │   └── users/
│   │   └── api/               # Route Handlers
│   │       ├── auth/
│   │       │   ├── register/route.ts
│   │       │   ├── login/route.ts
│   │       │   └── me/route.ts
│   │       ├── anime/
│   │       │   ├── route.ts       # GET 列表 / POST 创建
│   │       │   ├── [id]/route.ts
│   │       │   └── search/route.ts
│   │       ├── order/
│   │       │   ├── route.ts       # 创建 / 列表
│   │       │   └── [id]/route.ts
│   │       └── pay/
│   │           ├── alipay/
│   │           │   ├── create/route.ts
│   │           │   └── notify/route.ts  # 异步回调
│   │           └── wechat/
│   │               ├── prepay/route.ts
│   │               └── notify/route.ts
│   ├── components/            # 可复用组件
│   │   ├── ui/                # 基础 UI 组件
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── anime/
│   │   │   ├── AnimeCard.tsx
│   │   │   ├── AnimeGrid.tsx
│   │   │   ├── AnimeDetail.tsx
│   │   │   ├── EpisodeList.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── order/
│   │   │   ├── OrderTable.tsx
│   │   │   ├── OrderStatus.tsx
│   │   │   └── CheckoutForm.tsx
│   │   ├── pay/
│   │   │   ├── AlipayButton.tsx
│   │   │   ├── WechatPayButton.tsx
│   │   │   └── PaymentQRCode.tsx
│   │   └── auth/
│   │       ├── LoginForm.tsx
│   │       └── RegisterForm.tsx
│   ├── lib/                   # 工具函数
│   │   ├── prisma.ts          # Prisma 客户端单例
│   │   ├── auth.ts            # 认证工具函数
│   │   ├── pay.ts             # 支付工具函数
│   │   └── utils.ts           # 通用工具
│   ├── actions/               # Server Actions
│   │   ├── auth.ts
│   │   ├── anime.ts
│   │   └── order.ts
│   └── types/                 # TypeScript 类型定义
│       ├── anime.ts
│       ├── order.ts
│       ├── user.ts
│       └── pay.ts
```
