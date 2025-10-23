export type WaitlistSubscriber = {
  email: string;
  token: string;
  status: 'pending' | 'confirmed';
  source?: string;
  createdAt: string;
};

const subscribers: Record<string, WaitlistSubscriber> = {};

export function setSubscriber(subscriber: WaitlistSubscriber) {
  subscribers[subscriber.token] = subscriber;
}

export function getSubscriber(token: string) {
  return subscribers[token];
}

export function getSubscribers() {
  return subscribers;
}
