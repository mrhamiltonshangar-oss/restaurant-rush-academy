insert into public.allergens (name)
values
  ('Dairy'),
  ('Egg'),
  ('Wheat'),
  ('Soy'),
  ('Tree Nut')
on conflict (name) do nothing;

insert into public.ingredients (name, category, unit, shelf_life_days, cost_per_unit)
values
  ('Flour', 'Dry Goods', 'cup', 180, 0.20),
  ('Eggs', 'Dairy and Eggs', 'each', 21, 0.30),
  ('Milk', 'Dairy and Eggs', 'cup', 7, 0.45),
  ('Chicken Breast', 'Meat and Poultry', 'portion', 4, 2.25),
  ('Blueberries', 'Fruits and Vegetables', 'cup', 5, 0.90),
  ('Bell Pepper', 'Fruits and Vegetables', 'each', 7, 0.75),
  ('Cheddar', 'Dairy and Eggs', 'ounce', 14, 0.45)
on conflict (name) do nothing;

insert into public.locations (name, description, unlock_week)
values
  ('Starter Cafe', 'The first training location with lighter service flow.', 1),
  ('Moonlit Food Truck', 'A tighter station layout for faster rushes.', 6),
  ('Skyforge Tavern', 'Fantasy championship kitchen for the finale.', 12)
on conflict do nothing;

insert into public.achievements (key, title, description, category)
values
  ('board-warden', 'Board Warden', 'Complete 5 prep tasks with zero sanitation misses.', 'sanitation'),
  ('brunch-survivor', 'Brunch Survivor', 'Beat Breakfast Rush with 80 percent satisfaction.', 'speed'),
  ('inventory-whisperer', 'Inventory Whisperer', 'Finish a week with less than 5 percent waste.', 'business'),
  ('pass-window-hero', 'Pass Window Hero', 'Handle 3 allergy-safe orders correctly.', 'story')
on conflict (key) do nothing;

insert into public.recipes (title, unit_tag, station, summary, base_price, estimated_minutes, skill_level, is_template)
values
  ('Veggie Breakfast Wrap', 'fruits-and-vegetables', 'prep', 'A quick breakfast build with produce prep and egg handling.', 7.00, 12, 1, true),
  ('Blueberry Muffin', 'baking', 'baking', 'Classic muffin practice focused on measuring and bake timing.', 4.00, 18, 1, true),
  ('Herb Chicken Bowl', 'meat-poultry', 'line', 'Protein doneness and organized line timing.', 11.00, 20, 2, true),
  ('Cheese Omelet', 'dairy-eggs', 'line', 'Fast breakfast service with egg cookery.', 8.00, 10, 1, true);
