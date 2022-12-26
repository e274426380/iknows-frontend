import { ApiResult } from "@/api/types";
import { executeMoveCall } from "@/common/suiUtils";

// 发贴
export async function submitPost(post: any): Promise<ApiResult<boolean>> {
    console.log("args",[post.title, post.detail, post.format, post.category, post.photos , post.author_name])
    return executeMoveCall('topic', 'create_topic',
        [post.title, post.detail, post.format, post.category, [], post.author_name]);
}
