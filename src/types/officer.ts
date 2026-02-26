export interface Officer {
    id: string;
    full_name: string;
    email_address: string;
    photo_url: string;
    photo_position?: string; // e.g. 'object-top', 'object-center', 'object-bottom'
    current_mda: string;
    grade_level: string;
    lga: string;
    birth_month_day: string;
    phone_number: string;
    hobbies: string;
    about_me: string;
}
