<template>
  <div class="wrapper-content wrapper-content--fixed">
    <section>
      <div class="container">
        <!-- Error -->
        <div class="error" v-if="error" style="margin-bottom: 20px">
          <p>{{error}}</p>
        </div>
        <!-- Search -->
        <search :value="search" placeholder="Type username" @search="search = $event" />
        <!-- Buttons -->
        <button v-if="!repos" class="btn btnPrimary" @click="getRepos">Search!</button>
        <button v-else class="btn btnPrimary" @click="getRepos">Search Again!</button>
        <!-- Preloader -->
        <preloader v-if="loading" :width="60" :hight="60" />
        <!-- Wrapper -->
        <div class="repos__wrapper" v-if="repos && !loading && !error">
          <!-- User Info -->
          <div class="user">
            <a class="user-avatar" target="_blank" :href="url"><img :src="avatar" :alt="login"></a>
            <div class="user-info">
              <p class="user-login">User: {{login}}</p>
              <p class="repos-amount">Public Repos: {{reposLength}}</p>
            </div>
          </div>
          <!-- Animation -->
          <transition-group name="list">
            <!-- Item -->
            <div class="repos-item" v-for="repo in usersSort" :key="repo.id">
              <!-- Info Repos-->
              <div class="repos-info">
                <a class="link" target="_blank" :href="repo.html_url">{{repo.name}}</a>
                <span>{{repo.stargazers_count}} ⭐</span>
              </div>
            </div>
          </transition-group>
          <!-- Btn LoadMore -->
          <button class="btn btnPrimary" @click="loadMore" :disabled="reposNew.length === 0" :class="{btnDisabled:reposNew.length === 0}">Load More</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import search from '@/components/Search.vue'
import axios from 'axios'
// UI
import preloader from "@/components/UI/Preloader.vue"
export default {
  components: { search, preloader },
  data () {
    return {
      currentSort: 'name',
      currentSortDir: 'asc',
      search: '',
      login: '',
      avatar: '',
      name: '',
      url: '',
      reposLength: null,
      loading: false,
      error: null,
      repos: null,
      reposNew: null
    }
  },
  computed: {
    usersSort () {
      return this.repos.sort((a, b) => {
        let mod = 1
        if (this.currentSortDir === 'desc') mod = -1
        if (a[this.currentSort] < b[this.currentSort]) return -1 * mod
        if (a[this.currentSort] > b[this.currentSort]) return 1 * mod
        return 0
      })
    }
  },
  methods: {
    getRepos () {
      this.loading = true
      axios
        .get(`https://api.github.com/users/${this.search}/repos`)
        .then(res => {
          this.error = null
          let array = [],
            newArray = [];
          for (let i = 0; i < res.data.length; i++) {
            const element = res.data[i];
            if (i < 3) array.push(element)
            else newArray.push(element)
          }
          this.repos = array
          this.reposNew = newArray
        })
        .catch(err => {
          this.repos = null
          this.error = `Can't find this user`
        })
        .finally(() => (this.loading = false))
      axios
        .get(`https://api.github.com/users/${this.search}`)
        .then(res => {
          this.error = null
          this.login = res.data.login
          this.name = res.data.name
          this.url = res.data.html_url
          this.avatar = res.data.avatar_url
          this.reposLength = res.data.public_repos
        })
        .catch(err => {
          this.repos = null
          this.error = `Can't find this user`
        })
    },
    loadMore () {
      let array = [],
        newArray = [];
      if (this.reposNew.length) {
        for (let i = 0; i < this.reposNew.length; i++) {
          const element = this.reposNew[i];
          if (i < 3) array.push(element)
          else newArray.push(element)
        }
      }
      this.repos = [...this.repos, ...array]
      this.reposNew = newArray
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  align-items: center;
  flex-direction: column;
}
button {
  margin-top: 40px;
}
.repos__wrapper {
  display: flex;
  flex-direction: column;
  width: 400px;
  margin: 30px 0;
}
.repos {
  &-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 10px 0;
    border-bottom: 1px solid #dbdbdb;
  }
}
.link {
  border-bottom: 0;
}
.user {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 15px;
  &-avatar {
    width: 80px;
    height: 80px;
    margin-bottom: 10px;
  }
  &-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 80px;
  }
}
.sort-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  p {
    display: inline-block;
    cursor: pointer;
  }
}
button {
  margin-top: 20px;
  &.btnDisabled {
    cursor: default;
    opacity: 0.6;
  }
}
/* Animation */
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to{
  opacity: 0;
  transform: translateY(30px);
}
</style>