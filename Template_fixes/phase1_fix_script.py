import re
from pathlib import Path
base = Path('.')
html_files = list(base.glob('*.html')) + list(base.glob('vendor-*.html')) + list(base.glob('admin/*.html'))
print(f'Processing {len(html_files)} HTML files')
for file in html_files:
    text = file.read_text(encoding='utf-8')
    orig = text
    text = text.replace('https://cdn.tailwindcss.com', 'https://cdn.tailwindcss.com?with=default@3.4.1')
    def icon_repl(m):
        tag = m.group(0)
        if 'aria-hidden' in tag or 'aria-label' in tag:
            return tag
        if tag.endswith('/>'):
            return tag[:-2] + ' aria-hidden="true"/>'
        else:
            return tag[:-1] + ' aria-hidden="true">'
    text = re.sub(r'<i\b[^>]*\bdata-lucide=[^>]*>', icon_repl, text)
    def empty_alt_repl(m):
        tag = m.group(0)
        if 'aria-hidden' in tag:
            return tag
        if tag.endswith('/>'):
            return tag[:-2] + ' aria-hidden="true"/>'
        else:
            return tag[:-1] + ' aria-hidden="true">'
    text = re.sub(r'<img\b[^>]*\balt=""[^>]*>', empty_alt_repl, text)
    if file.name == 'admin/login.html':
        text = text.replace('<form id="loginForm">', '<form id="loginForm" method="POST" action="/admin/login">')
        text = text.replace(
            '<div id="errorMessage" class="error-message"></div>',
            '<div id="errorMessage" class="error-message" role="alert"></div>\n                <input type="hidden" name="_csrf" value="">'
        )
        text = text.replace('input type="email" id="email"', 'input type="email" id="email" name="email"')
        text = text.replace('input type="password" id="password"', 'input type="password" id="password" name="password"')
        text = text.replace('input type="checkbox" id="remember"', 'input type="checkbox" id="remember" name="remember"')
    if file.name == 'vendor-signup.html':
        mapping = {
            'business-name': 'business_name',
            'vendor-email': 'email',
            'vendor-phone': 'phone',
            'vendor-password': 'password',
            'vendor-confirm-password': 'confirm_password',
            'vendor-state': 'state',
            'vendor-city': 'city',
            'vendor-address': 'address',
            'vendor-terms': 'terms',
            'otp-1': 'otp1',
            'otp-2': 'otp2',
            'otp-3': 'otp3',
            'otp-4': 'otp4',
            'otp-5': 'otp5',
            'otp-6': 'otp6',
        }
        for rid, name in mapping.items():
            text = re.sub(rf'(?<!name="[^"]*")\bid="{rid}"', f'id="{rid}" name="{name}"', text)
        text = text.replace('<form id="vendor-signup-form"', '<form id="vendor-signup-form" method="POST" action="/vendor/signup"')
        text = text.replace('<form id="vendor-signup-form" method="POST" action="/vendor/signup" class="bg-white rounded-[16px] border border-[#e5e7eb] p-6 space-y-4" style="box-shadow:0 1px 4px rgba(0,0,0,0.05)">',
            '<form id="vendor-signup-form" method="POST" action="/vendor/signup" class="bg-white rounded-[16px] border border-[#e5e7eb] p-6 space-y-4" style="box-shadow:0 1px 4px rgba(0,0,0,0.05)">\n        <input type="hidden" name="_csrf" value="">')
        label_map = {
            'Business Name *': 'business-name',
            'Email Address *': 'vendor-email',
            'Phone Number *': 'vendor-phone',
            'Password *': 'vendor-password',
            'Confirm Password *': 'vendor-confirm-password',
            'State *': 'vendor-state',
            'City *': 'vendor-city',
            'Business Address *': 'vendor-address',
        }
        for label_text, fid in label_map.items():
            text = text.replace(f'<label class="block font-work font-medium text-[13px] text-[#101828] mb-2">{label_text}</label>',
                                f'<label for="{fid}" class="block font-work font-medium text-[13px] text-[#101828] mb-2">{label_text}</label>')
        text = text.replace('<button type="button" onclick="togglePassword(\'vendor-password\',\'eye-pwd\')" class="absolute right-3 top-1/2 -translate-y-1/2 text-[#99a1af] hover:text-[#364153]">\n              <i data-lucide="eye" id="eye-pwd" class="w-4 h-4"></i>\n            </button>',
                            '<button type="button" onclick="togglePassword(\'vendor-password\',\'eye-pwd\')" class="absolute right-3 top-1/2 -translate-y-1/2 text-[#99a1af] hover:text-[#364153]" aria-label="Toggle password visibility">\n              <i data-lucide="eye" id="eye-pwd" class="w-4 h-4"></i>\n            </button>')
        text = text.replace('<button type="button" onclick="togglePassword(\'vendor-confirm-password\',\'eye-confirm\')" class="absolute right-3 top-1/2 -translate-y-1/2 text-[#99a1af] hover:text-[#364153]">\n              <i data-lucide="eye" id="eye-confirm" class="w-4 h-4"></i>\n            </button>',
                            '<button type="button" onclick="togglePassword(\'vendor-confirm-password\',\'eye-confirm\')" class="absolute right-3 top-1/2 -translate-y-1/2 text-[#99a1af] hover:text-[#364153]" aria-label="Toggle password visibility">\n              <i data-lucide="eye" id="eye-confirm" class="w-4 h-4"></i>\n            </button>')
        text = text.replace('<button onclick="window.authShow(\'login\')" class="text-[#155dfc] font-semibold hover:underline bg-none border-none cursor-pointer">Sign in here</button>',
                            '<a href="admin/login.html" class="text-[#155dfc] font-semibold hover:underline">Sign in here</a>')
    if "window.authShow('login')" in text:
        text = text.replace('<button onclick="window.authShow(\'login\')" class="font-work font-medium text-[13px] text-[#155dfc] hover:text-[#1447e6] transition-colors py-2 text-left">Sign In</button>',
                            '<a href="admin/login.html" class="font-work font-medium text-[13px] text-[#155dfc] hover:text-[#1447e6] transition-colors py-2 text-left inline-flex">Sign In</a>')
    text = text.replace('<button id="mobile-menu-btn" class="w-9 h-9 border border-[#e5e7eb] rounded-[8px] flex items-center justify-center hover:bg-[#f9fafb] transition-colors shrink-0">',
                        '<button id="mobile-menu-btn" aria-label="Open mobile menu" class="w-9 h-9 border border-[#e5e7eb] rounded-[8px] flex items-center justify-center hover:bg-[#f9fafb] transition-colors shrink-0">')
    if text != orig:
        file.write_text(text, encoding='utf-8')
        print(f'Updated {file}')
