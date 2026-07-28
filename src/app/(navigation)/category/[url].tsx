import CategoryDetailScreen from '@/features/category/screens/CategoryDetailScreen';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function CategoryRoute() {
    const params = useLocalSearchParams();
    
    return (
        <CategoryDetailScreen 
            url={params.url as string} 
            name={params.name as string} 
            image={params.image as string} 
            description={params.description as string}
        />
    );
}
