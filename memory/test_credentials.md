# Test Credentials

## Admin Panel
- **URL**: `/admin`
- **Email**: `dhruv.pnchl.2307@gmail.com`
- **Password**: `dhruv@admin123`

## Supabase
- **Project URL**: `https://opjmbpvctdtvvdjgsqqk.supabase.co`
- **Anon Key**: in `/app/.env.local` as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Auth notes
- Guestbook uses Supabase OAuth (GitHub / Google). No JWT credentials required for visiting.
- Admin login on `/admin` is plain email/password against Supabase auth.
