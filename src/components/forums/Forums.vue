<template>
  <div>
    <div v-if="isAuth" class="mt-3 mb-1">
      <add-forum></add-forum>           
    </div>  
    <b-container fluid>   
      <b-row class="header">
        <b-col cols="7" sm="6">Name</b-col>
        <b-col class="d-none d-sm-block" sm="2">Topics/Posts</b-col>
        <b-col cols="5" sm="4">Last Post</b-col>
      </b-row>
      <b-row class="mt-2" v-for="forum in forums" :key="forum.id">
        <b-col cols="7" sm="6">
          <b-link :to="params(forum.id)">{{ forum.name }}</b-link>
          <div>{{ forum.description }}</div>
          <b-col cols="12" class="d-sm-none pl-0">
            <span>Topics: <b-link :to="params(forum.id)">{{ forum.topics }}</b-link></span> 
            <span>Posts: <b-link :to="params(forum.id)">{{ forum.posts }}</b-link></span>
          </b-col>
        </b-col>
        <b-col class="d-none d-sm-block" sm="2">
          <div>Topics: <b-link :to="params(forum.id)">{{ forum.topics }}</b-link></div>
          <div>Posts: <b-link :to="params(forum.id)">{{ forum.posts }}</b-link></div>
        </b-col>
        <b-col cols="5" sm="4">
          <div><b-link :to="{ name: 'posts', params: { forumId : forum.id, topicId: forum.lastTopicId }, hash: '#last' }">{{ forum.lastPost }}</b-link></div>
          <div v-if="forum.lastPoster">by {{ forum.lastPoster }}</div>
          <div>{{ forum.lastPostedDate | formatDate }}</div>
         </b-col>
     </b-row>         
    </b-container>  
    <app-confirm @onConfirm="closeDialog" ref="modal">
      Infromation
      <p slot="content">You must sign in to view topics and posts. Please sign in.</p>
      <template slot="action">OK</template>
    </app-confirm>
    </div>
</template>

<script>
   import AddForum from './AddForum'
   import Confirm from '../shared/Confirm'

   import { AUTH } from '@/store/auth/getter-types'
   import { FETCHFORUMS } from '@/store/forum/action-types'

  export default {
    name: 'forums',  
    computed: {
      forums() {
        return this.$store.state.forum.forums
      },
      isAuth() {
        return this.$store.getters[`auth/${ AUTH }`]
      }    
    },
    methods: {      
      params(forumId) {
        return { name: 'topics', params: { forumId } }
      },
      closeDialog() {
        this.$refs.modal.hide()
      }
    },
    created() {
      this.$store.dispatch(`forum/${ FETCHFORUMS }`)
    },
    beforeRouteEnter (to, from, next) {  
      if (to.query.e === 401) {
        next(vm => setTimeout(() => vm.$refs.modal.show(), 800))
      } else { next() }
    },
    beforeRouteUpdate (to, from, next) {     
      if (to.query.e === 401) {
        this.$refs.modal.show()
        next(false)
      } else { next() }
    },
    components: {
      addForum: AddForum,
      appConfirm: Confirm
    } 
  }
</script>
