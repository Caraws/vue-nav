<template>
    <div id="app">
        <ul class="section">
            <li v-for="(item, index) in navs" 
                :class='item.bgColor' 
                :id='`section${index}`'
                :style='getWinH'
                :key="item.id">
                {{ item.title }}
            </li>
        </ul>
        <footer>
            <p>超出导航范围啦</p>
        </footer>
        <vue-nav :options='options'></vue-nav>
    </div>
    
</template>

<script>
import vueNav from './components/vue-nav'
export default {
    name: "app",
    data: _ => ({
        navs: [
            {
                id: Math.random() * (+new Date),
                title: 'JavaScript',
                bgColor: 'bg-blue'
            },
            {
                id: Math.random() * (+new Date),
                title: 'HTML',
                bgColor: 'bg-roseate'
            },
            {
                id: Math.random() * (+new Date),
                title: 'CSS',
                bgColor: 'bg-light-green'
            },
            {
                id: Math.random() * (+new Date),
                title: 'Node.js',
                bgColor: 'bg-light-black'
            },
            {
                id: Math.random() * (+new Date),
                title: 'Vue.js',
                bgColor: 'bg-pink'
            },
            {
                id: Math.random() * (+new Date),
                title: 'SASS',
                bgColor: 'bg-brown'
            },
            {
                id: Math.random() * (+new Date),
                title: 'Eslint',
                bgColor: 'bg-yellow'
            }
        ]
    }),
    components: {
        vueNav
    },
    computed: {
        options: function () {
            let options = {
                offset: 0,
                bindData: this.navs,
                backToTop: 0
            }
            options.data = this.navs.map((item, index) => {
                
                return {
                    name: item.title,
                    target: `section${index}`
                }
            })
            return options
        },
        getWinH () {
            return {
                height: `${window.innerHeight}px`
            }
        }
    }
};
</script>

<style lang='scss'>
    @import '../static/style/main.scss';
</style>
