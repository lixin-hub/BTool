import router from '@/router'

//全局路由拦截
router.beforeEach(async (to, from, next) => {
  next()
})

router.afterEach(() => {
})
