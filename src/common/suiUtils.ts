import { JsonRpcProvider } from "@mysten/sui.js";
import { contractAddress, suiRpcUrl } from "@/types/constants";
import { showMessageError } from "@/utils/message";
import { t } from "@/locale";

const provider = new JsonRpcProvider(suiRpcUrl);

// 调用move合约
export async function executeMoveCall(moduleName: string, functionName: string, args: any): Promise<any> {
    console.log("args", args)
    let res;
    try {
        const data = {
            packageObjectId: contractAddress,
            module: moduleName,
            function: functionName,
            typeArguments: [],
            arguments: args, //将参数转换为合约能读懂的数组形式
            gasBudget: 10000,
        };
        res = await window.suiWallet.signAndExecuteTransaction({
            kind: 'moveCall',
            data: data
        })
    } catch (e) {
        console.error("executeMoveCall Error",res)
        showMessageError('Sui Net may have a problem')
    }
    console.log("executeMoveCall", res)
    return new Promise(function (resolve, reject) {
        const err = res.toString();
        if (err.indexOf('Cannot find gas coin') != -1) {
            //gas不够报错
            showMessageError(t('message.error.wallet.gas'))
        } else {
            //没有错误就返回这个。
            resolve({Ok:res});
        }
        reject({Err:res})
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
    // console.log("res",res)
    //筛选子对象的objectId
    const keys = res.map(item => item.objectId)
    // console.log("keys",keys)
    let childKeys = [] as Array<any>;
    //获得所有子对象详细信息。可以用promise优化
    for (const key of keys) {
        const res1 = await getObjectsOwned(key);
        if(res1){
            childKeys.push(res1[0].objectId)
        }
    }
    // const res1 = await getObjects(keys);
    // console.log("res1",res1)
    // // 获取目标的key，根据此key的objectId再次查找才能获取贴子内容。可能这里后面要单独分出来。
    // const childKeys = data.map(item => item.details.data.fields.name.fields.name)
    // console.log("keys1",childKeys)
    const values = await getObjects(childKeys);
    // console.log("values",values)
    return values.map(item => item.details.data.fields)
}

// 获取事件
export async function getSuiEvents(query, cursor?, limit?, order?): Promise<any> {
    return provider.getEvents(query, cursor, limit, order);
}

//sui_getDynamicFieldObject 还未实装
