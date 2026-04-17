# Next.js AI Support Widget

Use these files in your frontend app to show the floating homepage support chat.

## 1) Copy files
Copy this folder into your frontend project, for example:

```bash
src/components/support-chat/
```

## 2) Add environment variable
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

## 3) Use on homepage
```tsx
import SupportChatWidget from "@/components/support-chat/SupportChatWidget";

export default function HomePage() {
  return (
    <main>
      {/* your homepage sections */}
      <SupportChatWidget apiBaseUrl={process.env.NEXT_PUBLIC_API_BASE_URL} />
    </main>
  );
}
```

## Notes
- Endpoint used: `POST /api/v1/ai/chat`
- Works well for homepage AI help and can later be extended to live admin handoff.
- Styling uses Tailwind utility classes for a polished modern widget.
