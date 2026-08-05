import OtpVerificationScreen from '@/features/auth/screens/OtpVerificationScreen';
import { useLocalSearchParams } from 'expo-router';

export default function ForgotPasswordOtpPage() {
    const params = useLocalSearchParams();
    return <OtpVerificationScreen email={params.email as string} />;
}
