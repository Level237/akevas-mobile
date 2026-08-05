import ResetPasswordScreen from '@/features/auth/screens/ResetPasswordScreen';
import { useLocalSearchParams } from 'expo-router';

export default function ResetPasswordPage() {
    const params = useLocalSearchParams();
    return (
        <ResetPasswordScreen
            email={params.email as string}
            temp_token={params.temp_token as string}
        />
    );
}
