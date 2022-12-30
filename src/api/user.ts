import { getCache, TTL } from "@/common/cache";
import { contractAddress, userRegisterAddress } from "@/types/constants";
import { getSuiUser, getSuiUserQuestion } from "@/common/auth";
import { executeMoveCall } from "@/common/suiUtils";

export const moduleName = 'user';
const userTTL = TTL.hour1; //用户自身信息缓存时长。
const ohterUserTTL = TTL.hour1; //其他用户信息缓存时长。

// 注册用户接口
export async function registerUser(username: string): Promise<any> {
    // if (!wallet) return
    return executeMoveCall(moduleName, 'register_with_name', [userRegisterAddress, username])
}
// 获取目标用户信息
export async function getUser(address: string): Promise<any> {
    return await getCache({
        key: 'USER_INFO_' + address.toUpperCase(),
        execute: () => getSuiUser(address),
        ttl: userTTL,
        // ttl: 60 * 60, // 目前开发阶段先设置短的时间
        isLocal: true, // 需要本地存储
    });
}
// 获取目标用户发贴的列表
export async function getUserQuestion(address: string): Promise<any> {
    getSuiUserQuestion(address)
}
