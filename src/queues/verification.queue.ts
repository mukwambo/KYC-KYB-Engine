import { Queue, Worker, Job } from "bullmq";
import { queueConnection } from "./connection";
import { QueueName } from "./queue.registry";

export interface VerificationJobData {
  subjectId: string;
  subjectType: "individual" | "business";
  provider: string;
}

export const verificationQueue = new Queue<VerificationJobData>(
  QueueName.Verification,
  {
    connection: queueConnection,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: "exponential", delay: 5000 },
      removeOnComplete: 1000,
      removeOnFail: 5000,
    },
  },
);

// Placeholder job processor — once a kyc/kyb module owns this job, move this
// function (and the provider call it makes) into that module's service and
// have this file import it, rather than growing business logic here.
async function processVerificationJob(
  job: Job<VerificationJobData>,
): Promise<void> {
  const { subjectId, subjectType, provider } = job.data;
  console.log(
    `Processing ${subjectType} verification for ${subjectId} via ${provider}`,
  );
}

export const startVerificationWorker = (): Worker<VerificationJobData> => {
  const worker = new Worker<VerificationJobData>(
    QueueName.Verification,
    processVerificationJob,
    {
      connection: queueConnection,
      concurrency: 5,
    },
  );

  worker.on("completed", (job) => {
    console.log(`✅ Verification job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`❌ Verification job ${job?.id} failed:`, err.message);
  });

  return worker;
};
