import { useRoute } from "@react-navigation/native";
import { useEffect, useLayoutEffect, useState } from "react";
import { FlatList, ImageBackground, StyleSheet, View } from "react-native";
import MealItem from "../components/MealItem";
import { useGlobalContext } from "../context/globalContext";

function MealsDetailsScreen({ navigation }) {
    const route = useRoute();
    const catId = route.params.CategoryId;

    const [meals, setMeals] = useState([]);
    
    const { fetchMealsByCategory, addToCart } = useGlobalContext(); // Adjusted to use addToCart

    useEffect(() => {
        const fetchMeals = async () => {
            const mealsData = await fetchMealsByCategory(catId);
            setMeals(mealsData);
        };
        fetchMeals();
    }, [catId]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: route.params.CategoryTitle,
        });
    }, [catId, navigation]);

    const handleUpdateCart = (mealId, quantity) => {
        addToCart(mealId, quantity); // Use addToCart instead
    };

    function renderMealItems(itemObject) {
        const item = itemObject.item;
        const MealItemProps = {
            id: item.id,
            title: item.title,
            imageURL: item.imageUrl,
            price: item.price,
            updateCart: handleUpdateCart,
        };
        return <MealItem {...MealItemProps} />;
    }

    return (
        <ImageBackground source={require("../assets/images/psg.jpg")} style={styles.rootContainer} imageStyle={styles.backgroundImage}>
            <View style={styles.rootContainer}>
                <FlatList
                    data={meals}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMealItems}
                />
            </View>
        </ImageBackground>
    );
}

export default MealsDetailsScreen;

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        paddingHorizontal: 3,
    },
    backgroundImage: {
        opacity: 0.5,
    },
});
