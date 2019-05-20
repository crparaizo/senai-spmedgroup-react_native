import React, { Component } from "react";
import jwtDecode from 'jwt-decode';

import {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    FlatList,
    Alert,
    AsyncStorage
} from "react-native";

export default class Sair extends Component {
    static navigationOptions = {
        header: null
    };

    // constructor(props) {
    //     super(props);
    //     this.state = {
    //     };
    // }

    // componentDidMount() {
    // };

    direcionarPage = async () => {
            this.props.navigation.navigate("AuthStack");
    }

    render() {
        return (
            <View >
                <View>
                    <Text >{"Obrigado por utilizar nossos serviços!".toUpperCase()}</Text>
                    <TouchableOpacity onPress={this.direcionarPage}>
                        <Text >{"Login".toUpperCase()}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.direcionarPage}>
                        <Text >{"Login".toUpperCase()}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
