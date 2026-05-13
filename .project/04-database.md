# 数据库设计

## 模型关系

```
User ──1:N──> Order ──1:N──> OrderItem
Anime ──1:N──> Episode
Anime ──N:M──> Tag
OrderItem ──N:1──> Anime
OrderItem ──N:1──> Episode (nullable，可购买整部也可买单集)
Order ──1:1──> Payment
```

## Prisma Schema 概要

> **数据源配置**：Prisma 通过环境变量 `DATABASE_URL` 连接数据库。
> 在 Docker 环境下，该 URL 指向 db 服务名而非 localhost：
> `postgresql://anime:anime_secret@db:5432/anime_platform`

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hashed
  nickname  String?
  avatar    String?
  phone     String?  @unique
  role      Role     @default(USER)
  orders    Order[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role { USER ADMIN }

model Anime {
  id            String    @id @default(cuid())
  title         String
  originalTitle String?   // 原版标题
  cover         String?   // 封面图 URL
  description   String?   @db.Text
  releaseYear   Int?
  region        String?   // 地区
  status        AnimeStatus @default(ONGOING)
  totalEpisodes Int?
  tags          Tag[]
  episodes      Episode[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum AnimeStatus { ONGOING FINISHED UPCOMING }

model Episode {
  id        String   @id @default(cuid())
  animeId   String
  anime     Anime    @relation(fields: [animeId], references: [id])
  number    Int
  title     String?
  videoUrl  String?  // 视频源地址
  duration  Int?     // 秒
  isFree    Boolean  @default(false)
  price     Decimal? @db.Decimal(10, 2) // 单集购买价格
  order     Int      @default(0)        // 排序
  createdAt DateTime @default(now())
}

model Tag {
  id     String  @id @default(cuid())
  name   String  @unique
  animes Anime[]
}

model Order {
  id         String       @id @default(cuid())
  userId     String
  user       User         @relation(fields: [userId], references: [id])
  total      Decimal      @db.Decimal(10, 2)
  status     OrderStatus  @default(PENDING)
  items      OrderItem[]
  payment    Payment?
  createdAt  DateTime     @default(now())
  paidAt     DateTime?
  updatedAt  DateTime     @updatedAt
}

enum OrderStatus { PENDING PAID CANCELLED REFUNDING REFUNDED }

model OrderItem {
  id        String   @id @default(cuid())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id])
  animeId   String
  anime     Anime    @relation(fields: [animeId], references: [id])
  episodeId String?  // null 表示购买整部动漫
  episode   Episode? @relation(fields: [episodeId], references: [id])
  price     Decimal  @db.Decimal(10, 2)
}

model Payment {
  id         String        @id @default(cuid())
  orderId    String        @unique
  order      Order         @relation(fields: [orderId], references: [id])
  method     PayMethod
  tradeNo    String?       @unique  // 支付平台交易号
  amount     Decimal       @db.Decimal(10, 2)
  status     PaymentStatus @default(PENDING)
  paidAt     DateTime?
  rawData    Json?         // 支付回调原始数据
  createdAt  DateTime      @default(now())
}

enum PayMethod { ALIPAY WECHAT }
enum PaymentStatus { PENDING SUCCESS FAILED REFUND }
```
