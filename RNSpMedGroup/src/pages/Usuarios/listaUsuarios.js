import React, { Component } from "react";

import {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    FlatList,
    AsyncStorage
} from "react-native";

// idTipoUsuarioNavigation

import Api from "../../services/Api";

export default class ListaUsuarios extends Component {

    static navigationOptions = {
        title: 'Usuários'
    };

    constructor(props) {
        super(props);
        this.state = {
            listaUsuarios: [],
            IdUsuario: "",
            token: ""
        };
    }

    componentDidMount() {
        this.carregaToken();
    };

    carregaToken = async () => {
        await AsyncStorage.getItem("userToken").then((token) => {
            this.setState({ token: token }, () => {
                this.carregarUsuarios();
                this.buscarDados();
            });
        });
    };

    buscarDados = async () => {
        try {
            const value = await AsyncStorage.getItem("userToken");
            if (value !== null) {
                this.setState({ IdUsuario: jwt(value).IdUsuario });
                this.setState({ token: value });
            }
        } catch (error) { }
    };


    carregarUsuarios = async () => {
        try {
            const userToken = this.state.token;
            const resposta = await Api.get("/usuarios", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "bearer " + userToken //COLOCAR ESPAÇO ENTRE O BEARER E O TOKEN
                }
            });
            const dadosDaApi = resposta.data;
            this.setState({ listaUsuarios: dadosDaApi });
        } catch (error) {
            alert('ERROR ' + error);
        }
    };

    render() {
        return (
            // SafeAreaView
            <View >
                <View>
                    <View>
                        <Text>{"Usuários".toUpperCase()}</Text>
                    </View>
                    <View />
                </View>

                <View >
                    <FlatList
                        data={this.state.listaUsuarios}
                        keyExtractor={item => item.id}
                        renderItem={this.renderizaItem}
                    />
                </View>
            </View>
        );
    }

    renderizaItem = ({ item }) => (
        <View >
            <View>
                <Text >Nome: {item.nome}</Text>
                <Text >Email: {item.email}</Text>
                <Text >Senha: {item.senha}</Text>
                <Text >Tipo Usuário: {item.idTipoUsuarioNavigation.nome}</Text>
            </View>
        </View>
    );

};