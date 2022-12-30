import { contractAddress } from "@/types/constants";
import { getObject, getUserInfo } from "@/common/suiUtils";


// 获取目标用户信息
export async function getSuiUser(address: string): Promise<any> {
    const res = await getUserInfo(address).catch(e => {
        console.error("getUserError", e)
    })
    console.log("getUserInfo", res)
    //从返回的用户代币里查询是否包含用户资料，根据type属性查询
    const type = contractAddress + '::user::UserProfile';
    //TODO 由于Sui的bug导致type少了一位，先用着
    const userInfo = res.find(item => item.type === '0xe6f41599a8034a76985ecf0ed02ff11cefd0393::user::UserProfile')
    if (userInfo) {
        const res = await getObject(userInfo.objectId).catch(e => {
            console.error("getUserInfoObjectError", e)
        });
        console.log("getObject", res.details.data.fields)
        return {Ok: res.details.data.fields};
    }else {
        return {Err:"notReg"}
    }
}
// TODO 获取目标用户发贴列表，未做完
export async function getSuiUserQuestion(address: string): Promise<any> {
    const res = await getUserInfo(address).catch(e => {
        console.error("getUserError", e)
    })
    console.log("getUserInfo", res)
    //从返回的用户代币里查询是否包含用户资料，根据type属性查询
    const questions = res
        .filter(item => item.type === contractAddress + '::topic::TopicStore')
        .map(item => item['objectId'])
    console.log("questions", questions)
    if (questions) {
        const res = await getObject(questions[0]).catch(e => {
            console.error("getUserInfoObjectError", e)
        });
        console.log("getObject", res)
        return {Ok: res.details.data.fields};
    }else {
        return {Err:"notReg"}
    }
}
