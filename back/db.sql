create database link_shortener;

create table customer(
    id serial primary key,
    username text not null,
    password text not null
);

create table link(
    id serial primary key,
    customer_id int references public.customer(id),
    short_link text not null,
    target_link text not null,
    click_counter integer default 0
);

