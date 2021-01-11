--UTILISATEURS
CREATE TABLE public.users
(
    "id_user" SERIAL,
    "username" character varying(50) COLLATE pg_catalog."default" NOT NULL,
    "email" character varying(50) COLLATE pg_catalog."default" NOT NULL,
    "password" character varying(250) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id_user")
)

TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to postgres;

--FILMS
DROP TABLE IF EXISTS public.movies;

CREATE TABLE public.movies
(
    "id_movie" SERIAL,
    "title" character varying(50) COLLATE pg_catalog."default" NOT NULL,
    "release_date" smallint,
    "plot" character varying(500) COLLATE pg_catalog."default",
    "poster" character varying(250),
    "id_user" integer NOT NULL,
    CONSTRAINT "movies_pkey" PRIMARY KEY ("id_movie"),
    CONSTRAINT "id_user" FOREIGN KEY ("id_user")
        REFERENCES public.users ("id_user") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public.movies
    OWNER to postgres;

--AVIS
DROP TABLE IF EXISTS public.reviews;

CREATE TABLE public.reviews
(
    "id_user" integer NOT NULL,
    "id_movie" integer NOT NULL,
    "rating" integer NOT NULL,
    "comment" character varying(500) COLLATE pg_catalog."default",
    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id_user", "id_movie"),
    CONSTRAINT "id_movie" FOREIGN KEY ("id_movie")
        REFERENCES public.Movies ("id_movie") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "id_user" FOREIGN KEY ("id_user")
        REFERENCES public.users ("id_user") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public.reviews
    OWNER to postgres;

--DONNEES
INSERT INTO users (username, email, password) VALUES ('jtang', 'jtang@gmail.com', '$2b$10$J9ioGKVMZhbGsRUXx73nved.jl5nQILpRyaTn9NWVqNM2fHunQpbi');

INSERT INTO movies (title, release_date, plot, poster, id_user) VALUES ('Avengers', 2012, 'Les interprètes des six Avengers sont Robert Downey Jr., Chris Evans, Chris Hemsworth, Scarlett Johansson, Jeremy Renner et Mark Ruffalo. Dans ce premier des quatre films de la série Avengers, Iron Man, Captain America, Thor, Hulk, Clint Barton et Natasha Romanoff doivent tenter de travailler en équipe afin d''empêcher le frère adoptif de Thor, Loki, d''envahir la Terre.', 'https://upload.wikimedia.org/wikipedia/en/8/8a/The_Avengers_%282012_film%29_poster.jpg', 1);
INSERT INTO movies (title, release_date, plot, poster, id_user) VALUES ('Avengers : L''Ère d''Ultron', 2015, 'Alors que Tony Stark tente de relancer un programme de maintien de la paix jusque-là suspendu, les choses tournent mal et les super-héros Iron Man, Captain America, Thor, Hulk, Black Widow et Hawkeye vont devoir à nouveau unir leurs forces pour combattre le plus puissant de leurs adversaires : le terrible Ultron.', 'https://upload.wikimedia.org/wikipedia/en/f/ff/Avengers_Age_of_Ultron_poster.jpg', 1);

INSERT INTO reviews(id_user, id_movie, rating, comment) VALUES (1,1,4, 'Très bon film');