const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabaseUrl = 'https://ksejvfuqbwlmrttcgzye.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzZWp2ZnVxYndsbXJ0dGNnenllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI5MzMyMzUsImV4cCI6MjAyODUwOTIzNX0.4n6IOGT3GWyxNkZFcn4Cj9j9aFkp9ZqF3h4Kz0mGp9E';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const coaches = [
    {
        name: 'Võ Hoàng Nhật Sơn',
        hourly_rate: 250000,
        trial_rate: 50000,
        rating: 5.0,
        students_count: 8,
        experience: 5,
        is_featured: true,
        schedule: {
            'T2-T6': '16:00 - 20:00',
            'T6': '07:00 - 08:30'
        },
        additional_schedule: '+1 lịch khác'
    },
    {
        name: 'Văn Huỳnh Phương Huy',
        hourly_rate: 230000,
        trial_rate: 50000,
        rating: 5.0,
        students_count: 6,
        experience: 4,
        is_featured: true,
        schedule: {
            'T3': '10:00 - 20:00',
            'T5': '18:00 - 20:00'
        },
        additional_schedule: '+2 lịch khác'
    },
    {
        name: 'Trần Thị Ngọc Thơ',
        hourly_rate: 200000,
        trial_rate: 50000,
        rating: 5.0,
        students_count: 5,
        experience: 3,
        is_featured: true,
        schedule: {
            'T2, T4, T6': '7:00, 8:00, 9:00, 9:30',
            'T3, T7': '6:00 - 7:30'
        },
        additional_schedule: null
    },
    {
        name: 'Võ Kỳ Long',
        hourly_rate: 250000,
        trial_rate: 50000,
        rating: 5.0,
        students_count: 7,
        experience: 6,
        is_featured: false,
        schedule: {
            'T2, T4, T6': '17:30 - 20:30',
            'T7': '09:30 - 16:30'
        },
        additional_schedule: '+1 lịch khác'
    }
];

async function addCoaches() {
    try {
        console.log('Đang thêm HLV vào database...');
        
        const { data, error } = await supabase
            .from('coaches')
            .insert(coaches);
        
        if (error) {
            console.error('Lỗi khi thêm HLV:', error);
            process.exit(1);
        }
        
        console.log('✅ Thêm HLV thành công!');
        console.log(`Đã thêm ${coaches.length} HLV vào database`);
        process.exit(0);
    } catch (err) {
        console.error('Lỗi:', err);
        process.exit(1);
    }
}

addCoaches();
