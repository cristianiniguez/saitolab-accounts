interface Account {
  id: string;
  name: string;
  userId: string;
}

type MoveType = 'income' | 'outcome';

interface Move {
  id: string;
  detail: string;
  amount: number;
  date: string;
  type: MoveType;
}

interface Preferences {
  id: string;
  currency: string;
}
