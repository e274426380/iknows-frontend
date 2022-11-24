import { JsonRpcProvider, Network } from '@mysten/sui.js';
// connect to Devnet
const provider = new JsonRpcProvider(Network.DEVNET);
console.log("Network->",Network)
console.log("Network.DEVNET->",Network.DEVNET)
console.log("provider->",provider)
// 从水龙头获取token
// await provider.requestSuiFromFaucet(
//     '0xbff6ccc8707aa517b4f1b95750a2a8c666012df3'
// );
