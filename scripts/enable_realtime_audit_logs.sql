-- Enable Realtime for the audit_logs table
-- This allows the frontend to receive instant updates when activities occur on the portal
ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_logs;
