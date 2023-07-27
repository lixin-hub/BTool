import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
  Components({
    resolvers: [
      AntDesignVueResolver({
        importStyle: false, // css in js
      }),
    ],
  }),
  ],
  extensions: [".js", ".ts", ".tsx", ".jsx"],
  resolve: {
    alias: {
      // '@components': join(root, '/components'),
      '@': path.resolve(__dirname, './src') //在任何模块文件内部，可以使用__dirname变量获取当前模块文件所在目录的完整绝对路径。
    }
  },
})
