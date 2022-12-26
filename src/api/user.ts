import { getCache, TTL } from "@/common/cache";
import { contractAddress, userRegisterAddress } from "@/types/constants";
import { getSuiUser } from "@/common/auth";

const userTTL = TTL.hour1; //用户自身信息缓存时长。
const ohterUserTTL = TTL.hour1; //其他用户信息缓存时长。

// 注册用户接口
export async function registerUser(username: string): Promise<any> {
    // if (!wallet) return
    try {
        const signableTransaction1 = {
            kind: 'moveCall',
            data: {
                packageObjectId: contractAddress,
                module: 'user',
                function: 'register_with_name',
                typeArguments: [],
                arguments: [userRegisterAddress,username],
                gasBudget: 10000,
            },
        }
        const signableTransaction = {
            kind: 'moveCall',
            data: {
                packageObjectId: contractAddress,
                module: 'user',
                function: 'register',
                typeArguments: [],
                arguments: [
                    userRegisterAddress,
                    '',
                    username,
                    '[]', // Array.from((new TextEncoder()).encode('[]')),
                    '',
                    'secrecy',
                    '',
                    [],
                    '',
                    '',
                ],
                gasBudget: 10000,
            },
        }
        return window.suiWallet.executeMoveCall(signableTransaction1.data).then(res=>{
            console.log("executeMoveCall",res)
        }).catch(e=>{
            console.error("executeMoveCall error",e)
        });
        // wallet.signAndExecuteTransaction(signableTransaction).then(res => {
        //     console.log("signAndExecuteTransaction", res)
        // })
    } catch (error) {
        console.log(error)
    }
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
