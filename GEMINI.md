## Gemini Added Memories
- User is using local Supabase with PostgreSQL 17 and Docker, and plans to install MongoDB.

## Project Status Update (June 30, 2025)

### Vercel Deployment
The application has been successfully deployed to Vercel:
- **Production URL:** `https://kd-j2h7kwj2q-kddev.vercel.app`

**Important Notes:**
- The `_training` route has been temporarily disabled to resolve a build issue.
- Genkit AI features are temporarily disabled.

### GitHub Repository
The project code has been successfully pushed to the following GitHub repository:
- `https://github.com/ksnprogrammer/KD_Learn.git`

### Environment Variables
The following environment variables were manually added to Vercel for the `production` environment:

**Supabase:**
- `NEXT_PUBLIC_SUPABASE_URL`: `https://afkzfrzkzpimwgtypoit.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFma3pmcnprenBpbXdndHlwb2l0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMjMwMjAsImV4cCI6MjA2NjY5OTAyMH0.kHhFHZpaHTFnLWFghayUhkYRqKBzRAvijML03zIOW_s`
- `SUPABASE_SERVICE_ROLE_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFma3pmcnprenBpbXdndHlwb2l0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImiYXQiOjE3NTExMjMwMjAsImV4cCI6MjA2NjY5OTAyMH0.IcXU_tcoGScUKOWvd6iMMDAZKjCvSySxbDlgqiz744M`

**MongoDB:**
- `MONGODB_URI`: `mongodb+srv://sitharanimsara181221:vOrekcUHWCDXDo6z@kd.qkx3kfm.mongodb.net/`

A `.env.local` file was also created for local development.
