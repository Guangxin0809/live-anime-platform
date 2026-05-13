# 动漫内容平台 — 产品规划与开发计划

> 技术栈：Next.js 16 (App Router) + TypeScript + Prisma 7 + PostgreSQL 16 Alpine + Docker

---

## 文档索引

| # | 模块 | 文件 | 说明 |
|---|------|------|------|
| 1 | 产品概述 | [`.project/01-product.md`](.project/01-product.md) | 产品定位、目标用户、核心价值 |
| 2 | 功能模块规划 | [`.project/02-features.md`](.project/02-features.md) | 4 个 Phase 的优先级与功能描述 |
| 3 | 项目目录结构 | [`.project/03-structure.md`](.project/03-structure.md) | 完整目录树 |
| 4 | 数据库设计 | [`.project/04-database.md`](.project/04-database.md) | 模型关系、Prisma Schema |
| 5 | API 接口设计 | [`.project/05-api.md`](.project/05-api.md) | 认证/动漫/订单/支付 API 列表 |
| 6 | 组件树概览 | [`.project/06-components.md`](.project/06-components.md) | 组件层级与路由映射 |
| 7 | Docker 架构与配置 | [`.project/07-docker.md`](.project/07-docker.md) | Dockerfile、compose、env、命令 |
| 8 | 开发计划与时间线 | [`.project/08-development-plan.md`](.project/08-development-plan.md) | 4 个 Iteration 任务与完成详情 |
| 9 | 关键技术决策 | [`.project/09-tech-decisions.md`](.project/09-tech-decisions.md) | 选型理由与对比 |
| 10 | 环境与依赖清单 | [`.project/10-dependencies.md`](.project/10-dependencies.md) | 运行时/开发/Docker 依赖 |
| 11 | 风险与缓解 | [`.project/11-risks.md`](.project/11-risks.md) | 6 项风险与应对措施 |

---

## 状态速览

| 迭代 | 内容 | 进度 |
|------|------|------|
| Iteration 1 | 项目初始化 + Docker 环境 + 认证系统 | ✅ 已完成 |
| Iteration 2 | 动漫内容模块（浏览、搜索、详情） | ✅ 已完成 |
| Iteration 3 | 支付与订单 | ⏳ 进行中 |
| Iteration 4 | 管理与打磨 | 📅 待开始 |

> 详细开发计划见 [`.project/08-development-plan.md`](.project/08-development-plan.md)
