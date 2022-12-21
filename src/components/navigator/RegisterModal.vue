<template>
    <el-dialog
        v-model="dialogVisible"
        :before-close="onClose"
        :title="t('navbar.login')"
        width="30%"
    >
       <div>
           <el-form :model="form" hide-required-asterisk
                    ref="ruleFormRef">
               <el-form-item prop="username" :label="$t('user.name')"
                             :rules="[{
                                        required: true,
                                        message: $t('user.placeholder.name'),
                                        trigger: 'blur'}]"
               >
                   <el-input v-model="form.username"
                             maxlength="50"
                             show-word-limit
                             :placeholder="$t('user.placeholder.name')"/>
               </el-form-item>
           </el-form>
       </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="onClose()">{{t('common.cancel')}}</el-button>
            <el-button type="primary" @click="register(ruleFormRef)" :loading="loading">{{t('common.confirm')}}</el-button>
          </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
    import { ref, defineProps, defineEmits } from 'vue';
    import { ElButton, ElDialog, ElForm, ElFormItem, ElInput } from 'element-plus/es';
    import type { FormInstance } from 'element-plus'
    import { t } from '@/locale';
    import { registerUser } from "@/api/user";
    import { useUserStore } from "@/stores/user";

    const userStore = useUserStore();
    const emit = defineEmits(['update:dialogVisible']);
    const loading = ref(false)
    // const username = ref(userStore.address)
    const form = ref({
        username: userStore.address
    });
    const ruleFormRef = ref<FormInstance>();
    const props = defineProps({
        dialogVisible: {
            type: Boolean,
            required: true,
            default: false
        },
    });
    const register = async (formEl: FormInstance | undefined) => {
        if (!formEl) return;
        await formEl.validate((valid, fields) => {
            if (valid) {
                registerUser(form.value.username).then(res=>{

                });
            }else {
                console.error('error submit!', fields)
            }
        })
    }

    const onClose = () => {
        emit('update:dialogVisible');
        //关闭时清空输入，先别启用，感觉不友好
        // replyReply.value = "";
    }


</script>
