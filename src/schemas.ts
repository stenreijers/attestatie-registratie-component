import * as z from 'zod';

export const IssueParamsSchema = z.object({
  source: z.string(),
  id: z.string(),
  attestation: z.string(),
});
export type IssueParams = z.infer<typeof IssueParamsSchema>;

export const StatusParamsSchema = z.object({
  sessionId: z.string(),
});
export type StatusParams = z.infer<typeof StatusParamsSchema>;

export const RevokeParamsSchema = z.object({
  sessionId: z.string(),
  source: z.string(),
  id: z.string(),
  attestation: z.string(),
});
export type RevokeParams = z.infer<typeof RevokeParamsSchema>;

export const IssueResultSchema = z.object({
  url: z.string(),
  sessionId: z.string(),
});
export type IssueResult = z.infer<typeof IssueResultSchema>;

export const ProviderIssueResultSchema = IssueResultSchema.extend({
  callbackState: z.string().optional(),
});
export type ProviderIssueResult = z.infer<typeof ProviderIssueResultSchema>;

export const MappingResultSchema = z.record(z.string(), z.unknown());
export type MappingResult = z.infer<typeof MappingResultSchema>;

export const SessionStatusEnum = z.enum(['pending', 'issued', 'revoked', 'expired']);
export type SessionStatus = z.infer<typeof SessionStatusEnum>;

export const StatusResultSchema = z.object({
  sessionId: z.string(),
  status: SessionStatusEnum,
});
export type StatusResult = z.infer<typeof StatusResultSchema>;

export const RevokeResultSchema = z.object({
  sessionId: z.string(),
});
export type RevokeResult = z.infer<typeof RevokeResultSchema>;

export interface SessionEvent {
  sessionId: string;
  status: SessionStatus;
  context: {
    source: string;
    id: string;
    attestation: string;
  };
}

export interface ARCHooks {
  onSessionEvent?: (event: SessionEvent) => Promise<void>;
}
