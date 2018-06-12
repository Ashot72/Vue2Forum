<template>
  <b-container fluid>
    <b-row class="mb-1"> 
      <edit-topic v-if="topic.creator === email" class="px-1" :form="topic">
        <template>Edit Topic '{{ topic.title }}'</template>                
      </edit-topic>
      <edit-post  class="px-1" ref="editPostModal"></edit-post>
      <reply-post  class="px-1" ref="replyPostModal"></reply-post>
      <b-link v-if="topic.creator === email" @click="deleteTopicConfirm">Delete Topic</b-link>
      </b-row>
      <div>            
        <b-row class="header mb-3">
          <b-col>{{ topic.title }}</b-col>
        </b-row>
        <div class="mt-2" v-for="(post, index) in posts" :key="post.id">
          <div :id=last(index)>
            <b-row>
              <b-col sm="2">
                <b-img :src="require('@/assets/noimage.jpg')" thumbnail alt="Profile Picture" />
                <div class="mt-2 info">{{ post.creator }}</div>
                <div class="info">{{ post.createdDate | formatDate }}</div>
              </b-col>
              <b-col sm="10" :class= "{ answered: post.answered }">
                <div><b>{{ post.title }}</b></div>
                <div class="mt-2"><span v-html="lnToBr(post.content)"></span></div>
              </b-col>
            </b-row>
            <b-row class="float-right">
              <b-col cols="12">
                <b-link v-if="index !== 0 && index === posts.length - 1 && post.creator === email"  class="mx-1" @click="deletePostConfirm(post)">Delete</b-link>
                <b-link v-if="posts[0].creator === email" class="mx-1" @click="answered(post)">{{ post.answered ? 'Mark not Answered' : 'Mark Answered' }}</b-link>
                <b-link v-if="post.creator === email" class="mx-1" @click="editPost(post)">Edit</b-link>
                <b-link class="mx-1" @click="replyPost(post)">Reply</b-link>
              </b-col>
            </b-row>
          </div>
          <hr class="mt-4" />
        </div>
        <app-confirm @onConfirm="deleteTopic" ref="deleteTopicModal">
          Delete Topic
          <p slot="content">Are you sure you want to delete topic '{{ topic.title }}' ?</p>
          <template slot="action">Yes</template>
          <template slot="close">No</template>
        </app-confirm>
        <app-confirm @onConfirm="deletePost" ref="deletePostModal">
          Delete Post
          <p slot="content">Are you sure you want to delete post '{{ post.title }}' ?</p>
          <template slot="action">Yes</template>
          <template slot="close">No</template>
        </app-confirm>
      </div>   
    </b-container>  
</template>

<script>
  import EditTopic from '../topics/EditTopic'
  import EditPost from '../posts/EditPost'
  import ReplyPost from '../posts/ReplyPost'

  import { router } from '@/plugins/vue-router'

  import { mapState, mapActions } from 'vuex'
  import store from '@/store'
  import Confirm from '@/components/shared/Confirm'
  import { DELETETOPIC } from '@/store/topic/action-types'
  import { FETCHPOSTSTOPIC, FETCHPOSTS, DELETEPOST, ISANSWER } from '@/store/post/action-types'
  
  export default {
    data() {
      return {
        post: { }
      }
  },
  name: 'posts',
  props: ['forumId', 'topicId'],
  computed: {
    ...mapState('post', ['topic', 'posts']),    
    ...mapState('auth', ['email']),  
  },
  methods: {
    ...mapActions('post', { 
      answered: ISANSWER,
      deleteThePost: DELETEPOST 
    }),
    ...mapActions('topic', { deleteTheTopic: DELETETOPIC }),        
    last(index) {        
      return index === this.posts.length - 1 ? 'last' : this.posts[index].id         
    },
    editPost(post) {
      this.$refs.editPostModal.show(post)
    },
    replyPost(post) {
      this.$refs.replyPostModal.show(post)
    },
    deletePostConfirm(post) {
      this.post = post
      this.$refs.deletePostModal.show()
    },      
    deletePost(del) {       
      if (del) {
        this.deleteThePost(this.post)
          .then(() => this.$refs.deletePostModal.hide())
      } else {
        this.$refs.deletePostModal.hide()
      }           
    },
    deleteTopicConfirm() {
      this.$refs.deleteTopicModal.show()
    },
    deleteTopic(del) {       
      if (del) {
        this.deleteTheTopic({ forumId: this.forumId, topicId: this.topicId })
          .then(() => {
            this.$refs.deleteTopicModal.hide()
            setTimeout(() => router.replace(`/topics/${ this.forumId }`), 150)            
        })
      } else {
        this.$refs.deleteTopicModal.hide()
      }          
    },
    lnToBr(content) {
      return content.replace(/(?:\r\n|\r|\n)/g, '<br>')
    }
  },
  beforeRouteEnter (to, from, next) {    
    Promise.all([
      store.dispatch(`post/${ FETCHPOSTS }`, to.params.topicId),
      store.dispatch(`post/${ FETCHPOSTSTOPIC }`, to.params.topicId)
    ]).then(() => next())
  }, 
  components: {   
    editTopic: EditTopic,  
    editPost: EditPost,
    replyPost: ReplyPost,
    appConfirm: Confirm
  }
}
</script>

<style scoped>
  .info {
     display: flex;
     justify-content: center;
  }
  .answered {
    border: 2px solid lightgray;
  }
</style>
