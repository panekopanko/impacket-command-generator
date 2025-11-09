// ♥ Panko's Impacket Command Generator - Script ♥

let currentCommands = impacketCommands;
let currentFilters = new Set(['all']);

// Parameter inputs
const paramInputs = {
    domain: '',
    username: '',
    password: '',
    ntlm_hash: '',
    aes_key: '',
    target: '',
    dc_ip: '',
    command: 'whoami',
    target_user: '',
    spn: '',
    krbtgt_hash: '',
    domain_sid: '',
    service_hash: '',
    share_name: 'share',
    local_path: '/tmp/share',
    key_path: 'HKLM\\Software',
    computer_name: 'EVILPC',
    computer_pass: 'Password123!',
    target_computer: '',
    attacker_computer: '',
    child_domain: '',
    exchange_server: ''
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    setupEventListeners();
    renderCategories();
    renderCommands();
});

// Theme toggle
function toggleTheme() {
    const body = document.body;
    const isDarkMode = body.classList.contains('dark-mode');

    if (isDarkMode) {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

// Event listeners
function setupEventListeners() {
    // Search
    document.getElementById('search').addEventListener('input', (e) => {
        filterCommands();
    });

    // Clear search
    document.getElementById('clear-search').addEventListener('click', () => {
        document.getElementById('search').value = '';
        filterCommands();
    });

    // Parameter inputs
    Object.keys(paramInputs).forEach(param => {
        const input = document.getElementById(param);
        if (input) {
            input.addEventListener('input', (e) => {
                paramInputs[param] = e.target.value;
                renderCommands();
            });
        }
    });

    // Copy all button
    document.getElementById('copy-all').addEventListener('click', copyAllCommands);
}

// Render categories
function renderCategories() {
    const container = document.getElementById('categories');
    container.innerHTML = '';

    Object.entries(categories).forEach(([key, label]) => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.textContent = label;

        if (currentFilters.has(key)) {
            btn.classList.add('active');
        }

        btn.addEventListener('click', () => {
            toggleCategory(key);
        });

        container.appendChild(btn);
    });
}

// Toggle category filter
function toggleCategory(category) {
    if (category === 'all') {
        currentFilters.clear();
        currentFilters.add('all');
    } else {
        currentFilters.delete('all');

        if (currentFilters.has(category)) {
            currentFilters.delete(category);
            if (currentFilters.size === 0) {
                currentFilters.add('all');
            }
        } else {
            currentFilters.add(category);
        }
    }

    renderCategories();
    filterCommands();
}

// Filter commands
function filterCommands() {
    const searchTerm = document.getElementById('search').value.toLowerCase();

    currentCommands = impacketCommands.filter(cmd => {
        // Category filter
        const categoryMatch = currentFilters.has('all') ||
            cmd.meta.some(tag => currentFilters.has(tag));

        // Search filter
        const searchMatch = !searchTerm ||
            cmd.name.toLowerCase().includes(searchTerm) ||
            cmd.description.toLowerCase().includes(searchTerm) ||
            cmd.command.toLowerCase().includes(searchTerm) ||
            cmd.meta.some(tag => tag.toLowerCase().includes(searchTerm));

        return categoryMatch && searchMatch;
    });

    renderCommands();
}

// Render commands
function renderCommands() {
    const container = document.getElementById('commands');
    container.innerHTML = '';

    if (currentCommands.length === 0) {
        container.innerHTML = '<p class="no-results">no commands found 💜</p>';
        return;
    }

    currentCommands.forEach(cmd => {
        const commandEl = document.createElement('div');
        commandEl.className = 'command';

        // Generate command with user inputs
        let generatedCmd = cmd.command;
        Object.entries(paramInputs).forEach(([param, value]) => {
            const placeholder = `{${param}}`;
            if (generatedCmd.includes(placeholder)) {
                generatedCmd = generatedCmd.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value || placeholder);
            }
        });

        // Tags
        const tags = cmd.meta.map(tag => `<span class="tag">${tag}</span>`).join('');

        commandEl.innerHTML = `
            <div class="command-header">
                <h3>${cmd.name}</h3>
                <button class="copy-btn" onclick="copyCommand('${escapeHtml(generatedCmd)}')">
                    copy
                </button>
            </div>
            <p class="command-description">${cmd.description}</p>
            <div class="command-tags">${tags}</div>
            <pre class="command-code"><code>${escapeHtml(generatedCmd)}</code></pre>
        `;

        container.appendChild(commandEl);
    });

    // Update count
    document.getElementById('command-count').textContent =
        `showing ${currentCommands.length} command${currentCommands.length !== 1 ? 's' : ''}`;
}

// Copy command
function copyCommand(cmd) {
    navigator.clipboard.writeText(cmd).then(() => {
        showNotification('copied to clipboard! ♥');
    }).catch(() => {
        showNotification('failed to copy :(');
    });
}

// Copy all commands
function copyAllCommands() {
    const allCommands = currentCommands.map(cmd => {
        let generatedCmd = cmd.command;
        Object.entries(paramInputs).forEach(([param, value]) => {
            const placeholder = `{${param}}`;
            if (generatedCmd.includes(placeholder)) {
                generatedCmd = generatedCmd.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value || placeholder);
            }
        });
        return `# ${cmd.name}\n${generatedCmd}`;
    }).join('\n\n');

    navigator.clipboard.writeText(allCommands).then(() => {
        showNotification(`copied ${currentCommands.length} commands! ♥`);
    }).catch(() => {
        showNotification('failed to copy :(');
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
