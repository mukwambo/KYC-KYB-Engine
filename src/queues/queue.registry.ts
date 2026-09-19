// Central list of queue names, shared by producers (Queue) and consumers
// (Worker) so both sides always reference the same underlying Redis key.
export const QueueName = {
  Verification: "verification",
} as const;

export type QueueName = (typeof QueueName)[keyof typeof QueueName];
