import { ApiResult } from "@/api/types";
import { executeMoveCall, getObjectsChild } from "@/common/suiUtils";
import { contractAddress, topicBoardAddress } from "@/types/constants";

export const moduleName = 'topic_board';

// 发贴
export async function submitPost(post: any): Promise<ApiResult<boolean>> {
    console.log("args", [post.title, post.detail, post.format, post.category, post.photos, post.author_name])
    return executeMoveCall(moduleName, 'create_topic_and_list',
        [topicBoardAddress, post.title, post.detail, post.format, post.category, [], post.author_name, 0]);
}
// 发贴
export async function getPostPage(pageNum: number, pageSize: number, query: string, category: string[]): Promise<any> {
    //查交互历史
    return getObjectsChild(topicBoardAddress)
}
