import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';
import { FlatList, ImageBackground, StyleSheet, View } from 'react-native';
import CategoryGridTile from '../components/CategoryGridTile';
import { useGlobalContext } from '../context/globalContext';

function CategoryScreen({ navigation }) {

  const { fetchCategories } = useGlobalContext();
  const [categories, setCategories] = useState([]);

  const route = useRoute();
  const userId = route.params.collegeID;

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  function renderCategoryItem(itemObject) {
    function pressHandler() {
      navigation.navigate("MealDescription", {
        CategoryId: itemObject.item.id
      });
    }

    return (
      <CategoryGridTile
        title={itemObject.item.title}
        onPress={pressHandler}
        color={itemObject.item.color}
      />
    );
  }

  return (
    <ImageBackground source={require("../assets/images/psg.jpg")} style={styles.rootContainer} imageStyle={styles.backgroundImage}>
      <View style={styles.rootContainer}>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={renderCategoryItem}
          numColumns={2}
        />
      </View>
    </ImageBackground>
  );
}

export default CategoryScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.5,
  },
});
