<template>
  <div id="app">
    <div>
      <Navbar />
    </div>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import Navbar from '@/components/navbar.vue'; // @ is an alias to /src
import { mapState } from 'vuex'

@Component({
  components: {
    Navbar,
  },
  computed :{
    ...mapState( 'alertSlice',  ['message','type','alertDate'])
  }
})
export default class Home extends Vue {
    public type:any;
    public message:any;

    alert(message:string, variant:'danger'|'success'|'info'|'warning') {
        this.$bvToast.toast(`${message}`, {
          //noCloseButton: true,
          title : 'Message',
          variant,
          solid : true,
          autoHideDelay: variant == 'danger' ? 8000 : 2500,
          toaster: 'b-toaster-top-right'  // 'b-toaster-top-full', 'b-toaster-bottom-full', 'b-toaster-top-center', 'b-toaster-top-right' ....
        })
    }  

    @Watch('alertDate')
    onMesageChanged() {
      if (this.message)
        this.alert(this.message, this.type);
    }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

label {
    display: inline-block;
    font-weight: bolder;
}

table.table-hover.b-table-selectable > tbody > tr:hover > * {
  background-color: aliceblue;
}
</style>