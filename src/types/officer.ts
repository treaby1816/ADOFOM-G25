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
    is_admin?: boolean;
    is_approved?: boolean;
    needs_password_change?: boolean;
    created_at?: string;
}
