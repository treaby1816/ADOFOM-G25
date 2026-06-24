-- =====================================================================
-- ADOFOM E-Platform: SQL Injection for 62 Unique New Officers
-- Purpose: Pre-populate the administrative_officers table so users bypass
-- unauthorized blocks during signup and redirect safely to Profile Setup.
-- =====================================================================

BEGIN;

-- 1. Clean Up / Upsert Logic to Prevent Duplicates
INSERT INTO public.administrative_officers (id, email_address, full_name, is_approved, must_change_password)
VALUES
  (gen_random_uuid(), 'samolade2003@gmail.com', 'Ogunlade Samuel Somo', false, true),
  (gen_random_uuid(), 'bifoluojumu@gmail.com', 'OJUMU, Glory Taiwo', false, true),
  (gen_random_uuid(), 'natorogun@gmail.com', 'OROGUN Nathaniel', false, true),
  (gen_random_uuid(), 'debayodan@gmail.com', 'Adebayo Daniel', false, true),
  (gen_random_uuid(), 'bidemi.nelson@gmail.com', 'Familoni Nelson Abidemi', false, true),
  (gen_random_uuid(), 'fagbaanu@gmail.com', 'FAGBAMILA, Aanuoluwapo', false, true),
  (gen_random_uuid(), 'adeteye2015@gmail.com', 'oshodi Michael Adeteye', false, true),
  (gen_random_uuid(), 'yinkakinwe77@gmail.com', 'AKINWE, Adeyinka Adeyemi', false, true),
  (gen_random_uuid(), 'riccardo2k6@gmail.com', 'Aina Richard', false, true),
  (gen_random_uuid(), 'baloguntoyin07@gmail.com', 'Balogun, Stella Toyin', false, true),
  (gen_random_uuid(), 'akinduro.oluwabusayomi@gmail.com', 'AKINDURO, Busayo', false, true),
  (gen_random_uuid(), 'basikay2@gmail.com', 'IKUSEMIJU, Ayokunle Oluwadamilare', false, true),
  (gen_random_uuid(), 'jummy_stella@yahoo.com', 'OLANIRAN-OJO, Jumoke Stella', false, true),
  (gen_random_uuid(), 'ajibadeolakunle3@gmail.com', 'Ajibade Olakunle Bankole', false, true),
  (gen_random_uuid(), 'foluksdarasimi@gmail.com', 'Foluke Seyi-Olakanye', false, true),
  (gen_random_uuid(), 'tayoogundare9@gmail.com', 'OGUNDARE, Temitayo', false, true),
  (gen_random_uuid(), 'warrybae@gmail.com', 'Ojumu Blessing', false, true),
  (gen_random_uuid(), 'olafisoyeo@gmail.com', 'Olafisoye Olawole', false, true),
  (gen_random_uuid(), 'olumuyiwaakinkuolie@gmail.com', 'AKINKUOLIE, Olumuyiwa', false, true),
  (gen_random_uuid(), 'bukolakomolafe789@gmail.com', 'Komolafe Bukola', false, true),
  (gen_random_uuid(), 'nittygirl4real@gmail.com', 'Oladure Olanireti Folake', false, true),
  (gen_random_uuid(), 'akinolataiwo1001@gmail.com', 'AKINOLA Taiwo', false, true),
  (gen_random_uuid(), 'sheriffadeyemo@gmail.com', 'ADEYEMO Sheriff', false, true),
  (gen_random_uuid(), 'michaelpeace2015@gmail.com', 'Afariogun Michael Olugbenga', false, true),
  (gen_random_uuid(), 'adegokeabimbola90@gmail.com', 'Adegoke Folasade Abimbola Mrs', false, true),
  (gen_random_uuid(), 'olubisosea@gmail.com', 'Olubisose Afolabi', false, true),
  (gen_random_uuid(), 'femiwebs1989@gmail.com', 'Edema John', false, true),
  (gen_random_uuid(), 'bolajioke2@gmail.com', 'OBIDEYI,Stella Bolaji', false, true),
  (gen_random_uuid(), 'aomolabake@gmail.com', 'ADEOLA Omolabake', false, true),
  (gen_random_uuid(), 'sademonehin@gmail.com', 'MONEHIN, Modupe', false, true),
  (gen_random_uuid(), 'jokesajokes@gmail.com', 'AYOMIDE, Adejoke Christianah', false, true),
  (gen_random_uuid(), 'boderemmy@gmail.com', 'OLABODE, Aderemi', false, true),
  (gen_random_uuid(), 'delenagbeys@gmail.com', 'AKINNAGBE, Akinbamidele', false, true),
  (gen_random_uuid(), 'ehinmeroobafemi@gmail.com', 'EHINMERO, Obafemi', false, true),
  (gen_random_uuid(), 'georgeasonja@gmail.com', 'ASONJA, George', false, true),
  (gen_random_uuid(), 'edemakayode@gmail.com', 'Edema, Kayode Smart', false, true),
  (gen_random_uuid(), 'jigbekele@gmail.com', 'Jatuwase Igbekele Hosea  Esq', false, true),
  (gen_random_uuid(), 'frekolad25@gmail.com', 'Oladiran Fredrick Olawale', false, true),
  (gen_random_uuid(), 'folawemifunmi@gmail.com', 'AKINSELI, Folawe', false, true),
  (gen_random_uuid(), 'dejiageh@yahoo.com', 'AGEH Ayodeji', false, true),
  (gen_random_uuid(), 'joelolushile@gmail.com', 'ALE, Joel Olugbenga', false, true),
  (gen_random_uuid(), 'tiwaevelyn@gmail.com', 'OLUWATOBI-OMITA, Evelyn', false, true),
  (gen_random_uuid(), 'ebikedasanami@gmail.com', 'Sanami Ebikeda', false, true),
  (gen_random_uuid(), 'foldara@gmail.com', 'Tunde-Daramola Foluke', false, true),
  (gen_random_uuid(), 'chencocomputers17@gmail.com', 'Omore Olumide Victor', false, true),
  (gen_random_uuid(), 'pelumifakinlede@outlook.com', 'Fakinlede, Pelumi', false, true),
  (gen_random_uuid(), 'alabimayode999@gmail.com', 'Alabi Oluwamayode Oluwakemi', false, true),
  (gen_random_uuid(), 'akinyeleoluwatosin1996@gmail.com', 'Akinyele Oluwatosin', false, true),
  (gen_random_uuid(), 'bukieadetan1@gmail.com', 'Adetan Olubukola Ibironke', false, true),
  (gen_random_uuid(), 'donfemiobideyi@gmail.com', 'Obideyi, Olufemi', false, true),
  (gen_random_uuid(), 'ajibolaabidakun@mail.com', 'AJIBOLA,ABIDAKUN', false, true),
  (gen_random_uuid(), 'topekolawoles@gmail.com', 'Kolawole Olatope', false, true),
  (gen_random_uuid(), 'ogungbademorenikeji@gmail.com', 'Akinseye, Morenikeji', false, true),
  (gen_random_uuid(), 'phummyoni@gmail.com', 'Oni, Olufunmilayo', false, true),
  (gen_random_uuid(), 'gbemmychristianah@gmail.com', 'Omopariola Gbemisola Christianah', false, true),
  (gen_random_uuid(), 'rolandtolisa@gmail.com', 'Olisa, Roland', false, true),
  (gen_random_uuid(), 'ericoluwasinmi@gmail.com', 'Apata, Eric Oluwasinmi', false, true),
  (gen_random_uuid(), 'stevetosin941@gmail.com', 'OMOEKO, TOSIN', false, true),
  (gen_random_uuid(), 'omirinsundaylade1976@gmail.com', 'OMIRIN, Sunday', false, true),
  (gen_random_uuid(), 'eunishad2006@gmail.com', 'Ogunmola Eunice', false, true),
  (gen_random_uuid(), 'akinseyeolusola2018@gmail.com', 'AKINSEYE Olusola Firopo', false, true),
  (gen_random_uuid(), 'topsyleb@gmail.com', 'LEBILE, Temitope Oluseye', false, true),
  (gen_random_uuid(), 'josephogunsusi8@gmail.com', 'Ogunsusi Joseph', false, true),
  (gen_random_uuid(), 'folasadeale@gmail.com', 'folasade ale', false, true),
  (gen_random_uuid(), 'bosunadu24@gmail.com', 'Adu, Olatubosun Joseph', false, true),
  (gen_random_uuid(), 'segunakosh@gmail.com', 'Akosile Oladele Olusegun', false, true),
  (gen_random_uuid(), 'prettysuzzie30@gmail.com', 'Olaolu-Ikoto Abimbola', false, true),
  (gen_random_uuid(), 'ebiwonjumiademola@gmail.com', 'Ademola Abiola Ebiwonjumi', false, true),
  (gen_random_uuid(), 'femiisgodly@gmail.com', 'Isimijola Akeem', false, true),
  (gen_random_uuid(), 'adebola.ajagunna@gmail.com', 'AJAGUNNA ADEBOLA AKEEM', false, true)
ON CONFLICT (email_address) 
DO UPDATE SET 
  full_name = EXCLUDED.full_name,
  is_approved = EXCLUDED.is_approved;

-- 2. Verification check to see duplicate anomalies
SELECT email_address, COUNT(*) as occurrence_count 
FROM public.administrative_officers 
GROUP BY email_address 
HAVING COUNT(*) > 1;

COMMIT;
