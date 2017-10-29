<template>
    <div id="app">
        <ul class="section">
            <li v-for="item in navs" :key="item.id">
                {{ item.title }}
            </li>
        </ul>
        <footer>
            <p>超出导航范围啦</p>
        </footer>
    </div>
    
</template>

<script>
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
                bgColor: 'bg-blue'
            },
            {
                id: Math.random() * (+new Date),
                title: 'CSS',
                bgColor: 'bg-blue'
            },
            {
                id: Math.random() * (+new Date),
                title: 'Node.js',
                bgColor: 'bg-blue'
            },
            {
                id: Math.random() * (+new Date),
                title: 'Vue.js',
                bgColor: 'bg-blue'
            },
            {
                id: Math.random() * (+new Date),
                title: 'SASS',
                bgColor: 'bg-blue'
            },
            {
                id: Math.random() * (+new Date),
                title: 'Eslint',
                bgColor: 'bg-blue'
            }
        ]
    })
};
</script>

<style lang='scss' scoped>
    @import '../static/style/main.scss';
</style>
