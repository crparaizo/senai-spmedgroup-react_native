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

export default class ListaClinicas extends Component {

    static navigationOptions = {
        title: 'Clínicas'
    };

    constructor(props) {
        super(props);
        this.state = {
            listaClinicas: [],
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
                this.carregarClinicas();
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

    carregarClinicas = async () => {
        try {
            const userToken = this.state.token;
            const resposta = await Api.get("/clinicas", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "bearer " + userToken //COLOCAR ESPAÇO ENTRE O BEARER E O TOKEN
                }
            });
            const dadosDaApi = resposta.data;
            this.setState({ listaClinicas: dadosDaApi });
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
                        <Text>{"Clínicas".toUpperCase()}</Text>
                    </View>
                    <View />
                </View>

                <View >
                    <FlatList
                        data={this.state.listaClinicas}
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
                <Text >Nome Fantasia: {item.nomeFantasia}</Text>
                <Text >Horário de Funcionamento: {item.horarioFuncionamento}</Text>
                <Text >CNPJ: {item.cnpj}</Text>
                <Text >Razão Social: {item.razaoSocial}</Text>
                <Text >Endereço: {item.endereco}</Text>
            </View>
        </View>
    );
};