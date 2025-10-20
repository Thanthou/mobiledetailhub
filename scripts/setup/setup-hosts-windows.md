# Windows Hosts File Setup

## 🎯 Purpose

To make `tenant.localhost` work in your browser, you need to add an entry to your Windows hosts file.

---

## ⚙️ Quick Setup (Manual)

### Option 1: Edit Manually (Recommended)

1. **Open Notepad as Administrator:**
   - Press `Windows Key`
   - Type "Notepad"
   - Right-click "Notepad"
   - Select "Run as administrator"

2. **Open the hosts file:**
   - Click `File` → `Open`
   - Navigate to: `C:\Windows\System32\drivers\etc`
   - Change file filter from "Text Documents" to "All Files"
   - Open the file named `hosts` (no extension)

3. **Add this line at the bottom:**
   ```
   127.0.0.1 tenant.localhost
   ```

4. **Save and close**
   - Press `Ctrl + S` to save
   - Close Notepad

5. **Flush DNS cache:**
   ```powershell
   ipconfig /flushdns
   ```

---

### Option 2: PowerShell (Quick)

Run this in PowerShell **as Administrator**:

```powershell
Add-Content -Path "C:\Windows\System32\drivers\etc\hosts" -Value "`n127.0.0.1 tenant.localhost" -Force
ipconfig /flushdns
```

---

## ✅ Verify Setup

After adding the entry, verify it worked:

```powershell
# Check if entry exists
findstr "tenant.localhost" C:\Windows\System32\drivers\etc\hosts

# Test resolution
ping tenant.localhost
```

You should see:
```
Pinging tenant.localhost [127.0.0.1] with 32 bytes of data:
Reply from 127.0.0.1: bytes=32 time<1ms TTL=128
```

---

## 🌐 Test in Browser

1. Make sure your tenant app is running:
   ```bash
   cd frontend
   npm run dev:tenant
   ```

2. Open browser and visit:
   - `http://tenant.localhost:5177`

3. You should see the tenant app (not a DNS error)

---

## 🐛 Troubleshooting

### "Access Denied" Error
- You must run Notepad or PowerShell **as Administrator**
- Right-click and select "Run as administrator"

### Changes Not Working
1. Clear browser cache and cookies
2. Flush DNS: `ipconfig /flushdns`
3. Restart browser completely
4. Try incognito/private browsing mode

### Still Not Working?
- Check antivirus isn't blocking changes
- Verify no trailing spaces in hosts file entry
- Ensure the line is exactly: `127.0.0.1 tenant.localhost`
- Try rebooting your computer

---

## 📝 Full Hosts File Example

Your hosts file should look something like this:

```
# Copyright (c) 1993-2009 Microsoft Corp.
#
# This is a sample HOSTS file used by Microsoft TCP/IP for Windows.
#
# ... (existing comments) ...

127.0.0.1       localhost
::1             localhost

# That Smart Site Development
127.0.0.1       tenant.localhost
```

---

## 🔄 Remove Entry (When Done)

To remove the entry later:

1. Open hosts file as Administrator (see steps above)
2. Delete or comment out the line:
   ```
   # 127.0.0.1 tenant.localhost
   ```
3. Save and flush DNS

---

## 📚 Additional Subdomains (Optional)

If you need more subdomains later, add them all:

```
127.0.0.1 tenant.localhost
127.0.0.1 admin.localhost
127.0.0.1 api.localhost
```

---

**Note:** The admin app uses `admin.localhost:5176` but this may already work in most browsers without a hosts entry. The tenant subdomain is required because the app specifically checks for it.

