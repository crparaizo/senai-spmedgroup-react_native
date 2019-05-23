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
                // Alert.alert(this.state.tipoEspecialidade)
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
                    <View style={styles.headerEspecialidade}>
                        <Text style={[styles.headerEspecialidade__texto, styles.bold, styles.italic]}>{"Especialidades".toUpperCase()}</Text>
                        <Icon size={30} name="md-exit" style={styles.headerEspecialidade__icon} onPress={this.logout}></Icon>
                    </View>
                </View>

                <View style={styles.especialidadesLista} >
                    <FlatList style={styles.especialidadesLista__flatlist}
                        data={this.state.listaEspecialidades}
                        keyExtractor={item => item.id}
                        renderItem={this.renderizaItem}
                    />
                </View>

                <View style={styles.rodapeEspecialidade}>
                    <Text style={[styles.rodapeEspecialidade__texto, styles.italic]} >SPMedicalGroup</Text>
                </View>
            </View>
        );
    }

    renderizaItem = ({ item }) => (
        <View style={styles.conteudoEspecialidade} >
            <View style={styles.conteudoEspecialidade__topo}>
                <Text style={styles.conteudoEspecialidade__topoTexto} >Nome: {item.nome}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        //height: '100%'
    },
    headerEspecialidade: {
        flexDirection: 'row',
        height: 70,

        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#F1A8E8'
    },
    headerEspecialidade__texto: {
        fontSize: 30,
        color: '#707070'
    },
    headerEspecialidade__icon: {

    },
    especialidadesLista: {
        borderTopColor: 'black',
        borderTopWidth: 1,
    },
    especialidadesLista__flatlist: {
        height: 500 //Diminuir tamanho da Lista para apareer o que tem embaixo disso
    },
    rodapeEspecialidade: {
        alignItems: 'center',
        padding: '2%',
        color: 'rgba(112,112,112,0.47)',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#d6d7da',
    },
    rodapeEspecialidade__texto: {

    },
    conteudoEspecialidade: {
        marginLeft: '10%',
        marginBottom: 20,
        marginRight: '10%'
    },
    conteudoEspecialidade__topo: {
        alignItems: 'center',
        marginTop: '10%',
        backgroundColor: 'rgba(241,168,232,0.5)',
    },
    conteudoEspecialidade__topoTexto: {
        color: '#707070'
    },
    bold: { fontWeight: 'bold' },
    italic: { fontStyle: 'italic' }
});