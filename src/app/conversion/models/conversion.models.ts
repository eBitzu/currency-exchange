export interface ExchangeRate {
  currency: string;
  rate: string;
  timestamp: string;
  key: string;
}

export interface ExchangeRateHistory {
  timestamp: string;
  rate: string;
}

export const ratePrecision = 1000000;
export interface ExchangeTrans {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  result: string;
  oneFrom: string;
  oneTo: string;
}
export interface StorageItem extends ExchangeTrans {
  event: string;
  date: string;
  unixDate: number;
}
export interface ExchangeEmit extends ExchangeTrans {
  formEnabled: boolean;
}
export const historyIntervals = [
  {
    label: '7 days',
    days: 7
  },
  {
    label: '14 days',
    days: 14
  },
  {
    label: '30 days',
    days: 30
  }
];
