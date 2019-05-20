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
    AsyncStorage
} from "react-native";

// idTipoUsuarioNavigation

import api from "../../services/api";

export default class ListaUsuarios extends Component {

    static navigationOptions = {
        title: 'Usuários'
    };

    constructor(props) {
        super(props);
        this.state = {
            listaUsuarios: [],
            tipoUsuario: "",
            token: ""
        };
    }

    logout = async () => {
        try {
            await AsyncStorage.removeItem("userToken").then((token) => {
                this.setState({ token: token }, () => {
                    //console.warn(token)
                    this.props.navigation.navigate("AuthStack");
                });
            });
        }
        catch (error) {
            console.warn(error)
        }
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
                this.setState({ tipoUsuario: jwtDecode(value).tipoUsuario });
                this.setState({ token: value });
                // Alert.alert(this.state.tipoUsuario)
            }
        } catch (error) { }
    };

    carregarUsuarios = async () => {
        try {
            const userToken = this.state.token;
            const resposta = await api.get("/usuarios", {
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
                    <TouchableOpacity onPress={this.logout}>
                        <Text>{"Sair".toUpperCase()}</Text>
                    </TouchableOpacity>
                </View>

                <View >
                    <FlatList
                        data={this.state.listaUsuarios}
                        keyExtractor={item => item.id}
                        renderItem={this.renderizaItem}
                    />
                </View>

                <View>
                    <TouchableOpacity onPress={this.logout}>
                        <Text>{"Sair".toUpperCase()}</Text>
                    </TouchableOpacity>
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