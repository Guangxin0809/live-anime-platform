# 关键技术决策

| 决策点 | 选择 | 理由 |
|--------|------|------|
| 认证方式 | JWT（access + refresh token） | 无状态，适合前后端分离；next-auth 在国内需额外配置 OAuth |
| ORM | Prisma | 类型安全，迁移管理方便，生态成熟 |
| 样式方案 | TailwindCSS | 开发效率高，适合快速迭代 |
| 状态管理 | Zustand | 轻量，无 boilerplate，适合中小项目 |
| 数据请求 | SWR | 与 Next.js 配合好，自动缓存/重新验证 |
| 支付 SDK | 官方 SDK / `alipay-sdk` + `wechat-pay` | 保证签名算法准确 |
| 密码加密 | bcrypt | 业界标准 |
| 数据库镜像 | `postgres:16-alpine` | 体积小（~150MB），安全更新及时，适合容器化部署 |
| Node 基础镜像 | `node:20-alpine` | 与 PostgreSQL 同为 Alpine 系，减少层数 |
| 容器编排 | `docker compose` | 单机多容器，开发和生产共用同一套编排 |
| 构建策略 | 多阶段构建（dev / build / production） | 开发阶段挂载热重载，生产阶段输出最小镜像 |
| 部署 | Docker + 云服务器 | 镜像不可变、环境一致，国内 Vercel 网络不稳定 |
