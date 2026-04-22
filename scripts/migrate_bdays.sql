-- Database Migration to convert 'MM/DD' and 'MM-DD' uniformly to 'Month/Day' (e.g. '05-27' to 'May/27')
UPDATE administrative_officers
SET birth_month_day = 
  CASE 
    WHEN birth_month_day ~ '^[0-9]{1,2}[/-][0-9]{1,2}$' THEN
      (
        CASE CAST(split_part(replace(birth_month_day, '-', '/'), '/', 1) AS INT)
          WHEN 1 THEN 'January'
          WHEN 2 THEN 'February'
          WHEN 3 THEN 'March'
          WHEN 4 THEN 'April'
          WHEN 5 THEN 'May'
          WHEN 6 THEN 'June'
          WHEN 7 THEN 'July'
          WHEN 8 THEN 'August'
          WHEN 9 THEN 'September'
          WHEN 10 THEN 'October'
          WHEN 11 THEN 'November'
          WHEN 12 THEN 'December'
          ELSE split_part(replace(birth_month_day, '-', '/'), '/', 1)
        END
      ) || '/' || CAST(split_part(replace(birth_month_day, '-', '/'), '/', 2) AS INT)
    ELSE birth_month_day
  END
WHERE birth_month_day ~ '^[0-9]{1,2}[/-][0-9]{1,2}$';
