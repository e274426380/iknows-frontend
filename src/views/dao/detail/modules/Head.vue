<template>
    <div class="dao-detail-head-container">
        <div class="container">
            <el-row>
                <el-col :sm="24" :xs="24">
                    <div class="proposal-title">
                        <el-row justify="space-between">
                            <el-col :span="24" class="card-info">
                                <Avatar :username="author && author.name ? author?.name : ''"
                                        :principal-id=proposal.proposer.toString()
                                        :avatar-id="Number(author?.avatar_id)"
                                        :clickable="false"
                                        :size="60"/>
                                <div class="text">
                                    <div class="title">
                                        <span>{{proposal.payload.execute_args.AddGovernanceMember.title+" #"+route.params.id}}</span>
                                        <DaoState :state="proposal.state"/>
                                    </div>
                                    <div class="info">
                                        <Username :principalId="proposal.proposer.toString()"
                                                  :username="author!==undefined && author.name!==''
                                                      ? author.name: ''"
                                                  :clickable="true"/>
                                        <span>|</span>
                                        <span class="createTime">{{getTimeF(Number(proposal.created_at))}}</span>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                        <div class="content ql-snow">
                            <div v-if="proposal.payload.execute_args.AddGovernanceMember.content.format==='html'"
                                 class="ql-editor"
                                 :class="{hidden:isFold}"
                                 ref="htmlInformation"
                                 v-html="proposal.payload.execute_args.AddGovernanceMember.content.content"
                            >
                            </div>
                            <div v-else>
                                {{proposal.payload.execute_args.AddGovernanceMember.content.content}}
                            </div>
                        </div>
                        <div class="footer">
                            <div>
                                <span v-if="isFold" @click="isFold = !isFold" class="fold">{{t('common.expand')}}</span>
                                <span v-else @click="isFold = !isFold" class="fold">{{t('common.fold')}}</span>
                            </div>
                            <!--<div v-if="isOwner">-->
                            <!--<span class="fold" @click="dialogVisible=true">{{t('common.delete.title')}}</span>-->
                            <!--</div>-->
                        </div>
                        <Vote v-if="proposal.state.Open!==undefined && currentUserPrincipal"
                              :principalId="currentUserPrincipal"
                              :proposalId="proposalId"
                              @voteSuccess="voteSuccess"/>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
    <el-dialog
        v-model="dialogVisible"
        :title="t('common.delete.title')"
        width="30%"
    >
        <span>{{t('common.delete.text')}}</span>
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">{{t('common.cancel')}}</el-button>
        <el-button type="primary" @click="deleteThisPost()" :loading="loading">{{t('common.confirm')}}</el-button>
      </span>
        </template>
    </el-dialog>
</template>
<script lang="ts" setup>
    import { ref, onMounted, defineProps, PropType, computed, defineEmits } from 'vue';
    import { ElRow, ElCol, ElButton, ElCard, ElTag, ElIcon, ElDialog } from 'element-plus/es';
    import { Flag } from '@element-plus/icons-vue';
    import Avatar from '@/components/common/Avatar.vue';
    import Username from '@/components/common/Username.vue';
    import DaoState from '@/components/common/dao/DaoState.vue';
    import Vote from './Vote.vue';
    import { ApiDaoProposal, ApiUserInfo } from "@/api/types";
    import { getTimeF } from "@/utils/dates";
    import { t } from '@/locale';
    import { useRoute, useRouter } from "vue-router";
    import { useUserStore } from "@/stores/user";

    const userStore = useUserStore();
    const route = useRoute();
    const author = ref<ApiUserInfo>();

    const isFold = ref(true);
    const proposalId = Number(route.params.id);
    const currentUserPrincipal = computed<string>(() => userStore.address);
    const dialogVisible = ref(false);
    const loading = ref(false);

    const props = defineProps({
        proposal: {
            type: Object as PropType<ApiDaoProposal>,
            required: true,
        },
    });

    onMounted(() => {
        init();
    });

    const emit = defineEmits(['voteSuccess'])

    const voteSuccess = () => {
        emit('voteSuccess');
    }

    const fold = () => {
        isFold.value = !isFold.value;
    }

    const deleteThisPost = () => {
        loading.value = true;
    }

    const init = () => {
    }

</script>
<style lang="scss">
    /* 当页面宽度小于426px*/
    @media screen and (max-width: 426px) {
        .dao-detail-head-container {
            padding: 0 10px;
        }
    }
    .dao-detail-head-container {
        background-color: white;
        -webkit-box-shadow: 0 1px 3px rgb(18 18 18 / 10%);
        box-shadow: 0 1px 3px rgb(18 18 18 / 10%);
        span + span {
            margin-left: 10px;
        }
        .fold {
            color: rgb(133, 144, 166);
            margin-left: 10px;
            &:hover {
                cursor: pointer;
            }
        }
        .adopted {
            font-size: 12px;
            color: #9eadb6;
            .el-icon {
                color: rgb(103, 194, 58);
                font-size: 14px;
            }
        }
        .proposal-title {
            padding: 20px;
            .card-info {
                text-align: left;
                display: inherit;
                .text {
                    margin-left: 10px;
                    .info {
                        .createTime {
                            color: rgb(133, 144, 166);
                            font-size: 14px;
                        }
                    }
                }
                .title {
                    font-size: 20px;
                    font-weight: bold;
                }
                .need-type {
                    .el-tag {
                        /*margin-right: 5px;*/
                    }
                }
            }
            .flex-right {
                display: flex;
                justify-content: end;
                align-items: center;
            }
            .footer {
                margin-top: 15px;
                margin-bottom: 15px;
                display: flex;
                justify-content: space-between;
            }
        }
    }
</style>
