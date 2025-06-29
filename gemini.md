Absolutely! Here's the **plain text version** of your `GEMINI.md` file—ready to be used with the Gemini CLI or loaded as a system config prompt.

---

### ✅ `GEMINI.md` (copy-paste or save as `.md`)

```markdown
# GEMINI.md

This file configures Gemini CLI for the **KD Project** running on a constrained Windows 10 system (4 GB RAM, no GPU). It enables automation, resource-efficient dev workflows, permission handling, and full CLI autonomy.

---

## 1. Project Setup

- **Project Name**: KD Project
- **OS**: Windows 10
- **Specs**: 4 GB RAM, No GPU
- **Tech Stack**: Next.js, PHP, MySQL, Supabase, JavaScript
- **Purpose**: Gamified education for Sri Lankan Grade 5 and A/L biology students.

---

## 2. Directory Layout

```

C:\Users\pcworld\KD
├── src/                  # Source code
├── tests/                # Minimal unit tests
├── scripts/              # Automation scripts
├── error.log             # Aggregated error logs
├── features.md           # Feature backlog
├── .env.local            # Supabase keys
├── next.config.js        # Config for low RAM
└── GEMINI.md             # This config file

````

---

## 3. Environment

```ini
SUPABASE_URL=https://afkzfrzkzpimwgtypoit.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5...
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
````

---

## 4. CLI Behavior

Gemini CLI should behave like an automated agent with full autonomy:

```bash
set GEMINI_CLI_YES=true
set GEMINI_CLI_INTERACTIVE=false
```

Optionally create `.gemini.config.json`:

```json
{
  "interactive": false,
  "autoApprove": true,
  "telemetry": false
}
```

---

## 5. Scripts in `package.json`

```jsonc
{
  "scripts": {
    "lint": "eslint src --cache",
    "test": "jest --maxWorkers=2",
    "log-errors": "node scripts/log-errors.js",
    "autofix": "eslint src --fix",
    "cycle": "npm run lint && npm run test || npm run log-errors && npm run autofix && git add -A && git commit --no-verify --quiet -m 'chore: automated cycle' && git push"
  }
}
```

---

## 6. Next.js Optimizations for Low RAM

```js
// next.config.js
module.exports = {
  experimental: { turbo: false },
  devIndicators: { buildActivity: false },
  onDemandEntries: { maxInactiveAge: 25 * 1000, pagesBufferLength: 2 },
}
```

In `.env` or shell:

```bash
set NODE_OPTIONS=--max_old_space_size=1024
```

---

## 7. Permission Bootstrapping Prompt

```
You are Gemini, an autonomous CLI agent on Windows 10 with 4 GB RAM.
Your objectives:

1. Elevate to Administrator if not already.
2. Grant full (OI)(CI)(F) permissions to C:\Users\pcworld\KD
3. Whitelist gemini.exe in Windows Defender Firewall
4. Add Gemini to PATH
5. Set PowerShell ExecutionPolicy to RemoteSigned
6. Log all outcomes to scripts/permission-setup.log
7. Then run `npm run cycle`

Work non-interactively. Auto-confirm all prompts.
```

---

## 8. System Maintenance

* 🧹 `rimraf .next node_modules/.cache`
* 🧠 Use Resource Monitor to avoid RAM overload
* 🔁 Rotate `error.log` monthly

---

## 9. GitHub Automation

```bash
git remote add origin https://github.com/ksnprogrammer/knightdragons.git
git fetch origin
git branch --set-upstream-to=origin/main main
```

With GitHub token:

```bash
set GITHUB_TOKEN=<your_PAT>
```

Then auto-push from script:

```bash
git push https://%GITHUB_TOKEN%@github.com/ksnprogrammer/knightdragons.git main
```

---

## 10. Session Prompt

Start every Gemini CLI session with:

```
You are Gemini, a fully automated CLI developer on Windows 10 (4 GB RAM).
Use memory-safe scripts to lint, test, fix, commit, and push code in the KD project.
Operate with full admin powers, never ask for confirmation.
Start with: npm run cycle
```

---

*Update this file whenever system specs, workflows, or policies change.*

```

---

Let me know when you’re ready for the **prompt to paste into Gemini CLI**!
```
