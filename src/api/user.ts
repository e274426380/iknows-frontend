import { getCache, TTL } from "@/common/cache";
import { contractAddress, suiRpcUrl, userRegisterAddress } from "@/types/constants";
import { JsonRpcProvider } from "@mysten/sui.js";

const provider = new JsonRpcProvider(suiRpcUrl);
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
export async function getUserInfo(address: string): Promise<any> {
    return provider.getObjectsOwnedByAddress(address);
}
// 获取目标用户信息
export async function getObject(objectId: string): Promise<any> {
    // 参数只能传一个，不符合要求
    // provider.getEvents({
    //         MoveModule: {
    //             package: contractAddress,
    //             module: "user"
    //         },
    //         Sender: address
    //     }, null, 10,
    // ).then(res => {
    //     console.log("getEvents", res)
    // }).catch(e=>{
    //     console.log("getEventsError", e)
    // })
    // 没法用
    // provider.subscribeEvent({
    //     MoveEventType: "0xd738deed998cdbd22ef8a87f875b16f03146e871::user::UserProfile"
    // }, (event) => {
    //     console.log("event", event)
    // }).then(res => {
    //     console.log("subscribeEvent", res)
    // }).catch(e => {
    //     console.error("subscribeEventError", e)
    // })
    return provider.getObject(objectId);
}
