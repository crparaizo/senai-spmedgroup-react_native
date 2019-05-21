import React, { Component } from "react";
import jwtDecode from 'jwt-decode';

import Icon from 'react-native-vector-icons/Ionicons';

import {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    FlatList,
    AsyncStorage,
    SafeAreaView
} from "react-native";

import moment from 'moment';

import api from "../../services/api";

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
            tipoUsuario: "",
            token: ""
        };
    }

    logout = async () => {
        try {
            await AsyncStorage.removeItem("userToken").then((token) => {
                this.setState({ token: token }, () => {
                    //console.warn(token)
                    this.props.navigation.navigate("Saida");
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
                //console.warn(token)
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
                this.setState({ tipoUsuario: jwtDecode(value).tipoUsuario });
                this.setState({ token: value });
                // Alert.alert(this.state.tipoUsuario)
            }
        } catch (error) { }
    };

    carregarConsultas = async () => {
        try {
            const userToken = this.state.token;
            const resposta = await api.get("/consultas", {
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
            const resposta = await api.get("/prontuarios", {
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

    render() {
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <View >
                    <View style={styles.header}>
                        <Icon size={30} name="md-menu" style={styles.header__icon} onPress={this.logout}></Icon>
                        <Text style={styles.header__texto}>{"Consultas".toUpperCase()}</Text>
                        <Icon size={30} name="md-power" style={styles.header__icon} onPress={this.logout}></Icon>
                        {/* <TouchableOpacity style={styles.titulo_botao} onPress={this.logout}>
                                <Image source={require("../../assets/img/iconfinder_060_Off_183189.png")} />
                                <Text>{"Sair".toUpperCase()}</Text>
                            </TouchableOpacity> */}
                    </View>

                    <View style={styles.consultasLista}>
                        <FlatList style={styles.consultasLista__flatlist}
                            data={this.state.listaConsultas}
                            keyExtractor={item => item.id}
                            renderItem={this.renderizaItem}
                        />
                    </View>

                    <View style={styles.rodape}>
                        <TouchableOpacity style={styles.rodape__botao} onPress={this.logout}>
                            <Text style={styles.rodape__texto}>{"Sair".toUpperCase()}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    renderizaItem = ({ item }) => (
        <View >
            <View style={styles.conteudo}>
                <View style={styles.conteudo__topo}>
                    <Text >Data: {moment(item.dataHoraConsulta).format("DD/MM/YYYY - HH:mm")}</Text>
                </View>
                <View style={styles.conteudo__corpo}>
                    <Text >Situação: {item.idSituacaoNavigation.nome}</Text>
                    <Text >Prontuário: {item.idProntuarioNavigation.idUsuarioNavigation.nome}</Text>
                    <Text >Médico: {item.idMedicoNavigation.idUsuarioNavigation.nome}</Text>
                    <Text >Descrição: {item.descricao}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    safeAreaView: {
        flex: 1,
        backgroundColor: 'rgba(234,202,169,0.45)'
    },
    header: {
        paddingTop: "7%",
        flex: 1,
        flexDirection: 'row',
        // height: 30,
        // width: 100 , 

        alignItems: 'center',
        justifyContent: 'space-around'


    },
    header__texto: {

    },
    header__icon: {

    },
    consultasLista: {
        marginTop: "10%"

    },
    consultasLista__flatlist: {

    },
    rodape: {

    },
    rodape__botao: {

    },
    rodape__texto: {

    },
    conteudo: {

    },
    conteudo__topo: {

    },
    conteudo__corpo: {

    },
    bold: { fontWeight: 'bold' },
    italic: { fontStyle: 'italic' }
});