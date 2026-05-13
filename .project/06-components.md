# 组件树概览

```
<RootLayout>
  <AuthProvider>
    <Header>
      <Logo />
      <SearchBar />
      <NavLinks />
      <UserMenu />           {/* 登录后显示：头像、订单入口 */}
    </Header>
    <main>
      {/* 首页 */}
      <HomePage>
        <Banner />
        <AnimeGrid>
          <AnimeCard />*N
        </AnimeGrid>
      </HomePage>

      {/* 动漫列表/搜索 */}
      <AnimeListPage>
        <FilterSidebar />
        <AnimeGrid>
          <AnimeCard />*N
        </AnimeGrid>
        <Pagination />
      </AnimeListPage>

      {/* 动漫详情 */}
      <AnimeDetailPage>
        <AnimeInfo />         {/* 封面、简介、标签 */}
        <EpisodeList>
          <EpisodeItem />*N
        </EpisodeList>
      </AnimeDetailPage>

      {/* 登录/注册 */}
      <LoginPage>   <LoginForm />   </LoginPage>
      <RegisterPage> <RegisterForm /> </RegisterPage>

      {/* 下单页 */}
      <CheckoutPage>
        <OrderSummary />
        <PayMethodSelector />
        <AlipayButton />
        <WechatPayButton />
        <PaymentQRCode />
      </CheckoutPage>

      {/* 订单管理 */}
      <OrderListPage>
        <OrderTable>
          <OrderStatus />*N
        </OrderTable>
      </OrderListPage>
    </main>
    <Footer />
  </AuthProvider>
</RootLayout>
```
