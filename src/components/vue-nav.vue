<template>
    <div class="vue-nav-wrapper">
        <ul ref='ul'
        :class="['vue-nav', (isDrag ? 'isDraging' : 'noDraging')]">
            
            <template v-for='(item, index) in data'>
                <!-- <li v-if='isDrag && index == dragId' 
                    :class='["nav-item", "drag-block"]' 
                    :key='index'>
                    {{ item.name }}
                </li> -->
                <li
                    :key='index'
                    :class='["nav-item", {"active": mode === "navigation" && index === current}]'
                    @click='setActive(index)'>
                    <div class="nav-item-name">
                        {{ item.name }}
                    </div>
                </li>
            </template>

            <li v-if="mode === 'navigation'" 
                class="pointer-block" 
                :style="{ top: `${current * height}px` }">
			</li>

            <li class='nav-item'>排序</li>
            <li class='nav-item' @click='scrollToTop'>回到顶部</li>
        </ul>
    </div>
</template>

<script>
import scrollMix from '../utils/scroll'
import { sortArray, getOffsetTop } from '../utils/common'
export default {
    name: 'vue-nav',
    data: _ => ({
        mode: 'navigation',
        data: [],
        time: 800,
        scrollTop: 0,
        isDrag: false,
        screenHeight: 0,
        left: 0,
        top: 0,
        isClickScroll: false,
        targetValue: 0,
        dragId: 0,
        height: 50
    }),
    mixins: [scrollMix],
    props: {
        options: {
            type: Object
        }
    },
    mounted () {
        this.init()
    },
    computed: {
        active () {
            // if (this.isInScope) return 
            let active;
            for (let i = 0, len = this.data.length; i < len; i++) {
                if (this.scrollTop >= this.data[i].offsetTop - this.offset) {
                    active = i
                }
            }
            return active
        },
        current () {
            return this.isClickScroll ? this.targetValue : this.active
        },
        offset () {
            return this.options.offset || 100
        },
        isInScope () {
            if (!this.data.length || 
            this.scrollTop < (this.data[0].offsetTop - this.screenHeight) || this.scrollTop > (this.data[this.data.length - 1].offsetTop - this.data[this.data.length - 1].height)) {
                return false
            }
            return true
        }
    },
    watch: {
        options: {
            deep: true,
            handler: function(newVal, oldVal) {
                this.getData()
		    }
	    }
    },
    methods: {
        init () {
            this.getData()
            document.addEventListener('scroll', this.scroll, false)
            this.screenHeight = window.screen.availHeight
            this.left = this.$refs.ul.getBoundingClientRect().left
            this.top = this.$refs.ul.getBoundingClientRect().top
        },
        getData () {
            this.data = sortArray(Array.from(this.options.data, item => {
                let el = document.getElementById(item.target)
                if (!el) console.error('请确保已传入id')
                let offsetTop = getOffsetTop(el)
                return {
                    name: item.name,
                    el: el,
                    offsetTop: offsetTop,
                    height: el.offsetHeight
                }
            }), 'offsetTop');
        },
        scroll () {
            this.scrollTop = window.pageYOffset || document.body.scrollTop
        },
        setActive (i) {
            if (i === this.current || this.mode === 'sortable') return
            let target = this.data[i].el
            this.isClickScroll = true
            this.targetValue = i
            this.scrollToEl(target, this.time, this.offset || 0)
            .then( _ => {
                this.isClickScroll = false
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    @import '../../static/style/vue-nav.scss';
</style>



