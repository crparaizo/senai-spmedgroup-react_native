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

export default class EsperarAuth extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            token: "",
            tipoUsuario: ""
        };
    }

    componentDidMount() {
        this.carregaToken();
    };

    carregaToken = async () => {
        await AsyncStorage.getItem("userToken").then((token) => {
            this.setState({ token: token }, () => {
                this.carregarPage();
                this.buscarDados();
            });
        });
    };

    buscarDados = async () => {
        try {
            const value = await AsyncStorage.getItem("userToken");
            if (value !== null) {
                this.setState({ tipoUsuario: jwtDecode(value).tipoUsuario });
                this.setState({ token: value });
                // Alert.alert(this.state.tipoUsuario)
            }
        } catch (error) { }
    };


    carregarPage = async () => {

        // let decode = jwtDecode(token);
        const userToken = this.state.token;
        let decode = jwtDecode(userToken);
        // console.warn(userToken)
        if (decode.tipoUsuario === "Administrador") {
            this.props.navigation.navigate("MainNavigator");
        } else if (decode.tipoUsuario === "Medico") {
            this.props.navigation.navigate("MedNavigator");
        } else {
            this.props.navigation.navigate("PacNavigator");
        }

    }

    render() {
        return (
            <View >
                <View>
                    <Text >{"Carregando...Espere um pouco!!!!!!!!".toUpperCase()}</Text>
                    <TouchableOpacity onPress={this.carregarPage}>
                        <Text >{"VAI".toUpperCase()}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
