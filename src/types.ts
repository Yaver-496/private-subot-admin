export interface IData {
  id: number;
  username: string;
  channels: IChannel[];
  subscriptionPlans: SubscriptionPlan[];
  language_code: string | undefined;
}

export interface IChannel {
  id: number;
  title: string;
  type: string;
  inviteLink: string;
  subscribers: IMember[];
};

export interface IMember {
  id: number;
  username: string;
  startdate: string;
  enddate: string;
  substate: 'active' | 'expired' | 'free';
  role: 'admin' | 'subscriber' | 'banned';
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  duration: number;
  price: number;
  features: string[];
}