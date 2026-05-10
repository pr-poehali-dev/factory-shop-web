CREATE TABLE IF NOT EXISTS t_p47486170_factory_shop_web.clients (
  id SERIAL PRIMARY KEY,
  company VARCHAR(256) NOT NULL,
  contact VARCHAR(256) NOT NULL,
  phone VARCHAR(64),
  email VARCHAR(128),
  created_at TIMESTAMP DEFAULT NOW()
);