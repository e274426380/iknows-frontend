<template>
    <div class="post-detail-container">
        <Navigator/>
        <Head :post="post" :isOwner="isOwner" @showWrite="showWriteReply()" v-if="post!==undefined"/>
        <WriteReply @foldWrite="foldWrite(false)" @replySuccess="replyInit" v-show="showWrite"/>
        <div v-if="post!==undefined" style="min-height: 70vh">
            <!--<TimeLine :postId="postId" @changeStatusSuccess="init" :isOwner="isOwner"/>-->
            <Reply :postId="postId" ref="reply"
                   :isOwner="isOwner"
                   :currentUserAddress="currentUserAddress"/>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import {ref, onMounted, computed} from 'vue';
    import Navigator from '@/components/navigator/Navigator.vue';
    import Head from './modules/Head.vue';
    import TimeLine from './modules/TimeLine.vue';
    import WriteReply from './modules/WriteReply.vue';
    import Reply from './modules/Reply.vue';
    import {ElLoading} from 'element-plus/es';
    import { useRoute, useRouter } from 'vue-router';
    import {ApiPost} from "@/api/types";
    import {t} from "@/locale";
    import { useUserStore } from "@/stores/user";
    import { showMessageError } from "@/utils/message";
    import { goBack } from "@/router/routers";
    import { getPostInfo } from "@/api/post";

    const route = useRoute();
    const router = useRouter();
    const userStore = useUserStore();
    const postId = route.params.id.toString();
    const currentUserAddress = computed<string>(() => userStore.address);
    // 是否是本人 或者是管理员。关联编辑，删除按钮的显示与否
    // 本地环境下，authorId和currentId会有冲突。
    const isOwner = computed(() => {
        if (post.value) {
            return currentUserAddress.value === post.value.author.toString()
        }
        return false;
    });
    const post = ref<ApiPost>();
    const reply = ref()
    const loading = ref(false);
    const showWrite = ref(false)

    onMounted(() => {
        init();
    });

    const replyInit = () => {
        reply.value.init();
    }

    const init = () => {
        const fullLoading = ElLoading.service({
            lock: true
        });
        loading.value = true;
        getPostInfo(postId).then(res => {
            console.log("getPostInfo", res)
            if (res.status === "Exists") {
                //移除content字段里sui自动添加的fields外壳。
                post.value = {
                    ...res.details.data.fields,
                    content: res.details.data.fields.content.fields
                }
                console.log("detail", post.value)
            } else {
                showMessageError(t('message.error.noTarget'));
                setTimeout(() => {
                    //等用户看清了错误提示再弹
                    goBack(router);
                }, 1500);
            }
        }).finally(() => {
            fullLoading.close();
            loading.value = false
        })
    }

    const showWriteReply = () => {
        showWrite.value = !showWrite.value
    }

    const foldWrite = (show: boolean) => {
        showWrite.value = show
    }

</script>
<style lang="scss">
    .post-detail-container {
        background-color: rgb(246, 246, 246);
    }
</style>
