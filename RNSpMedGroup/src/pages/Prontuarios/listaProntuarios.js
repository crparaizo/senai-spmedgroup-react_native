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

import Api from "../../services/Api";

export default class ListaProntuarios extends Component {

    static navigationOptions = {
        title: 'Prontuários'
    };

    constructor(props) {
        super(props);
        this.state = {
            listaProntuarios: [],
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
                this.carregarProntuarios();
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

    carregarProntuarios = async () => {
        try {
            const userToken = this.state.token;
            const resposta = await Api.get("/prontuarios", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "bearer " + userToken //COLOCAR ESPAÇO ENTRE O BEARER E O TOKEN
                }
            });
            const dadosDaApi = resposta.data;
            this.setState({ listaProntuarios: dadosDaApi });
        } catch (error) {
            alert('ERROR ' + error);
        }
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
                        <Text>{"Prontuários".toUpperCase()}</Text>
                    </View>
                    <View />
                </View>

                <View >
                    <FlatList
                        data={this.state.listaProntuarios}
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
                <Text >Paciente: {item.idUsuarioNavigation.nome}</Text>
                <Text >RG: {item.rg}</Text>
                <Text >CPF: {item.cpf}</Text>
                <Text >Data Nascimento: {item.dataNascimento}</Text>
                <Text >Telefone: {item.telefone}</Text>
                <Text >Endereço: {item.endereco}</Text>
            </View>
        </View>
    );

};