export interface JournalEntry {
  transId: string;
  postingDate: string;
  remarks: string;
  glAccountCode: string;
  glAccountName: string;
  bpCode: string;
  bpName: string;
  debitLC: number;
  creditLC: number;
  lineRemarks: string;
}

export interface ProcessedData {
  bpName: string;
  bpCode: string;
  mancomMeals: string[];
  execomMeals: string[];
  excessMeals: string[];
  insurance: string[];
  hmo: string[];
  totalDebit: number;
  totalCredit: number;
}

export interface FilteredData {
  [bpName: string]: ProcessedData;
}