const TestnetContracts = {
  MockRPC: '0x75AD3a3D1a30af7Adf9D0ee8691F58D8B1f279b9',
  RPCRouter: '0x387077894f15070133177faD92Fb836fc5B52D1C',
  MarketProxyWithoutRPC: '0xc7225694A6Fe8793eEf5B171559Cbd245E73b987',
  PlatwinMEME2WithoutRPC: '0x0daB724e3deC31e5EB0a000Aa8FfC42F1EC917C5'
}
const RinkebyContracts = {
  PlatwinMEME2WithoutRPC: '0x12DafDC77B0c754481395783Fa2e59024e92C2eF'
}
type ContractConfigs = {
  [key: string]: {
    [key: number]: string
  }
}
const configs: ContractConfigs = {
  MockRPC: {
    80001: TestnetContracts.MockRPC
  },

  RPCRouter: {
    80001: TestnetContracts.RPCRouter
  },
  PlatwinMEME2WithoutRPC: {
    80001: TestnetContracts.PlatwinMEME2WithoutRPC,
    4: RinkebyContracts.PlatwinMEME2WithoutRPC
  },
  MarketProxyWithoutRPC: {
    80001: TestnetContracts.MarketProxyWithoutRPC
  }
}
export default configs
