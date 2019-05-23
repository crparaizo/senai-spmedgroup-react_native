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

import moment from 'moment';

import api from "../../services/api";

export default class ListaProntuarios extends Component {

    static navigationOptions = {
        title: 'Prontuários'
    };

    constructor(props) {
        super(props);
        this.state = {
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
                this.carregarProntuarios();
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



    render() {
        return (
            // SafeAreaView
            <View >
                <View>
                    <View style={styles.headerProntuario}>
                        <Text style={[styles.headerProntuario__texto, styles.bold, styles.italic]}>{"Prontuários".toUpperCase()}</Text>
                        <Icon size={30} name="md-exit" style={styles.headerProntuario__icon} onPress={this.logout}></Icon>
                    </View>
                </View>

                <View style={styles.prontuariosLista} >
                    <FlatList style={styles.prontuariosLista__flatlist}
                        data={this.state.listaProntuarios}
                        keyExtractor={item => item.id}
                        renderItem={this.renderizaItem}
                    />
                </View>

                <View style={styles.rodapeProntuario}>
                    <Text style={[styles.rodapeProntuario__texto, styles.italic]} >SPMedicalGroup</Text>
                </View>
            </View>
        );
    }

    renderizaItem = ({ item }) => (
        <View style={styles.conteudoProntuario} >
            <View style={styles.conteudoProntuario__topo}>
                <Text style={styles.conteudoProntuario__topoTexto} >CPF: {item.cpf}</Text>
            </View>
            <View style={styles.conteudoProntuario__corpo}>
                <Text style={styles.conteudoProntuario__corpo} >Paciente: {item.idUsuarioNavigation.nome}</Text>
                <Text style={styles.conteudoProntuario__corpo} >RG: {item.rg}</Text>
                <Text style={styles.conteudoProntuario__corpo}>Data Nascimento: {moment(item.dataNascimento).format("DD/MM/YYYY")}</Text>
                <Text style={styles.conteudoProntuario__corpo} >Telefone: {item.telefone}</Text>
                <Text style={styles.conteudoProntuario__corpo}>Endereço: {item.endereco}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        //height: '100%'
    },
    headerProntuario: {
        flexDirection: 'row',
        height: 70,

        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#A8E0F1'
    },
    headerProntuario__texto: {
        fontSize: 30,
        color: '#707070'
    },
    headerProntuario__icon: {

    },
    prontuariosLista: {
        borderTopColor: 'black',
        borderTopWidth: 1,
    },
    prontuariosLista__flatlist: {
        height: 500 //Diminuir tamanho da Lista para apareer o que tem embaixo disso
    },
    rodapeProntuario: {
        alignItems: 'center',
        padding: '2%',
        color: 'rgba(112,112,112,0.47)',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#d6d7da',
    },
    rodapeProntuario__texto: {

    },
    conteudoProntuario: {
        marginLeft: '10%',
        marginBottom: 20,
        marginRight: '10%'
    },
    conteudoProntuario__topo: {
        alignItems: 'center',
        marginTop: '10%',
        backgroundColor: '#A8E0F1',
        color: '#707070'
    },
    conteudoProntuario__topoTexto: {
        color: '#FFF9F9'
    },
    conteudoProntuario__corpo: {
        backgroundColor: 'rgba(220,211,216,0.5)',
        color: 'rgba(112,112,112,0.6)'
    },
    conteudoProntuario__corpoTexto: {
        color: '#9C9098'
    },
    bold: { fontWeight: 'bold' },
    italic: { fontStyle: 'italic' }
});