export interface Group {
  id: string;
  title: string;
  amount: number;
  plan: string;
  currentCycle: number;
  members: Array<any>; // You can define a Member interface if needed
}
