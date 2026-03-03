import { BrowserProvider, Contract, formatUnits, parseUnits } from 'ethers'

export const SEPOLIA_CHAIN_ID_HEX = '0xaa36a7'
export const SEPOLIA_CHAIN_ID_DEC = 11155111

export const TREASURY_VAULT_ADDRESS = '0x25F288A9d86e165126fBE5e4C8367FF9B1E0ED7D'
export const MOCK_USDT_ADDRESS = '0x58f0F78AB4397f915211C882fABdAf530bA8Fc65'

export const TREASURY_VAULT_ABI = [
  'function rebalance(address reserveWallet,address hedgeWallet,address yieldWallet,uint256 reserveAmount,uint256 hedgeAmount,uint256 yieldAmount) external',
  'event Rebalanced(address indexed reserveWallet,address indexed hedgeWallet,address indexed yieldWallet,uint256 reserveAmount,uint256 hedgeAmount,uint256 yieldAmount)'
] as const

export const ERC20_ABI = [
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)'
] as const

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
  on?: (event: string, handler: (...args: unknown[]) => void) => void
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void
}

export function getEthereum(): EthereumProvider {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is not installed.')
  }

  return window.ethereum as EthereumProvider
}

export async function getBrowserProvider(): Promise<BrowserProvider> {
  return new BrowserProvider(getEthereum())
}

export async function ensureSepoliaNetwork(): Promise<void> {
  const ethereum = getEthereum()

  const chainId = (await ethereum.request({ method: 'eth_chainId' })) as string
  if (chainId?.toLowerCase() === SEPOLIA_CHAIN_ID_HEX) {
    return
  }

  await ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }]
  })
}

export async function getSignerAddress(): Promise<string> {
  const provider = await getBrowserProvider()
  const signer = await provider.getSigner()
  return signer.address
}

export async function getTreasuryVaultContract(withSigner: boolean = false): Promise<Contract> {
  const provider = await getBrowserProvider()

  if (withSigner) {
    const signer = await provider.getSigner()
    return new Contract(TREASURY_VAULT_ADDRESS, TREASURY_VAULT_ABI, signer)
  }

  return new Contract(TREASURY_VAULT_ADDRESS, TREASURY_VAULT_ABI, provider)
}

export async function getMockUsdtContract(withSigner: boolean = false): Promise<Contract> {
  const provider = await getBrowserProvider()

  if (withSigner) {
    const signer = await provider.getSigner()
    return new Contract(MOCK_USDT_ADDRESS, ERC20_ABI, signer)
  }

  return new Contract(MOCK_USDT_ADDRESS, ERC20_ABI, provider)
}

export async function getUsdtBalance(address: string): Promise<number> {
  const usdt = await getMockUsdtContract(false)
  const decimals = (await usdt.decimals()) as number
  const balance = await usdt.balanceOf(address)
  return Number(formatUnits(balance, decimals))
}

export function parseUsdtAmount(value: string): bigint {
  return parseUnits(value, 6)
}

export function getExplorerTxUrl(txHash: string): string {
  return `https://sepolia.etherscan.io/tx/${txHash}`
}
