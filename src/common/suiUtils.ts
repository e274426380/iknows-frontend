import { JsonRpcProvider } from "@mysten/sui.js";
import { contractAddress, suiRpcUrl } from "@/types/constants";
import { showMessageError } from "@/utils/message";
import { t } from "@/locale";

const provider = new JsonRpcProvider(suiRpcUrl);

// 调用move合约
export async function executeMoveCall(moduleName: string, functionName: string, args: any): Promise<any> {
    console.log("args", args)
    const res = await window.suiWallet.executeMoveCall({
        packageObjectId: contractAddress,
        module: moduleName,
        function: functionName,
        typeArguments: [],
        arguments: args, //将参数转换为合约能读懂的数组形式
        gasBudget: 10000,
    })
    console.log("executeMoveCall", res)
    return new Promise(function (resolve, reject) {
        const err = res.toString();
        if (err.indexOf('Cannot find gas coin') != -1) {
            //gas不够报错
            showMessageError(t('message.error.wallet.gas'))
        } else {
            //没有错误就返回这个。
            resolve(res);
        }
        reject(res)
    });
}

// 获取目标地址所有信息
export async function getUserInfo(address: string): Promise<any> {
    //TODO 等待根据type类型查找的接口实装
    return provider.getObjectsOwnedByAddress(address);
}
// 获取目标Object资料
export async function getObject(objectId: string): Promise<any> {
    return provider.getObject(objectId);
}
// 获取多个Object资料（数组）
export async function getObjects(objectIds: string[]): Promise<any> {
    return provider.getObjectBatch(objectIds);
}
// 获取目标Object拥有的子object
export async function getObjectsOwned(objectId: string): Promise<any> {
    return provider.getObjectsOwnedByObject(objectId);
}

// 获取目标Object的子object详细信息列表
export async function getObjectsChild(objectId: string): Promise<any> {
    const res = await getObjectsOwned(objectId);
    //筛选子对象的objectId
    const keys = res.map(item => item.objectId)
    //返回所有子对象详细信息。
    const res1 = await getObjects(keys);
    // console.log("res1",res1)
    //可能这里后面要单独分出来。
    const childKeys = res1.map(item => item.details.data.fields.name.fields.name)
    // console.log("keys1",childKeys)
    const values = await getObjects(childKeys);
    return {Ok: values.map(item => item.details.data.fields)}
}

// 获取事件
export async function getSuiEvents(query, cursor?, limit?, order?): Promise<any> {
    return provider.getEvents(query, cursor, limit, order);
}

//sui_getDynamicFieldObject 还未实装
