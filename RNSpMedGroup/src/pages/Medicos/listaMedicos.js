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

import api from "../../services/api";


import Icon from 'react-native-vector-icons/Ionicons';


export default class ListaMedicos extends Component {

    static navigationOptions = {
        title: 'Médicos'
    };

    constructor(props) {
        super(props);
        this.state = {
            listaMedicos: [],
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
                // Alert.alert(this.state.tipoMedico)
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

    

    render() {
        return (
            // SafeAreaView
            <View >
                <View>
                    <View style={styles.headerMedico}>
                        <Text style={[styles.headerMedico__texto, styles.bold, styles.italic]}>{"Médicos".toUpperCase()}</Text>
                        <Icon size={30} name="md-exit" style={styles.headerMedico__icon} onPress={this.logout}></Icon>
                    </View>
                </View>

                <View style={styles.medicosLista} >
                    <FlatList style={styles.medicosLista__flatlist}
                        data={this.state.listaMedicos}
                        keyExtractor={item => item.id}
                        renderItem={this.renderizaItem}
                    />
                </View>

                <View style={styles.rodapeMedico}>
                    <Text style={[styles.rodapeMedico__texto, styles.italic]} >SPMedicalGroup</Text>
                </View>
            </View>
        );
    }

    renderizaItem = ({ item }) => (
        <View style={styles.conteudoMedico} >
            <View style={styles.conteudoMedico__topo}>
                <Text style={styles.conteudoMedico__topoTexto} >CRM: {item.crm}</Text>
            </View>
            <View style={styles.conteudoMedico__corpo}>
                <Text style={styles.conteudoMedico__corpo} >Médico: {item.idUsuarioNavigation.nome}</Text>
                <Text style={styles.conteudoMedico__corpo} >Especialidade: {item.idEspecialidadeNavigation.nome}</Text>
                <Text style={styles.conteudoMedico__corpo} >Clínica: {item.idClinicaNavigation.nomeFantasia}</Text>
                <Text style={styles.conteudoMedico__corpo}>Descrição: {item.descricao}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        //height: '100%'
    },
    headerMedico: {
        flexDirection: 'row',
        height: 70,

        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#A8F1C3'
    },
    headerMedico__texto: {
        fontSize: 30,
        color: '#707070'
    },
    headerMedico__icon: {

    },
    medicosLista: {
        borderTopColor: 'black',
        borderTopWidth: 1,
    },
    medicosLista__flatlist: {
        height: 500 //Diminuir tamanho da Lista para apareer o que tem embaixo disso
    },
    rodapeMedico: {
        alignItems: 'center',
        padding: '2%',
        color: 'rgba(112,112,112,0.47)',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#d6d7da',
    },
    rodapeMedico__texto: {

    },
    conteudoMedico: {
        marginLeft: '10%',
        marginBottom: 20,
        marginRight: '10%'
    },
    conteudoMedico__topo: {
        alignItems: 'center',
        marginTop: '10%',
        backgroundColor: '#A8F1C3',
        color: '#707070'
    },
    conteudoMedico__topoTexto: {
        color: '#707070'
    },
    conteudoMedico__corpo: {
        backgroundColor: 'rgba(220,211,216,0.5)',
        color: 'rgba(112,112,112,0.6)'
    },
    conteudoMedico__corpoTexto: {
        color: '#9C9098'
    },
    bold: { fontWeight: 'bold' },
    italic: { fontStyle: 'italic' }
});