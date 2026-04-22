-- Enable the network extension
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create the daily trigger for 8:00 AM
-- Replace YOUR_ANON_KEY and your-project with the exact credentials from your Supabase Dashboard
SELECT cron.schedule(
  'morning-daily-notifier',
  '0 8 * * *',
  $$
  SELECT net.http_post(
    url := 'https://vggkiprlyxainiysftom.supabase.co/functions/v1/daily-notifier',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  );
  $$
);
