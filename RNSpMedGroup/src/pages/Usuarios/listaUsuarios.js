import React, { Component } from "react";
import jwtDecode from 'jwt-decode';

import {
    View,
    Text,
    FlatList,
    AsyncStorage,
    StyleSheet
} from "react-native";

import Icon from 'react-native-vector-icons/Ionicons';

// idTipoUsuarioNavigation

import api from "../../services/api";

export default class ListaUsuarios extends Component {

    static navigationOptions = {
        title: 'Usuários'
    };

    constructor(props) {
        super(props);
        this.state = {
            listaUsuarios: [],
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
                this.carregarUsuarios();
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

    carregarUsuarios = async () => {
        try {
            const userToken = this.state.token;
            const resposta = await api.get("/usuarios", {
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
            <View style={styles.mainUsuario} >
                <View style={styles.headerUsuario}>
                    <View>
                        <Text style={[styles.headerUsuario__texto, styles.bold, styles.italic]}>{"Usuários".toUpperCase()}</Text>
                        <Icon size={30} name="md-exit" style={styles.headerUsuario__icon} onPress={this.logout}></Icon>
                    </View>
                </View>

                <View style={styles.usuariosLista} >
                    <FlatList style={styles.usuariosLista__flatlist}
                        data={this.state.listaUsuarios}
                        keyExtractor={item => item.id}
                        renderItem={this.renderizaItem}
                    />
                </View>

                <View style={styles.rodapeUsuario}>
                    <Text style={[styles.rodapeUsuario__texto, styles.italic]} >SPMedicalGroup</Text>
                </View>
            </View>
        );
    }

    renderizaItem = ({ item }) => (
        <View style={styles.conteudoUsuario} >
            <View style={styles.conteudoUsuario__topo}>
                <Text style={styles.conteudoUsuario__topoTexto} >Email: {item.email}</Text>
            </View>
            <View style={styles.conteudoUsuario__corpo}>
                <Text style={styles.conteudoUsuario__corpoTexto} >Nome: {item.nome}</Text>
                <Text style={styles.conteudoUsuario__corpoTexto} >Senha: {item.senha}</Text>
                <Text style={styles.conteudoUsuario__corpoTexto} >Tipo Usuário: {item.idTipoUsuarioNavigation.nome}</Text>
            </View>
        </View>
    );
};

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
    headerUsuario: {
        flexDirection: 'row',
        height: 70,
        //flex: 1,

        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(231,107,107,0.59)'
    },
    headerUsuario__texto: {
        fontSize: 30,
        color: '#707070'
    },
    headerUsuario__icon: {

    },
    consultasLista: {
        borderTopColor: 'black',
        borderTopWidth: 1,
    },
    consultasLista__flatlist: {
        height: 500 //Diminuir tamanho da Lista para apareer o que tem embaixo disso
    },
    rodapeUsuario: {
        alignItems: 'center',
        padding: '2%',
        color: 'rgba(112,112,112,0.47)',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#d6d7da',
    },
    rodapeUsuario__texto: {

    },
    conteudoUsuario: {
        // height:, // teste
        marginLeft: '10%',
        marginBottom: 20,
        marginRight: '10%'
    },
    conteudoUsuario__topo: {
        alignItems: 'center',
        marginTop: '10%',
        backgroundColor: '#B6B6B6',
        color: '#707070'
    },
    conteudoUsuario__topoTexto: {
        color: '#CF1313'
    },
    conteudoUsuario__corpo: {
        backgroundColor: 'rgba(246,216,232,0.5)',
        color: '#B1458A'
    },
    conteudoUsuario__corpoTexto: {
        color: '#B1458A'
    },
    bold: { fontWeight: 'bold' },
    italic: { fontStyle: 'italic' }
});