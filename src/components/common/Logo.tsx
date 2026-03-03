import { images } from '@/constants/images';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';


export default function Logo() {
    return (
        <View>
            <Image source={images.logo} style={styles.logo} />
        </View>
    );
}

const styles = StyleSheet.create({
    logo: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    }
});