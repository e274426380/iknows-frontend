import { JsonRpcProvider } from "@mysten/sui.js";
import { contractAddress, suiRpcUrl } from "@/types/constants";

const provider = new JsonRpcProvider(suiRpcUrl);

// 调用move合约
export async function executeMoveCall(moduleName: string, functionName: string, args: any): Promise<any> {
    console.log("args",args)
    return window.suiWallet.executeMoveCall({
        packageObjectId: contractAddress,
        module: moduleName,
        function: functionName,
        typeArguments: [],
        arguments: args, //将参数转换为合约能读懂的数组形式
        gasBudget: 10000,
    }).then(res => {
        console.log("executeMoveCall", res)
    }).catch(e => {
        console.error("executeMoveCall error", e)
    });
}

// 获取目标用户信息
export async function getUserInfo(address: string): Promise<any> {
    return provider.getObjectsOwnedByAddress(address);
}
// 获取目标用户信息
export async function getObject(objectId: string): Promise<any> {
    return provider.getObject(objectId);
}
