<template>
    <div class="post-submit-container">
        <Navigator/>
        <div class="container">
            <div class="submit-title">
                <h3 class="title">
                    {{ $t('post.help.create') }}
                    <div class="back-button" @click="$router.back()"
                    >{{ '<' }}{{ $t('common.back') }}
                    </div>
                </h3>
            </div>
            <el-row class="post-form">
                <el-col :sm={span:16,offset:4} :xs="24">
                    <el-form :model="form" hide-required-asterisk
                             ref="ruleFormRef">
                        <el-form-item prop="title" :label="$t('post.help.title.label')"
                                      :rules="[{
                                        required: true,
                                        message: $t('post.help.title.placeholder'),
                                        trigger: 'blur'}]"
                        >
                            <el-input v-model="form.title"
                                      maxlength="200"
                                      show-word-limit
                                      :placeholder="$t('post.help.title.placeholder')"/>
                        </el-form-item>
                        <el-form-item :label="$t('post.help.content.label')"
                                      :rules="[{
                                        required: true,
                                        message: $t('post.help.content.placeholder'),
                                        trigger: 'blur'}]"
                                      :class="{ isEditorError: isEditorErr }"
                                      prop="detail">
                            <QuillEditor
                                ref="myTextEditor"
                                v-model:content="form.detail"
                                contentType="html"
                                :options="editorOption"
                                @update:content="isEditorChange = true"
                            />
                            <span class="editorCalculate" :class="{ isCalcError: isEditorErr }">
                            {{ showEditorLength }} / {{ limitLength }}
                        </span>
                        </el-form-item>
                        <el-form-item :label="$t('post.help.category.label')"
                                      :rules="[{
                                        required: true,
                                        message: $t('post.help.category.placeholder'),
                                        trigger: 'blur'}]"
                                      prop="category">
                            <el-select class="i-select"
                                       popper-class="i-select-pop"
                                       v-model="form.category"
                                       :placeholder="$t('post.help.category.placeholder')"
                            >
                                <el-option
                                    v-for="item in category"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <div style="text-align: center" class="form-footer">
                <el-button type="primary" class="submit-button" @click="submit(ruleFormRef)" :loading="loading">
                    {{t('post.submit')}}
                </el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref, toRaw, onMounted, watch, computed, nextTick } from 'vue';
    import Navigator from '@/components/navigator/Navigator.vue';
    import {
        ElRow, ElCol, ElButton, ElSelect, ElOption, ElForm, ElFormItem, ElInput, ElMessage, ElConfigProvider,
        ElDatePicker, ElLoading
    } from 'element-plus/es';
    import { Close } from '@element-plus/icons-vue';
    import type { FormInstance } from 'element-plus'
    import { t } from '@/locale';
    import { Quill, QuillEditor } from '@vueup/vue-quill';
    import ImageUploader from "quill-image-uploader";
    import { useRouter } from 'vue-router';
    import { goBack } from "@/router/routers";
    import { showMessageError, showMessageSuccess } from "@/utils/message";
    import { calculatedICPIdLength, uploadImage } from "@/utils/images";
    import { useUserStore } from "@/stores/user";
    import { submitPost } from "@/api/post";
    import { contractAddress, topicBoardAddress } from "@/types/constants";

    const userStore = useUserStore();
    const router = useRouter();

    const currentUserAddress = computed<string>(() => userStore.address);
    const loading = ref(false);
    //编辑器是否发生变化
    const isEditorChange = ref(false);
    const isEditorErr = ref(false);
    //注册quill上传图片模块
    Quill.register("modules/imageUploader", ImageUploader);
    //限制输入长度10000个字
    const limitLength = 10000;
    const ruleFormRef = ref<FormInstance>();
    // 直接取出，没有额外逻辑，用 computed 变成响应式值
    const myTextEditor = ref<{ setHTML: Function; getText: Function } | null>(null);
    const form = ref({
        title: "",
        detail: "",
        format: "html",
        category: "",
        photos: [],
        author_name: "",
    });
    const category = ref([{
        value: "Tech",
        label: t('post.help.category.tech')
    }, {
        value: "Law",
        label: t('post.help.category.law')
    }, {
        value: "Safeguard",
        label: t('post.help.category.safeguard')
    }, {
        value: "Blacklist",
        label: t('post.help.category.blacklist')
    }, {
        value: "Other",
        label: t('post.help.category.other')
    }]);
    const editorOption = {
        modules: {
            toolbar: {
                container: [
                    ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
                    ['blockquote', 'code-block'], // 引用  代码块
                    [{header: 1}, {header: 2}], // 1、2 级标题
                    [{list: 'ordered'}, {list: 'bullet'}], // 有序、无序列表
                    [{script: 'sub'}, {script: 'super'}], // 上标/下标
                    // [{ indent: "-1" }, { indent: "+1" }], // 缩进
                    // [{'direction': 'rtl'}],                         // 文本方向
                    // [{ size: ["small", false, "large", "huge"] }], // 字体大小
                    [{header: [1, 2, 3, 4, 5, 6, false]}], // 标题
                    // [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
                    // [{ font: [] }], // 字体种类
                    // [{ align: [] }], // 对齐方式
                    ['clean'], // 清除文本格式
                    ['image'], // 图片
                    // ["link", "image","video"], // 链接、图片、视频
                ], //工具菜单栏配置
            },
            imageUploader: {
                upload: (file) => {
                    return new Promise((resolve, reject) => {
                        uploadImage(file).then(res => {
                                if (res !== '') {
                                    resolve(res)
                                } else {
                                    reject()
                                }
                            }
                        )
                    });
                }
            },
        },
        placeholder: '......',       //placeholder,在双语切换时不会即时响应，注释了
        readyOnly: false, //是否只读
        theme: 'snow', //主题 snow/bubble
        syntax: true, //语法检测
    };

    onMounted(() => {
        init()
        console.log("userStore.user.name",userStore.user.name)
    });

    const saveDraftBox = () => {
        //存草稿箱
        if (showEditorLength.value > 0) {
            localStorage.setItem('postDraftBox', JSON.stringify({form: form.value, time: new Date().toLocaleString()}));
        }
    }

    const getDraftBox = () => {
        //读取并设置草稿箱中的内容
        const item = localStorage.getItem('postDraftBox');
        if (!item) {
            return
        }
        const postDraftBox = JSON.parse(item);
        if (postDraftBox && myTextEditor.value) {
            form.value = postDraftBox.form;
            showMessageSuccess(t('post.draft.get') + postDraftBox.time)
            myTextEditor.value.setHTML(form.value.detail);
        }
    }

    const showEditorLength = computed(() => {
        const length = calculatedICPIdLength(form.value.detail);
        length > limitLength ? (isEditorErr.value = true) : (isEditorErr.value = false);
        return length;
    });

    const submit = async (formEl: FormInstance | undefined) => {
        console.log("submit formEl", formEl)
        form.value.author_name = userStore.user.name;
        console.log("form", form.value);
        if (!formEl) return;
        await formEl.validate((valid, fields) => {
            if (valid && !isEditorErr.value) {
                const fullLoading = ElLoading.service({
                    target: ".container",
                    lock: true
                });
                loading.value = true;
                console.log("form", form.value);
                console.log("photos", form.value.photos);
                //submit 解除vue的响应式，免得将数组字段改成proxy
                // submitPost(JSON.parse(JSON.stringify(form.value))).then(res => {
                submitPost(toRaw(form.value)).then(res => {
                    console.log(res);
                    if (res.Ok) {
                        showMessageSuccess(t('message.post.create'));
                        //通过查找create里是否存在owner为topic合约地址的对象来获得新发贴的地址id
                        //@ts-ignore
                        const postId = res.Ok.effects.events
                            .find(item => item.newObject && item.newObject.objectType === contractAddress+"::topic::Topic")
                            .newObject.objectId
                        router.push('/post/detail/' + postId);
                        //发布成功后删除草稿箱里的内容。
                        localStorage.removeItem('postDraftBox')
                    }
                }).finally(() => {
                    loading.value = false;
                    fullLoading.close();
                })
            } else {
                console.error('error submit!', fields)
            }
        })
    }

    watch(
        () => form,
        () => {
            //监听form对象，有变动就存草稿箱。
            saveDraftBox();
        },
        {deep: true}
    );

    const init = () => {
        console.log("currentUserAddress.value", currentUserAddress.value)
        //验证是否登录
        setTimeout(() => {
            nextTick(() => {
                if (!currentUserAddress.value) {
                    showMessageError(t('message.error.noLogin'));
                    // setTimeout(() => {
                    //等用户看清了错误提示再弹
                    goBack(router);
                    // }, 1500);
                }
            });
        }, 1500);
        getDraftBox();
    }

</script>

<style lang="scss">
    .post-submit-container {
        /* 当页面宽度小于426px*/
        @media screen and (max-width: 426px) {
            .container {
                padding: 0 10px;
            }
            .post-form .el-form-item {
                display: block;
            }
        }
        .container {
            .is-error, .isEditorError {
                .ql-toolbar {
                    border: 1px solid var(--el-color-danger);
                    border-bottom: 0;
                }
                .ql-container {
                    border: 1px solid var(--el-color-danger);
                }
            }
            .submit-title {
                margin-top: 20px;
                text-align: center;
                .title {
                    position: relative;
                }
                .back-button {
                    position: absolute;
                    right: 0;
                    top: 0;
                    font-size: 1.75rem;
                    &:hover {
                        cursor: pointer;
                    }
                }
            }
            .post-form {
                margin-top: 20px;
                .editorCalculate {
                    color: var(--el-color-info);
                    font-size: 12px;
                    position: absolute;
                    right: 13px;
                    bottom: 0px;
                }
            }
            .form-footer {
                margin-top: 10px;
                .submit-button {
                    font-size: 1.45rem;
                    min-width: 110px;
                    min-height: 35px;
                }
            }
        }
    }

</style>
