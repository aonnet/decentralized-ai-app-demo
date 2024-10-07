import { reactive, render, h, onMounted } from 'vue'
import Card from './Card.vue'

// 计算真实高度，这里只计算除了图片的高度
function getRealHeight(item: any, realWidth: number) {
    const dom:any = document.createElement('div')
    render(
        h(Card, {
            item: item,
            width: realWidth + 'px',
            noImage: false
        }),
        dom
    )

    document.body.appendChild(dom)

    // 获取高度
    const height: number = dom.firstElementChild.clientHeight

    // 移除新容器
    document.body.removeChild(dom)
    // 返回高度
    return height
}

const useWaterfall = () => {
    const backTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'instant'
        })
    }

    // 瀑布流的一些属性
    const waterfallOption = reactive({
        loading: true,
        bottomDistance: 0,
        // 是否只展示图片，这是自定义加的一个属性
        onlyImage: false,
        topPreloadScreenCount: 5,
        bottomPreloadScreenCount: 5,
        virtual: true,
        gap: 24,
        padding: 0,
        itemMinWidth: 220,
        minColumnCount: 2,
        maxColumnCount: 2
    })

    // 瀑布流元素高度的计算函数
    const calcItemHeight = (item: any, itemWidth: number) => {
        if(!item.isUploadComponents){
            let height = 0
            // 当包含图文时，需要单独计算文字部分的高度
            // 文字部分的高度 + 图片的高度 = 真实高度
            if (!waterfallOption.onlyImage) {
                height = getRealHeight(item.value, itemWidth)
            }
    
            return item.value.height * (itemWidth / item.value.width) + height
        }
        
    }

    const calcItemHeight_user_res = (item: any, itemWidth: number) => {
        return item.height * (itemWidth / item.width)
    }

    // 需要展示数据的属性
    const data = reactive({
        page: 0,
        size: 30,
        total: 0,
        max: 0,
        list: [] as ItemOption[],
        end: false
    })

    // 加载更多数据的函数
    const loadData = async () => {
        if (data.end) {
            return
        }
        data.page += 1
        const response = await fetch(`https://mock.tatakai.top/images?page=${data.page}&size=${data.size}&mode=simple`)
        const result = await response.json()
        if (!result.list.length) {
            data.end = true
            return
        }
        data.total = result.total
        data.max = result.max
        data.list = [...data.list, ...result.list]
    }

    // 检查是否加载更多
    const checkScrollPosition = async () => {
        console.log('checkScrollPosition')
        if (waterfallOption.loading) {
            return
        }

        const scrollHeight = document.documentElement.scrollHeight
        const scrollTop = document.documentElement.scrollTop
        const clientHeight = document.documentElement.clientHeight

        const distanceFromBottom = scrollHeight - scrollTop - clientHeight

        // 不大于最小底部距离就加载更多
        if (distanceFromBottom <= waterfallOption.bottomDistance) {
            waterfallOption.loading = true
            await loadData()
            waterfallOption.loading = false
        }

        requestAnimationFrame(checkScrollPosition)
    }

    onMounted(async () => {
        await checkScrollPosition()
    })

    return {
        backTop,
        waterfallOption,
        data,
        calcItemHeight,
        calcItemHeight_user_res
    }
}

export default useWaterfall