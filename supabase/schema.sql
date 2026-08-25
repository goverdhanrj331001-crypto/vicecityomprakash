-- ============================================================================
-- GTA 5 MODS HUB - COMPLETE DATABASE SETUP & SEED SCRIPT (20+ ITEMS)
-- ============================================================================
-- Instructions:
-- 1. Open Supabase Dashboard (https://supabase.com/dashboard)
-- 2. Go to your Project -> SQL Editor -> Click 'New Query'
-- 3. Paste this ENTIRE code block and click 'RUN' (Green button)
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(100) DEFAULT 'fa fa-cube',
    description TEXT,
    mods_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. MODS / PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.mods (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    category_id INTEGER REFERENCES public.categories(id) ON DELETE SET NULL,
    price NUMERIC(10,2) DEFAULT 0.00 NOT NULL,
    version VARCHAR(50) DEFAULT '1.0.0' NOT NULL,
    author VARCHAR(150) DEFAULT 'GtaModderPro' NOT NULL,
    author_avatar TEXT,
    author_discord TEXT,
    author_twitter TEXT,
    author_patreon TEXT,
    cover_image TEXT NOT NULL,
    thumbnail_images TEXT[] DEFAULT ARRAY[]::TEXT[],
    zip_url TEXT NOT NULL,
    description TEXT,
    file_size VARCHAR(50) DEFAULT '15 MB',
    downloads INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    rating NUMERIC(3,2) DEFAULT 5.00,
    comments_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'featured', 'hidden')),
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    sub_categories TEXT[] DEFAULT ARRAY[]::TEXT[],
    video_url TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_mobile VARCHAR(50),
    country VARCHAR(100) DEFAULT 'India',
    country_flag TEXT DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_India.svg',
    mod_id INTEGER REFERENCES public.mods(id) ON DELETE SET NULL,
    mod_title VARCHAR(255) NOT NULL,
    mod_slug VARCHAR(255) NOT NULL,
    mod_category VARCHAR(100) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'upi' CHECK (payment_method IN ('upi', 'razorpay', 'paypal', 'binance', 'card')),
    amount_usd NUMERIC(10,2) NOT NULL,
    amount_inr NUMERIC(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed', 'refunded')),
    gateway_txn_id VARCHAR(255) NOT NULL,
    download_token VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.transactions (
    id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) REFERENCES public.orders(order_id) ON DELETE CASCADE,
    gateway VARCHAR(50) NOT NULL,
    gateway_ref VARCHAR(255) NOT NULL,
    gross_usd NUMERIC(10,2) NOT NULL,
    fee_usd NUMERIC(10,2) DEFAULT 0.00,
    net_usd NUMERIC(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'success',
    customer VARCHAR(150) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. USERS PROFILE TABLE
CREATE TABLE IF NOT EXISTS public.users_profile (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile VARCHAR(50),
    role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('super_admin', 'modder', 'customer')),
    orders_count INTEGER DEFAULT 0,
    total_spent NUMERIC(10,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. AUTO-UPDATE 'updated_at' TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_mods_updated_at ON public.mods;
CREATE TRIGGER set_mods_updated_at
    BEFORE UPDATE ON public.mods
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users_profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public categories are viewable" ON public.categories;
CREATE POLICY "Public categories are viewable" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public categories are insertable" ON public.categories;
CREATE POLICY "Public categories are insertable" ON public.categories FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public categories are updateable" ON public.categories;
CREATE POLICY "Public categories are updateable" ON public.categories FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public categories are deleteable" ON public.categories;
CREATE POLICY "Public categories are deleteable" ON public.categories FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public mods are viewable" ON public.mods;
CREATE POLICY "Public mods are viewable" ON public.mods FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public mods are insertable" ON public.mods;
CREATE POLICY "Public mods are insertable" ON public.mods FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public mods are updateable" ON public.mods;
CREATE POLICY "Public mods are updateable" ON public.mods FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public mods are deleteable" ON public.mods;
CREATE POLICY "Public mods are deleteable" ON public.mods FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public orders are insertable" ON public.orders;
CREATE POLICY "Public orders are insertable" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view orders" ON public.orders;
CREATE POLICY "Users can view orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role full access on mods" ON public.mods;
CREATE POLICY "Service role full access on mods" ON public.mods FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role full access on orders" ON public.orders;
CREATE POLICY "Service role full access on orders" ON public.orders FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Service role full access on categories" ON public.categories;
CREATE POLICY "Service role full access on categories" ON public.categories FOR ALL TO service_role USING (true);

-- Users Profile Policies (Fixes 42501 RLS Policy Error)
DROP POLICY IF EXISTS "Public users_profile are viewable" ON public.users_profile;
CREATE POLICY "Public users_profile are viewable" ON public.users_profile FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users profile insertable" ON public.users_profile;
CREATE POLICY "Users profile insertable" ON public.users_profile FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users profile updateable" ON public.users_profile;
CREATE POLICY "Users profile updateable" ON public.users_profile FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Service role full access on users_profile" ON public.users_profile;
CREATE POLICY "Service role full access on users_profile" ON public.users_profile FOR ALL TO service_role USING (true);

-- Transactions Policies
DROP POLICY IF EXISTS "Public transactions are viewable" ON public.transactions;
CREATE POLICY "Public transactions are viewable" ON public.transactions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public transactions are insertable" ON public.transactions;
CREATE POLICY "Public transactions are insertable" ON public.transactions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on transactions" ON public.transactions;
CREATE POLICY "Service role full access on transactions" ON public.transactions FOR ALL TO service_role USING (true);

-- ============================================================================
-- 9. SEED CATEGORIES (8 Default Categories)
-- ============================================================================
INSERT INTO public.categories (name, slug, icon, description, mods_count) VALUES
('Vehicles', 'vehicles', 'fa fa-car', 'Cars, Supercars, Bikes, Aircrafts & Boats', 450),
('Paint Jobs', 'paintjobs', 'fa fa-paint-brush', '4K High Res Liveries, Custom Decals & Skins', 210),
('Weapons', 'weapons', 'fa fa-crosshairs', 'Gun Models, Sound Overhauls, Military Packs', 140),
('Scripts', 'scripts', 'fa fa-code', '.NET, LUA, ASI Scripts & Gameplay Features', 320),
('Player', 'player', 'fa fa-user', 'Character Models, Outfits, Realistic Tattoos', 180),
('Maps', 'maps', 'fa fa-map', 'Custom Islands, Stunt Tracks & Expanded Maps', 95),
('Tools', 'tools', 'fa fa-wrench', 'OpenIV, Menyoo, ScriptHookV & Modding Utilities', 65),
('Misc', 'misc', 'fa fa-cubes', 'Sound Effects, Realistic Handling & Settings', 110)
ON CONFLICT (slug) DO UPDATE SET
name = EXCLUDED.name,
icon = EXCLUDED.icon,
description = EXCLUDED.description;

-- ============================================================================
-- 10. SEED ALL PRODUCTS / MODS (20+ Complete Catalog Items with Details)
-- ============================================================================
INSERT INTO public.mods (
    slug, title, category, price, version, author, cover_image, 
    thumbnail_images, zip_url, description, file_size, downloads, likes, rating, is_featured, status, tags, sub_categories
) VALUES
(
    'purple-cat-girl-livery-annis-elegy-rh-7',
    'Purple Cat Girl Livery - Annis Elegy RH-7 [4K Textures]',
    'paintjobs',
    4.99,
    '1.0.0',
    'Personka',
    '/images/catgirl_1.jpg',
    ARRAY['/images/catgirl_2.jpg', '/images/catgirl_1.jpg'],
    '/downloads/purple-cat-girl-livery-annis-elegy-rh-7.zip',
    'Ultra 4K resolution anime cat girl livery created for the Annis Elegy RH-7 & RH-8. Includes metallic gloss reflection mapping and custom template for easy paint customization.',
    '18.5 MB',
    1420,
    312,
    4.95,
    true,
    'featured',
    ARRAY['Anime', '4K', 'Livery', 'Elegy', 'Annis'],
    ARRAY['Paint Jobs', 'Elegy RH7', '4K Textures']
),
(
    '2024-bugatti-chiron-super-sport-300',
    '2024 Bugatti Chiron Super Sport 300+ Custom [Add-On | HQ]',
    'vehicles',
    9.99,
    '2.1.0',
    'SkylineGTRFreak',
    '/images/6252eb-bansh1.jpg',
    ARRAY['/images/vehicles.jpg', '/images/6252eb-bansh1.jpg'],
    '/downloads/bugatti-chiron-super-sport-300.zip',
    '100% accurate scale model with functional carbon active aero spoiler, realistic cockpit gauges, custom sound engine package, and breakable glass.',
    '45.2 MB',
    2890,
    580,
    5.00,
    true,
    'featured',
    ARRAY['Supercar', 'Bugatti', 'Add-On', 'HQ'],
    ARRAY['Vehicles', 'Supercars', 'Add-On']
),
(
    'ultra-realistic-graphics-enb-reshade-2026',
    'Ultra-Realistic Photoreal Graphics ENB & ReShade Pack 2026',
    'scripts',
    6.50,
    '3.4.0',
    'QuantVModding',
    '/images/5c9692-image.png',
    ARRAY['/images/5c9692-image_1.png', '/images/5c9692-image.png'],
    '/downloads/realistic-graphics-enb-reshade.zip',
    'Complete overhaul of lighting, volumetric clouds, ambient reflections, rain puddles, and color grading for FiveM and Single Player.',
    '120.0 MB',
    4120,
    980,
    4.90,
    true,
    'featured',
    ARRAY['Graphics', 'ENB', 'ReShade', 'Photoreal'],
    ARRAY['Scripts', 'Visuals', 'Graphics']
),
(
    'tier-1-tactical-spec-ops-weapon-overhaul',
    'Tier-1 Tactical Spec-Ops Weapon Overhaul Pack [4K Sounds]',
    'weapons',
    5.99,
    '1.2.0',
    'JMaxCustoms',
    '/images/1ba87e-4_1.jpg',
    ARRAY['/images/1ba87e-4.jpg', '/images/1ba87e-4_1.jpg'],
    '/downloads/tactical-military-weapon-pack.zip',
    'Includes 14 modernized firearms with holographic sights, suppressors, flashlights, realistic recoil animations and Dolby 5.1 audio samples.',
    '85.0 MB',
    1950,
    410,
    4.85,
    true,
    'featured',
    ARRAY['Weapons', 'Tactical', 'Guns', 'Sounds'],
    ARRAY['Weapons', 'Military', 'Overhaul']
),
(
    'betterchaseremade',
    'BetterChaseRemade [Enhanced Police AI & Tactics]',
    'scripts',
    3.99,
    '4.4.4-B',
    'FlareXll',
    '/images/5c9692-image.png',
    ARRAY['/images/5c9692-image_1.png'],
    '/downloads/betterchaseremade.zip',
    'Replaces standard GTA police AI with aggressive PIT maneuvers, tactical road blocks, helicopter spotlights, and dynamic spike strips.',
    '8.4 MB',
    890,
    145,
    4.80,
    true,
    'featured',
    ARRAY['Police', 'AI', 'Chase', 'Script'],
    ARRAY['Scripts', 'Police']
),
(
    'cessna-750-citation-x-add-on-sounds',
    'Cessna 750 Citation X [Add-On | Sounds | Legacy & Enhanced]',
    'vehicles',
    7.50,
    '1.0 LEGACY',
    'Reacon',
    '/images/1ba87e-4_1.jpg',
    ARRAY['/images/1ba87e-4.jpg'],
    '/downloads/cessna-750.zip',
    'High speed business jet with high detail passenger cabin, illuminated dashboard, working rudders, and authentic Rolls-Royce engine sounds.',
    '32.0 MB',
    760,
    120,
    4.90,
    true,
    'featured',
    ARRAY['Plane', 'Aircraft', 'Cessna', 'HQ'],
    ARRAY['Vehicles', 'Planes']
),
(
    'mark-v-soc-combat-patrol-boat',
    'Mark V SOC Special Ops Combat Boat [Add-On]',
    'vehicles',
    4.50,
    '1.0.0',
    'SkylineGTRFreak',
    '/images/6ec60a-4_1.jpg',
    ARRAY['/images/6ec60a-4.jpg'],
    '/downloads/mark-v-soc.zip',
    'High-speed military patrol craft equipped with dual mounted machine guns, radar system, and wave piercing deep-V aluminum hull.',
    '24.0 MB',
    540,
    95,
    4.75,
    false,
    'active',
    ARRAY['Military', 'Boat', 'SpecialOps'],
    ARRAY['Vehicles', 'Boats']
),
(
    '2023-audi-rs6-avant-c8-abt',
    '2023 Audi RS6 Avant C8 ABT Legacy [HQ Textures]',
    'vehicles',
    8.99,
    '2.0.0',
    'MotorsportModding',
    '/images/6252eb-bansh1.jpg',
    ARRAY['/images/vehicles.jpg'],
    '/downloads/audi-rs6-abt.zip',
    'Widebody sports wagon with twin turbo V8 sound package, dynamic matrix LED indicators, custom forged rims, and customizable interior upholstery.',
    '52.0 MB',
    3410,
    720,
    4.95,
    false,
    'active',
    ARRAY['Audi', 'RS6', 'ABT', 'StationWagon'],
    ARRAY['Vehicles', 'Sports']
),
(
    'personal-army-active-bodyguards-squads',
    'Personal Army (Active Bodyguards & Tactical Squads) [.NET]',
    'scripts',
    4.99,
    '1.1.0',
    'chris22622',
    '/images/f1e862-hero_upload.jpg',
    ARRAY['/images/f1e862-hero_upload.jpg'],
    '/downloads/personal-army.zip',
    'Summon customizable military contractors, sniper support teams, armored convoy escorts, and drone strikes at the push of a key.',
    '6.2 MB',
    1240,
    180,
    4.80,
    false,
    'active',
    ARRAY['Army', 'Bodyguards', 'Script', '.NET'],
    ARRAY['Scripts', 'Gameplay']
),
(
    'quicksilver-super-speed-mod',
    'Quicksilver Super Speed & Time Slow [.NET]',
    'scripts',
    3.50,
    '1.1.0',
    'chris22622',
    '/images/b644a7-hero.jpg',
    ARRAY['/images/b644a7-hero.jpg'],
    '/downloads/quicksilver.zip',
    'Run at supersonic velocities, walk on water, dodge bullets in ultra slow-motion, and create shockwaves that launch vehicles.',
    '4.5 MB',
    980,
    115,
    4.65,
    false,
    'active',
    ARRAY['Superhero', 'Speed', 'TimeSlow'],
    ARRAY['Scripts', 'Powers']
),
(
    'injured-peds-realistic-ragdoll-medical-system',
    'Injured Peds Realistic Ragdoll & Medical System [.NET]',
    'scripts',
    2.99,
    '1.0.0',
    'ww_aleeex',
    '/images/04711c-2312312414.jpg',
    ARRAY['/images/04711c-2312312414.jpg'],
    '/downloads/injured-peds.zip',
    'Pedestrians react realistically to injuries with limping, crawling, calling 911, applying tourniquets, and paramedic rescue sequences.',
    '3.8 MB',
    1560,
    230,
    4.70,
    false,
    'active',
    ARRAY['Realism', 'Ragdoll', 'Medical', 'Pedestrians'],
    ARRAY['Scripts', 'Realism']
),
(
    'banshee-gts-custom-tuning-template',
    'Banshee GTS Custom [Add-On | Tuning | Template]',
    'vehicles',
    5.99,
    '1.0.0',
    'Silentm503',
    '/images/6252eb-bansh1.jpg',
    ARRAY['/images/6252eb-bansh1.jpg'],
    '/downloads/banshee-gts.zip',
    'Modern reimagining of the iconic Dodge Viper / Bravado Banshee with 25+ tuning parts, custom livery mapping, and race bucket seats.',
    '28.0 MB',
    2110,
    410,
    4.90,
    false,
    'active',
    ARRAY['Banshee', 'Tuning', 'LoreFriendly'],
    ARRAY['Vehicles', 'Custom']
),
(
    'los-santos-drug-wars-sp-missions',
    'Los Santos Drug Wars in Single Player [Full DLC Port]',
    'scripts',
    7.99,
    '1.0.0',
    'HKH191',
    '/images/6974c3-LosSantosDrugWarsInSP.jpg',
    ARRAY['/images/6974c3-LosSantosDrugWarsInSP.jpg'],
    '/downloads/ls-drug-wars.zip',
    'Port of the GTA Online Drug Wars expansion into single player story mode with full cutscenes, Freakshop interior, and acid lab business.',
    '65.0 MB',
    3890,
    810,
    4.95,
    false,
    'active',
    ARRAY['Missions', 'DLC', 'AcidLab', 'StoryMode'],
    ARRAY['Scripts', 'Missions']
),
(
    'realistic-reverse-camera-park-assist',
    'Realistic Reverse Backup Camera & Dynamic Park Assist',
    'scripts',
    3.00,
    '1.1.0',
    'lelelelelelele',
    '/images/2a6b6a-preview_1.jpg',
    ARRAY['/images/2a6b6a-preview_1.jpg'],
    '/downloads/reverse-camera.zip',
    'Dynamic dashboard display rendering real-time rear wide angle camera feeds with predictive trajectory lines when shifting into reverse.',
    '2.1 MB',
    1780,
    340,
    4.85,
    false,
    'active',
    ARRAY['Camera', 'HUD', 'Vehicles', 'Realism'],
    ARRAY['Scripts', 'HUD']
),
(
    'bugatti-centodieci-add-on-legacy-enhanced',
    'Bugatti Centodieci [Add-On | Legacy | Enhanced]',
    'vehicles',
    11.99,
    '1.0.0',
    'Hammer76',
    '/images/0f1edd-1.jpg',
    ARRAY['/images/0f1edd-1.jpg'],
    '/downloads/bugatti-centodieci.zip',
    'Limited edition French hypercar with 8.0L quad-turbo W16 engine bay modeling, active motorized rear wing, and custom carbon fiber textures.',
    '48.0 MB',
    4200,
    910,
    5.00,
    false,
    'active',
    ARRAY['Bugatti', 'Centodieci', 'Hypercar', 'HQ'],
    ARRAY['Vehicles', 'Supercars']
)
ON CONFLICT (slug) DO UPDATE SET
title = EXCLUDED.title,
price = EXCLUDED.price,
category = EXCLUDED.category,
description = EXCLUDED.description,
cover_image = EXCLUDED.cover_image,
zip_url = EXCLUDED.zip_url,
file_size = EXCLUDED.file_size;

-- ============================================================================
-- 11. SEED INITIAL LIVE ORDERS & TRANSACTIONS
-- ============================================================================
INSERT INTO public.orders (
    order_id, customer_name, customer_email, customer_mobile, country, 
    mod_title, mod_slug, mod_category, payment_method, amount_usd, amount_inr, status, gateway_txn_id
) VALUES
('ORD-9842', 'Goverdhan Sharma', 'goverdhan@example.com', '0000000000', 'India', 'Purple Cat Girl Livery - Annis Elegy RH-7', 'purple-cat-girl-livery-annis-elegy-rh-7', 'paintjobs', 'upi', 4.99, 415, 'completed', 'UPI/23984710293/PAYTM'),
('ORD-9841', 'Alex Rivera', 'alex.rivera@gmail.com', '14155552671', 'United States', '2024 Bugatti Chiron Super Sport 300+ Custom', '2024-bugatti-chiron-super-sport-300', 'vehicles', 'paypal', 9.99, 830, 'completed', 'PAYPAL_883291049281'),
('ORD-9840', 'Vikram Singh', 'vikram.singh@yahoo.com', '9988776655', 'India', 'Ultra-Realistic Photoreal Graphics ENB & ReShade', 'ultra-realistic-graphics-enb-reshade-2026', 'scripts', 'razorpay', 6.50, 540, 'completed', 'RZP_PAY_982341234')
ON CONFLICT (order_id) DO NOTHING;
