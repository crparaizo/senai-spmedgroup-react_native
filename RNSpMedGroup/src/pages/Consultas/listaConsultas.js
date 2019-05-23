import React, { Component } from "react";
import jwtDecode from 'jwt-decode';

import Icon from 'react-native-vector-icons/Ionicons';

import {
    StyleSheet,
    View,
    Text,
    FlatList,
    AsyncStorage} from "react-native";

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

    render() {
        return (
            <View style={styles.mainConsulta}>
                {/* <SafeAreaView style={styles.safeAreaViewTop} /> */}
                {/* <SafeAreaView style={styles.safeAreaView} > */}
                <View style={styles.headerConsulta}>
                    <Text style={[styles.headerConsulta__texto, styles.bold, styles.italic]}>{"Consultas".toUpperCase()}</Text>
                    <Icon size={30} name="md-exit" style={styles.headerConsulta__icon} onPress={this.logout}></Icon>
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

                <View style={styles.rodapeConsulta}>
                    <Text style={[styles.rodapeConsulta__texto, styles.italic]} >SPMedicalGroup</Text>
                </View>
                {/* </SafeAreaView> */}
            </View>
        );
    }

    renderizaItem = ({ item }) => (
            <View style={styles.conteudoConsulta}>
                <View style={styles.conteudoConsulta__topo}>
                    <Text style={styles.conteudoConsulta__topoTexto} >Data: {moment(item.dataHoraConsulta).format("DD/MM/YYYY - HH:mm")}</Text>
                </View>
                <View style={styles.conteudoConsulta__corpo}>
                    <Text style={styles.conteudoConsulta__corpoTexto} >Situação: {item.idSituacaoNavigation.nome}</Text>
                    <Text style={styles.conteudoConsulta__corpoTexto} >Prontuário: {item.idProntuarioNavigation.idUsuarioNavigation.nome}</Text>
                    <Text style={styles.conteudoConsulta__corpoTexto} >Médico: {item.idMedicoNavigation.idUsuarioNavigation.nome}</Text>
                    <Text style={styles.conteudoConsulta__corpoTexto} >Descrição: {item.descricao}</Text>
                </View>
            </View>
    );
}


const styles = StyleSheet.create({
    main: {
        // height: '100%'
    },
    // safeAreaViewTop: {
    //     flex: 1,
    //     backgroundColor: '#C72525',
    // },
    // safeAreaViewBottom: {
    //     flex: 1,
    //     backgroundColor: '#C72525',
    // },
    headerConsulta: {
        flexDirection: 'row',
        height: 70,
        //flex: 1,

        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(231,107,107,0.59)'
    },
    headerConsulta__texto: {
        fontSize: 30,
        color: '#707070'
    },
    headerConsulta__icon: {

    },
    consultasLista: {
        borderTopColor: 'black',
        borderTopWidth: 1,
    },
    consultasLista__flatlist: {
        height: 500 //Diminuir tamanho da Lista para apareer o que tem embaixo disso
    },
    rodapeConsulta: {
        alignItems: 'center',
        padding: '2%',
        color: 'rgba(112,112,112,0.47)',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#d6d7da',
    },
    rodapeConsulta__texto: {

    },
    conteudoConsulta: {
        // height:, // teste
        marginLeft: '20%',
        marginBottom: 20,
        marginRight: '20%'
    },
    conteudoConsulta__topo: {
        alignItems: 'center',
        marginTop: '10%',
        backgroundColor: 'rgba(231,107,107,0.59)',
        color: '#CF1313'
    },
    conteudoConsulta__topoTexto: {
        color: '#CF1313'
    },
    conteudoConsulta__corpo: {
        backgroundColor: 'rgba(246,216,232,0.5)',
        color: '#B1458A'
    },
    conteudoConsulta__corpoTexto: {
        color: '#B1458A'
    },
    bold: { fontWeight: 'bold' },
    italic: { fontStyle: 'italic' }
});