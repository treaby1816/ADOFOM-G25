-- =====================================================================
-- ADOFOM E-Platform: SQL Injection for 62 Unique New Officers
-- Purpose: Pre-populate the administrative_officers table safely.
-- =====================================================================

-- 1. Verification check to see ANY existing duplicate anomalies in the database
SELECT email_address, COUNT(*) as occurrence_count 
FROM public.administrative_officers 
GROUP BY email_address 
HAVING COUNT(*) > 1;

-- 2. Safe Insert Logic (Bypassing ON CONFLICT and handling NOT NULL constraints)
INSERT INTO public.administrative_officers (id, email_address, full_name, is_approved, must_change_password, current_mda, phone_number, grade_level, lga, birth_month_day)
SELECT new_data.id, new_data.email_address, new_data.full_name, new_data.is_approved, new_data.must_change_password, new_data.current_mda, new_data.phone_number, new_data.grade_level, new_data.lga, new_data.birth_month_day
FROM (
  SELECT gen_random_uuid() as id, 'samolade2003@gmail.com'::text as email_address, 'OGUNLADE, Samuel Somo'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'bifoluojumu@gmail.com'::text as email_address, 'OJUMU, Glory Taiwo'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'natorogun@gmail.com'::text as email_address, 'OROGUN, Nathaniel'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'debayodan@gmail.com'::text as email_address, 'ADEBAYO, Daniel'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'bidemi.nelson@gmail.com'::text as email_address, 'FAMILONI, Nelson Abidemi'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'fagbaanu@gmail.com'::text as email_address, 'FAGBAMILA, Aanuoluwapo'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'adeteye2015@gmail.com'::text as email_address, 'OSHODI, Michael Adeteye'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'yinkakinwe77@gmail.com'::text as email_address, 'AKINWE, Adeyinka Adeyemi'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'riccardo2k6@gmail.com'::text as email_address, 'AINA, Richard'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'baloguntoyin07@gmail.com'::text as email_address, 'BALOGUN, Stella Toyin'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'akinduro.oluwabusayomi@gmail.com'::text as email_address, 'AKINDURO, Busayo'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'basikay2@gmail.com'::text as email_address, 'IKUSEMIJU, Ayokunle Oluwadamilare'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'jummy_stella@yahoo.com'::text as email_address, 'OLANIRAN-OJO, Jumoke Stella'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'ajibadeolakunle3@gmail.com'::text as email_address, 'AJIBADE, Olakunle Bankole'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'foluksdarasimi@gmail.com'::text as email_address, 'FOLUKE, Seyi-olakanye'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'tayoogundare9@gmail.com'::text as email_address, 'OGUNDARE, Temitayo'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'warrybae@gmail.com'::text as email_address, 'OJUMU, Blessing'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'olafisoyeo@gmail.com'::text as email_address, 'OLAFISOYE, Olawole'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'olumuyiwaakinkuolie@gmail.com'::text as email_address, 'AKINKUOLIE, Olumuyiwa'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'bukolakomolafe789@gmail.com'::text as email_address, 'KOMOLAFE, Bukola'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'nittygirl4real@gmail.com'::text as email_address, 'OLADURE, Olanireti Folake'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'akinolataiwo1001@gmail.com'::text as email_address, 'AKINOLA, Taiwo'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'sheriffadeyemo@gmail.com'::text as email_address, 'ADEYEMO, Sheriff'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'michaelpeace2015@gmail.com'::text as email_address, 'AFARIOGUN, Michael Olugbenga'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'adegokeabimbola90@gmail.com'::text as email_address, 'ADEGOKE, Folasade Abimbola Mrs'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'olubisosea@gmail.com'::text as email_address, 'OLUBISOSE, Afolabi'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'femiwebs1989@gmail.com'::text as email_address, 'EDEMA, John'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'bolajioke2@gmail.com'::text as email_address, 'OBIDEYI, Stella Bolaji'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'aomolabake@gmail.com'::text as email_address, 'ADEOLA, Omolabake'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'sademonehin@gmail.com'::text as email_address, 'MONEHIN, Modupe'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'jokesajokes@gmail.com'::text as email_address, 'AYOMIDE, Adejoke Christianah'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'boderemmy@gmail.com'::text as email_address, 'OLABODE, Aderemi'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'delenagbeys@gmail.com'::text as email_address, 'AKINNAGBE, Akinbamidele'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'ehinmeroobafemi@gmail.com'::text as email_address, 'EHINMERO, Obafemi'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'georgeasonja@gmail.com'::text as email_address, 'ASONJA, George'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'edemakayode@gmail.com'::text as email_address, 'EDEMA, Kayode Smart'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'jigbekele@gmail.com'::text as email_address, 'JATUWASE, Igbekele Hosea Esq'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'frekolad25@gmail.com'::text as email_address, 'OLADIRAN, Fredrick Olawale'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'folawemifunmi@gmail.com'::text as email_address, 'AKINSELI, Folawe'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'dejiageh@yahoo.com'::text as email_address, 'AGEH, Ayodeji'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'joelolushile@gmail.com'::text as email_address, 'ALE, Joel Olugbenga'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'tiwaevelyn@gmail.com'::text as email_address, 'OLUWATOBI-OMITA, Evelyn'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'ebikedasanami@gmail.com'::text as email_address, 'SANAMI, Ebikeda'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'foldara@gmail.com'::text as email_address, 'TUNDE-DARAMOLA, Foluke'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'chencocomputers17@gmail.com'::text as email_address, 'OMORE, Olumide Victor'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'pelumifakinlede@outlook.com'::text as email_address, 'FAKINLEDE, Pelumi'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'alabimayode999@gmail.com'::text as email_address, 'ALABI, Oluwamayode Oluwakemi'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'akinyeleoluwatosin1996@gmail.com'::text as email_address, 'AKINYELE, Oluwatosin'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'bukieadetan1@gmail.com'::text as email_address, 'ADETAN, Olubukola Ibironke'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'donfemiobideyi@gmail.com'::text as email_address, 'OBIDEYI, Olufemi'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'ajibolaabidakun@mail.com'::text as email_address, 'AJIBOLA, Abidakun'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'topekolawoles@gmail.com'::text as email_address, 'KOLAWOLE, Olatope'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'ogungbademorenikeji@gmail.com'::text as email_address, 'AKINSEYE, Morenikeji'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'phummyoni@gmail.com'::text as email_address, 'ONI, Olufunmilayo'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'gbemmychristianah@gmail.com'::text as email_address, 'OMOPARIOLA, Gbemisola Christianah'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'rolandtolisa@gmail.com'::text as email_address, 'OLISA, Roland'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'ericoluwasinmi@gmail.com'::text as email_address, 'APATA, Eric Oluwasinmi'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'stevetosin941@gmail.com'::text as email_address, 'OMOEKO, Tosin'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'omirinsundaylade1976@gmail.com'::text as email_address, 'OMIRIN, Sunday'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'eunishad2006@gmail.com'::text as email_address, 'OGUNMOLA, Eunice'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'akinseyeolusola2018@gmail.com'::text as email_address, 'AKINSEYE, Olusola Firopo'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'topsyleb@gmail.com'::text as email_address, 'LEBILE, Temitope Oluseye'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'josephogunsusi8@gmail.com'::text as email_address, 'OGUNSUSI, Joseph'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'folasadeale@gmail.com'::text as email_address, 'FOLASADE, Ale'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'bosunadu24@gmail.com'::text as email_address, 'ADU, Olatubosun Joseph'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'segunakosh@gmail.com'::text as email_address, 'AKOSILE, Oladele Olusegun'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'prettysuzzie30@gmail.com'::text as email_address, 'OLAOLU-IKOTO, Abimbola'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'ebiwonjumiademola@gmail.com'::text as email_address, 'ADEMOLA, Abiola Ebiwonjumi'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'femiisgodly@gmail.com'::text as email_address, 'ISIMIJOLA, Akeem'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
  UNION ALL
  SELECT gen_random_uuid() as id, 'adebola.ajagunna@gmail.com'::text as email_address, 'AJAGUNNA, Adebola Akeem'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day
) as new_data
WHERE NOT EXISTS (
  SELECT 1 FROM public.administrative_officers 
  WHERE administrative_officers.email_address = new_data.email_address
);
