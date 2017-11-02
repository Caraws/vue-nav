/**
 * Created on 2017-10-31 by Cara
 */


/**
 * 快排
 * @param {Object} originArray 需要排序数组
 * @param {String} propertyName 属性名
 */
const sortArray = (originArray, propertyName) => {
    if (!originArray || originArray.length <= 1) return originArray
    let pivotIndex = Math.floor(originArray.length / 2),
        pivot = originArray.splice(pivotIndex, 1),
        pivotProerty = pivot[0][propertyName],
        left = [],
        right = [];
    for (let index = 0; index < originArray.length; index++) {
        if (originArray[index][propertyName] > pivotProerty) {
            right.push(originArray[index])
        } else {
            left.push(originArray[index])
        }
    }
    return sortArray(right).concat(pivot, sortArray(left))
}

/**
 * 计算上边距
 * @param {Dom} el 
 */
const getOffsetTop = el => {
    let top, clientTop, scrollTop;
    // 元素距顶部距离
    top = el.getBoundingClientRect() ? el.getBoundingClientRect().top : 0
        // 元素上边框宽度
    clientTop = document.body.clientTop || 0
        // 滚动距离
    scrollTop = document.body.offsetTop || window.pageYOffset
    return top + scrollTop - clientTop
}
module.exports = {
    sortArray,
    getOffsetTop
}