# 🗺️ Where to Find the Settings Page

## Visual Layout:

```
┌─────────────────────────────────────────────────────────────────┐
│ Dashboard Navigation Bar                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Shopimize    [Store Selector ▼]  ⚙️ Settings   Sign Out       │
│                                         ↑                         │
│                                    CLICK HERE                    │
└─────────────────────────────────────────────────────────────────┘
```

## Direct URLs:

**Settings Page:**
```
https://shopimize-app-beta-6dbu.vercel.app/settings
```

**Dashboard:**
```
https://shopimize-app-beta-6dbu.vercel.app/dashboard
```

---

## Quick Test:

### Step 1: Deploy the Latest Code
```bash
git add .
git commit -m "Add settings page"
git push
```

### Step 2: Log In
Go to: `https://shopimize-app-beta-6dbu.vercel.app/login`

### Step 3: Look for Settings
Once on dashboard, look in the top-right navigation bar

### Step 4: Or Visit Directly
Go to: `https://shopimize-app-beta-6dbu.vercel.app/settings`

---

## What You'll See on Settings Page:

### 1. Profile Information Section
- Update your name
- Update your email
- Resend verification email (if needed)

### 2. Change Password Section
- Current password
- New password
- Confirm password

### 3. Danger Zone
- Delete account button (red)

---

## Navigation Flow:

```
Dashboard → ⚙️ Settings → Settings Page
    ↑                            ↓
    └───────← Back to Dashboard ←┘
```

---

## If Settings Link is Missing:

The Settings button was added to this line in the dashboard:

**File:** `app/dashboard/page.tsx`
**Line:** ~242-258

It should look like:
```tsx
<div className="flex items-center gap-4">
  <select value={selectedStore}>
    {/* Store selector */}
  </select>
  <button onClick={() => router.push('/settings')}>
    ⚙️ Settings
  </button>
  <button onClick={() => router.push('/api/auth/signout')}>
    Sign Out
  </button>
</div>
```

If you don't see it, the code might not be deployed yet!

---

## Mobile View:

On mobile, the buttons might stack vertically but the Settings button should still be visible.

---

Need me to add the Settings link somewhere else too? Like:
- On the welcome screen (before connecting a store)?
- In a dropdown menu?
- As a user avatar menu?
