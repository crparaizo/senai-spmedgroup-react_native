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

export default class ListaMedicos extends Component {

    static navigationOptions = {
        title: 'Médicos'
    };

    constructor(props) {
        super(props);
        this.state = {
            listaMedicos: [],
            listaUsuarios: [],
            listaEspecialidades: [],
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
                this.carregarMedicos();
                this.carregarUsuarios();
                this.carregarEspecialidades();
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

    carregarEspecialidades = async () => {
        try {
            const userToken = this.state.token;
            const resposta = await Api.get("/especialidades", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "bearer " + userToken //COLOCAR ESPAÇO ENTRE O BEARER E O TOKEN
                }
            });
            const dadosDaApi = resposta.data;
            this.setState({ listaEspecialidades: dadosDaApi });
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
                        <Text>{"Médicos".toUpperCase()}</Text>
                    </View>
                    <View />
                </View>

                <View >
                    <FlatList
                        data={this.state.listaMedicos}
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
                <Text >Médico: {item.idUsuarioNavigation.nome}</Text>
                <Text >CRM: {item.crm}</Text>
                <Text >Especialidade: {item.idEspecialidadeNavigation.nome}</Text>
                <Text >Clínica: {item.idClinicaNavigation.nomeFantasia}</Text>
                <Text >Descrição: {item.descricao}</Text>
            </View>
        </View>
    );
};