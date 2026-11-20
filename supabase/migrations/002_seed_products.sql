-- ============================================================
-- Mistri E-Commerce — Seed Products
-- File: 002_seed_products.sql
-- ============================================================

-- ----------------------------------------------------------------
-- Categories
-- ----------------------------------------------------------------
insert into categories (name, slug, image_url) values
  ('Robotics Kits', 'robotics-kits', 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&q=80'),
  ('Smart Home',    'smart-home',    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'),
  ('Components',   'components',    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80'),
  ('Gadgets',      'gadgets',       'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80');

-- ----------------------------------------------------------------
-- Products (24 total across 4 categories)
-- ----------------------------------------------------------------
do $$
declare
  cat_robotics   uuid;
  cat_smart      uuid;
  cat_components uuid;
  cat_gadgets    uuid;
  p_id           uuid;
begin
  select id into cat_robotics   from categories where slug = 'robotics-kits';
  select id into cat_smart      from categories where slug = 'smart-home';
  select id into cat_components from categories where slug = 'components';
  select id into cat_gadgets    from categories where slug = 'gadgets';

  -- ==============================================================
  -- ROBOTICS KITS (6 products)
  -- ==============================================================

  -- Product 1 — Arduino Mega 2560 Pro Kit
  insert into products (title, slug, description, price, compare_at_price, category_id, brand, is_featured, tags)
  values (
    'Arduino Mega 2560 Pro Kit',
    'arduino-mega-2560-pro-kit',
    'Complete robotics starter kit with Arduino Mega 2560, 65+ components, motor drivers, servo motors, ultrasonic sensors, LCD display, and comprehensive project guide. Perfect for beginners and educators.',
    8999, 12999, cat_robotics, 'Arduino', true,
    array['robotics','arduino','starter','educational','iot']
  )
  returning id into p_id;

  insert into product_images (product_id, url, alt, position) values
    (p_id, 'https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=800&q=80', 'Arduino Mega Kit Box', 0),
    (p_id, 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80', 'Components spread', 1);

  insert into product_variants (product_id, title, sku, price, stock, options) values
    (p_id, 'Standard Kit',          'ARD-MEGA-STD', 8999,  45, '{"includes": "Standard"}'),
    (p_id, 'Pro Kit + Power Supply','ARD-MEGA-PRO', 11999, 20, '{"includes": "Pro + PSU"}');

  -- Product 2 — Raspberry Pi 5 Robotics Bundle
  insert into products (title, slug, description, price, compare_at_price, category_id, brand, is_featured, tags)
  values (
    'Raspberry Pi 5 Robotics Bundle',
    'raspberry-pi-5-robotics-bundle',
    'Official Raspberry Pi 5 (8GB RAM) bundled with robotics HAT, motor controllers, camera module, and aluminum case. Build AI-powered robots, computer vision projects, and IoT systems.',
    18999, 22999, cat_robotics, 'Raspberry Pi', true,
    array['raspberry-pi','robotics','ai','computer-vision','single-board-computer']
  )
  returning id into p_id;

  insert into product_images (product_id, url, alt, position) values
    (p_id, 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80', 'Raspberry Pi 5', 0),
    (p_id, 'https://images.unsplash.com/photo-1595617795501-9661aafda72a?w=800&q=80', 'Pi with HAT', 1);

  insert into product_variants (product_id, title, sku, price, stock, options) values
    (p_id, '8GB RAM Bundle',  'RPI5-8GB-RBT',  18999, 30, '{"ram": "8GB"}'),
    (p_id, '16GB RAM Bundle', 'RPI5-16GB-RBT', 24999, 15, '{"ram": "16GB"}');

  -- Product 3 — 6-DOF Robotic Arm Kit
  insert into products (title, slug, description, price, compare_at_price, category_id, brand, is_featured, tags)
  values (
    '6-DOF Robotic Arm Kit',
    'six-dof-robotic-arm-kit',
    'Professional 6-axis robotic arm with high-torque servo motors, aluminum alloy frame, and Arduino-compatible controller. Program precise movements with inverse kinematics. Ideal for pick-and-place automation.',
    24999, 32999, cat_robotics, 'Mistri Robotics', false,
    array['robotic-arm','servo','automation','6dof','industrial']
  )
  returning id into p_id;

  insert into product_images (product_id, url, alt, position) values
    (p_id, 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80', 'Robotic Arm', 0),
    (p_id, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', 'Arm detail', 1);

  insert into product_variants (product_id, title, sku, price, stock, options) values
    (p_id, 'Kit Only',              'RARM-6DOF-KIT',  24999, 25, '{"type": "Kit"}'),
    (p_id, 'Kit + Controller Board','RARM-6DOF-CTRL', 29999, 10, '{"type": "Kit + Controller"}');

  -- Product 4 — Line-Following Robot Kit
  insert into products (title, slug, description, price, compare_at_price, category_id, brand, is_featured, tags)
  values (
    'Line-Following Robot Kit',
    'line-following-robot-kit',
    'Build a smart line-following robot from scratch. Includes chassis, IR sensors, DC motors with encoders, motor driver board, and step-by-step programming tutorials in Arduino C++.',
    4999, 6999, cat_robotics, 'EduBot', false,
    array['robotics','line-follower','educational','beginner','arduino']
  )
  returning id into p_id;

  insert into product_images (product_id, url, alt, position) values
    (p_id, 'https://images.unsplash.com/photo-1562408590-e32931084e23?w=800&q=80', 'Line follower robot', 0);

  insert into product_variants (product_id, title, sku, price, stock, options) values
    (p_id, 'Basic Kit',                   'LBOT-BASIC',  4999, 60, '{"level": "Basic"}'),
    (p_id, 'Advanced Kit with Bluetooth', 'LBOT-ADV-BT', 6999, 35, '{"level": "Advanced"}');

  -- Product 5 — ESP32 IoT Rover
  insert into products (title, slug, description, price, compare_at_price, category_id, brand, is_featured, tags)
  values (
    'ESP32 IoT Rover',
    'esp32-iot-rover',
    'Wi-Fi + Bluetooth enabled rover with ESP32 microcontroller, camera, ultrasonic obstacle avoidance, and web-based control interface. Build your own remote-controlled or autonomous robot.',
    7999, 9999, cat_robotics, 'IoTech', false,
    array['esp32','iot','rover','wifi','autonomous','camera']
  )
  returning id into p_id;

  insert into product_images (product_id, url, alt, position) values
    (p_id, 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&q=80', 'ESP32 Rover', 0);

  insert into product_variants (product_id, title, sku, price, stock, options) values
    (p_id, 'Standard Rover',    'ESP32-ROVER-STD', 7999, 40, '{"camera": "No"}'),
    (p_id, 'Rover with Camera', 'ESP32-ROVER-CAM', 9999, 25, '{"camera": "Yes"}');

  -- Product 6 — FPV Drone Building Kit
  insert into products (title, slug, description, price, compare_at_price, category_id, brand, is_featured, tags)
  values (
    'FPV Drone Building Kit',
    'fpv-drone-building-kit',
    'Complete DIY drone kit with 250mm carbon fiber frame, 2306 brushless motors, 30A ESCs, F7 flight controller, FPV camera, and video transmitter. No soldering required for assembly.',
    34999, 44999, cat_robotics, 'AeroTech', false,
    array['drone','fpv','diy','carbon-fiber','racing','brushless']
  )
  returning id into p_id;

  insert into product_images (product_id, url, alt, position) values
    (p_id, 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80', 'FPV Drone', 0),
    (p_id, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', 'Drone components', 1);

  insert into product_variants (product_id, title, sku, price, stock, options) values
    (p_id, 'Kit Only',              'DRONE-FPV-KIT',   34999, 15, '{"radio": "Not included"}'),
    (p_id, 'Kit + Radio Controller','DRONE-FPV-RADIO', 49999,  8, '{"radio": "Included"}');

  -- ==============================================================
  -- SMART HOME (6 products)
  -- ==============================================================

  -- Product 7 — Smart Dimmer Switch 4-Pack
  insert into products (title, slug, description, price, compare_at_price, category_id, brand, is_featured, tags)
  values (
    'Smart Dimmer Switch 4-Pack',
    'smart-dimmer-switch-4-pack',
    'Wi-Fi enabled smart dimmer switches compatible with Alexa, Google Home, and Apple HomeKit. No hub required. Supports 2-way and 3-way configurations. Works with all LED bulbs.',
    7999, 10999, cat_smart, 'Kasa Smart', true,
    array['smart-home','dimmer','wifi','alexa','google-home','homekit']
  )
  returning id into p_id;

  insert into product_images (product_id, url, alt, position) values
    (p_id, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', 'Smart Dimmer', 0),
    (p_id, 'https://images.unsplash.com/photo-1486946255434-2466348c2166?w=800&q=80', 'App control', 1);

  insert into product_variants (product_id, title, sku, price, stock, options) values
    (p_id, '4-Pack White', 'DIM-4PK-WHT', 7999, 50, '{"color": "White", "qty": "4-Pack"}'),
    (p_id, '4-Pack Black', 'DIM-4PK-BLK', 7999, 35, '{"color": "Black", "qty": "4-Pack"}');

  -- Product 8 — Zigbee Hub Pro
  insert into products (title, slug, description, price, compare_at_price, category_id, brand, is_featured, tags)
  values (
    'Zigbee Hub Pro',
    'zigbee-hub-pro',
    'Central smart home hub supporting Zigbee 3.0, Z-Wave, Matter, and Thread protocols. Connect up to 200 devices. Local processing for instant response without cloud dependency.',
    12999, 15999, cat_smart, 'Homey', false,
    array['smart-home','hub','zigbee','z-wave','matter','thread']
  )
  returning id into p_id;

  insert into product_images (product_id, url, alt, position) values
    (p_id, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80', 'Zigbee Hub', 0);

  insert into product_variants (product_id, title, sku, price, stock, options) values
    (p_id, 'Standard Hub',  'ZGB-HUB-STD', 12999, 30, '{"storage": "8GB"}'),
    (p_id, 'Pro Hub 32GB',  'ZGB-HUB-PRO', 17999, 15, '{"storage": "32GB"}');

  -- Product 9 — Smart Lock Deadbolt Gen 2
  insert into products (title, slug, description, price, compare_at_price, category_id, brand, is_featured, tags)
  values (
    'Smart Lock Deadbolt Gen 2',
    'smart-lock-deadbolt-gen-2',
    'Keyless smart lock with fingerprint, PIN, card, and app access. Auto-lock, tamper alerts, and access logs. Works with Alexa, Google, and Apple HomeKit. Grade 3 ANSI certified.',
    15999, 19999, cat_smart, 'August', false,
    array['smart-lock','deadbolt','fingerprint','security','keyless']
  )
  returning id into p_id;

  insert into product_images (product_id, url, alt, position) values
    (p_id, 'https://images.unsplash.com/photo-1558618048-cb51d6f38dfc?w=800&q=80', 'Smart Lock', 0);

  insert into product_variants (product_id, title, sku, price, stock, options) values
    (p_id, 'Matte Black',   'LOCK-GEN2-BLK', 15999, 20, '{"finish": "Matte Black"}'),
    (p_id, 'Satin Nickel',  'LOCK-GEN2-NKL', 15999, 25, '{"finish": "Satin Nickel"}');

  -- Product 10 — Wi-Fi Outdoor Camera 4K
  insert into products (title, slug, description, price, compare_at_price, category_id, brand, is_featured, tags)
  values (
    'Wi-Fi Outdoor Camera 4K',
    'wifi-outdoor-camera-4k',
    '4K HDR outdoor security camera with color night vision, two-way audio, AI person detection, 180° pan-tilt, IP67 weatherproof, and 60-day local storage. No subscription required.',
    8999, 11999, cat_smart, 'Reolink', false,
    array['camera','security','4k','outdoor','night-vision','ip67']
  )
  returning id into p_id;

  insert into product_images (product_id, url, alt, position) values
    (p_id, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80', 'Outdoor Camera', 0);

  insert into product_variants (product_id, title, sku, price, stock, options) values
    (p_id, 'Single Camera', 'CAM-4K-1PK', 8999,  40, '{"pack": "1x"}'),
    (p_id, '2-Camera Pack', 'CAM-4K-2PK', 15999, 20, '{"pack": "2x"}');

  -- Product 11 — Smart Thermostat Gen 3
  insert into products (title, slug, description, price, compare_at_price, category_id, brand, is_featured, tags)
  values (
    'Smart Thermostat Gen 3',
    'smart-thermostat-gen-3',
    'AI-learning smart thermostat that adapts to your schedule. Touch display, humidity control, geofencing, energy reports, and integration with 95% of HVAC systems. Saves up to 23% on energy bills.',
    13999, 17999, cat_smart, 'Ecobee', false,
    array['thermostat','smart-home','hvac','energy-saving','ai','learning']
  )
  returning id into p_id;

  insert into product_images (product_id, url, alt, position) values
    (p_id, 'https://images.unsplash.com/photo-1626270996527-6e2c0b4f2e88?w=800&q=80', 'Smart Thermostat', 0);

  insert into product_variants (product_id, title, sku, price, stock, options) values
    (p_id, 'Standard',          'THERM-GEN3-STD', 13999, 30, '{"sensor": "Built-in"}'),
    (p_id, 'With Extra Sensor', 'THERM-GEN3-SNS', 16999, 15, '{"sensor": "Extra included"}');

  -- Product 12 — Smart Plug 10-Pack
  insert into products (title, slug, description, price, compare_at_price, category_id, brand, is_featured, tags)
  values (
    'Smart Plug 10-Pack',
    'smart-plug-10-pack',
    'Compact Wi-Fi smart plugs with energy monitoring, scheduling, and voice control. No hub needed. Each plug monitors real-time power consumption. Works with Alexa, Google Home, SmartThings.',
    5999, 7999, cat_smart, 'Kasa Smart', false,
    array['smart-plug','energy-monitor','wifi','alexa','10-pack']
  )
  returning id into p_id;

  insert into product_images (product_id, url, alt, position) values
    (p_id, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', 'Smart Plugs', 0);

  insert into product_variants (product_id, title, sku, price, stock, options) values
    (p_id, '10-Pack', 'PLUG-10PK-US', 5999,  55, '{"outlet": "US Type-B"}'),
    (p_id, '20-Pack', 'PLUG-20PK-US', 10999, 20, '{"outlet": "US Type-B 20x"}');

  -- ==============================================================
  -- COMPONENTS (6 products)
  -- ==============================================================

  -- Product 13 — Precision Soldering Station
  insert into products (title, slug, description, price, compare_at_price, category_id, brand, is_featured, tags)
  values (
    'Precision Soldering Station',
    'precision-soldering-station',
    'Professional 80W digital soldering station with temperature control (200–480°C), lead-free compatible tip set, tip cleaner, and ESD-safe mat. Heats to working temperature in under 10 seconds.',
    5999, 8999, cat_components, 'Hakko', true,
    array['soldering','tools','pcb','electronics','professional']
  )
  returning id into p_id;

  insert into product_images (product_id, url, alt, position) values
    (p_id, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', 'Soldering Station', 0);

  insert into product_variants (product_id, title, sku, price, stock, options) values
    (p_id, '60W Station',    'SOLD-60W',     5999, 30, '{"power": "60W"}'),
    (p_id, '80W Pro Station','SOLD-80W-PRO', 7999, 20, '{"power": "80W Pro"}');

  -- Product 14 — Oscilloscope 100MHz 2-Channel
  insert into products (title, slug, description, price, compare_at_price, category_id, brand, is_featured, tags)
  values (
    'Oscilloscope 100MHz 2-Channel',
    'oscilloscope-100mhz-2-channel',
    'Portable 100MHz dual-channel oscilloscope with 7" color display, 1GSa/s sampling rate, FFT analysis, protocol decoding (I2C, SPI, UART), and 12-bit ADC. Ideal for circuit debugging.',
    29999, 39999, cat_components, 'Rigol', false,
    array['oscilloscope','test-equipment','electronics','debugging','measurement']
  )
  returning id into p_id;

  insert into product_images (product_id, url, alt, position) values
    (p_id, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', 'Oscilloscope', 0);

  insert into product_variants (product_id, title, sku, price, stock, options) values
    (p_id, '100MHz 2-Ch', 'OSC-100MHZ-2CH', 29999, 15, '{"channels": "2", "bandwidth": "100MHz"}'),
    (p_id, '200MHz 4-Ch', 'OSC-200MHZ-4CH', 54999,  8, '{"channels": "4", "bandwidth": "200MHz"}');

  -- Product 15 — Breadboard & Jumper Kit Pro
  insert into products (title, slug, description, price, compare_at_price, category_id, brand, is_featured, tags)
  values (
    'Breadboard & Jumper Kit Pro',
    'breadboard-jumper-kit-pro',
    '3-piece breadboard set (2×830 tie-point + 1×400 tie-point), 840-piece jumper wire kit (M-M, M-F, F-F), and 10 mini breadboards. Color-coded for easy circuit organization.',
    1999, 2999, cat_components, 'Elegoo', false,
    array['breadboard','jumpers','prototyping','beginner','starter']
  )
  returning id into p_id;

  insert into product_images (product_id, url, alt, position) values
    (p_id, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', 'Breadboard Kit', 0);

  insert into product_variants (product_id, title, sku, price, stock, options) values
    (p_id, 'Standard Kit',          'BREAD-KIT-STD', 1999, 80, '{"size": "Standard"}'),
    (p_id, 'Pro Kit + Storage Box', 'BREAD-KIT-PRO', 2999, 50, '{"size": "Pro + Box"}');

  -- Product 16 — Resistor Capacitor Assortment 1200pcs
  insert into products (title, slug, description, price, compare_at_price, category_id, brand, is_featured, tags)
  values (
    'Resistor Capacitor Assortment 1200pcs',
    'resistor-capacitor-assortment-1200pcs',
    '1200-piece precision components kit: 600 resistors (1Ω–10MΩ, 1% tolerance, E24 series) + 600 capacitors (1pF–1000μF, ceramic + electrolytic). Includes labeled storage box.',
    1499, 1999, cat_components, 'Chanzon', false,
    array['resistors','capacitors','components','electronics','assortment']
  )
  returning id into p_id;

  insert into product_images (product_id, url, alt, position) values
    (p_id, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', 'Components kit', 0);

  insert into product_variants (product_id, title, sku, price, stock, options) values
    (p_id, '1200pcs Kit',    'COMP-1200PC', 1499, 100, '{"qty": "1200pcs"}'),
    (p_id, '3000pcs Mega Kit','COMP-3000PC', 2999,  40, '{"qty": "3000pcs"}');

  -- Product 17 — Raspberry Pi Zero 2W
  insert into products (title, slug, description, price, compare_at_price, category_id, brand, is_featured, tags)
  values (
    'Raspberry Pi Zero 2W',
    'raspberry-pi-zero-2w',
    'Ultra-compact Linux computer with 1GHz quad-core CPU, 512MB RAM, Wi-Fi, Bluetooth 4.2, CSI camera connector, and micro HDMI. Perfect for wearables, IoT nodes, and embedded projects.',
    1599, 1999, cat_components, 'Raspberry Pi', false,
    array['raspberry-pi','zero','single-board-computer','iot','embedded']
  )
  returning id into p_id;

  insert into product_images (product_id, url, alt, position) values
    (p_id, 'https://images.unsplash.com/photo-1595617795501-9661aafda72a?w=800&q=80', 'Pi Zero 2W', 0);

  insert into product_variants (product_id, title, sku, price, stock, options) values
    (p_id, 'Board Only',      'RPZ2W-BARE',   1599, 60, '{"bundle": "Board only"}'),
    (p_id, 'Starter Bundle',  'RPZ2W-BUNDLE', 2999, 30, '{"bundle": "Board + case + adapter"}');

  -- Product 18 — Component Storage Cabinet 48-Drawer
  insert into products (title, slug, description, price, compare_at_price, category_id, brand, is_featured, tags)
  values (
    'Component Storage Cabinet 48-Drawer',
    'component-storage-cabinet-48-drawer',
    'Professional 48-drawer parts organizer with stackable design, transparent drawers, and label holders. Each drawer holds 2kg. Ideal for resistors, capacitors, ICs, screws, and hardware.',
    3999, 5499, cat_components, 'Akro-Mils', false,
    array['storage','organizer','components','workshop','drawers']
  )
  returning id into p_id;

  insert into product_images (product_id, url, alt, position) values
    (p_id, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', 'Storage Cabinet', 0);

  insert into product_variants (product_id, title, sku, price, stock, options) values
    (p_id, '48 Drawers',         'STOR-48D', 3999, 25, '{"drawers": "48"}'),
    (p_id, '96 Drawers (Double)','STOR-96D', 6999, 10, '{"drawers": "96"}');

  -- ==============================================================
  -- GADGETS (6 products)
  -- ==============================================================

  -- Product 19 — Mini Laser Engraver 10W
  insert into products (title, slug, description, price, compare_at_price, category_id, brand, is_featured, tags)
  values (
    'Mini Laser Engraver 10W',
    'mini-laser-engraver-10w',
    '10W diode laser engraver and cutter with 400×400mm work area, 0.08mm focus spot, air assist, offline control, and safety enclosure. Engrave wood, leather, acrylic, and metal. Includes LightBurn license.',
    27999, 34999, cat_gadgets, 'xTool', true,
    array['laser-engraver','cnc','maker','wood','acrylic','10w']
  )
  returning id into p_id;

  insert into product_images (product_id, url, alt, position) values
    (p_id, 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80', 'Laser Engraver', 0),
    (p_id, 'https://images.unsplash.com/photo-1562408590-e32931084e23?w=800&q=80', 'Engraved samples', 1);

  insert into product_variants (product_id, title, sku, price, stock, options) values
    (p_id, '10W Standard',       'LASER-10W-STD', 27999, 20, '{"power": "10W", "enclosure": "No"}'),
    (p_id, '10W with Enclosure', 'LASER-10W-ENC', 34999, 10, '{"power": "10W", "enclosure": "Yes"}');

  -- Product 20 — 3D Pen Pro with OLED Display
  insert into products (title, slug, description, price, compare_at_price, category_id, brand, is_featured, tags)
  values (
    '3D Pen Pro with OLED Display',
    '3d-pen-pro-oled',
    'Professional 3D pen with OLED display, variable speed and temperature control, compatible with PLA, ABS, and flexible TPU filaments. Includes 20 colors of PLA filament and stencil book.',
    3999, 5499, cat_gadgets, '3Doodler', false,
    array['3d-pen','3d-printing','creative','art','maker','kids']
  )
  returning id into p_id;

  insert into product_images (product_id, url, alt, position) values
    (p_id, 'https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?w=800&q=80', '3D Pen', 0);

  insert into product_variants (product_id, title, sku, price, stock, options) values
    (p_id, 'Pen + 10 Colors',      '3DPEN-10C',      3999, 45, '{"filament_colors": "10"}'),
    (p_id, 'Pen + 20 Colors + Case','3DPEN-20C-CASE', 5999, 25, '{"filament_colors": "20"}');

  -- Product 21 — Portable Lab Power Supply 30V 10A
  insert into products (title, slug, description, price, compare_at_price, category_id, brand, is_featured, tags)
  values (
    'Portable Lab Power Supply 30V 10A',
    'portable-lab-power-supply-30v-10a',
    'Benchtop linear power supply with dual outputs (0–30V / 0–10A each), precise voltage and current control, short-circuit protection, and digital LED displays. Essential for electronics lab.',
    11999, 15999, cat_gadgets, 'Eventek', false,
    array['power-supply','bench','lab','30v','10a','electronics']
  )
  returning id into p_id;

  insert into product_images (product_id, url, alt, position) values
    (p_id, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', 'Lab Power Supply', 0);

  insert into product_variants (product_id, title, sku, price, stock, options) values
    (p_id, 'Single Output 30V/5A',  'PSU-30V-5A',   7999, 20, '{"output": "Single 30V/5A"}'),
    (p_id, 'Dual Output 30V/10A',   'PSU-30V-10A-D',11999, 15, '{"output": "Dual 30V/10A"}');

  -- Product 22 — Digital Multimeter Auto-Ranging
  insert into products (title, slug, description, price, compare_at_price, category_id, brand, is_featured, tags)
  values (
    'Digital Multimeter Auto-Ranging',
    'digital-multimeter-auto-ranging',
    'Professional auto-ranging digital multimeter with True RMS, NCV detector, temperature probe, backlit display, diode test, continuity buzzer, and CAT III 600V safety rating.',
    2999, 3999, cat_gadgets, 'Fluke', false,
    array['multimeter','test-equipment','measurement','true-rms','auto-ranging']
  )
  returning id into p_id;

  insert into product_images (product_id, url, alt, position) values
    (p_id, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', 'Multimeter', 0);

  insert into product_variants (product_id, title, sku, price, stock, options) values
    (p_id, 'Standard',       'DMM-STD',       2999, 50, '{"type": "Standard"}'),
    (p_id, 'Pro with Clamp', 'DMM-PRO-CLAMP', 4999, 25, '{"type": "Pro + Clamp Meter"}');

  -- Product 23 — USB Logic Analyzer 24MHz 8-Channel
  insert into products (title, slug, description, price, compare_at_price, category_id, brand, is_featured, tags)
  values (
    'USB Logic Analyzer 24MHz 8-Channel',
    'usb-logic-analyzer-24mhz-8ch',
    '24MHz 8-channel USB logic analyzer compatible with PulseView and Sigrok. Analyze I2C, SPI, UART, CAN, 1-Wire protocols. 10ns resolution. Includes test clips and software license.',
    1999, 2999, cat_gadgets, 'Saleae', false,
    array['logic-analyzer','debugging','protocol','usb','spi','i2c','uart']
  )
  returning id into p_id;

  insert into product_images (product_id, url, alt, position) values
    (p_id, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', 'Logic Analyzer', 0);

  insert into product_variants (product_id, title, sku, price, stock, options) values
    (p_id, '8-Channel 24MHz',   'LA-8CH-24M',  1999, 40, '{"channels": "8",  "speed": "24MHz"}'),
    (p_id, '16-Channel 100MHz', 'LA-16CH-100M',4999, 20, '{"channels": "16", "speed": "100MHz"}');

  -- Product 24 — Foldable FPV Drone with 4K Camera
  insert into products (title, slug, description, price, compare_at_price, category_id, brand, is_featured, tags)
  values (
    'Foldable FPV Drone with 4K Camera',
    'foldable-fpv-drone-4k-camera',
    'Consumer foldable drone with 4K 60fps stabilized camera, 35-min flight time, 10km range, obstacle avoidance, subject tracking, and intelligent return-to-home. Includes carry case and 2 batteries.',
    79999, 99999, cat_gadgets, 'DJI', false,
    array['drone','fpv','4k','foldable','consumer','photography']
  )
  returning id into p_id;

  insert into product_images (product_id, url, alt, position) values
    (p_id, 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80', 'FPV Drone', 0),
    (p_id, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', 'Drone flying', 1);

  insert into product_variants (product_id, title, sku, price, stock, options) values
    (p_id, 'Standard Combo',   'DRONE-4K-STD', 79999, 12, '{"batteries": "1", "case": "No"}'),
    (p_id, 'Fly More Combo',   'DRONE-4K-FMC', 99999,  6, '{"batteries": "3", "case": "Yes"}');

end $$;
