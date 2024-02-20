CREATE TABLE bill (
  id SERIAL PRIMARY KEY,
  doctype VARCHAR(255),
  firstname VARCHAR(255),
  lastname VARCHAR(255),
  address VARCHAR(255),
  country VARCHAR(255),
  city VARCHAR(255),
  zipcode INTEGER,
  productname VARCHAR(255),
  price NUMERIC,
  quantity INTEGER,
  tva NUMERIC,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);