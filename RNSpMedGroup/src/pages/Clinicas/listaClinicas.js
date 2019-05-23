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
    AsyncStorage,
} from "react-native";

import Icon from 'react-native-vector-icons/Ionicons';


import api from "../../services/api";

export default class ListaClinicas extends Component {

    static navigationOptions = {
        title: 'Clínicas'
    };

    constructor(props) {
        super(props);
        this.state = {
            listaClinicas: [],
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
                this.carregarClinicas();
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
                // Alert.alert(this.state.tipoClinica)
            }
        } catch (error) { }
    };

    carregarClinicas = async () => {
        try {
            const userToken = this.state.token;
            const resposta = await api.get("/clinicas", {
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
                <View style={styles.headerClinica}>
                        <Text style={[styles.headerClinica__texto, styles.bold, styles.italic]}>{"Clínicas".toUpperCase()}</Text>
                        <Icon size={30} name="md-exit" style={styles.headerClinica__icon} onPress={this.logout}></Icon>
                </View>
                </View>

                <View style={styles.clinicasLista} >
                    <FlatList style={styles.clinicasLista__flatlist}
                        data={this.state.listaClinicas}
                        keyExtractor={item => item.id}
                        renderItem={this.renderizaItem}
                    />
                </View>

                <View style={styles.rodapeClinica}>
                    <Text style={[styles.rodapeClinica__texto, styles.italic]} >SPMedicalGroup</Text>
                </View>
            </View>
        );
    }

    renderizaItem = ({ item }) => (
        <View style={styles.conteudoClinica} >
            <View style={styles.conteudoClinica__topo}>
                <Text style={styles.conteudoClinica__topoTexto} >Nome Fantasia: {item.nomeFantasia}</Text>
            </View>
            <View style={styles.conteudoClinica__corpo}>
                <Text style={styles.conteudoClinica__corpoTexto} >Horário de Funcionamento: {item.horarioFuncionamento}</Text>
                <Text style={styles.conteudoClinica__corpoTexto} >CNPJ: {item.cnpj}</Text>
                <Text style={styles.conteudoClinica__corpoTexto}>Razão Social: {item.razaoSocial}</Text>
                <Text style={styles.conteudoClinica__corpoTexto}>Endereço: {item.endereco}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        //height: '100%'
    },
    headerClinica: {
        flexDirection: 'row',
        height: 70,

        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#B2A8F1'
    },
    headerClinica__texto: {
        fontSize: 30,
        color: '#707070'
    },
    headerClinica__icon: {

    },
    clinicasLista: {
        borderTopColor: 'black',
        borderTopWidth: 1,
    },
    clinicasLista__flatlist: {
        height: 500 //Diminuir tamanho da Lista para apareer o que tem embaixo disso
    },
    rodapeClinica: {
        alignItems: 'center',
        padding: '2%',
        color: 'rgba(112,112,112,0.47)',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#d6d7da',
    },
    rodapeClinica__texto: {

    },
    conteudoClinica: {
        marginLeft: '10%',
        marginBottom: 30,
        marginRight: '10%'
    },
    conteudoClinica__topo: {
        alignItems: 'center',
        marginTop: '10%',
        color: '#707070',
        backgroundColor: '#B2A8F1'
    },
    conteudoClinica__topoTexto: {
        color: '#FFF9F9'
    },
    conteudoClinica__corpo: {
        backgroundColor: 'rgba(220,211,216,0.5)',
        color: '#B1458A'
    },
    conteudoClinica__corpoTexto: {
        //backgroundColor: 'rgba(178,168,241,0.5)',
        color: '#9C9098'
    },
    bold: { fontWeight: 'bold' },
    italic: { fontStyle: 'italic' }
});