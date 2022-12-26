import { contractAddress } from "@/types/constants";
import { getObject, getUserInfo } from "@/common/suiUtils";


// 获取目标用户信息
export async function getSuiUser(address: string): Promise<any> {
    const res = await getUserInfo(address).catch(e => {
        console.error("getUserError", e)
    })
    console.log("getUserInfo", res)
    //从返回的用户代币里查询是否包含用户资料，根据type属性查询
    const userInfo = res.find(item => item.type === contractAddress + '::user::UserProfile')
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
