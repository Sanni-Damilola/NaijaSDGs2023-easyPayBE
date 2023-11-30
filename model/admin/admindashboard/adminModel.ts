export interface adminWalletProps {
  balance: number;
 
  credit: number;
  debit: number;
}

export interface adminTransactionProps {
  message: string;
  receiver: string;
  date: string;
  transactionReference: number;
}
