import re

def create_card_index(id, category, image, title, unit, vendor, price):
    return f'''          <div class="product-card" data-id="{id}" data-category="{category}" role="article">
            <a href="product.html#id={id}" class="card-image block"><img src="images/products/{image}" alt="{title}" loading="lazy" onerror="this.src='images/placeholder.jpg'"></a>
            <div class="card-body">
              <a href="product.html#id={id}" class="block" style="text-decoration:none">
                <a href="brand.html#brand={vendor}" class="vendor-name" style="text-decoration:none" onclick="event.stopPropagation()">{vendor}</a>
                <p class="product-name">{title}</p>
                <p class="product-unit">{unit}</p>
              </a>
              <div>
                <p class="product-price">{price}</p>
                <div style="display:flex;gap:8px;margin-top:8px">
                  <button class="compare-btn" data-id="{id}" style="flex:1">+ Compare</button>
                  <button class="wishlist-btn" data-id="{id}" style="flex:1;border:1px solid #e5e7eb;background:#f9fafb;color:#364153;font-weight:500;border-radius:8px;cursor:pointer">? Save</button>
                </div>
              </div>
            </div>
          </div>'''

def create_card_category(id, category, image, title, unit, vendor, price):
    return f'''        <div class="bg-white rounded-[10px] overflow-hidden flex flex-col shadow-soft">
          <a href="product.html#id={id}" class="block overflow-hidden bg-[#f9fafb]" style="height:151px">
            <img src="images/products/{image}" alt="{title}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" onerror="this.src='images/placeholder.jpg'">
          </a>
          <div class="flex flex-col gap-2.5 p-4 flex-1">
            <a href="product.html#id={id}" class="flex flex-col gap-0.5 flex-1">
              <p class="font-inter font-medium text-[11px] text-[#0f42b3] tracking-[0.06px] truncate">{vendor}</p>
              <p class="font-inter font-semibold text-[13px] text-[#364153] leading-tight line-clamp-2">{title}</p>
              <p class="font-inter text-[10px] text-[#99a1af] tracking-[0.12px]">{unit}</p>
            </a>
            <div class="mt-auto">
              <p class="font-inter font-bold text-[15px] text-[#364153] mb-2">{price}</p>
              <button class="w-full bg-[#155dfc] text-white font-inter font-medium text-[12px] rounded-[12px] flex items-center justify-center hover:bg-[#1447e6] transition-colors" style="height:32px">
                + Compare
              </button>
            </div>
          </div>
        </div>'''


elec_products = [
    (1, "electronics", "iphone-15-pro.jpg", "iPhone 15 Pro", "256GB / Titanium", "GADGETPRO", "?1,850,000"),
    (2, "electronics", "macbook-air-m3.jpg", "MacBook Air M3", "512GB / Space Gray", "TECHSTORE", "?2,150,000"),
    (3, "electronics", "playstation-5.jpg", "PlayStation 5", "Standard Edition", "DIGIZONE", "?750,000"),
    (4, "electronics", "ipad-pro-12.jpg", "iPad Pro 12.9\\"", "256GB / Wi-Fi", "GADGETPRO", "?1,450,000"),
    (5, "electronics", "sony-wh1000xm5.jpg", "Sony WH-1000XM5", "Black", "SMARTBUY", "?350,000")
]

food_products = [
    (6, "food", "white-rice.jpg", "Bag of Rice", "50kg / Long Grain", "FOODHUB", "?85,000"),
    (7, "food", "white-yam.jpg", "White Yam", "Large Tubers", "NAIJAFOODS", "?15,000"),
    (8, "food", "palm-oil.jpg", "Palm Oil", "5 Litres", "GREENFARM", "?12,500"),
    (9, "food", "fresh-catfish.jpg", "Fresh Catfish", "per kg", "FOODHUB", "?4,500"),
    (10, "food", "cow-leg.jpg", "Cow Leg", "per portion", "NAIJAFOODS", "?8,500")
]

home_products = [
    (11, "home", "jbl-charge-5.jpg", "JBL Charge 5", "Bluetooth Speaker", "GADGETPRO", "?120,000"),
    (12, "home", "apple-watch-9.jpg", "Apple Watch S9", "45mm", "TECHSTORE", "?380,000"),
    (13, "home", "canon-eos-r50.jpg", "Canon EOS R50", "Mirrorless", "DIGIZONE", "?650,000"),
    (14, "home", "african-snail.jpg", "African Snail", "Jumbo Size", "GREENFARM", "?15,000"),
    (15, "home", "ripe-plantain.jpg", "Ripe Plantain", "Large Bunch", "NAIJAFOODS", "?4,500")
]


# INDEX.HTML FIX
with open('index.html', 'r', encoding='utf-8') as f:
    idx_content = f.read()

elec_html = "\\n".join([create_card_index(*p) for p in elec_products])
food_html = "\\n".join([create_card_index(*p) for p in food_products])
home_html = "\\n".join([create_card_index(*p) for p in home_products])

idx_content = re.sub(
    r'<div id="electronics-grid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">.*?<!-- End static card -->\n        </div>',
    f'<div id="electronics-grid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">\\n          <!-- TODO (Drupal): Replace static cards below with Twig loop: {{% for product in category.products %}} -->\\n{elec_html}\\n        </div>',
    idx_content, flags=re.DOTALL
)

idx_content = re.sub(
    r'<div id="food-grid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">.*?</div>\n        </div>',
    f'<div id="food-grid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">\\n          <!-- TODO (Drupal): Replace static cards below with Twig loop -->\\n{food_html}\\n        </div>',
    idx_content, flags=re.DOTALL
)

idx_content = re.sub(
    r'<div id="home-grid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">.*?</div>\n        </div>',
    f'<div id="home-grid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">\\n          <!-- TODO (Drupal): Replace static cards below with Twig loop -->\\n{home_html}\\n        </div>',
    idx_content, flags=re.DOTALL
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(idx_content)


# CATEGORY.HTML FIX
with open('category.html', 'r', encoding='utf-8') as f:
    cat_content = f.read()

all_cat_html = "\\n".join([create_card_category(*p) for p in (elec_products + food_products)])

cat_content = re.sub(
    r'<div id="product-grid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">.*?</div>\n      </div>',
    f'<div id="product-grid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">\\n        <!-- TODO (Drupal): Replace static cards below with Twig loop: {{% for product in category.products %}} -->\\n{all_cat_html}\\n      </div>',
    cat_content, flags=re.DOTALL
)

with open('category.html', 'w', encoding='utf-8') as f:
    f.write(cat_content)

print("Done")
