window.requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

// t: current time（当前时间）
// b: beginning value（初始值）
// c: change in value（变化量）
// d: duration（持续时间）
const easeIn = (t, b, c, d) => c * ((t = t / d - 1) * t * t + 1) + b;

/**
 * 滚动到...
 * @param {Number} end 终点位置
 * @param {Number} time 运动时间
 */
const scrollTo = (end, time = 800) => {
    let scrollTop = window.pageYOffset || document.body.scrollTop,
        b = scrollTop,
        c = end - b,
        d = time,
        start;
    return new Promise((resolve, reject) => {
        // requestAnimationFrame的callback有一个
        // 传参timeStamp : 从回调到现在的时间
        let step = timeStamp => {
            if (!start) start = timeStamp
            let progress = timeStamp - start
            if (progress < time) {
                let st = easeIn(progress, b, c, d)
                document.body.scrollTop = st
                document.documentElement.scrollTop = st
                window.requestAnimationFrame(step)
            } else {
                document.body.scrollTop = end
                document.documentElement.scrollTop = end
                resolve(end)
            }
        }
        window.requestAnimationFrame(step)
    })
}

/**
 * 返回顶部
 * @param {Number} time 运动时间 
 */
const scrollToTop = time => {
    time = typeof time === 'number' ? time : 800
    return scrollTo(0, time)
}

const scrollToEl = (el, time, offset) => {
    let top = el.getBoundingClientRect().top + (window.pageYOffset || document.body.scrollTop) - (document.documentElement.clientTop || 0)
    return scrollTo(top - (offset || 0), time)
}

export default {
    methods: {
        scrollTo,
        scrollToTop,
        scrollToEl
    }
}