# Docker 架构与配置

## 整体架构

```
┌──────────────────────────────────────────────────┐
│                 docker compose                     │
│  ┌─────────────────────┐  ┌──────────────────┐   │
│  │   next-app (container)│  │  db (container)  │   │
│  │  ┌───────────────┐  │  │  postgres:16-     │   │
│  │  │  Next.js App   │  │  │  alpine          │   │
│  │  │  :3000         │◄─┼──┤  :5432           │   │
│  │  └───────────────┘  │  │                   │   │
│  │  volume: ./ → /app  │  │  volume: pgdata   │   │
│  │  (热重载)            │  │  (持久化)          │   │
│  └─────────────────────┘  └──────────────────┘   │
│  Network: internal                                   │
└──────────────────────────────────────────────────┘
```

- `next-app`: Next.js 应用容器，开发模式挂载源码实现热重载，生产模式运行编译产物
- `db`: PostgreSQL 16 Alpine，数据卷持久化，仅内部网络可访问
- 两个容器通过 `docker compose` 自定义网络通信，宿主机只需暴露 `:3000`

## Dockerfile（多阶段构建）

```dockerfile
# ---- 依赖安装阶段 ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# ---- 构建阶段 ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate && npm run build

# ---- 生产运行阶段 ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

## docker-compose.yml

```yaml
version: "3.9"

services:
  db:
    image: postgres:16-alpine
    container_name: anime-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER:-anime}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-anime_secret}
      POSTGRES_DB: ${DB_NAME:-anime_platform}
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-anime} -d ${DB_NAME:-anime_platform}"]
      interval: 10s
      timeout: 5s
      retries: 5

  next-app:
    build:
      context: .
      target: ${BUILD_TARGET:-development}
    container_name: anime-next
    restart: unless-stopped
    ports:
      - "${APP_PORT:-3000}:3000"
    environment:
      DATABASE_URL: postgresql://${DB_USER:-anime}:${DB_PASSWORD:-anime_secret}@db:5432/${DB_NAME:-anime_platform}
      NODE_ENV: ${NODE_ENV:-development}
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    depends_on:
      db:
        condition: service_healthy

volumes:
  pgdata:
```

## .env 示例

```bash
# PostgreSQL
DB_USER=anime
DB_PASSWORD=anime_secret
DB_NAME=anime_platform

# Next.js
APP_PORT=3000
NODE_ENV=development
BUILD_TARGET=development    # development / production

# Prisma 连接 Docker 内的数据库
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}

# JWT
JWT_SECRET=your-jwt-secret-here

# 支付宝
ALIPAY_APP_ID=
ALIPAY_PRIVATE_KEY=
ALIPAY_PUBLIC_KEY=

# 微信支付
WECHAT_APP_ID=
WECHAT_MCH_ID=
WECHAT_API_KEY=
```

## .dockerignore

```
node_modules
.next
.git
.env.local
*.md
.DS_Store
```

## 常用命令

| 命令 | 用途 |
|------|------|
| `docker compose up -d` | 后台启动所有服务 |
| `docker compose up -d --build` | 重新构建镜像后启动 |
| `docker compose down` | 停止并删除容器（保留数据卷） |
| `docker compose down -v` | 停止并删除容器及数据卷（⚠️ 清空数据库） |
| `docker compose logs -f next-app` | 跟踪 Next.js 日志 |
| `docker compose exec next-app npx prisma migrate dev` | 执行数据库迁移 |
| `docker compose exec next-app npx prisma db seed` | 运行种子数据 |
| `docker compose exec db psql -U anime anime_platform` | 连接数据库 CLI |

## 开发 vs 生产差异

| 维度 | 开发模式 | 生产模式 |
|------|----------|----------|
| BUILD_TARGET | `development` | `production` |
| 源码挂载 | ✅ 挂载本地目录，热重载 | ❌ 镜像内只读 |
| node_modules | 宿主机 + 容器分离（volume 覆盖） | 镜像内构建产物 |
| 数据库迁移 | 手动执行 `docker compose exec` | 启动时自动运行或 init container |
| 镜像大小 | 包含 devDeps，较大 | 仅 standalone 产物 (~150MB) |
| 端口 | `:3000` 直接暴露 | Nginx 反代 + `:3000` |
