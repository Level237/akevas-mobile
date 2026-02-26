
import { FlatList, StyleSheet, View } from 'react-native';


const SkeletonCategory = () => (
    <View style={styles.container}>

        <FlatList
            data={[1, 2, 3, 4]}
            keyExtractor={(item) => item.toString()}
            numColumns={2}
            renderItem={({ item }) => (
                <View key={item} style={styles.category}>
                    <View style={styles.categoryImage} />
                </View>
            )}
            contentContainerStyle={styles.gridContent}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
        />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    gridContent: {
        padding: 16,
        paddingBottom: 40,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    category: {
        width: '48%',
        aspectRatio: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    categoryImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#e5e7eb', // Gris clair
        //animation: 'pulse 1.5s infinite',
    },
});

export default SkeletonCategory;
