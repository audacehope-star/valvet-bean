// Tailwind CDN configuration - must load AFTER the Tailwind CDN script
tailwind.config = {
    theme: {
        extend: {
            colors: {
                espresso: '#231B19',
                cream: '#FBF9F5',
                caramel: '#C68B59',
                terracotta: '#A85A32',
                sage: '#6D8273',
                warmbeige: '#EFECE6'
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['"Plus Jakarta Sans"', 'sans-serif']
            }
        }
    }
};
