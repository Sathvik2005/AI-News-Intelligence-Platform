# Hosting Guide

## Option A: Render (Backend + Frontend + Postgres + Redis)

1. Push this repository to GitHub.
2. In Render, create a **Blueprint** and point to `deployment/render.yaml`.
3. After services are created, open the frontend service and set `NEXT_PUBLIC_API_BASE` to your real backend URL.
4. Redeploy frontend.
5. Open backend docs at `/docs` and call `POST /api/v1/news/refresh` once.

### Upload Environment Variables in Render

1. Open service `ai-news-backend` in Render.
2. Go to **Environment**.
3. Add values for these keys:
	- `OPENAI_API_KEY`
	- `ANTHROPIC_API_KEY`
	- `GEMINI_API_KEY`
	- `GROQ_API_KEY`
	- `YOUTUBE_API_KEY` (optional)
	- `REDDIT_CLIENT_ID` (optional)
	- `REDDIT_CLIENT_SECRET` (optional)
	- `GITHUB_TOKEN` (optional)
4. Save changes and redeploy backend.

For frontend service `ai-news-frontend`, ensure:
- `NEXT_PUBLIC_API_BASE=https://<your-render-backend-domain>`

Notes:
- Initial free-tier cold starts may be slow.
- Some external sources may intermittently fail; use `/api/v1/admin/ingestion-status` to monitor.

## Option B: Vercel (Frontend only)

1. Import repository in Vercel.
2. Set **Root Directory** to `frontend`.
3. Set env var: `NEXT_PUBLIC_API_BASE=https://<your-backend-domain>`.
4. Deploy.

### Vercel CLI Deploy (alternative)

From `frontend` directory:

1. Login:
	- `npx vercel login`
2. Link and deploy:
	- `npx vercel --prod`

If you see `The specified token is not valid`, remove stale token and login again:
- Windows path: `%USERPROFILE%\\.vercel\\auth.json`

### Upload Environment Variables in Vercel

In project settings -> **Environment Variables**:
- `NEXT_PUBLIC_API_BASE=https://<your-backend-domain>`

Do not upload backend secrets (OpenAI/Anthropic/etc.) to Vercel unless backend also runs there.

### GitHub Auto Deploy (Vercel + Actions)

Repository configured with workflow: `.github/workflows/vercel-deploy.yml`.

Add these GitHub repository secrets:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

How to get values:
1. `VERCEL_TOKEN`: Vercel Dashboard -> Settings -> Tokens -> Create.
2. `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`:
	- In local `frontend` folder run `npx vercel link`.
	- IDs appear in `frontend/.vercel/project.json`.

Behavior:
- Pull request to `main`: preview deployment.
- Push to `main`: production deployment.

Backend can run on Render/Railway/Fly independently.

## Security Notes

- Never commit `.env` with real keys.
- Rotate keys if they were exposed in logs, screenshots, or commits.
- Use least-privilege API tokens where possible.

## Local One-Click Demo (Windows)

Run from repo root:

```bat
scripts\demo_start.bat
```
