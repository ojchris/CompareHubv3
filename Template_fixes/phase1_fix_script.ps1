$files = Get-ChildItem -Path '.\Phase 1 fixes\*.html', '.\Phase 1 fixes\vendor-*.html', '.\Phase 1 fixes\admin\*.html' -File
function AddAriaHiddenIcons {
    param([string]$content)
    return [System.Text.RegularExpressions.Regex]::Replace($content, '<i\b[^>]*\bdata-lucide=[^>]*>', {
        param($m)
        $tag = $m.Value
        if ($tag -match 'aria-hidden|aria-label') { return $tag }
        if ($tag.TrimEnd().EndsWith('/>')) { return $tag.Substring(0,$tag.Length-2) + ' aria-hidden="true"/>' }
        return $tag.Substring(0,$tag.Length-1) + ' aria-hidden="true">'
    }, [System.Text.RegularExpressions.RegexOptions]::Singleline)
}
function AddAriaHiddenEmptyAlt {
    param([string]$content)
    return [System.Text.RegularExpressions.Regex]::Replace($content, '<img\b[^>]*\balt=""[^>]*>', {
        param($m)
        $tag = $m.Value
        if ($tag -match 'aria-hidden') { return $tag }
        if ($tag.TrimEnd().EndsWith('/>')) { return $tag.Substring(0,$tag.Length-2) + ' aria-hidden="true"/>' }
        return $tag.Substring(0,$tag.Length-1) + ' aria-hidden="true">'
    }, [System.Text.RegularExpressions.RegexOptions]::Singleline)
}
foreach ($file in $files) {
    $text = Get-Content -Path $file -Raw -Encoding utf8
    $orig = $text
    $text = $text -replace 'https://cdn\.tailwindcss\.com', 'https://cdn.tailwindcss.com?with=default@3.4.1'
    $text = AddAriaHiddenIcons $text
    $text = AddAriaHiddenEmptyAlt $text
    if ($file.Name -eq 'admin/login.html') {
        $text = $text -replace '<form id="loginForm">', '<form id="loginForm" method="POST" action="/admin/login">'
        $text = $text -replace '<div id="errorMessage" class="error-message"></div>', '<div id="errorMessage" class="error-message" role="alert"></div>`n                <input type="hidden" name="_csrf" value="">'
        $text = $text -replace 'input type="email" id="email"', 'input type="email" id="email" name="email"'
        $text = $text -replace 'input type="password" id="password"', 'input type="password" id="password" name="password"'
        $text = $text -replace 'input type="checkbox" id="remember"', 'input type="checkbox" id="remember" name="remember"'
    }
    if ($file.Name -eq 'vendor-signup.html') {
        $fields = @{ 'business-name'='business_name'; 'vendor-email'='email'; 'vendor-phone'='phone'; 'vendor-password'='password'; 'vendor-confirm-password'='confirm_password'; 'vendor-state'='state'; 'vendor-city'='city'; 'vendor-address'='address'; 'vendor-terms'='terms'; 'otp-1'='otp1'; 'otp-2'='otp2'; 'otp-3'='otp3'; 'otp-4'='otp4'; 'otp-5'='otp5'; 'otp-6'='otp6' }
        foreach ($id in $fields.Keys) {
            $name = $fields[$id]
            $text = [System.Text.RegularExpressions.Regex]::Replace($text, 'id="' + [System.Text.RegularExpressions.Regex]::Escape($id) + '"(?![^>]*name=")', 'id="' + $id + '" name="' + $name + '"', [System.Text.RegularExpressions.RegexOptions]::Singleline)
        }
        $text = $text -replace '<form id="vendor-signup-form"', '<form id="vendor-signup-form" method="POST" action="/vendor/signup"'
        $text = [System.Text.RegularExpressions.Regex]::Replace($text, '(<form id="vendor-signup-form" method="POST" action="/vendor/signup"[^>]*>)', '$1`n        <input type="hidden" name="_csrf" value="">', [System.Text.RegularExpressions.RegexOptions]::Singleline)
        $text = $text -replace '<label class="block font-work font-medium text-\[13px\] text-\[#101828\] mb-2">Business Name \*</label>', '<label for="business-name" class="block font-work font-medium text-[13px] text-[#101828] mb-2">Business Name *</label>'
        $text = $text -replace '<label class="block font-work font-medium text-\[13px\] text-\[#101828\] mb-2">Email Address \*</label>', '<label for="vendor-email" class="block font-work font-medium text-[13px] text-[#101828] mb-2">Email Address *</label>'
        $text = $text -replace '<label class="block font-work font-medium text-\[13px\] text-\[#101828\] mb-2">Phone Number \*</label>', '<label for="vendor-phone" class="block font-work font-medium text-[13px] text-[#101828] mb-2">Phone Number *</label>'
        $text = $text -replace '<label class="block font-work font-medium text-\[13px\] text-\[#101828\] mb-2">Password \*</label>', '<label for="vendor-password" class="block font-work font-medium text-[13px] text-[#101828] mb-2">Password *</label>'
        $text = $text -replace '<label class="block font-work font-medium text-\[13px\] text-\[#101828\] mb-2">Confirm Password \*</label>', '<label for="vendor-confirm-password" class="block font-work font-medium text-[13px] text-[#101828] mb-2">Confirm Password *</label>'
        $text = $text -replace '<label class="block font-work font-medium text-\[13px\] text-\[#101828\] mb-2">State \*</label>', '<label for="vendor-state" class="block font-work font-medium text-[13px] text-[#101828] mb-2">State *</label>'
        $text = $text -replace '<label class="block font-work font-medium text-\[13px\] text-\[#101828\] mb-2">City \*</label>', '<label for="vendor-city" class="block font-work font-medium text-[13px] text-[#101828] mb-2">City *</label>'
        $text = $text -replace '<label class="block font-work font-medium text-\[13px\] text-\[#101828\] mb-2">Business Address \*</label>', '<label for="vendor-address" class="block font-work font-medium text-[13px] text-[#101828] mb-2">Business Address *</label>'
    }
    $text = $text -replace '<button id="mobile-menu-btn" class="w-9 h-9 border border-\[#e5e7eb\] rounded-\[8px\] flex items-center justify-center hover:bg-\[#f9fafb\] transition-colors shrink-0">', '<button id="mobile-menu-btn" aria-label="Open mobile menu" class="w-9 h-9 border border-[#e5e7eb] rounded-[8px] flex items-center justify-center hover:bg-[#f9fafb] transition-colors shrink-0">'
    if ($text -ne $orig) {
        Set-Content -Path $file -Value $text -Encoding utf8
        Write-Output "Updated $file"
    }
}
