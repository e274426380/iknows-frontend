import { ApiResult } from "@/api/types";
import { executeMoveCall, getObject, getObjectsChild } from "@/common/suiUtils";
import { contractAddress, topicBoardAddress } from "@/types/constants";
import { getTargetType } from "@/common/filter";

export const moduleName = 'topic_board';

// 提交贴子
export async function submitPost(post: any): Promise<ApiResult<boolean>> {
    console.log("args", [post.title, post.detail, post.format, post.category, post.photos, post.author_name])
    return executeMoveCall(moduleName, 'create_topic_and_list',
        [topicBoardAddress, post.title, post.detail, post.format, post.category, post.photos, post.author_name, "0"]);
}

// 发贴
export async function getPostPage(pageNum: number, pageSize: number, query: string, category: string[]): Promise<any> {
    //查交互历史
    const res = await getObjectsChild(topicBoardAddress)
    //拥有title字段的为post，topicId的为comment，commentId的为reply
    return {Ok: res.filter(item => item.hasOwnProperty('title') === true)}
}

// 获取贴子详情
export async function getPostInfo(id: string): Promise<any> {
    //查交互历史
    return getObject(id)
}

// 提交贴子的回答
export async function addTopicComment(topicAddress: string, content: string): Promise<ApiResult<boolean>> {
    return executeMoveCall(moduleName, 'add_topic_comment',
        [topicBoardAddress, topicAddress, content, "html", "0"]);
}

// 提交贴子回答的评论
export async function addTopicCommentReply(topicAddress: string, commentAddress: string, content: string): Promise<ApiResult<boolean>> {
    return executeMoveCall(moduleName, 'add_comment_reply',
        [topicBoardAddress, topicAddress, commentAddress, content, "html", "0"]);
}

// 获取贴子相关回帖
export async function getPostComments(topicAddress: string): Promise<ApiResult<any>> {
    const res = await getObjectsChild(topicBoardAddress);
    console.log("res", res)
    //存在topicId字段且没有commentid字段的为comment，两者都有的为reply
    return {Ok: res.filter(item => item['topic_id'] === topicAddress && !item.hasOwnProperty('comment_id'))}
}

// 获取所有的评论，留给帖子自己筛选匹配
export async function getPostCommentReply(): Promise<ApiResult<any>> {
    const res = await getObjectsChild(topicBoardAddress);
    return {Ok: res.filter(item => item['comment_id'])}
}
