<template>
    <VueMiss>
        <div class="home-container">
            <Navigator/>
            <Public/>
            <PostList/>
        </div>
    </VueMiss>
</template>

<script lang="ts" setup>
    import Navigator from '@/components/navigator/Navigator.vue';
    import Public from './modules/Public.vue';
    import PostList from './modules/PostList.vue';
    import { VueMissReact } from "@/common/wallet";
    const VueMiss = VueMissReact
</script>

<style lang="scss">
    .home-container {
        /*background-color: rgb(246, 246, 246);*/
        min-height: 100vh;
        /*color: black;*/
        /*width: 100%;*/
        /*height: 100%;*/
    }
</style>
