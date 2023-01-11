import { getObjectsChild } from "@/common/suiUtils";
import { topicBoardAddress } from "@/types/constants";

// 获取目标合约中指定的type
export async function getTargetType(id: string, type: string): Promise<any> {
    const res = await getObjectsChild(topicBoardAddress);
    console.log("res", res)
    return {Ok: res.filter(item => item[type] === id)}
}
