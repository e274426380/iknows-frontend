<template>
    <div class="like-button flex-y-center"
         :class="{ 'like-button-not-clickable': !currentUserPrincipal }"
         @click.stop="onClick">
        <i v-if="!isLike" class="iconfont icon-like"></i>
        <i v-else class="iconfont icon-like-filled"></i>
        {{props.likeCount}}
    </div>
</template>

<script lang="ts" setup>
    import {ref, defineProps, onMounted, computed} from 'vue';
    import {useStore} from "vuex";

    const store = useStore();
    const props = defineProps({
        // 问题ID
        postId: {
            type: Number,
            required: true,
        },
        // 评论id
        commentId: {
            type: Number,
        },
        likeCount: {
            type: Number,
            required: true,
            default: 0
        },
    });
    const currentUserPrincipal = computed<string>(() => store.state.user.principal);
    const isLike = ref(false);

    const onClick = async () => {
        //根据是否点赞执行不同的方法
        //没登录不允许点赞
        if (!currentUserPrincipal.value) {
            return
        }
        if (isLike.value) {
            //取消点赞
            isLike.value = !isLike.value;
            //@ts-ignore
            props.likeCount--;
        } else {
            //没有点赞，就点赞
            isLike.value = !isLike.value;
            //@ts-ignore
            props.likeCount++;
        }
    }

    const isLiked = () => {
        if (!currentUserPrincipal.value) {
            return
        }
    }

    onMounted(() => {
        isLiked();
    });

</script>

<style lang="scss" scoped>
    .like-button {
        .iconfont {
            cursor: pointer;
            font-size: 20px;
            color: #8590a6;
        }
    }
    .like-button-not-clickable {
        cursor: not-allowed !important;
        i {
            cursor: not-allowed !important;
        }
    }
</style>
