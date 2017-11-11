<template>
    <div class="vue-nav-wrapper">
        <ul ref='ul'
        :class="['vue-nav', (isDrag ? 'isDraging' : 'noDraging'), {'sortable': mode === 'sortable'}]">
            
            <template v-for='(item, index) in data'>
                <!-- 拖拽体 -->
                <li v-if='isDrag && index === dragId' 
                    :class='["nav-item", "drag-block"]' 
                    :key='index'
                    :style='dragStyle'>
                    {{ item.name }}
                </li>
                <li v-else
                    :key='index'
                    :class='["nav-item", {"active": mode === "navigation" && index === current}]'
                    @click='setActive(index)'
                    @mousedown="dragStart($event, index)">
                    <div class="nav-item-name">
                        {{ item.name }}
                    </div>
                </li>
            </template>
            <!-- 当前活动位置 -->
            <li v-if="!!isInScope && mode === 'navigation'" 
                class="pointer-block" 
                :style="{ top: `${current * height}px` }">
			</li>

            <li class='nav-item' @click='toggleMode'>排序</li>
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
        x: 0,
        y: 0,
        offsetX: 0,
        offsetY: 0,
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
        // 滚动当前值, 根据滚动距离判断
        active () {
            if (!this.isInScope) return false
            let active;
            for (let i = 0, len = this.data.length; i < len; i++) {
                if (this.scrollTop >= this.data[i].offsetTop - this.offset) {
                    active = i
                }
            }
            return active
        },
        // 如果为点击跳转, 当前值则为目标值
        current () {
            return this.isClickScroll ? this.targetValue : this.active
        },
        // 偏移值
        offset () {
            return this.options.offset || 100
        },
        // 是否在滚动范围
        isInScope () {
            if (!this.data.length || 
            this.scrollTop < 0 || 
            this.scrollTop > this.data[this.data.length - 1].offsetTop + this.data[this.data.length - 1].height) {
                return false
            }
            return true
        },
        // 交换的目标 id
        exchangeId () {
            let id = Math.floor(this.y / this.height)
            if (id > this.data.length - 1) {
                id = this.data.length -1
            }else if (id < 0) {
                id = 0
            }
            return id
        },
        // 拖拽体位置
        dragStyle () {
            return {
                top: `${ this.x }px`,
                left: `${ this.y }px`,
            }
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
            this.dragId = this.options.bindData[0].id
            this.getData()
            this.addEvent()
            this.screenHeight = window.screen.availHeight
            // 导航栏处距离页面上边/ 左边的距离
            this.left = this.$refs.ul.getBoundingClientRect().left
            this.top = this.$refs.ul.getBoundingClientRect().top
        },
        // 监听事件
        addEvent () {
            document.addEventListener('scroll', this.scroll, false)
            document.addEventListener('mouseup', this.dragEnd, false)
            document.addEventListener('mouseleave', this.dragEnd, false)
            document.addEventListener('mousemove', this.dragMove, false)
        },
        // 移除监听
        removeEvent () {
            document.removeEventListener('scroll', this.scroll, false)
            document.removeEventListener('mouseup', this.dragEnd, false)
            document.removeEventListener('mouseleave', this.dragEnd, false)
            document.removeEventListener('mousemove', this.dragMove, false)            
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
        // 点击设置当前区域
        setActive (i) {
            if (i === this.current) return false
            let target = this.data[i].el,
                number = 0
            this.isClickScroll = true
            this.targetValue = i
            number++
            this.scrollToEl(target, this.time, this.offset || 0)
            .then( _ => {
                number--
                if (number === 0) {
                    this.isClickScroll = false
                }
            })
        },
        // 切换模式
        toggleMode () {
            this.mode = this.mode == 'navigation' ? 'sortable' : 'navigation'
        },
        // 鼠标位置(e 为拖拽时的参数)
        getPos (e) {
            this.x = e.clientX - this.left - this.offsetX
            this.y = e.clientY - this.top - this.offsetY
        },
        // 拖拽开始
        dragStart (e, i) {
            // 如果当前模式为导航模式, 直接返回
            if (this.mode === 'navigation') return
            this.isDrag = true
            this.dragId = i
            // 鼠标距元素上边距/ 左边距位置
            this.offsetX = e.offsetX
            this.offsetY = e.offsetY
            this.getPos(e)
        },
        // 拖拽移动
        dragMove (e) {
            if (!this.isDrag) return
            this.getPos(e)
            e.preventDefault()
        },
        // 拖拽结束
        dragEnd () {
            if(!this.isDrag) return
            this.isDrag = false
            console.log(this.exchangeId)
            console.log(this.dragId)
            // 交换的目标位置 id 与被拖拽的 id 不一致时
            if (this.exchangeId !== this.dragId) {
                // 从目标位置插入拖拽目标
                this.options.bindData.splice(this.exchangeId, 0, this.options.bindData.splice(this.dragId, 1)[0])
            }else {
                // 否则跳到拖拽位置
                this.setActive(this.dragId)
            }
        }
    },
    beforeDestroy () {
        this.removeEvent()
    }
}
</script>
<style lang="scss" scoped>
    @import '../../static/style/vue-nav.scss';
</style>



