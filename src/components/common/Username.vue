<template>
    <span class="username-container"
          :class="{ 'username-clickable': clickable }"
          @click="onClick">
        {{ showName }}
    </span>
</template>

<script lang="ts" setup>
    import { defineProps, computed, watch, onMounted } from 'vue';
    import { showUsername } from '@/utils/avatars';
    import { openTab } from '@/router/routers';

    const props = defineProps({
        // 必要的内容，显示哪些
        addressId: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        // 是否可以点击（hover时鼠标变手）
        clickable: {
            type: Boolean,
            default: false,
        },
        clickCallback: Function,
    });

    const showName = computed<string>(() => {
        const m = showUsername(props.username, props.addressId);
        return m ? m : 'null';
    });

    const onClick = async () => {
        //可点击时执行方法
        if(props.clickable){
            try {
                openTab('/person/profile/' + props.addressId)
            } catch (e) {
                console.error(e)
            }
        }
    }
    //
    // watch(
    //     () => props.addressId,
    //     () => {
    //         console.log("props",props)
    //     },
    // );

    onMounted(() => {

    });

</script>

<style lang="scss">
    .username-container.username-clickable{
        cursor: pointer;
    }
</style>
