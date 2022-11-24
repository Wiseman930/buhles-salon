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

INSERT INTO treatment (id, treatment_type, price, code) values (1, 'Pedicure', 175, 'PD123')
INSERT INTO treatment (id, treatment_type, price, code) values (2, 'Manicure', 215, 'MA123')
INSERT INTO treatment (id, treatment_type, price, code) values (3, 'Make up', 185.00, 'MP123')
INSERT INTO treatment (id, treatment_type, price, code) values (4, 'Brows & Lashes', 240.00, 'BL123')

INSERT INTO stylist (id, first_name, last_name, phone_number, commission_percentage) values (1, 'WISEMAN', 'MABUSELA', '0834029770', 0.10)
INSERT INTO stylist (id, first_name, last_name, phone_number, commission_percentage) values (2, 'LINDIWE', 'MASHININI', '0608705525', 0.15)
INSERT INTO stylist (id, first_name, last_name, phone_number, commission_percentage) values (3, 'PHUMEZA', 'MAKATISI', '0630331811', 0.17)
INSERT INTO stylist (id, first_name, last_name, phone_number, commission_percentage) values (4, 'LINDA', 'KENT', '0873033000', 0.9)

INSERT INTO client (id, first_name, last_name, phone_number) values (1, 'NOAH', 'LYLES', '0834529653')
INSERT INTO client (id, first_name, last_name, phone_number) values (2, 'TYSON', 'GAY', '0608705577')
INSERT INTO client (id, first_name, last_name, phone_number) values (3, 'YOHAN', 'BLAKE', '0636043256')
INSERT INTO client (id, first_name, last_name, phone_number) values (4, 'USAIN', 'BOLT', '0803265342')