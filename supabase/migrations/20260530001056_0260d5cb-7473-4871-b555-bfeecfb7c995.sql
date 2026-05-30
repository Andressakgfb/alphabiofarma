create table if not exists public.catalog_products (
  id text primary key,
  name text not null,
  brand text not null,
  image text not null,
  price numeric(10,2) not null,
  old_price numeric(10,2),
  stock integer not null default 0,
  tag text,
  is_custom boolean not null default false,
  category text,
  product_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.catalog_products to anon;
grant select on public.catalog_products to authenticated;
grant insert, update, delete on public.catalog_products to authenticated;
grant all on public.catalog_products to service_role;

alter table public.catalog_products enable row level security;

drop policy if exists "Catalog is viewable by everyone" on public.catalog_products;
create policy "Catalog is viewable by everyone"
on public.catalog_products
for select
using (true);

drop policy if exists "Admins can add catalog products" on public.catalog_products;
create policy "Admins can add catalog products"
on public.catalog_products
for insert
to authenticated
with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can edit catalog products" on public.catalog_products;
create policy "Admins can edit catalog products"
on public.catalog_products
for update
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can delete catalog products" on public.catalog_products;
create policy "Admins can delete catalog products"
on public.catalog_products
for delete
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create or replace function public.set_catalog_product_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_catalog_product_updated_at on public.catalog_products;
create trigger set_catalog_product_updated_at
before update on public.catalog_products
for each row
execute function public.set_catalog_product_updated_at();

insert into public.catalog_products (
  id,
  name,
  brand,
  image,
  price,
  old_price,
  stock,
  tag,
  is_custom,
  category,
  product_type
)
values
  ('nad500','NAD+ 500mg','AlphaBio Lab','https://base44.app/api/apps/69fcb7f0e1284bc61825c867/files/mp/public/69fcb7f0e1284bc61825c867/350ab0a39_nad.png',1156,NULL,52,'Longevidade',false,'Suplementação e Performance','Bem-estar e Saúde Integrativa'),
  ('tesa10','Tesamorelin 10mg','AlphaBio Lab','https://base44.app/api/apps/69fcb7f0e1284bc61825c867/files/mp/public/69fcb7f0e1284bc61825c867/a557e0e90_tesamorelim.png',1190,NULL,57,NULL,false,'Hormônio Crescimento Regenerativo','Hormônio Crescimento Regenerativos'),
  ('pt141','PT-141 10mg','AlphaBio Lab','https://base44.app/api/apps/69fcb7f0e1284bc61825c867/files/mp/public/69fcb7f0e1284bc61825c867/3a12c83c5_pt-141.png',945,NULL,55,NULL,false,'Suplementação e Performance','Bem-estar e Saúde Integrativa'),
  ('nadb12','NAD+ Vitamina B12 (Pen)','AlphaBio Lab','https://base44.app/api/apps/69fcb7f0e1284bc61825c867/files/mp/public/69fcb7f0e1284bc61825c867/5453b7c2e_nadcaneta.png',1816,NULL,59,'Energia',false,'Suplementação e Performance','Bem-estar e Saúde Integrativa'),
  ('ghkcu100pen','GHK-Cu 100mg (Pen)','AlphaBio Lab','https://base44.app/api/apps/69fcb7f0e1284bc61825c867/files/mp/public/69fcb7f0e1284bc61825c867/d8c6bf296_ghkcupen100mg.png',1420,NULL,61,NULL,false,'Hormônio Crescimento Regenerativo','Hormônio Crescimento Regenerativos'),
  ('glow70pen','GLOW 70mg Pen','AlphaBio Lab','https://base44.app/api/apps/69fcb7f0e1284bc61825c867/files/mp/public/69fcb7f0e1284bc61825c867/4435494c5_glow70caneta.png',1816,NULL,60,'Pele',false,'Suplementação e Performance','Bem-estar e Saúde Integrativa'),
  ('tirz60ag','Tirzegen 60mg c/ agulha','AlphaBio Clinic','https://base44.app/api/apps/69fcb7f0e1284bc61825c867/files/mp/public/69fcb7f0e1284bc61825c867/1fae475ec_tirz60comagulha.png',1750,NULL,54,'Receita',false,'Tirzepatida / Mounjaro','Emagrecimento/ Metabólicos'),
  ('tirz60pen','Tirzegen Pen 60mg Tirzepatida','AlphaBio Clinic','https://base44.app/api/apps/69fcb7f0e1284bc61825c867/files/mp/public/69fcb7f0e1284bc61825c867/355c5a08d_tirze60mgsagulha.png',1684,NULL,58,'Receita',false,'Tirzepatida / Mounjaro','Emagrecimento/ Metabólicos'),
  ('reta40pen','Retagen Pen 40mg Retatrutida','AlphaBio Clinic','https://base44.app/api/apps/69fcb7f0e1284bc61825c867/files/mp/public/69fcb7f0e1284bc61825c867/3130f8d0e_retasemagulha40mg.png',1816,NULL,53,'Receita',false,'Retatrutida','Emagrecimento/ Metabólicos'),
  ('reta40ag','Retagen 40mg Retatrutida c/ agulha','AlphaBio Clinic','https://base44.app/api/apps/69fcb7f0e1284bc61825c867/files/mp/public/69fcb7f0e1284bc61825c867/d7f962379_retacanetaagulha40m.png',1882,NULL,57,'Receita',false,'Retatrutida','Emagrecimento/ Metabólicos'),
  ('retaxt40','Retagen XT 40mg — 4 Ampolas','AlphaBio Clinic','https://base44.app/api/apps/69fcb7f0e1284bc61825c867/files/mp/public/69fcb7f0e1284bc61825c867/2c76de753_retaampola40mg.png',1288,NULL,50,'Receita',false,'Retatrutida','Emagrecimento/ Metabólicos'),
  ('ghkcu50','GHK-Cu 50mg','AlphaBio Lab','https://base44.app/api/apps/69fcb7f0e1284bc61825c867/files/mp/public/69fcb7f0e1284bc61825c867/9c2bf5cd4_716C0B07-BDDC-4B98-860B-62D8F0E44535.png',734,NULL,60,NULL,false,'Hormônio Crescimento Regenerativo','Hormônio Crescimento Regenerativos'),
  ('ghkcu100','GHK-Cu 100mg','AlphaBio Lab','https://base44.app/api/apps/69fcb7f0e1284bc61825c867/files/mp/public/69fcb7f0e1284bc61825c867/e69c1d26d_ghcu100.png',998,NULL,66,NULL,false,'Hormônio Crescimento Regenerativo','Hormônio Crescimento Regenerativos'),
  ('retalio40','Retagen 40mg Liofilizada','AlphaBio Clinic','https://base44.app/api/apps/69fcb7f0e1284bc61825c867/files/mp/public/69fcb7f0e1284bc61825c867/284bcea93_retaliofi.png',1420,NULL,79,'Receita',false,'Retatrutida','Emagrecimento/ Metabólicos'),
  ('tirz60','Tirzegen 60mg Tirzepatida','AlphaBio Clinic','https://base44.app/api/apps/69fcb7f0e1284bc61825c867/files/mp/public/69fcb7f0e1284bc61825c867/75b9cbc5a_9F5CBAB3-8DB9-496D-81BE-9A3EA6621289.png',1288,NULL,60,'Receita',false,'Tirzepatida / Mounjaro','Emagrecimento/ Metabólicos'),
  ('glow70','GLOW 70mg','AlphaBio Lab','https://base44.app/api/apps/69fcb7f0e1284bc61825c867/files/mp/public/69fcb7f0e1284bc61825c867/f2b197c7a_FF0E1085-E71D-4EF8-99A0-A863225EFFC7.png',1235,NULL,55,NULL,false,'Suplementação e Performance','Bem-estar e Saúde Integrativa'),
  ('ghkcu50d','GHK-Cu 50mg Diluído','AlphaBio Lab','https://base44.app/api/apps/69fcb7f0e1284bc61825c867/files/mp/public/69fcb7f0e1284bc61825c867/0d268913e_ChatGPTImage20demaide202619_36_22.png',707,NULL,57,NULL,false,'Hormônio Crescimento Regenerativo','Hormônio Crescimento Regenerativos'),
  ('ghkcu100d','GHK-Cu 100mg Diluído','AlphaBio Lab','https://base44.app/api/apps/69fcb7f0e1284bc61825c867/files/mp/public/69fcb7f0e1284bc61825c867/09f3bbe23_A3E3E677-7902-4F44-A99C-2D7E01436545.png',958,NULL,61,NULL,false,'Hormônio Crescimento Regenerativo','Hormônio Crescimento Regenerativos'),
  ('tirzlp60','Tirzepatida Lipoland 60mg (4x 15mg)','Lipoland','https://base44.app/api/apps/69fcb7f0e1284bc61825c867/files/mp/public/69fcb7f0e1284bc61825c867/103537377_IMG_7880.jpg',1500,1700,21,'-12%',false,'Tirzepatida / Mounjaro','Emagrecimento/ Metabólicos'),
  ('tirztg60','Tirzepatida T.G 60mg (4x 15mg)','T.G Pharma','https://base44.app/api/apps/69fcb7f0e1284bc61825c867/files/mp/public/69fcb7f0e1284bc61825c867/9d6cc6c39_IMG_7874.WEBP',1500,1700,40,'-12%',false,'Tirzepatida / Mounjaro','Emagrecimento/ Metabólicos'),
  ('kit4x5','Kit 4 Canetas 5mg Tirzepatida — 20mg','AlphaBio Clinic','https://base44.app/api/apps/69fcb7f0e1284bc61825c867/files/mp/public/69fcb7f0e1284bc61825c867/eeea08808_IMG_7869.jpg',1350,1650,35,'-18%',false,'Tirzepatida / Mounjaro','Emagrecimento/ Metabólicos'),
  ('kit4x10','Kit 4 Canetas 10mg Tirzepatida — 40mg','AlphaBio Clinic','https://base44.app/api/apps/69fcb7f0e1284bc61825c867/files/mp/public/69fcb7f0e1284bc61825c867/58d04a952_IMG_7869.jpg',1500,NULL,58,NULL,false,'Tirzepatida / Mounjaro','Emagrecimento/ Metabólicos'),
  ('reta60amp','Retatrutida Ampola 60mg (5x 12mg)','AlphaBio Clinic','https://base44.app/api/apps/69fcb7f0e1284bc61825c867/files/mp/public/69fcb7f0e1284bc61825c867/568d834ac_IMG_7863.PNG',2600,2800,0,'Esgotado',false,'Retatrutida','Emagrecimento/ Metabólicos'),
  ('reta30pen','Retatrutida Caneta 30mg','AlphaBio Clinic','https://base44.app/api/apps/69fcb7f0e1284bc61825c867/files/mp/public/69fcb7f0e1284bc61825c867/44c3c1417_IMG_7861.JPG',1950,2300,0,'Esgotado',false,'Retatrutida','Emagrecimento/ Metabólicos'),
  ('reta120','Retatrutida Ampola 120mg (5x 24mg)','AlphaBio Clinic','https://base44.app/api/apps/69fcb7f0e1284bc61825c867/files/mp/public/69fcb7f0e1284bc61825c867/8289ebac4_IMG_7857.JPG',4200,NULL,0,'Esgotado',false,'Retatrutida','Emagrecimento/ Metabólicos'),
  ('reta40amp','Retatrutida Ampola 40mg (5x 8mg)','AlphaBio Clinic','https://base44.app/api/apps/69fcb7f0e1284bc61825c867/files/mp/public/69fcb7f0e1284bc61825c867/d0b74dd7a_IMG_7855.PNG',1950,2100,0,'Esgotado',false,'Retatrutida','Emagrecimento/ Metabólicos'),
  ('reta15amp','Retatrutida Ampola 15mg','AlphaBio Clinic','https://base44.app/api/apps/69fcb7f0e1284bc61825c867/files/mp/public/69fcb7f0e1284bc61825c867/4cf0bc34b_IMG_7853.jpg',800,1300,6,'-38%',false,'Retatrutida','Emagrecimento/ Metabólicos')
on conflict (id) do update set
  name = excluded.name,
  brand = excluded.brand,
  image = excluded.image,
  price = excluded.price,
  old_price = excluded.old_price,
  stock = excluded.stock,
  tag = excluded.tag,
  is_custom = excluded.is_custom,
  category = excluded.category,
  product_type = excluded.product_type;