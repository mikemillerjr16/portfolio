# Website traffic & analytics

Every request to **mikemiller.ai** is logged by CloudFront to a private S3 bucket,
and those logs are queryable with Amazon Athena (SQL). No third-party tracker, no
cookies, nothing added to the page.

- **Logs:** `s3://mikemiller-ai-logs/cf/` (auto-expire after 90 days)
- **Athena database:** `mikemiller_analytics` · **table:** `cf_logs`
- **Region:** `us-east-1`

## How to view your traffic

1. AWS Console → **Athena** (make sure the region is **N. Virginia / us-east-1**).
2. If prompted, set the query result location to
   `s3://mikemiller-ai-logs/athena-results/`.
3. Pick database **`mikemiller_analytics`** on the left.
4. Paste any query below and click **Run**.

CloudFront logs land in batches, so the most recent few minutes may not appear yet.

## Ready-to-run queries

A reusable filter that keeps only real page views (drops assets like JS/CSS/images):

```sql
-- Overview: page views + unique visitors
SELECT count(*) AS page_views,
       count(DISTINCT request_ip) AS unique_visitors
FROM cf_logs
WHERE status = 200 AND method = 'GET'
  AND uri NOT LIKE '/_next/%' AND uri NOT LIKE '/images/%'
  AND uri NOT LIKE '%.svg' AND uri NOT LIKE '%.png' AND uri NOT LIKE '%.jpg'
  AND uri NOT LIKE '%.pdf' AND uri NOT LIKE '%.xml' AND uri NOT LIKE '%.txt'
  AND uri NOT LIKE '%.ico' AND uri NOT LIKE '%.woff2';
```

```sql
-- Most-visited pages
SELECT uri, count(*) AS views, count(DISTINCT request_ip) AS visitors
FROM cf_logs
WHERE status = 200 AND method = 'GET' AND uri NOT LIKE '/_next/%' AND uri NOT LIKE '/images/%' AND uri NOT LIKE '%.svg'
GROUP BY uri ORDER BY views DESC LIMIT 20;
```

```sql
-- Where visitors come from (traffic sources)
SELECT CASE WHEN referrer = '-' THEN '(direct / bookmark)'
            ELSE url_extract_host(referrer) END AS source,
       count(*) AS hits
FROM cf_logs
WHERE status = 200 AND method = 'GET' AND uri NOT LIKE '/_next/%'
GROUP BY 1 ORDER BY hits DESC LIMIT 20;
```

```sql
-- Recent visits: who (IP), when, what page, on what device
SELECT date, time, request_ip, uri, user_agent
FROM cf_logs
WHERE status = 200 AND method = 'GET' AND uri NOT LIKE '/_next/%' AND uri NOT LIKE '/images/%' AND uri NOT LIKE '%.svg'
ORDER BY date DESC, time DESC LIMIT 50;
```

```sql
-- Traffic by day
SELECT date, count(*) AS views, count(DISTINCT request_ip) AS visitors
FROM cf_logs
WHERE status = 200 AND method = 'GET' AND uri NOT LIKE '/_next/%' AND uri NOT LIKE '/images/%' AND uri NOT LIKE '%.svg'
GROUP BY date ORDER BY date DESC;
```

Tip: the résumé download shows up as a request for `/resume/michael-miller-resume.pdf`,
so you can count résumé opens with `WHERE uri = '/resume/michael-miller-resume.pdf'`.

## Can I see *who* visited (names / companies)?

Honestly: not from logs alone. CloudFront records **IP address, device (user agent),
time, page, and referrer** — not a person's name. What you can do:

- **Company-level identification** — a paid visitor-ID service (e.g. RB2B, Vector,
  Leadfeeder) maps corporate IPs to company names. It only works when someone visits
  from an office network, never for home/mobile users, and it's a third-party add-on.
- **A friendlier dashboard** — a privacy-first analytics tool (Plausible or Fathom,
  ~$9/mo) gives charts for pageviews, sources, countries, and devices without the SQL.
  It needs a small script added to the site and an account you own.
- **Direct signals you already have** — the contact form tells you exactly who reached
  out, and LinkedIn/GitHub clicks are tracked as outbound events.

Individual identity fundamentally requires the visitor to identify themselves
(contact form, sign-in, etc.). Everything else is IP-based and approximate.
