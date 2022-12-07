import { getCache, TTL } from "@/common/cache";
import { contractAddress } from "@/types/constants";

// 注册用户接口
export async function registerUser(wallet: any): Promise<any> {
    // if (!wallet) return
    try {
        const signableTransaction1 = {
            kind: 'moveCall',
            data: {
                packageObjectId: contractAddress,
                module: 'user',
                function: 'register_with_name',
                typeArguments: [],
                arguments: ['0xc2ee523b333b71e6dfa249bd6ee4ee76bac8def6','test@gmail.com'],
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
                    '0xc2ee523b333b71e6dfa249bd6ee4ee76bac8def6',
                    '',
                    'jamesKing',
                    '[]',
                    // Array.from((new TextEncoder()).encode('[]')),
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
        window.suiWallet.executeMoveCall(signableTransaction.data).then(res=>{
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
