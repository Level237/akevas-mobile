import Onboarding from '../components/Onboarding';

export default function OnboardingScreen() {
    // If we needed to check if onboarding was already seen, 
    // we would do it here and return <Redirect href="/(tabs)" />

    return (
        <>

            <Onboarding />
        </>
    );
}
