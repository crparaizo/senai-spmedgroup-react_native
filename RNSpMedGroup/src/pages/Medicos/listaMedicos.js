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

import api from "../../services/api";

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
                this.setState({ tipoUsuario: jwtDecode(value).tipoUsuario });
                this.setState({ token: value });
                // Alert.alert(this.state.tipoUsuario)
            }
        } catch (error) { }
    };

    carregarMedicos = async () => {
        try {
            const userToken = this.state.token;
            const resposta = await api.get("/medicos", {
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
            const resposta = await api.get("/usuarios", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "bearer " + userToken //COLOCAR ESPAÇO ENTRE O BEARER E O TOKEN
                }
            });
            const dadosDaapi = resposta.data;
            this.setState({ listaUsuarios: dadosDaapi });
        } catch (error) {
            alert('ERROR ' + error);
        }
    };

    carregarEspecialidades = async () => {
        try {
            const userToken = this.state.token;
            const resposta = await api.get("/especialidades", {
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
                    <TouchableOpacity onPress={this.logout}>
                        <Text>{"Sair".toUpperCase()}</Text>
                    </TouchableOpacity>
                </View>

                <View >
                    <FlatList
                        data={this.state.listaMedicos}
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
                <Text >Médico: {item.idUsuarioNavigation.nome}</Text>
                <Text >CRM: {item.crm}</Text>
                <Text >Especialidade: {item.idEspecialidadeNavigation.nome}</Text>
                <Text >Clínica: {item.idClinicaNavigation.nomeFantasia}</Text>
                <Text >Descrição: {item.descricao}</Text>
            </View>
        </View>
    );
};