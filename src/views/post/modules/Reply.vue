<template>
    <div class="post-detail-reply-container" v-infinite-scroll="onScroll" :infinite-scroll-distance="200">
        <div class="container">
            <el-row>
                <el-col :sm={span:16,offset:4} :xs="24">
                    <el-card>
                        <div class="head">
                            <b v-if="total === 0 || total === 1">
                                {{total+ " " + t('post.size') + t('post.answer')}}
                            </b>
                            <b v-else>{{total+ " " + t('post.size') + t('post.answers')}}</b>
                        </div>
                        <div class="reply" v-for="(item,index) in showList">
                            <div v-if="props.answerId === Number(item.id)" style="margin-bottom: 5px">
                                <el-tag type="success">
                                    <el-icon>
                                        <Flag/>
                                    </el-icon>
                                    {{t('post.adopt.down')}}
                                </el-tag>
                            </div>
                            <div class="author">
                                <div class="flex">
                                    <Avatar :username="item.author_name"
                                            :addressId=item.author.toString()
                                            :size="38"/>
                                    <div class="authorName">
                                        <b>
                                            <Username :addressId="item.author.toString()"
                                                      :username="item.author_name"/>
                                        </b>
                                        <div class="sign" v-if="item.authorData && item.authorData.biography!==''">
                                            {{item.authorData.biography}}
                                        </div>
                                    </div>
                                </div>
                                <!--<span class="create-time">{{getTimeF(Number(item.created_at))}}</span>-->
                            </div>
                            <div class="content ql-snow">
                                <div v-if="item.content.format==='html'"
                                     class="ql-editor"
                                     :class="{hidden:!foldIndex[index]}"
                                     ref="htmlInformation"
                                     v-html="item.content.detail"
                                >
                                </div>
                                <div v-else>
                                    {{item.content.detail}}
                                </div>
                            </div>
                            <div class="footer">
                                <div class="flex">
                                    <span v-if="item.comments.length===0 || item.comments.length===1"
                                          @click="openReplyReply(index)">
                                        {{item.comments.length+ " " + t('post.item') + t('post.comment')}}
                                    </span>
                                    <span v-else @click="openReplyReply(index)">
                                        {{item.comments.length+ " " + t('post.item') + t('post.comments')}}
                                    </span>
                                    <span @click="share()">{{t('common.share')}}</span>
                                    <!--<el-popconfirm v-if="isOwner && props.answerId===undefined"-->
                                    <!--:title="t('post.adopt.confirm')"-->
                                    <!--:confirmButtonText="t('common.confirm')"-->
                                    <!--:cancelButtonText="t('common.cancel')"-->
                                    <!--@confirm="submitAnswer(Number(item.post_id),Number(item.id))"-->
                                    <!--&gt;-->
                                    <!--<template #reference>-->
                                    <!--<div class="owner-div flex-y-center">-->
                                    <!--<el-icon>-->
                                    <!--<Medal/>-->
                                    <!--</el-icon>-->
                                    <!--<span>{{t('post.adopt.text')}}</span>-->
                                    <!--</div>-->
                                    <!--</template>-->
                                    <!--</el-popconfirm>-->
                                    <!--<DeleteButton v-if="props.currentUserAddress===item.author.toString()"-->
                                    <!--:id="Number(item.id)"-->
                                    <!--:deleteFunction="deleteAnswer"-->
                                    <!--:loading="deleteLoading"/>-->
                                </div>
                                <div>
                                    <span v-if="!foldIndex[index]" @click="fold(index)">{{t('common.expand')}}</span>
                                    <span v-else @click="fold(index)">{{t('common.fold')}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="reply" v-if="total===0">
                            {{t('post.noAnswer')}}
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </div>
    <ReplyReply v-if="showReplyReply" v-model:visible="showReplyReply" :comments="comments" :replyId="commentId"
                :postId="props.postId" :isOwner="props.isOwner" :currentUserAddress="props.currentUserAddress"
                @refreshCallback="init()"/>
</template>
<script lang="ts" setup>
    import { ref, onMounted, defineProps, defineExpose } from 'vue';
    import { ElRow, ElCol, ElButton, ElCard, ElIcon, ElPopconfirm, ElTag } from 'element-plus/es';
    import { Medal, Flag } from '@element-plus/icons-vue';
    import Avatar from '@/components/common/Avatar.vue';
    import Username from '@/components/common/Username.vue';
    import DeleteButton from '@/components/common/PostDeleteButton.vue';
    import ReplyReply from './ReplyReply.vue';
    import { ApiPostComments } from "@/api/types";
    import { t } from '@/locale';
    import { toClipboard } from "@soerenmartius/vue3-clipboard";
    import { showMessageSuccess, showResultError } from "@/utils/message";
    import { getTimeF } from "@/utils/dates";
    import { getPostCommentReply, getPostComments } from "@/api/post";

    const props = defineProps({
        postId: {
            type: String,
            required: true,
        },
        answerId: {
            type: Number,
        },
        isOwner: {
            type: Boolean,
            required: true,
        },
        currentUserAddress: {
            type: String,
            required: true,
        }
    });
    const list = ref<ApiPostComments[]>([]); //初始数据，可能会有很多数据量，所以需要分页成showList
    const showList = ref<ApiPostComments[]>([]); //实际展示数据
    const answer = ref<ApiPostComments>();
    const showReplyReply = ref(false);
    const pageLoading = ref(false);
    const deleteLoading = ref(false);
    const foldIndex = ref([false]);
    const pageSize = ref(5);
    const pageNum = ref(0);
    const total = ref(0);
    const replyIndex = ref(-1);
    const commentId = ref("");
    const comments = ref<any[]>([]);

    const onScroll = () => {
        //初始化时会运行一次此方法
        //不能加载分页的时候停止请求博客列表，免得陷入死循环
        console.log("onScroll", pageNum.value)
        if (total.value !== 0 && showList.value.length !== total.value) {
            pageNum.value++;
            paging()
        }
    };

    const fold = (index: number) => {
        foldIndex.value[index] = !foldIndex.value[index];
    }

    const openReplyReply = (index: number) => {
        //打开评论列表
        replyIndex.value = index;
        comments.value = list.value[index].comments;
        showReplyReply.value = true;
        commentId.value = list.value[index].id.id;
    }

    const share = async () => {
        try {
            await toClipboard(window.location.href)
            showMessageSuccess(t('message.share.success'))
        } catch (e) {
            console.error(e)
        }
    }

    const deleteAnswer = (answerId: number, callback) => {
        deleteLoading.value = true;
    }

    const submitAnswer = (postId: number, commentId: number) => {
    }
    //将指定的回答id置顶
    const onTop = (commentId: number) => {
        const index = list.value.findIndex(item => Number(item.id) === commentId)
        //将查到的答案移到数组第一位，得到置顶的效果。
        list.value.unshift(list.value.splice(index, 1)[0])
    }

    const paging = () => {
        if (total.value > 0) {
            const length = showList.value.length;
            showList.value.push(...list.value.slice(pageSize.value * (pageNum.value - 1), pageSize.value * pageNum.value));
            console.log("ReplyShowList", showList.value)
            //需要获取user数据的index区间在(length, length + pageSize)
            for (let i = length; i < showList.value.length; i++) {

            }
        }
    }

    const init = async () => {
        await getPostComments(props.postId).then(async res => {
            console.log("getPostComments", res)
            if (res.Ok) {
                list.value = res.Ok
                const replys = await getPostCommentReply();
                console.log("resply", replys)
                //从列表里筛选出匹配的comments
                list.value.forEach(item => {
                    //TODO 这里移除了sui自带的fields
                    const comments = replys.Ok.filter(reply => reply.comment_id === item.id.id)
                        .map(item => {
                            item.content = item.content.fields;
                            return item
                        })
                    Object.assign(item, {
                        //TODO 这里移除了sui自带的fields
                        content: item.content.fields,
                        comments: comments
                    })
                })
                console.log("list",list.value)
                total.value = list.value.length;
                //如果有采纳的答案就展示
                // if (props.answerId) {
                //     console.log("props.answerId", props.answerId)
                //     onTop(props.answerId);
                // }
            }
        });
        if (list.value.length > 0 && replyIndex.value !== -1 && showReplyReply.value) {
            //如果replyIndex不为0，说明用户目前在看评论区，需要重新加载一下评论区的数据
            openReplyReply(replyIndex.value);
        } else {
            //不在看评论区，得清空分页数据重新来，免得写回答后没有反应。
            showList.value = [];
            pageNum.value = 0;
            onScroll();
        }
    }

    onMounted(() => {
        init();
    });

    defineExpose({
        init
    })

</script>
<style lang="scss">
    .post-detail-reply-container {
        .el-card {
            margin-top: 10px;
            .el-card__body {
                /*padding-left: 30px;*/
                /*padding-right: 30px;*/
            }
            .reply {
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px solid rgb(246, 246, 246);
                .author {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .authorName {
                        margin-left: 10px;
                        display: flex;
                        justify-content: center;
                        flex-direction: column;
                    }
                }
                .owner-div {
                    margin-left: 10px;
                }
                .delete-button {
                    margin-left: 10px;
                }
                .footer {
                    display: flex;
                    justify-content: space-between;
                    color: rgb(133, 144, 166);
                    span:hover {
                        cursor: pointer;
                    }
                    span + span {
                        margin-left: 10px;
                    }
                }
            }
        }
    }
</style>
