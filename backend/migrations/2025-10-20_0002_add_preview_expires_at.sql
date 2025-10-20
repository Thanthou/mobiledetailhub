-- Add preview_expires_at to previews tracking (if a previews table exists)
-- This migration is idempotent-safe via IF NOT EXISTS checks

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'previews'
      AND column_name = 'preview_expires_at'
  ) THEN
    ALTER TABLE public.previews
    ADD COLUMN preview_expires_at timestamptz;
  END IF;
END $$;


