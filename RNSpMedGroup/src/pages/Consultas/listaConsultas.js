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

import moment from 'moment';

import Api from "../../services/Api";

export default class ListaConsultas extends Component {

    static navigationOptions = {
        title: 'Consultas'
    };

    constructor(props) {
        super(props);
        this.state = {
            listaConsultas: [],
            listaMedicos: [],
            listaProntuarios: [],
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
                this.carregarConsultas();
                this.carregarProntuarios();
                this.carregarMedicos();
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

    carregarMedicos = async () => {
        try {
            const userToken = this.state.token;
            const resposta = await Api.get("/medicos", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "bearer " + userToken //COLOCAR ESPAÇO ENTRE O BEARER E O TOKEN
                }
            });
            const dadosDaApi = resposta.data;
            this.setState({ listaMedicos: dadosDaApi });
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
                <Text >Prontuário: {item.idProntuarioNavigation.idUsuarioNavigation.nome}</Text>
                <Text >Médico: {item.idMedicoNavigation.idUsuarioNavigation.nome}</Text>
                <Text >Data: {moment(item.dataHoraConsulta).format("DD/MM/YYYY - HH:mm")}</Text>
                {/* <Text >Data: {item.dataHoraConsulta}</Text> */}
                <Text >Situação: {item.idSituacaoNavigation.nome}</Text>
                <Text >Descrição: {item.descricao}</Text>
            </View>
        </View>
    );
}