DROP TABLE covid;

CREATE TABLE IF NOT EXISTS covid(
    id SERIAL PRIMARY KEY,
    country VARCHAR(255),
    confirmed VARCHAR(255),
    deaths VARCHAR(255),
    Recovered VARCHAR(255),
    date VARCHAR(255)


)