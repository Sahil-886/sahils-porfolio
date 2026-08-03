# Vercel Deployment & Domain Configuration Guide

## Production Base URL
- **Primary Domain:** `https://sahilmakhamale.com`
- **Canonical Source:** All SEO canonical tags, Open Graph meta tags, Twitter cards, `sitemap.xml`, and `robots.txt` use `https://sahilmakhamale.com`.

---

## Step-by-Step Vercel Setup

### 1. Rename Vercel Project Subdomain
If the current Vercel deployment URL has a misspelling (e.g. `porfolio` instead of `portfolio`):
1. Go to your **Vercel Dashboard** → Select the portfolio project.
2. Click **Settings** → **General**.
3. Under **Project Name**, change it to `sahil-portfolio` or `sahilmakhamale`.
4. Click **Save**.

### 2. Attach Custom Domain (`sahilmakhamale.com`)
1. Go to **Settings** → **Domains**.
2. Click **Add Domain**.
3. Enter `sahilmakhamale.com` and select **Add**.
4. Vercel will automatically suggest adding `www.sahilmakhamale.com` as a redirect target.

### 3. DNS Configuration at Domain Registrar
Update the DNS records at your domain registrar (e.g. GoDaddy, Namecheap, Cloudflare):
- **A Record:**
  - `Name`: `@`
  - `Value`: `76.76.21.21`
- **CNAME Record:**
  - `Name`: `www`
  - `Value`: `cname.vercel-dns.com`

Once DNS propagates (usually 5–15 minutes), Vercel will generate free SSL certificates and redirect all traffic to `https://sahilmakhamale.com`.
