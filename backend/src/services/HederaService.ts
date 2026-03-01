import { Client, AccountId, PrivateKey, AccountBalanceQuery, TransferTransaction, Hbar, TokenId, TokenAssociateTransaction, TokenCreateTransaction, TokenType, TokenSupplyType } from '@hashgraph/sdk';
import dotenv from 'dotenv';

dotenv.config();

export interface TokenBalance {
  tokenId: string;
  symbol: string;
  balance: number;
  decimals: number;
}

export interface AccountInfo {
  accountId: string;
  hbarBalance: number;
  tokens: TokenBalance[];
}

export class HederaService {
  private client: Client;
  private operatorId: AccountId;
  private operatorKey: PrivateKey;

  constructor() {
    // Initialize Hedera client based on network
    const network = process.env.HEDERA_NETWORK || 'testnet';
    
    if (network === 'mainnet') {
      this.client = Client.forMainnet();
    } else {
      this.client = Client.forTestnet();
    }

    // Set operator
    const accountId = process.env.HEDERA_ACCOUNT_ID;
    const privateKey = process.env.HEDERA_PRIVATE_KEY;

    if (accountId && privateKey) {
      this.operatorId = AccountId.fromString(accountId);
      this.operatorKey = PrivateKey.fromString(privateKey);
      this.client.setOperator(this.operatorId, this.operatorKey);
    } else {
      // Use demo credentials for development
      this.operatorId = AccountId.fromString('0.0.1234');
      this.operatorKey = PrivateKey.generate();
      console.warn('⚠️ Using demo credentials - configure HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY');
    }
  }

  /**
   * Get account balance and token holdings
   */
  async getAccountInfo(accountId: string): Promise<AccountInfo> {
    try {
      const query = new AccountBalanceQuery()
        .setAccountId(AccountId.fromString(accountId));
      
      const balance = await query.execute(this.client);
      
      const tokens: TokenBalance[] = [];
      
      // Process token balances
      if (balance.tokens) {
        balance.tokens.forEach((amount, tokenId) => {
          tokens.push({
            tokenId: tokenId.toString(),
            symbol: 'TOKEN', // Would need to fetch from mirror node
            balance: amount.toNumber(),
            decimals: 8
          });
        });
      }

      return {
        accountId,
        hbarBalance: balance.hbars.toBigNumber().toNumber(),
        tokens
      };
    } catch (error) {
      console.error('Error fetching account info:', error);
      throw error;
    }
  }

  /**
   * Transfer HBAR between accounts
   */
  async transferHbar(
    fromAccountId: string,
    toAccountId: string,
    amount: number
  ): Promise<string> {
    try {
      const transaction = new TransferTransaction()
        .addHbarTransfer(AccountId.fromString(fromAccountId), Hbar.from(-amount))
        .addHbarTransfer(AccountId.fromString(toAccountId), Hbar.from(amount));

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);

      return receipt.status.toString();
    } catch (error) {
      console.error('Error transferring HBAR:', error);
      throw error;
    }
  }

  /**
   * Transfer tokens between accounts
   */
  async transferToken(
    tokenId: string,
    fromAccountId: string,
    toAccountId: string,
    amount: number
  ): Promise<string> {
    try {
      const transaction = new TransferTransaction()
        .addTokenTransfer(
          TokenId.fromString(tokenId),
          AccountId.fromString(fromAccountId),
          -amount
        )
        .addTokenTransfer(
          TokenId.fromString(tokenId),
          AccountId.fromString(toAccountId),
          amount
        );

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);

      return receipt.status.toString();
    } catch (error) {
      console.error('Error transferring token:', error);
      throw error;
    }
  }

  /**
   * Associate token with account
   */
  async associateToken(accountId: string, tokenId: string): Promise<string> {
    try {
      const transaction = new TokenAssociateTransaction()
        .setAccountId(AccountId.fromString(accountId))
        .setTokenIds([TokenId.fromString(tokenId)]);

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);

      return receipt.status.toString();
    } catch (error) {
      console.error('Error associating token:', error);
      throw error;
    }
  }

  /**
   * Create a new token (for testing)
   */
  async createToken(
    name: string,
    symbol: string,
    initialSupply: number,
    decimals: number = 8
  ): Promise<string> {
    try {
      const transaction = new TokenCreateTransaction()
        .setTokenName(name)
        .setTokenSymbol(symbol)
        .setTokenType(TokenType.FungibleCommon)
        .setDecimals(decimals)
        .setInitialSupply(initialSupply)
        .setTreasuryAccountId(this.operatorId)
        .setSupplyType(TokenSupplyType.Infinite)
        .setSupplyKey(this.operatorKey);

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);

      return receipt.tokenId?.toString() || '';
    } catch (error) {
      console.error('Error creating token:', error);
      throw error;
    }
  }

  /**
   * Get current HBAR price (mock for demo)
   */
  async getHbarPrice(): Promise<number> {
    // In production, fetch from oracle or price feed
    return 0.08; // Mock price
  }

  /**
   * Close client connection
   */
  close(): void {
    this.client.close();
  }
}

export const hederaService = new HederaService();
