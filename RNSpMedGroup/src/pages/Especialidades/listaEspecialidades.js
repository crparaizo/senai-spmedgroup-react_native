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

export default class ListaEspecialidades extends Component {

    static navigationOptions = {
        title: 'Especialidades'
    };

    constructor(props) {
        super(props);
        this.state = {
            listaEspecialidades: [],
            tipoUsuario: "",
            token: ""
        };
    }

    logout = async () => {
        try{
            await AsyncStorage.removeItem("userToken").then((token) => {
                this.setState({ token: token }, () => {
                    //console.warn(token)
                    this.props.navigation.navigate("AuthStack");
                });
            });
        } 
        catch(error){
            console.warn(error)
        }
    }

    componentDidMount() {
        this.carregaToken();

        // this.carregarEspecialidades();
    };

    carregaToken = async () => {
        await AsyncStorage.getItem("userToken").then((token) => {
            this.setState({ token: token }, () => {
                this.carregarEspecialidades();
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
                        <Text>{"Especialidades".toUpperCase()}</Text>
                    </View>
                    <TouchableOpacity onPress={this.logout}>
                        <Text>{"Sair".toUpperCase()}</Text>
                    </TouchableOpacity>
                </View>

                <View >
                    <FlatList
                        data={this.state.listaEspecialidades}
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
            </View>
        </View>
    );
};