export type NotificationType = 'commandes' | 'promos' | 'alertes';

export type Notification = {
    id: string;
    type: NotificationType;
    title: string;
    description: string;
    timestamp: string;
    isRead: boolean;
};

export type FilterType = 'Toutes' | 'Commandes' | 'Promos' | 'Alertes';

export const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        type: 'commandes',
        title: 'Commande confirmée',
        description: 'Votre commande #1234 a été confirmée et est en cours de préparation.',
        timestamp: 'Il y a 2h',
        isRead: false,
    },
    {
        id: '2',
        type: 'promos',
        title: 'Offre exclusive !',
        description: 'Bénéficiez de -20% sur toute la collection été avec le code SUMMER20.',
        timestamp: 'Il y a 5h',
        isRead: false,
    },
    {
        id: '3',
        type: 'alertes',
        title: 'Alerte sécurité',
        description: 'Une nouvelle connexion a été détectée sur votre compte depuis un nouvel appareil.',
        timestamp: 'Hier',
        isRead: true,
    },
    {
        id: '4',
        type: 'commandes',
        title: 'Livraison en cours',
        description: 'Le livreur est en route avec votre colis. Préparez-vous à le recevoir !',
        timestamp: 'Il y a 10 min',
        isRead: false,
    }
];
