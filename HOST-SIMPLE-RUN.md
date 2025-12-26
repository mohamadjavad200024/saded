# دستورات ساده برای Run در هاست

## بعد از Build و Push در محلی:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# Pull تغییرات (شامل .next build شده)
git pull origin main

# فقط Run (بدون Build)
pm2 restart saded
pm2 logs saded --lines 20
```

**نکته:** Build در محلی انجام شده و `.next` در Git commit شده است. در هاست فقط pull و run کنید.

