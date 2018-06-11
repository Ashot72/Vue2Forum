<template>
  <div> 
    <app-loader v-if="loading"></app-loader>
    <div>
      <app-header></app-header>
      <app-nav></app-nav>
    </div>
  <div>     
    <b-container fluid>
      <transition       
        enter-active-class="animated fadeInRight"
        leave-active-class="animated fadeOutLeft"
        mode="out-in">
          <router-view></router-view>
      </transition>  
    </b-container>        
   </div>
   <app-confirm @onConfirm="closeDialog" ref="modal">
     Error
     <p slot="content">{{ error }}</p>
     <template slot="action">OK</template>
   </app-confirm>
  </div>
</template>

<script>
  import Header from './components/Header'
  import Loader from './components/loading/Loader'
  import Nav from './components/navigation/Breadcrumb'
  import Confirm from './components/shared/Confirm'
  import { EventBus } from './plugins/event-bus'
  import { LOADER_EVENT } from './helpers/constants'
  import { CLEARERROR } from './store'

  export default {
    name: 'app', 
    data() {
      return {
        loading: false
      }
    },
    computed: {
      error() {
        return this.$store.state.error
      }     
  },
  components: {
    appHeader: Header,
    appLoader: Loader,
    appNav: Nav,
    appConfirm: Confirm
  }, 
  methods: {      
    closeDialog() {
      this.$refs.modal.hide()
      this.$store.commit(CLEARERROR)
    }
  },  
  mounted() { 
   this.$watch(      
     () => {
       if (this.error) {        
         this.$refs.modal.show()
       }         
     }
    ),
    EventBus.$on(LOADER_EVENT, loading => {
      this.loading = loading
    })
  }  
}
</script>
  
<style>
   @import "https://fonts.googleapis.com/css?family=Kavivanar";
   @import "animate.css/animate.css";
   
   body {
     font-size: 0.9rem;
     font-family: 'Kavivanar', cursive;
     padding-top: 57px;
  }
  .header {
    background-color:#0072c6;
    color:white;
    height: 32px;
    align-items: center;
  }
</style>
