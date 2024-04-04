This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# [grammY](https://grammy.dev) on [Supabase Edge Functions](https://supabase.com/edge-functions)

> Try it out: [@supabase_example_bot](https://t.me/supabase_example_bot)

## Deploying

1. Create the function:

```shell
supabase functions deploy --no-verify-jwt telegram-bot
```

2. Contact [@BotFather](https://t.me/BotFather) to create a bot and get its
   token.
3. Set the secrets:

```shell
supabase secrets set BOT_TOKEN=your_token FUNCTION_SECRET=random_secret
```

4. Set your bot’s webhook URL to
   `https://<PROJECT_NAME>.functions.supabase.co/telegram-bot` (replacing
   `<...>` with respective values). To do that, you open the request URL in your
   browser:

```text
https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://<PROJECT_NAME>.functions.supabase.co/telegram-bot?secret=<FUNCTION_SECRET>
```
