import Vue from 'vue'

const API_URL = 'https://vue-forums.firebaseio.com'
const REFRESHTOKEN_URL = 'https://securetoken.googleapis.com/v1/token'

export default {
  install (Vue, { storageKey, key, loader }) {    
    Vue.axios.forums.defaults.baseURL = API_URL    
    this.storageKey = storageKey
    this.key = key
    this.auth = true

    Vue.axios.forums.interceptors.request.use(config => {          
      if (this.auth) {
        config.url = this.constructURL(config)
      }
      this.auth = true
      loader(true)
      return config        
    })
    Vue.axios.forums.interceptors.response.use(res => {              
      loader(false)    
      return res
    }, ({ response }) => {
      loader(false)
      if (this._isInvalidToken(response)) {
        return this._refreshToken(response.config)
      }
    })

    Vue.prototype.$forums = this
  },
  constructURL(config) {
    const index = config.url.indexOf('auth') 
    if(index !== -1) {
      config.url = config.url.substring(0, index - 1)
    }
    const separator = config.url.indexOf('?') === -1 ? '?' : '&'
    return config.url + separator + 'auth=' + this.getIdToken()
  },
  fetchForums() {
    this.auth = false
    return Vue.axios.forums.get('/forums.json')
  },
  fetchForum(id) {
    return Vue.axios.forums.get(`/forums/${ id }.json`)
  },
  addForum(forum) {
    return Vue.axios.forums.post('/forums.json', forum)
  },
  updateForumAndTopicId(topics, id, topicId) {    
    return Vue.axios.forums.patch(`/forums/${ id }.json`, { topics, topicsId: topicId })
  },
  updateForum(id, forum) {
    return Vue.axios.forums.patch(`/forums/${ id }.json`, forum)
  },
  deleteForumTopicId(topics, id, topicId) {   
    return Vue.axios.forums.patch(`/forums/${ id }/topicsId.json`, topicId)
  },
  deleteForum(id) {
    return Vue.axios.forums.delete(`/forums/${ id }.json`)
  },    
  fetchTopics(forumId) {
    return Vue.axios.forums.get(`/topics.json?orderBy="forumId"&equalTo="${ forumId }"`)
  },
  fetchPost(id) {
    return Vue.axios.forums.get(`/posts/${ id }.json`)
  },    
  fetchTopic(id) {
    return Vue.axios.forums.get(`/topics/${ id }.json`)
  },
  addTopic(topic) {
    return Vue.axios.forums.post('/topics.json', topic)
  },
  updateTopic(id, topic) {
    return Vue.axios.forums.patch(`/topics/${ id}.json`, topic)
  },
  addTopicPostId(id, postId) {     
    return Vue.axios.forums.patch(`/topics/${ id }/postsId.json`, postId)
  },
  deleteTopic(id) {
    return Vue.axios.forums.delete(`/topics/${ id }.json`)
  },
  fetchPosts(topicId) {
    return Vue.axios.forums.get(`/posts.json?orderBy="topicId"&equalTo="${ topicId }"`)
  },
  addPost(post) {
    return Vue.axios.forums.post('/posts.json', post)
  },
  updatePost(id, post) {
    return Vue.axios.forums.patch(`/posts/${ id }.json`, post)
  },
  deletePost(id) {
    return Vue.axios.forums.delete(`/posts/${ id }.json`)
  },
  deleteTopicPostId(id, postId) {     
    return Vue.axios.forums.delete(`/topics/${ id }/postsId.json`, postId)
  },
  addUser(email) {
    this.auth = false
    return Vue.axios.forums.post('/users.json', email)
  },
  getIdToken() {
    const storage = localStorage.getItem(this.storageKey)
    if (storage) {
      const vueForum = JSON.parse(storage)   
      return vueForum.idToken        
    } else {
      return null
    }            
  },
  _refreshToken(req) {
    this.auth = false
    const storage = localStorage.getItem(this.storageKey)
    if (!storage) {
      return Promise.reject("signout")
    }
    return Vue.axios.forums.post(`${REFRESHTOKEN_URL}?key=${this.key}`, {
      'grant_type': 'refresh_token',
      'refresh_token': JSON.parse(storage).refreshToken
    }).then(({ data }) => {
      this._storeToken(data)
      return this._retry(req)
     }).catch(() => Promise.reject("signout"))
   },
   _retry (req) {    
     return Vue.axios.forums(req)       
   },
    _storeToken({ id_token, refresh_token, expires_in }) {
      const storage = JSON.parse(localStorage.getItem(this.storageKey))
      localStorage.setItem(this.storageKey, 
              JSON.stringify({ idToken: id_token, refreshToken: refresh_token , email: storage.email, expiresIn: expires_in }))
    },
    _isInvalidToken({ status }) {
       return status === 401
    }
}
