<template>
    <div :class="`template_item`">
        <div class="imgCon">
            <img :src="item.image" alt="" />
        </div>
        <text :class="`text`">{{ item.title }}</text>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'

const props = withDefaults(
    defineProps<{
        item: any
        onlyImage?: boolean
        noImage?: boolean
        width?: string
    }>(),
    {
        onlyImage: false,
        noImage: false,
        width: '100%'
    }
)

const loaded = ref(false)
const height = ref('auto')

onBeforeMount(() => {
    if (!props.noImage) {
        height.value = '100%'
        new Promise(resolve => {
            const image = new Image()
            image.src = props.item.image
            if (image.complete) {
                loaded.value = true
                resolve(true)
                return
            }

            image.onload = () => {
                loaded.value = true
                resolve(true)
            }

            image.onerror = error => {
                console.error(props.item.image, error)
                loaded.value = true
                resolve(true)
            }
        })
    }
})
</script>

<style scoped lang="scss">
.template_item {
    display: flex;
    flex-direction: column;
    width: v-bind(width);
    height: v-bind(height);
    overflow: hidden;
    background: white;
    border: 1px solid #e3e8f7;
    border-radius: 1.07vw;
    padding-bottom: 1.67vw;

    .imgCon {
        width: 100%;
        height: auto;
    }

    .imgCon img {
        display: block;
        height: 100%;
        width: 100%;
        object-fit: cover;
    }

    .text {
        width: 100%;
        height: 8.53vw;
        line-height: 8.53vw;
        background: #3B3939;
        justify-content: flex-start;
        align-items: center;
        font-size: 3.2vw;
        font-family: Roboto-Bold;
        color: #FFFFFF;
        padding: 0 2.13vw;

        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>