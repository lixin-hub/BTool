import router from '@/router'

//全局路由拦截
router.beforeEach(async (_to, _from, next) => {
  next()
})

router.afterEach(() => {
})
