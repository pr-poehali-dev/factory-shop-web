CREATE TABLE IF NOT EXISTS t_p47486170_factory_shop_web.orders (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES t_p47486170_factory_shop_web.clients(id),
  date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(32) DEFAULT 'new',
  amount NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);