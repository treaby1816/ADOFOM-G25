-- =====================================================================
-- ADOFOM E-Platform: Fix Officer Names to SURNAME, Other Names Format
-- Run this in Supabase SQL Editor to update existing DB records.
-- =====================================================================

BEGIN;

UPDATE public.administrative_officers
  SET full_name = 'OLUBISOSE, Afolabi'
  WHERE email_address = 'olubisosea@gmail.com'
    AND full_name IS DISTINCT FROM 'OLUBISOSE, Afolabi';

UPDATE public.administrative_officers
  SET full_name = 'FAKINLEDE, Pelumi'
  WHERE email_address = 'pelumifakinlede@outlook.com'
    AND full_name IS DISTINCT FROM 'FAKINLEDE, Pelumi';

UPDATE public.administrative_officers
  SET full_name = 'AKINYOSOYE, Bolanle A'
  WHERE email_address = 'bolayosoye@gmail.com'
    AND full_name IS DISTINCT FROM 'AKINYOSOYE, Bolanle A';

UPDATE public.administrative_officers
  SET full_name = 'DADA, Odunayo Lola'
  WHERE email_address = 'temilolaodunayo@yahoo.com'
    AND full_name IS DISTINCT FROM 'DADA, Odunayo Lola';

UPDATE public.administrative_officers
  SET full_name = 'OYEWO, Gbadebo Sheun'
  WHERE email_address = 'gbadebooyewo@yahoo.com'
    AND full_name IS DISTINCT FROM 'OYEWO, Gbadebo Sheun';

UPDATE public.administrative_officers
  SET full_name = 'AKINBINU, Isaac Temitope'
  WHERE email_address = 'akinbinutemitopeisaac@gmail.com'
    AND full_name IS DISTINCT FROM 'AKINBINU, Isaac Temitope';

UPDATE public.administrative_officers
  SET full_name = 'OGUNSULIRE, Timilehin'
  WHERE email_address = 'ogunsuliretimilehin@gmail.com'
    AND full_name IS DISTINCT FROM 'OGUNSULIRE, Timilehin';

UPDATE public.administrative_officers
  SET full_name = 'LOTO, Oluwatoyin Amuwa'
  WHERE email_address = 'oluwatoyinloto@gmail.com'
    AND full_name IS DISTINCT FROM 'LOTO, Oluwatoyin Amuwa';

UPDATE public.administrative_officers
  SET full_name = 'OSHODI, Ayobami'
  WHERE email_address = 'ayobamijoshua01@gmail.com'
    AND full_name IS DISTINCT FROM 'OSHODI, Ayobami';

UPDATE public.administrative_officers
  SET full_name = 'BALOGUN, Olalekan Ebenezer'
  WHERE email_address = 'balogunolamilekan93@gmail.com'
    AND full_name IS DISTINCT FROM 'BALOGUN, Olalekan Ebenezer';

UPDATE public.administrative_officers
  SET full_name = 'ISOLA, Olabamidele Wasiu'
  WHERE email_address = 'deleishola9@gmail.com'
    AND full_name IS DISTINCT FROM 'ISOLA, Olabamidele Wasiu';

UPDATE public.administrative_officers
  SET full_name = 'ABEGUNDE, Oluwatosin Israel'
  WHERE email_address = 'ajekunrin1@gmail.com'
    AND full_name IS DISTINCT FROM 'ABEGUNDE, Oluwatosin Israel';

UPDATE public.administrative_officers
  SET full_name = 'OYENUSI, Eunice'
  WHERE email_address = 'consolationiog2015@gmail.com'
    AND full_name IS DISTINCT FROM 'OYENUSI, Eunice';

UPDATE public.administrative_officers
  SET full_name = 'ADEWUSI, Mary Olufisayo'
  WHERE email_address = 'fisscom215@gmail.com'
    AND full_name IS DISTINCT FROM 'ADEWUSI, Mary Olufisayo';

UPDATE public.administrative_officers
  SET full_name = 'ATERE, Olubunmi Moyomola'
  WHERE email_address = 'atereolubunmi@gmail.com'
    AND full_name IS DISTINCT FROM 'ATERE, Olubunmi Moyomola';

UPDATE public.administrative_officers
  SET full_name = 'OGUNLEYE, Michael'
  WHERE email_address = 'ogunleyemichaelom@gmail.com'
    AND full_name IS DISTINCT FROM 'OGUNLEYE, Michael';

UPDATE public.administrative_officers
  SET full_name = 'OLADURE, Olanireti Folake'
  WHERE email_address = 'nittygirl4real@gmail.com'
    AND full_name IS DISTINCT FROM 'OLADURE, Olanireti Folake';

UPDATE public.administrative_officers
  SET full_name = 'ITORO, Daniel Oweike'
  WHERE email_address = 'itorodaniel@gmail.com'
    AND full_name IS DISTINCT FROM 'ITORO, Daniel Oweike';

UPDATE public.administrative_officers
  SET full_name = 'DUEBO, O. Dennis'
  WHERE email_address = 'dennisduebo@gmail.com'
    AND full_name IS DISTINCT FROM 'DUEBO, O. Dennis';

UPDATE public.administrative_officers
  SET full_name = 'OMOTERE, Benson Agboola'
  WHERE email_address = 'bensonomotere81@gmail.com'
    AND full_name IS DISTINCT FROM 'OMOTERE, Benson Agboola';

UPDATE public.administrative_officers
  SET full_name = 'ADEWOLE, Felix Bamidele'
  WHERE email_address = 'felixadewole16@gmail.com'
    AND full_name IS DISTINCT FROM 'ADEWOLE, Felix Bamidele';

UPDATE public.administrative_officers
  SET full_name = 'OKE, Arinola Oluwabukola'
  WHERE email_address = 'okearinola1@gmail.com'
    AND full_name IS DISTINCT FROM 'OKE, Arinola Oluwabukola';

UPDATE public.administrative_officers
  SET full_name = 'OLAIMOLU, Emmanuel Diekolola'
  WHERE email_address = 'olaimoluemmanuel@gmail.com'
    AND full_name IS DISTINCT FROM 'OLAIMOLU, Emmanuel Diekolola';

UPDATE public.administrative_officers
  SET full_name = 'AKINYELE, Oluwatosin'
  WHERE email_address = 'oluwatosinakinyele03@gmail.com'
    AND full_name IS DISTINCT FROM 'AKINYELE, Oluwatosin';

UPDATE public.administrative_officers
  SET full_name = 'OLANREWAJU, Precious Ayomide'
  WHERE email_address = 'olanrewajupreciousa@gmail.com'
    AND full_name IS DISTINCT FROM 'OLANREWAJU, Precious Ayomide';

UPDATE public.administrative_officers
  SET full_name = 'DOKO, Benjamin Temidayo'
  WHERE email_address = 'dayobenlaw2@gmail.com'
    AND full_name IS DISTINCT FROM 'DOKO, Benjamin Temidayo';

UPDATE public.administrative_officers
  SET full_name = 'OLUWASOLA, Yetunde'
  WHERE email_address = 'yetundeoluwasola@gmail.com'
    AND full_name IS DISTINCT FROM 'OLUWASOLA, Yetunde';

UPDATE public.administrative_officers
  SET full_name = 'AKIN-MIBIOLA, Ayokunle'
  WHERE email_address = 'akinmibiolaayokunle@gmail.com'
    AND full_name IS DISTINCT FROM 'AKIN-MIBIOLA, Ayokunle';

UPDATE public.administrative_officers
  SET full_name = 'SANYADE, Jumoke Yetunde'
  WHERE email_address = 'jumyyety@gmail.com'
    AND full_name IS DISTINCT FROM 'SANYADE, Jumoke Yetunde';

UPDATE public.administrative_officers
  SET full_name = 'THOMPSON -ISRAEL, Oyindamola Sadiat'
  WHERE email_address = 'thompsonisraeloyindamola@gmail.com'
    AND full_name IS DISTINCT FROM 'THOMPSON -ISRAEL, Oyindamola Sadiat';

UPDATE public.administrative_officers
  SET full_name = 'WOLEMIWA, Feyisayo Happiness'
  WHERE email_address = 'feyisayohappiness599@gmail.com'
    AND full_name IS DISTINCT FROM 'WOLEMIWA, Feyisayo Happiness';

UPDATE public.administrative_officers
  SET full_name = 'AKINRINWOYE, Isaiah'
  WHERE email_address = 'akinrinwoyeisaiah@gmail.com'
    AND full_name IS DISTINCT FROM 'AKINRINWOYE, Isaiah';

UPDATE public.administrative_officers
  SET full_name = 'BOLARINWA, Taye Tope'
  WHERE email_address = 'bola644736@gmail.com'
    AND full_name IS DISTINCT FROM 'BOLARINWA, Taye Tope';

UPDATE public.administrative_officers
  SET full_name = 'PIRISOLA, Ayokunle M.'
  WHERE email_address = 'piridhino71@gmail.com'
    AND full_name IS DISTINCT FROM 'PIRISOLA, Ayokunle M.';

UPDATE public.administrative_officers
  SET full_name = 'ALABI, Oluwamayode Oluwakemi'
  WHERE email_address = 'alabimayode999@gmail.com'
    AND full_name IS DISTINCT FROM 'ALABI, Oluwamayode Oluwakemi';

UPDATE public.administrative_officers
  SET full_name = 'AKINYELURE, Ayodeji'
  WHERE email_address = 'ayodejiakinyelure017@gmail.com'
    AND full_name IS DISTINCT FROM 'AKINYELURE, Ayodeji';

UPDATE public.administrative_officers
  SET full_name = 'ADEROBOYE, Adetula Olamide'
  WHERE email_address = 'adetulaol@gmail.com'
    AND full_name IS DISTINCT FROM 'ADEROBOYE, Adetula Olamide';

UPDATE public.administrative_officers
  SET full_name = 'EKUNDAYO, Elizabeth Olufunmi'
  WHERE email_address = 'funmiliz09@gmail.com'
    AND full_name IS DISTINCT FROM 'EKUNDAYO, Elizabeth Olufunmi';

UPDATE public.administrative_officers
  SET full_name = 'KEHINDE, Sandra Abimbola'
  WHERE email_address = 'kehindesandra98@gmail.com'
    AND full_name IS DISTINCT FROM 'KEHINDE, Sandra Abimbola';

UPDATE public.administrative_officers
  SET full_name = 'ARAJULU, Olabisi Deborah'
  WHERE email_address = 'olabisiolajumoke24@gmail.com'
    AND full_name IS DISTINCT FROM 'ARAJULU, Olabisi Deborah';

UPDATE public.administrative_officers
  SET full_name = 'AKINROGUNDE, Omoniyi Adetayo'
  WHERE email_address = 'omoniyi.akinrogunde@gmail.com'
    AND full_name IS DISTINCT FROM 'AKINROGUNDE, Omoniyi Adetayo';

UPDATE public.administrative_officers
  SET full_name = 'ADINLEWA, Adebukola Olufunmilayo'
  WHERE email_address = 'adinlewaadebukola@gmail.com'
    AND full_name IS DISTINCT FROM 'ADINLEWA, Adebukola Olufunmilayo';

UPDATE public.administrative_officers
  SET full_name = 'BABATUNDE, Deborah Titilayo'
  WHERE email_address = 'adetitideby2019@gmail.com'
    AND full_name IS DISTINCT FROM 'BABATUNDE, Deborah Titilayo';

UPDATE public.administrative_officers
  SET full_name = 'ONIYI, Oluwaseun Esther'
  WHERE email_address = 'oluseunoniyi@gmail.com'
    AND full_name IS DISTINCT FROM 'ONIYI, Oluwaseun Esther';

UPDATE public.administrative_officers
  SET full_name = 'AGBOTOBA, Omolola'
  WHERE email_address = 'lagbotoba@gmail.com'
    AND full_name IS DISTINCT FROM 'AGBOTOBA, Omolola';

UPDATE public.administrative_officers
  SET full_name = 'JUBRIL, Olayele Olaoluwa'
  WHERE email_address = 'olayeletitilope@gmail.com'
    AND full_name IS DISTINCT FROM 'JUBRIL, Olayele Olaoluwa';

UPDATE public.administrative_officers
  SET full_name = 'PITT, Temidayo'
  WHERE email_address = 'temidayopitt@gmail.com'
    AND full_name IS DISTINCT FROM 'PITT, Temidayo';

UPDATE public.administrative_officers
  SET full_name = 'JEGEDE, Ezekiel Ayoola'
  WHERE email_address = 'ezekieljegede@rocketmail.com'
    AND full_name IS DISTINCT FROM 'JEGEDE, Ezekiel Ayoola';

UPDATE public.administrative_officers
  SET full_name = 'AKEJU, Modupe Moyinoluwa'
  WHERE email_address = 'easymodak86@gmail.com'
    AND full_name IS DISTINCT FROM 'AKEJU, Modupe Moyinoluwa';

UPDATE public.administrative_officers
  SET full_name = 'OLUTOLA, Temidayo Victoria'
  WHERE email_address = 'olutolatemi2017@gmail.com'
    AND full_name IS DISTINCT FROM 'OLUTOLA, Temidayo Victoria';

UPDATE public.administrative_officers
  SET full_name = 'ALABI, Saheed Onimisi'
  WHERE email_address = 'alabi136@gmail.com'
    AND full_name IS DISTINCT FROM 'ALABI, Saheed Onimisi';

UPDATE public.administrative_officers
  SET full_name = 'SANAMI, Ebikeda'
  WHERE email_address = 'ebikedasanami@gmail.com'
    AND full_name IS DISTINCT FROM 'SANAMI, Ebikeda';

UPDATE public.administrative_officers
  SET full_name = 'AJIBOLA, Ibukun Rachael'
  WHERE email_address = 'ibukunrach3@gmail.com'
    AND full_name IS DISTINCT FROM 'AJIBOLA, Ibukun Rachael';

UPDATE public.administrative_officers
  SET full_name = 'KOLAWOLE, Ayọdeji Josiah'
  WHERE email_address = 'tezzy4joy@gmail.com'
    AND full_name IS DISTINCT FROM 'KOLAWOLE, Ayọdeji Josiah';

UPDATE public.administrative_officers
  SET full_name = 'AKEREDOLU, Roseline Oluwakemi'
  WHERE email_address = 'roselinemasebinu@gmail.com'
    AND full_name IS DISTINCT FROM 'AKEREDOLU, Roseline Oluwakemi';

UPDATE public.administrative_officers
  SET full_name = 'FAMUSUDO, Olawale'
  WHERE email_address = 'mcfamowalex@yahoo.com'
    AND full_name IS DISTINCT FROM 'FAMUSUDO, Olawale';

UPDATE public.administrative_officers
  SET full_name = 'OWOLABI, Nkechi Blessing'
  WHERE email_address = 'nkayblessing@gmail.com'
    AND full_name IS DISTINCT FROM 'OWOLABI, Nkechi Blessing';

UPDATE public.administrative_officers
  SET full_name = 'TAIWO, Damilare Moses'
  WHERE email_address = 'taiwodamilaremoses@gmail.com'
    AND full_name IS DISTINCT FROM 'TAIWO, Damilare Moses';

UPDATE public.administrative_officers
  SET full_name = 'FAGBAMILA, Aanuoluwapo'
  WHERE email_address = 'fagbaanu@gmail.com'
    AND full_name IS DISTINCT FROM 'FAGBAMILA, Aanuoluwapo';

UPDATE public.administrative_officers
  SET full_name = 'OLAREWAJU, Kemisola Vivian'
  WHERE email_address = 'vivianolarewaju@gmail.com'
    AND full_name IS DISTINCT FROM 'OLAREWAJU, Kemisola Vivian';

UPDATE public.administrative_officers
  SET full_name = 'BADEJO, Adedayo Emmanuel'
  WHERE email_address = 'badejo007@gmail.com'
    AND full_name IS DISTINCT FROM 'BADEJO, Adedayo Emmanuel';

UPDATE public.administrative_officers
  SET full_name = 'SANNI, Faruq Adeyanju'
  WHERE email_address = 'faruq.sanni.adeyanju@gmail.com'
    AND full_name IS DISTINCT FROM 'SANNI, Faruq Adeyanju';

UPDATE public.administrative_officers
  SET full_name = 'OGUNDUYI, Blessing Innameneze'
  WHERE email_address = 'blessingogunduyi1620@gmail.com'
    AND full_name IS DISTINCT FROM 'OGUNDUYI, Blessing Innameneze';

UPDATE public.administrative_officers
  SET full_name = 'ORIMOLOYE, Titilola Catherine'
  WHERE email_address = 'titilolaorims@gmail.com'
    AND full_name IS DISTINCT FROM 'ORIMOLOYE, Titilola Catherine';

UPDATE public.administrative_officers
  SET full_name = 'OLISA, Aderinsola Adekoya'
  WHERE email_address = 'olisaaderinsola@gmail.com'
    AND full_name IS DISTINCT FROM 'OLISA, Aderinsola Adekoya';

UPDATE public.administrative_officers
  SET full_name = 'IMORU, Wemimo Patience'
  WHERE email_address = 'holamide055@gmail.com'
    AND full_name IS DISTINCT FROM 'IMORU, Wemimo Patience';

UPDATE public.administrative_officers
  SET full_name = 'OLA-AMUDA, Toluwanimi O.'
  WHERE email_address = 'olaamudatoluwanimi@gmail.com'
    AND full_name IS DISTINCT FROM 'OLA-AMUDA, Toluwanimi O.';

UPDATE public.administrative_officers
  SET full_name = 'AKINFULIE, Blessing Solomon'
  WHERE email_address = 'solomonakinfulie@gmail.com'
    AND full_name IS DISTINCT FROM 'AKINFULIE, Blessing Solomon';

UPDATE public.administrative_officers
  SET full_name = 'AJAYI, Ayorinde'
  WHERE email_address = 'ajayiayorinde2013@gmail.com'
    AND full_name IS DISTINCT FROM 'AJAYI, Ayorinde';

UPDATE public.administrative_officers
  SET full_name = 'AKEREDOLU, Titilope Oluwaseyi Opeyemi'
  WHERE email_address = 'yopemie@gmail.com'
    AND full_name IS DISTINCT FROM 'AKEREDOLU, Titilope Oluwaseyi Opeyemi';

UPDATE public.administrative_officers
  SET full_name = 'DUROJAIYE, Oluwaseun Modupe'
  WHERE email_address = 'oluwaseunmodupe18@gmail.com'
    AND full_name IS DISTINCT FROM 'DUROJAIYE, Oluwaseun Modupe';

UPDATE public.administrative_officers
  SET full_name = 'OROGUN, Adenike Adesola'
  WHERE email_address = 'olarewajuadenike8@gmail.com'
    AND full_name IS DISTINCT FROM 'OROGUN, Adenike Adesola';

UPDATE public.administrative_officers
  SET full_name = 'ASONJA, Kehinde Imisioluwa'
  WHERE email_address = 'asonjakehinde16@gmail.com'
    AND full_name IS DISTINCT FROM 'ASONJA, Kehinde Imisioluwa';

UPDATE public.administrative_officers
  SET full_name = 'FATUROTI, Vincent Temitope'
  WHERE email_address = 'faturotivincenttemitope@gmail.com'
    AND full_name IS DISTINCT FROM 'FATUROTI, Vincent Temitope';

UPDATE public.administrative_officers
  SET full_name = 'BAMIDELE, Damilola Ayooluwa'
  WHERE email_address = 'ayooluwabamidele571@gmail.com'
    AND full_name IS DISTINCT FROM 'BAMIDELE, Damilola Ayooluwa';

UPDATE public.administrative_officers
  SET full_name = 'OMOSEYIN-OJO, Oluwamayowa'
  WHERE email_address = 'omoseyinojom@gmail.com'
    AND full_name IS DISTINCT FROM 'OMOSEYIN-OJO, Oluwamayowa';

UPDATE public.administrative_officers
  SET full_name = 'ADEBAYO, Daniel'
  WHERE email_address = 'debayodan@gmail.com'
    AND full_name IS DISTINCT FROM 'ADEBAYO, Daniel';

UPDATE public.administrative_officers
  SET full_name = 'AWOSEMO, Deborah Olubunmi'
  WHERE email_address = 'prettydebbie2009@yahoo.com'
    AND full_name IS DISTINCT FROM 'AWOSEMO, Deborah Olubunmi';

UPDATE public.administrative_officers
  SET full_name = 'AREWA, Bamidele Patrick'
  WHERE email_address = 'patrickarewa024@gmail.com'
    AND full_name IS DISTINCT FROM 'AREWA, Bamidele Patrick';

UPDATE public.administrative_officers
  SET full_name = 'ỌMỌỌLỌRUN, Agnes'
  WHERE email_address = 'agnes.omoolorun25@gmail.com'
    AND full_name IS DISTINCT FROM 'ỌMỌỌLỌRUN, Agnes';

UPDATE public.administrative_officers
  SET full_name = 'IBUKUN, Akindele Joshua'
  WHERE email_address = 'ibukun4eva@gmail.com'
    AND full_name IS DISTINCT FROM 'IBUKUN, Akindele Joshua';

UPDATE public.administrative_officers
  SET full_name = 'OGUNMOLA, Yetunde Olubusola'
  WHERE email_address = 'yetundekayode1@gmail.com'
    AND full_name IS DISTINCT FROM 'OGUNMOLA, Yetunde Olubusola';

UPDATE public.administrative_officers
  SET full_name = 'OMORE, Olumide Victor'
  WHERE email_address = 'chencocomputers17@gmail.com'
    AND full_name IS DISTINCT FROM 'OMORE, Olumide Victor';

UPDATE public.administrative_officers
  SET full_name = 'ALADEJANA, Ayoyinka'
  WHERE email_address = 'ayoyinkaaladejana@gmail.com'
    AND full_name IS DISTINCT FROM 'ALADEJANA, Ayoyinka';

UPDATE public.administrative_officers
  SET full_name = 'DADA, Ruth Erioluwa'
  WHERE email_address = 'ruthdada18@gmail.com'
    AND full_name IS DISTINCT FROM 'DADA, Ruth Erioluwa';

UPDATE public.administrative_officers
  SET full_name = 'SUNMOLA, Adeyinka'
  WHERE email_address = 'yinkasunmola@gmail.com'
    AND full_name IS DISTINCT FROM 'SUNMOLA, Adeyinka';

UPDATE public.administrative_officers
  SET full_name = 'FAKOMOGBON, Oluwafemi'
  WHERE email_address = 'ftchetto@yahoo.com'
    AND full_name IS DISTINCT FROM 'FAKOMOGBON, Oluwafemi';

UPDATE public.administrative_officers
  SET full_name = 'DARE, Bayode Philip'
  WHERE email_address = 'darephilip85@gmail.com'
    AND full_name IS DISTINCT FROM 'DARE, Bayode Philip';

UPDATE public.administrative_officers
  SET full_name = 'ADEOYE, Augustine Oluwatosin'
  WHERE email_address = 'oluwatosinaugustine@gmail.com'
    AND full_name IS DISTINCT FROM 'ADEOYE, Augustine Oluwatosin';

UPDATE public.administrative_officers
  SET full_name = 'FAMUTI, Oluwakemi Funmi'
  WHERE email_address = 'kemifamuti08@gmail.com'
    AND full_name IS DISTINCT FROM 'FAMUTI, Oluwakemi Funmi';

UPDATE public.administrative_officers
  SET full_name = 'AKINMAMEJI, Ebunoluwa Omolola'
  WHERE email_address = 'omololaakinmaameji@gmail.com'
    AND full_name IS DISTINCT FROM 'AKINMAMEJI, Ebunoluwa Omolola';

UPDATE public.administrative_officers
  SET full_name = 'OGODONLA, Omosule Olawale'
  WHERE email_address = 'omosuleogodounla@gmail.com'
    AND full_name IS DISTINCT FROM 'OGODONLA, Omosule Olawale';

UPDATE public.administrative_officers
  SET full_name = 'OLUFOWOBI, Abosede Mobolaji'
  WHERE email_address = 'fowobiabosede@gmail.com'
    AND full_name IS DISTINCT FROM 'OLUFOWOBI, Abosede Mobolaji';

UPDATE public.administrative_officers
  SET full_name = 'ADELAYI, Blessing Oluwapelumi'
  WHERE email_address = 'adelayipelumi@gmail.com'
    AND full_name IS DISTINCT FROM 'ADELAYI, Blessing Oluwapelumi';

UPDATE public.administrative_officers
  SET full_name = 'OLOWOFOYEKU, Ose James'
  WHERE email_address = 'olowofoyekujames@gmail.com'
    AND full_name IS DISTINCT FROM 'OLOWOFOYEKU, Ose James';

UPDATE public.administrative_officers
  SET full_name = 'OGUNLADE, Samuel Somo'
  WHERE email_address = 'samolade2003@gmail.com'
    AND full_name IS DISTINCT FROM 'OGUNLADE, Samuel Somo';

UPDATE public.administrative_officers
  SET full_name = 'OJUMU, Glory Taiwo'
  WHERE email_address = 'bifoluojumu@gmail.com'
    AND full_name IS DISTINCT FROM 'OJUMU, Glory Taiwo';

UPDATE public.administrative_officers
  SET full_name = 'OROGUN, Nathaniel'
  WHERE email_address = 'natorogun@gmail.com'
    AND full_name IS DISTINCT FROM 'OROGUN, Nathaniel';

UPDATE public.administrative_officers
  SET full_name = 'FAMILONI, Nelson Abidemi'
  WHERE email_address = 'bidemi.nelson@gmail.com'
    AND full_name IS DISTINCT FROM 'FAMILONI, Nelson Abidemi';

UPDATE public.administrative_officers
  SET full_name = 'OSHODI, Michael Adeteye'
  WHERE email_address = 'adeteye2015@gmail.com'
    AND full_name IS DISTINCT FROM 'OSHODI, Michael Adeteye';

UPDATE public.administrative_officers
  SET full_name = 'AKINWE, Adeyinka Adeyemi'
  WHERE email_address = 'yinkakinwe77@gmail.com'
    AND full_name IS DISTINCT FROM 'AKINWE, Adeyinka Adeyemi';

UPDATE public.administrative_officers
  SET full_name = 'AINA, Richard'
  WHERE email_address = 'riccardo2k6@gmail.com'
    AND full_name IS DISTINCT FROM 'AINA, Richard';

UPDATE public.administrative_officers
  SET full_name = 'BALOGUN, Stella Toyin'
  WHERE email_address = 'baloguntoyin07@gmail.com'
    AND full_name IS DISTINCT FROM 'BALOGUN, Stella Toyin';

UPDATE public.administrative_officers
  SET full_name = 'AKINDURO, Busayo'
  WHERE email_address = 'akinduro.oluwabusayomi@gmail.com'
    AND full_name IS DISTINCT FROM 'AKINDURO, Busayo';

UPDATE public.administrative_officers
  SET full_name = 'IKUSEMIJU, Ayokunle Oluwadamilare'
  WHERE email_address = 'basikay2@gmail.com'
    AND full_name IS DISTINCT FROM 'IKUSEMIJU, Ayokunle Oluwadamilare';

UPDATE public.administrative_officers
  SET full_name = 'OLANIRAN-OJO, Jumoke Stella'
  WHERE email_address = 'jummy_stella@yahoo.com'
    AND full_name IS DISTINCT FROM 'OLANIRAN-OJO, Jumoke Stella';

UPDATE public.administrative_officers
  SET full_name = 'AJIBADE, Olakunle Bankole'
  WHERE email_address = 'ajibadeolakunle3@gmail.com'
    AND full_name IS DISTINCT FROM 'AJIBADE, Olakunle Bankole';

UPDATE public.administrative_officers
  SET full_name = 'FOLUKE, Seyi-olakanye'
  WHERE email_address = 'foluksdarasimi@gmail.com'
    AND full_name IS DISTINCT FROM 'FOLUKE, Seyi-olakanye';

UPDATE public.administrative_officers
  SET full_name = 'OGUNDARE, Temitayo'
  WHERE email_address = 'tayoogundare9@gmail.com'
    AND full_name IS DISTINCT FROM 'OGUNDARE, Temitayo';

UPDATE public.administrative_officers
  SET full_name = 'OJUMU, Blessing'
  WHERE email_address = 'warrybae@gmail.com'
    AND full_name IS DISTINCT FROM 'OJUMU, Blessing';

UPDATE public.administrative_officers
  SET full_name = 'OLAFISOYE, Olawole'
  WHERE email_address = 'olafisoyeo@gmail.com'
    AND full_name IS DISTINCT FROM 'OLAFISOYE, Olawole';

UPDATE public.administrative_officers
  SET full_name = 'AKINKUOLIE, Olumuyiwa'
  WHERE email_address = 'olumuyiwaakinkuolie@gmail.com'
    AND full_name IS DISTINCT FROM 'AKINKUOLIE, Olumuyiwa';

UPDATE public.administrative_officers
  SET full_name = 'KOMOLAFE, Bukola'
  WHERE email_address = 'bukolakomolafe789@gmail.com'
    AND full_name IS DISTINCT FROM 'KOMOLAFE, Bukola';

UPDATE public.administrative_officers
  SET full_name = 'AKINOLA, Taiwo'
  WHERE email_address = 'akinolataiwo1001@gmail.com'
    AND full_name IS DISTINCT FROM 'AKINOLA, Taiwo';

UPDATE public.administrative_officers
  SET full_name = 'ADEYEMO, Sheriff'
  WHERE email_address = 'sheriffadeyemo@gmail.com'
    AND full_name IS DISTINCT FROM 'ADEYEMO, Sheriff';

UPDATE public.administrative_officers
  SET full_name = 'AFARIOGUN, Michael Olugbenga'
  WHERE email_address = 'michaelpeace2015@gmail.com'
    AND full_name IS DISTINCT FROM 'AFARIOGUN, Michael Olugbenga';

UPDATE public.administrative_officers
  SET full_name = 'ADEGOKE, Folasade Abimbola'
  WHERE email_address = 'adegokeabimbola90@gmail.com'
    AND full_name IS DISTINCT FROM 'ADEGOKE, Folasade Abimbola';

UPDATE public.administrative_officers
  SET full_name = 'EDEMA, John'
  WHERE email_address = 'femiwebs1989@gmail.com'
    AND full_name IS DISTINCT FROM 'EDEMA, John';

UPDATE public.administrative_officers
  SET full_name = 'OBIDEYI, Stella Bolaji'
  WHERE email_address = 'bolajioke2@gmail.com'
    AND full_name IS DISTINCT FROM 'OBIDEYI, Stella Bolaji';

UPDATE public.administrative_officers
  SET full_name = 'ADEOLA, Omolabake'
  WHERE email_address = 'aomolabake@gmail.com'
    AND full_name IS DISTINCT FROM 'ADEOLA, Omolabake';

UPDATE public.administrative_officers
  SET full_name = 'MONEHIN, Modupe'
  WHERE email_address = 'sademonehin@gmail.com'
    AND full_name IS DISTINCT FROM 'MONEHIN, Modupe';

UPDATE public.administrative_officers
  SET full_name = 'AYOMIDE, Adejoke Christianah'
  WHERE email_address = 'jokesajokes@gmail.com'
    AND full_name IS DISTINCT FROM 'AYOMIDE, Adejoke Christianah';

UPDATE public.administrative_officers
  SET full_name = 'OLABODE, Aderemi'
  WHERE email_address = 'boderemmy@gmail.com'
    AND full_name IS DISTINCT FROM 'OLABODE, Aderemi';

UPDATE public.administrative_officers
  SET full_name = 'AKINNAGBE, Akinbamidele'
  WHERE email_address = 'delenagbeys@gmail.com'
    AND full_name IS DISTINCT FROM 'AKINNAGBE, Akinbamidele';

UPDATE public.administrative_officers
  SET full_name = 'EHINMERO, Obafemi'
  WHERE email_address = 'ehinmeroobafemi@gmail.com'
    AND full_name IS DISTINCT FROM 'EHINMERO, Obafemi';

UPDATE public.administrative_officers
  SET full_name = 'ASONJA, George'
  WHERE email_address = 'georgeasonja@gmail.com'
    AND full_name IS DISTINCT FROM 'ASONJA, George';

UPDATE public.administrative_officers
  SET full_name = 'EDEMA, Kayode Smart'
  WHERE email_address = 'edemakayode@gmail.com'
    AND full_name IS DISTINCT FROM 'EDEMA, Kayode Smart';

UPDATE public.administrative_officers
  SET full_name = 'JATUWASE, Igbekele Hosea Esq'
  WHERE email_address = 'jigbekele@gmail.com'
    AND full_name IS DISTINCT FROM 'JATUWASE, Igbekele Hosea Esq';

UPDATE public.administrative_officers
  SET full_name = 'OLADIRAN, Fredrick Olawale'
  WHERE email_address = 'frekolad25@gmail.com'
    AND full_name IS DISTINCT FROM 'OLADIRAN, Fredrick Olawale';

UPDATE public.administrative_officers
  SET full_name = 'AKINSELI, Folawe'
  WHERE email_address = 'folawemifunmi@gmail.com'
    AND full_name IS DISTINCT FROM 'AKINSELI, Folawe';

UPDATE public.administrative_officers
  SET full_name = 'AGEH, Ayodeji'
  WHERE email_address = 'dejiageh@yahoo.com'
    AND full_name IS DISTINCT FROM 'AGEH, Ayodeji';

UPDATE public.administrative_officers
  SET full_name = 'ALE, Joel Olugbenga'
  WHERE email_address = 'joelolushile@gmail.com'
    AND full_name IS DISTINCT FROM 'ALE, Joel Olugbenga';

UPDATE public.administrative_officers
  SET full_name = 'OLUWATOBI-OMITA, Evelyn'
  WHERE email_address = 'tiwaevelyn@gmail.com'
    AND full_name IS DISTINCT FROM 'OLUWATOBI-OMITA, Evelyn';

UPDATE public.administrative_officers
  SET full_name = 'TUNDE-DARAMOLA, Foluke'
  WHERE email_address = 'foldara@gmail.com'
    AND full_name IS DISTINCT FROM 'TUNDE-DARAMOLA, Foluke';

UPDATE public.administrative_officers
  SET full_name = 'AKINYELE, Oluwatosin'
  WHERE email_address = 'akinyeleoluwatosin1996@gmail.com'
    AND full_name IS DISTINCT FROM 'AKINYELE, Oluwatosin';

UPDATE public.administrative_officers
  SET full_name = 'ADETAN, Olubukola Ibironke'
  WHERE email_address = 'bukieadetan1@gmail.com'
    AND full_name IS DISTINCT FROM 'ADETAN, Olubukola Ibironke';

UPDATE public.administrative_officers
  SET full_name = 'OBIDEYI, Olufemi'
  WHERE email_address = 'donfemiobideyi@gmail.com'
    AND full_name IS DISTINCT FROM 'OBIDEYI, Olufemi';

UPDATE public.administrative_officers
  SET full_name = 'AJIBOLA, Abidakun'
  WHERE email_address = 'ajibolaabidakun@mail.com'
    AND full_name IS DISTINCT FROM 'AJIBOLA, Abidakun';

UPDATE public.administrative_officers
  SET full_name = 'KOLAWOLE, Olatope'
  WHERE email_address = 'topekolawoles@gmail.com'
    AND full_name IS DISTINCT FROM 'KOLAWOLE, Olatope';

UPDATE public.administrative_officers
  SET full_name = 'AKINSEYE, Morenikeji'
  WHERE email_address = 'ogungbademorenikeji@gmail.com'
    AND full_name IS DISTINCT FROM 'AKINSEYE, Morenikeji';

UPDATE public.administrative_officers
  SET full_name = 'ONI, Olufunmilayo'
  WHERE email_address = 'phummyoni@gmail.com'
    AND full_name IS DISTINCT FROM 'ONI, Olufunmilayo';

UPDATE public.administrative_officers
  SET full_name = 'OMOPARIOLA, Gbemisola Christianah'
  WHERE email_address = 'gbemmychristianah@gmail.com'
    AND full_name IS DISTINCT FROM 'OMOPARIOLA, Gbemisola Christianah';

UPDATE public.administrative_officers
  SET full_name = 'OLISA, Roland'
  WHERE email_address = 'rolandtolisa@gmail.com'
    AND full_name IS DISTINCT FROM 'OLISA, Roland';

UPDATE public.administrative_officers
  SET full_name = 'APATA, Eric Oluwasinmi'
  WHERE email_address = 'ericoluwasinmi@gmail.com'
    AND full_name IS DISTINCT FROM 'APATA, Eric Oluwasinmi';

UPDATE public.administrative_officers
  SET full_name = 'OMOEKO, Tosin'
  WHERE email_address = 'stevetosin941@gmail.com'
    AND full_name IS DISTINCT FROM 'OMOEKO, Tosin';

UPDATE public.administrative_officers
  SET full_name = 'OMIRIN, Sunday'
  WHERE email_address = 'omirinsundaylade1976@gmail.com'
    AND full_name IS DISTINCT FROM 'OMIRIN, Sunday';

UPDATE public.administrative_officers
  SET full_name = 'OGUNMOLA, Eunice'
  WHERE email_address = 'eunishad2006@gmail.com'
    AND full_name IS DISTINCT FROM 'OGUNMOLA, Eunice';

UPDATE public.administrative_officers
  SET full_name = 'AKINSEYE, Olusola Firopo'
  WHERE email_address = 'akinseyeolusola2018@gmail.com'
    AND full_name IS DISTINCT FROM 'AKINSEYE, Olusola Firopo';

UPDATE public.administrative_officers
  SET full_name = 'LEBILE, Temitope Oluseye'
  WHERE email_address = 'topsyleb@gmail.com'
    AND full_name IS DISTINCT FROM 'LEBILE, Temitope Oluseye';

UPDATE public.administrative_officers
  SET full_name = 'OGUNSUSI, Joseph'
  WHERE email_address = 'josephogunsusi8@gmail.com'
    AND full_name IS DISTINCT FROM 'OGUNSUSI, Joseph';

UPDATE public.administrative_officers
  SET full_name = 'FOLASADE, Ale'
  WHERE email_address = 'folasadeale@gmail.com'
    AND full_name IS DISTINCT FROM 'FOLASADE, Ale';

UPDATE public.administrative_officers
  SET full_name = 'ADU, Olatubosun Joseph'
  WHERE email_address = 'bosunadu24@gmail.com'
    AND full_name IS DISTINCT FROM 'ADU, Olatubosun Joseph';

UPDATE public.administrative_officers
  SET full_name = 'AKOSILE, Oladele Olusegun'
  WHERE email_address = 'segunakosh@gmail.com'
    AND full_name IS DISTINCT FROM 'AKOSILE, Oladele Olusegun';

UPDATE public.administrative_officers
  SET full_name = 'OLAOLU-IKOTO, Abimbola'
  WHERE email_address = 'prettysuzzie30@gmail.com'
    AND full_name IS DISTINCT FROM 'OLAOLU-IKOTO, Abimbola';

UPDATE public.administrative_officers
  SET full_name = 'ADEMOLA, Abiola Ebiwonjumi'
  WHERE email_address = 'ebiwonjumiademola@gmail.com'
    AND full_name IS DISTINCT FROM 'ADEMOLA, Abiola Ebiwonjumi';

UPDATE public.administrative_officers
  SET full_name = 'ISIMIJOLA, Akeem'
  WHERE email_address = 'femiisgodly@gmail.com'
    AND full_name IS DISTINCT FROM 'ISIMIJOLA, Akeem';

UPDATE public.administrative_officers
  SET full_name = 'AJAGUNNA, Adebola Akeem'
  WHERE email_address = 'adebola.ajagunna@gmail.com'
    AND full_name IS DISTINCT FROM 'AJAGUNNA, Adebola Akeem';

-- Verify: show any names that still don't match the SURNAME, Other Names pattern
SELECT id, email_address, full_name
FROM public.administrative_officers
WHERE full_name NOT SIMILAR TO '[A-Z ,-]+,? [A-Za-z ]+'
ORDER BY full_name;

COMMIT;
