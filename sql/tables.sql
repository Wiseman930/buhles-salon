CREATE TABLE IF NOT EXISTS client (
    id SERIAL PRIMARY KEY,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone_number varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS treatment (
    id SERIAL PRIMARY KEY,
    treatment_type TEXT NOT NULL,
    code TEXT NOT NULL,
    price INT NOT NULL

);

CREATE TABLE IF NOT EXISTS stylist (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone_number varchar NOT NULL,
    commission_percentage DECIMAL NOT NULL
);

CREATE TABLE IF NOT EXISTS booking (
    id SERIAL PRIMARY KEY,
    booking_date date NOT NULL,
    booking_time time NOT NULL,
    client_id INT NOT NULL,
    treatment_id INT NOT NULL,
    stylist_id INT NOT NULL,
    foreign key (client_id) references client(id),
    foreign key (treatment_id) references treatment(id),
    foreign key (stylist_id) references stylist(id)
);