import os
import re
import glob

def main():
    base_dir = r"Z:/home/ojchris/webworks/Comparehub/Template_fixes"
    js_file = os.path.join(base_dir, "js", "components.js")
    
    with open(js_file, "r", encoding="utf-8") as f:
        js_content = f.read()
        
    # Extract constants
    def extract_const(name):
        match = re.search(f"const {name}\s*=\s*`(.*?)`;", js_content, re.DOTALL)
        if match:
            return match.group(1)
        # Maybe it's a single quote string
        match = re.search(f"const {name}\s*=\s*'(.*?)';", js_content, re.DOTALL)
        if match:
            return match.group(1)
        return ""
        
    desktop_header = extract_const("DESKTOP_HEADER_HTML")
    vendor_header = extract_const("VENDOR_HEADER_HTML")
    footer = extract_const("FOOTER_HTML")
    mobile_nav = extract_const("MOBILE_NAV_HTML")
    auth_modals = extract_const("AUTH_MODALS_HTML")
    
    close_btn = extract_const("CLOSE_BTN")
    google_svg = extract_const("GOOGLE_SVG")
    
    # Clean up interpolations
    generic_nav_cls = "font-work font-medium text-[14px] text-[#364153] hover:text-[#155dfc] transition-colors"
    generic_tab_cls = "text-[#99a1af]"
    
    desktop_header = re.sub(r"\$\{navCls\('[^']+'\)\}", generic_nav_cls, desktop_header)
    desktop_header = re.sub(r"\$\{activePage\s*===[^}]+\}", generic_nav_cls, desktop_header)
    
    vendor_header = re.sub(r"\$\{activePage\s*===[^}]+\}", generic_nav_cls, vendor_header)
    
    mobile_nav = re.sub(r"\$\{navTabCls\('[^']+'\)\}", generic_tab_cls, mobile_nav)
    
    footer = re.sub(r"\$\{activePage\s*===[^}]+\? '[^']+' : '([^']+)'\}", r"\1", footer)
    
    auth_modals = auth_modals.replace("${CLOSE_BTN}", close_btn)
    auth_modals = auth_modals.replace("${GOOGLE_SVG}", google_svg)
    
    html_files = glob.glob(os.path.join(base_dir, "*.html"))
    
    for html_file in html_files:
        with open(html_file, "r", encoding="utf-8") as f:
            content = f.read()
            
        filename = os.path.basename(html_file)
        
        is_vendor = filename.startswith("vendor-")
        header_to_use = vendor_header if is_vendor else desktop_header
        
        # Replace placeholders
        content = re.sub(r'<div id="app-header">\s*</div>', header_to_use, content)
        content = re.sub(r'<div id="app-footer">\s*</div>', footer, content)
        content = re.sub(r'<div id="app-mobile-nav">\s*</div>', mobile_nav, content)
        
        # Inject auth modals before </body> if not already there
        if "auth-login" not in content and "auth-signup" not in content:
            content = content.replace("</body>", f"{auth_modals}\n</body>")
            
        with open(html_file, "w", encoding="utf-8") as f:
            f.write(content)
            
    # Comment out JS mounts
    js_content = re.sub(r"(mountHeader\(\);)", r"// \1", js_content)
    js_content = re.sub(r"(mount\('app-footer', FOOTER_HTML\);)", r"// \1", js_content)
    js_content = re.sub(r"(mount\('app-mobile-nav', MOBILE_NAV_HTML\);)", r"// \1", js_content)
    js_content = re.sub(r"(document\.body\.insertAdjacentHTML\('beforeend', AUTH_MODALS_HTML\);)", r"// \1", js_content)
    
    with open(js_file, "w", encoding="utf-8") as f:
        f.write(js_content)
        
    print(f"Processed {len(html_files)} HTML files successfully.")

if __name__ == "__main__":
    main()
