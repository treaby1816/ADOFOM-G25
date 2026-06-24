-- =====================================================================
-- ADOFOM E-Platform: SQL Injection for 62 Unique New Officers
-- Purpose: Pre-populate the administrative_officers table safely.
-- =====================================================================

-- 1. Verification check to see ANY existing duplicate anomalies in the database
SELECT email_address, COUNT(*) as occurrence_count 
FROM public.administrative_officers 
GROUP BY email_address 
HAVING COUNT(*) > 1;

-- 2. Safe Insert Logic (Bypassing ON CONFLICT since email_address lacks a UNIQUE constraint)
INSERT INTO public.administrative_officers (id, email_address, full_name, is_approved, must_change_password)
SELECT new_data.id, new_data.email_address, new_data.full_name, new_data.is_approved, new_data.must_change_password
FROM (
  SELECT gen_random_uuid() as id, 'samolade2003@gmail.com'::text as email_address, 'Ogunlade Samuel Somo'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'bifoluojumu@gmail.com'::text as email_address, 'OJUMU, Glory Taiwo'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'natorogun@gmail.com'::text as email_address, 'OROGUN Nathaniel'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'debayodan@gmail.com'::text as email_address, 'Adebayo Daniel'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'bidemi.nelson@gmail.com'::text as email_address, 'Familoni Nelson Abidemi'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'fagbaanu@gmail.com'::text as email_address, 'FAGBAMILA, Aanuoluwapo'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'adeteye2015@gmail.com'::text as email_address, 'oshodi Michael Adeteye'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'yinkakinwe77@gmail.com'::text as email_address, 'AKINWE, Adeyinka Adeyemi'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'riccardo2k6@gmail.com'::text as email_address, 'Aina Richard'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'baloguntoyin07@gmail.com'::text as email_address, 'Balogun, Stella Toyin'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'akinduro.oluwabusayomi@gmail.com'::text as email_address, 'AKINDURO, Busayo'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'basikay2@gmail.com'::text as email_address, 'IKUSEMIJU, Ayokunle Oluwadamilare'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'jummy_stella@yahoo.com'::text as email_address, 'OLANIRAN-OJO, Jumoke Stella'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'ajibadeolakunle3@gmail.com'::text as email_address, 'Ajibade Olakunle Bankole'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'foluksdarasimi@gmail.com'::text as email_address, 'Foluke Seyi-Olakanye'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'tayoogundare9@gmail.com'::text as email_address, 'OGUNDARE, Temitayo'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'warrybae@gmail.com'::text as email_address, 'Ojumu Blessing'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'olafisoyeo@gmail.com'::text as email_address, 'Olafisoye Olawole'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'olumuyiwaakinkuolie@gmail.com'::text as email_address, 'AKINKUOLIE, Olumuyiwa'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'bukolakomolafe789@gmail.com'::text as email_address, 'Komolafe Bukola'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'nittygirl4real@gmail.com'::text as email_address, 'Oladure Olanireti Folake'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'akinolataiwo1001@gmail.com'::text as email_address, 'AKINOLA Taiwo'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'sheriffadeyemo@gmail.com'::text as email_address, 'ADEYEMO Sheriff'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'michaelpeace2015@gmail.com'::text as email_address, 'Afariogun Michael Olugbenga'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'adegokeabimbola90@gmail.com'::text as email_address, 'Adegoke Folasade Abimbola Mrs'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'olubisosea@gmail.com'::text as email_address, 'Olubisose Afolabi'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'femiwebs1989@gmail.com'::text as email_address, 'Edema John'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'bolajioke2@gmail.com'::text as email_address, 'OBIDEYI,Stella Bolaji'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'aomolabake@gmail.com'::text as email_address, 'ADEOLA Omolabake'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'sademonehin@gmail.com'::text as email_address, 'MONEHIN, Modupe'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'jokesajokes@gmail.com'::text as email_address, 'AYOMIDE, Adejoke Christianah'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'boderemmy@gmail.com'::text as email_address, 'OLABODE, Aderemi'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'delenagbeys@gmail.com'::text as email_address, 'AKINNAGBE, Akinbamidele'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'ehinmeroobafemi@gmail.com'::text as email_address, 'EHINMERO, Obafemi'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'georgeasonja@gmail.com'::text as email_address, 'ASONJA, George'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'edemakayode@gmail.com'::text as email_address, 'Edema, Kayode Smart'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'jigbekele@gmail.com'::text as email_address, 'Jatuwase Igbekele Hosea  Esq'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'frekolad25@gmail.com'::text as email_address, 'Oladiran Fredrick Olawale'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'folawemifunmi@gmail.com'::text as email_address, 'AKINSELI, Folawe'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'dejiageh@yahoo.com'::text as email_address, 'AGEH Ayodeji'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'joelolushile@gmail.com'::text as email_address, 'ALE, Joel Olugbenga'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'tiwaevelyn@gmail.com'::text as email_address, 'OLUWATOBI-OMITA, Evelyn'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'ebikedasanami@gmail.com'::text as email_address, 'Sanami Ebikeda'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'foldara@gmail.com'::text as email_address, 'Tunde-Daramola Foluke'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'chencocomputers17@gmail.com'::text as email_address, 'Omore Olumide Victor'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'pelumifakinlede@outlook.com'::text as email_address, 'Fakinlede, Pelumi'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'alabimayode999@gmail.com'::text as email_address, 'Alabi Oluwamayode Oluwakemi'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'akinyeleoluwatosin1996@gmail.com'::text as email_address, 'Akinyele Oluwatosin'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'bukieadetan1@gmail.com'::text as email_address, 'Adetan Olubukola Ibironke'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'donfemiobideyi@gmail.com'::text as email_address, 'Obideyi, Olufemi'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'ajibolaabidakun@mail.com'::text as email_address, 'AJIBOLA,ABIDAKUN'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'topekolawoles@gmail.com'::text as email_address, 'Kolawole Olatope'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'ogungbademorenikeji@gmail.com'::text as email_address, 'Akinseye, Morenikeji'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'phummyoni@gmail.com'::text as email_address, 'Oni, Olufunmilayo'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'gbemmychristianah@gmail.com'::text as email_address, 'Omopariola Gbemisola Christianah'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'rolandtolisa@gmail.com'::text as email_address, 'Olisa, Roland'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'ericoluwasinmi@gmail.com'::text as email_address, 'Apata, Eric Oluwasinmi'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'stevetosin941@gmail.com'::text as email_address, 'OMOEKO, TOSIN'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'omirinsundaylade1976@gmail.com'::text as email_address, 'OMIRIN, Sunday'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'eunishad2006@gmail.com'::text as email_address, 'Ogunmola Eunice'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'akinseyeolusola2018@gmail.com'::text as email_address, 'AKINSEYE Olusola Firopo'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'topsyleb@gmail.com'::text as email_address, 'LEBILE, Temitope Oluseye'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'josephogunsusi8@gmail.com'::text as email_address, 'Ogunsusi Joseph'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'folasadeale@gmail.com'::text as email_address, 'folasade ale'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'bosunadu24@gmail.com'::text as email_address, 'Adu, Olatubosun Joseph'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'segunakosh@gmail.com'::text as email_address, 'Akosile Oladele Olusegun'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'prettysuzzie30@gmail.com'::text as email_address, 'Olaolu-Ikoto Abimbola'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'ebiwonjumiademola@gmail.com'::text as email_address, 'Ademola Abiola Ebiwonjumi'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'femiisgodly@gmail.com'::text as email_address, 'Isimijola Akeem'::text as full_name, false as is_approved, true as must_change_password
  UNION ALL
  SELECT gen_random_uuid() as id, 'adebola.ajagunna@gmail.com'::text as email_address, 'AJAGUNNA ADEBOLA AKEEM'::text as full_name, false as is_approved, true as must_change_password
) as new_data
WHERE NOT EXISTS (
  SELECT 1 FROM public.administrative_officers 
  WHERE administrative_officers.email_address = new_data.email_address
);
