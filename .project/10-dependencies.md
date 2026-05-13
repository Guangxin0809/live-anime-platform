# 环境与依赖清单

## 运行时依赖

```
next              16.2.6
react             19.2.4
react-dom         19.2.4
typescript        ^5
prisma            ^7.8.0
@prisma/client    ^7.8.0
bcryptjs          ^3.0.3         (密码加密)
jsonwebtoken      ^9.0.3         (JWT 签发)
pg                ^8.20.0        (PostgreSQL 驱动)
@prisma/adapter-pg ^7.8.0       (Prisma PostgreSQL 适配器)
tailwindcss       ^4             (CSS 工具类)
```

## 开发依赖

```
@types/bcryptjs
@types/jsonwebtoken
@types/pg
@types/node
eslint
tsx               (运行 seed 脚本)
dotenv            (环境变量)
```

## Docker 工具链

| 工具 | 版本 | 用途 |
|------|------|------|
| Docker Engine | >=24.x | 容器运行时 |
| docker compose | V2 (plugin) | 多容器编排 |
| `postgres:16-alpine` | 16.x | 数据库镜像，~150MB |
| `node:20-alpine` | 20.x | Node.js 基础镜像 |
