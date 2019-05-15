import React, { Component } from "react";

import { AsyncStorage } from 'react-native';

import {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    FlatList
} from "react-native";

import Api from "../../services/Api";

export default class ListaConsultas extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listaConsultas: [],
            IdUsuario: "",
            token: ""
        };
    }

    componentDidMount() {
        this.carregaToken();

        // this.carregarConsultas();
    };

    carregaToken = async () => {
        await AsyncStorage.getItem("userToken").then((token) => {
            this.setState({ token: token }, () => {
                this.carregarConsultas();
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

    carregarConsultas = async () => {
        try {
            const userToken = this.state.token;
            const resposta = await Api.get("/consultas", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "bearer " + userToken //COLOCAR ESPAÇO ENTRE O BEARER E O TOKEN
                }
            });
            const dadosDaApi = resposta.data;
            this.setState({ listaConsultas: dadosDaApi });
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
                        <Text>{"Consultas".toUpperCase()}</Text>
                    </View>
                    <View />
                </View>

                <View >
                    <FlatList
                        data={this.state.listaConsultas}
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
                <Text >IdProntuario: {item.idProntuario}</Text>
                <Text >IdMedico: {item.idMedico}</Text>
                <Text >Data: {item.dataHoraConsulta}</Text>
                <Text >idSituacao: {item.idSituacao}</Text>
                <Text >Descricao: {item.descricao}</Text>
            </View>
        </View>
    );
}