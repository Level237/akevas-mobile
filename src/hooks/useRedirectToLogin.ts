import { useRouter } from 'expo-router';

type RedirectOptions = {
    redirectUrl: string;
    productIds?: (number | string)[] | string | null;
    [key: string]: any; // Pour accepter d'autres params comme "s": "1"
};

export const useRedirectToLogin = () => {
    const router = useRouter();

    const redirectToLogin = (options: RedirectOptions) => {
        const { redirectUrl, productIds, ...restParams } = options;

        // Préparation des paramètres
        const params: Record<string, any> = {
            // On passe l'URL de retour
            redirect: redirectUrl || '/(home)',

            // On passe les IDs des produits (on peut passer un tableau directement en RN)
            // Note : On convertit en string si ce sont des nombres pour éviter les soucis de sérialisation
            productIds: productIds ? JSON.stringify(productIds) : null,

            // On étend avec le reste des paramètres (s, etc.)
            ...restParams
        };

        // Redirection vers Login (replace pour ne pas revenir en arrière)
        router.replace({
            pathname: '/login',
            params: params
        });
    };

    return { redirectToLogin };
};