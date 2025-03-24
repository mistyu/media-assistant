import { createRouter, createWebHashHistory } from 'vue-router'
import AI from '../views/AIEdit/index.vue'
import AIEdit from '../views/AIEdit/Main/Edit.vue'
import Video from '../views/Video/index.vue'
import Publish from '../views/Video/Main/Publish.vue'
import MyVideo from '../views/Video/Main/MyVideo.vue'

const router = createRouter({
  //  hash 模式。
  history: createWebHashHistory(),
  routes: [
    // 设置首页
    {
      path: '/',
      redirect: 'Video',
      children: [
        {
          name: 'Video',
          path: 'video',
          component: Video,
          redirect: 'video/publish',
          children: [
            {
              name: 'Publish',
              path: 'publish',
              component: Publish
            },
            {
              name: 'MyVideo',
              path: 'my-video',
              component: MyVideo
            }
          ]
        },
        {
          path: 'ai',
          name: 'AI',
          component: AI,
          redirect: 'ai/edit',
          children: [
            {
              name: 'Edit',
              path: 'edit',
              component: AIEdit
            }
          ]
        }
      ]
    }
  ]
})

export default router
