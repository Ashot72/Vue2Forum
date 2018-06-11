export default [
  {
    path: '/forums',
    name: 'forums',
    component: () => import('@/components/forums/Forums'),
  },
  {
    path: '/topics/:forumId',
    name: 'topics',
    component: () => import('@/components/topics/Topics'),
    props: true,
    meta: { auth: true }
  },
  {
    path: '/posts/:forumId/:topicId',
    name: 'posts',
    component: () => import('@/components/posts/Posts'),
    props: true,
    meta: { auth: true }
  },      
  {
    path: '/',
    redirect: '/forums'
  },
  {
    path: '/*',
    redirect: '/forums'
  }
]