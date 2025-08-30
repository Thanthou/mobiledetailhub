-- Seed: Populate vehicles table with industry standards
INSERT INTO vehicles (name, type, size_category, base_multiplier) VALUES
  ('Cars', 'automotive', 'standard', 1.00),
  ('Trucks', 'automotive', 'large', 1.25),
  ('RVs', 'recreational', 'extra-large', 2.00),
  ('Boats', 'marine', 'variable', 1.50),
  ('Motorcycles', 'automotive', 'small', 0.75),
  ('Off-Road', 'automotive', 'large', 1.50),
  ('Other', 'misc', 'variable', 1.00);