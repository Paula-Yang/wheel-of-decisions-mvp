CREATE TABLE spins (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    result TEXT NOT NULL,
    options TEXT[] NOT NULL,
    spin_name VARCHAR(255)
);
