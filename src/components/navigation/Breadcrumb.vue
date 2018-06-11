<template>
  <b-breadcrumb :items="items" class="nav"/>
</template>

<script>
  import { FETCHFORUM } from '../../store/forum/action-types'
  import { FETCHTOPIC } from '../../store/topic/action-types'

  export default {
    data () {
      return {
        items: []
     }
   },
   watch: {
     $route (to, from) {       
       switch(to.name) {
         case 'forums':
           this.genForumsItems()
           break
         case 'topics':
           this.genTopicsItems(to.params.forumId)
           break
         case 'posts':
           const { forumId, topicId } = to.params 
           this.genPostsItems(forumId, topicId)
           break
       }
     }
   },
   methods: {
     getForumName(forumId) {   
       return this.$store.dispatch(`forum/${ FETCHFORUM }`, forumId)
     },
     getTopicName(topicId) {
       return this.$store.dispatch(`topic/${ FETCHTOPIC }`, topicId)
     },
     genForumsItems() {
       this.items = [{ text: 'Home' }]    
     },
     genTopicsItems(forumId) {
       this.getForumName(forumId).then(({ data }) => {
         this.items = [
           { text: 'Home', to: { name: 'forums' }},
           { text: data.name }]
         })
      },
      genPostsItems(forumId, topicId) {      
        Promise.all([
          this.getForumName(forumId),
          this.getTopicName(topicId)]
        ).then(([{ data: fData }, { data: tData }]) => {
          this.items = [
            { text: 'Home', to: { name: 'forums' }},
            { text: fData.name, to: { name: 'topics', params: { forumId } } }, 
            { text: tData.title }    
          ]
         })       
      }         
   }
}
</script>

<style scoped>
  .breadcrumb { 
    background-color: white;
    padding: .75rem 1rem 0 1rem;
  }
  .nav {
    height:32px
  }
</style>
