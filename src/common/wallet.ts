import { EthosConnectProvider, ethos } from 'ethos-connect';
import { applyPureReactInVue, applyVueInReact, createCrossingProviderForPureVueInReact } from 'veaury'

// 创建一个跨技术栈到vue的react hooks和一个对应使用的react provider
// provider需要包裹在使用hooks的组件外才能取到值
const [useEthosForVue, EthosProviderForVue] = createCrossingProviderForPureVueInReact(
    function () {
        return {
            // 将React ethos的值暴露给vue
            ethos: ethos.useWallet(),
        }
    }
)
const VueMissReact = applyPureReactInVue(EthosProviderForVue)
export {
    useEthosForVue,
    EthosProviderForVue,
    VueMissReact
}
