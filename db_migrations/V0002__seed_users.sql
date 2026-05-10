INSERT INTO t_p47486170_factory_shop_web.users (login, password, name, role) VALUES
  ('admin', 'admin', 'Администратор', 'admin'),
  ('nik', '000', 'Nik', 'user')
ON CONFLICT (login) DO NOTHING;