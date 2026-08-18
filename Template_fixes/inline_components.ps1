$base_dir = "Z:\home\ojchris\webworks\Comparehub\Template_fixes"
$js_file = Join-Path $base_dir "js\components.js"

$js_content = [System.IO.File]::ReadAllText($js_file)

# Extract constants
function Extract-Const {
    param([string]$name)
    # Match multiline template strings
    if ($js_content -match "(?s)const $name\s*=\s*``(.*?)``;") {
        return $matches[1]
    }
    if ($js_content -match "(?s)const $name\s*=\s*`(.*?)`;") {
        return $matches[1]
    }
    if ($js_content -match "(?s)const $name\s*=\s*'(.*?)';") {
        return $matches[1]
    }
    return ""
}

$desktop_header = Extract-Const "DESKTOP_HEADER_HTML"
$vendor_header = Extract-Const "VENDOR_HEADER_HTML"
$footer = Extract-Const "FOOTER_HTML"
$mobile_nav = Extract-Const "MOBILE_NAV_HTML"
$auth_modals = Extract-Const "AUTH_MODALS_HTML"

$close_btn = Extract-Const "CLOSE_BTN"
$google_svg = Extract-Const "GOOGLE_SVG"

# Clean up interpolations
$generic_nav_cls = "font-work font-medium text-[14px] text-[#364153] hover:text-[#155dfc] transition-colors"
$generic_tab_cls = "text-[#99a1af]"

$desktop_header = $desktop_header -replace "\`$\{navCls\('[^']+'\)\}", $generic_nav_cls
$desktop_header = $desktop_header -replace "\`$\{activePage\s*===[^\}]+\}", $generic_nav_cls

$vendor_header = $vendor_header -replace "\`$\{activePage\s*===[^\}]+\}", $generic_nav_cls

$mobile_nav = $mobile_nav -replace "\`$\{navTabCls\('[^']+'\)\}", $generic_tab_cls

$footer = $footer -replace "\`$\{activePage\s*===[^\}]+\?\s*'[^']+'\s*:\s*'([^']+)'\}", '$1'

$auth_modals = $auth_modals.Replace("`${CLOSE_BTN}", $close_btn)
$auth_modals = $auth_modals.Replace("`${GOOGLE_SVG}", $google_svg)

$html_files = Get-ChildItem -Path $base_dir -Filter "*.html"

foreach ($file in $html_files) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    
    $is_vendor = $file.Name.StartsWith("vendor-")
    $header_to_use = if ($is_vendor) { $vendor_header } else { $desktop_header }
    
    # Replace placeholders
    $content = $content -replace '(?s)<div id="app-header">\s*</div>', $header_to_use
    $content = $content -replace '(?s)<div id="app-footer">\s*</div>', $footer
    $content = $content -replace '(?s)<div id="app-mobile-nav">\s*</div>', $mobile_nav
    
    # Inject auth modals before </body> if not already there
    if (-not $content.Contains('id="auth-login"') -and -not $content.Contains('id="auth-signup"')) {
        $content = $content.Replace("</body>", "$auth_modals`n</body>")
    }
    
    [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
}

# Comment out JS mounts
$js_content = $js_content -replace '(mountHeader\(\);)', '// $1'
$js_content = $js_content -replace "(mount\('app-footer', FOOTER_HTML\);)", '// $1'
$js_content = $js_content -replace "(mount\('app-mobile-nav', MOBILE_NAV_HTML\);)", '// $1'
$js_content = $js_content -replace "(document\.body\.insertAdjacentHTML\('beforeend', AUTH_MODALS_HTML\);)", '// $1'

[System.IO.File]::WriteAllText($js_file, $js_content, [System.Text.Encoding]::UTF8)

Write-Output "Processed HTML files successfully."
