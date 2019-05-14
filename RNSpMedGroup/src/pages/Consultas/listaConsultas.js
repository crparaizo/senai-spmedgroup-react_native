import React, { Component } from "react";

import {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
} from "react-native";

export default class ListaConsultas extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listaConsultas: []
        };
    }

    componentDidMount() {
        // realizar a chamada a api
        // emulator -list-avds
        // emulator -avd nomeAVD
        this.carregarConsultas();
    }

    carregarConsultas = async () => {
        const resposta = await api.get("/consultas");
        const dadosDaApi = resposta.data;
        this.setState({ listaConsultas: dadosDaApi });
    };

    render() {
        return (
            // SafeAreaView
            <View >
                <View>
                    <View>
                        <Text>{"Consultas".toUpperCase()}</Text>
                    </View>
                    <View />
                </View>

                <View >
                    <FlatList
                        data={this.state.listaConsultas}
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
                <Text >IdProjeto: {item.idProntuario}</Text>
                <Text >Titulo: {item.idMedico}</Text>
                <Text > Tema: {item.dataHoraConsulta}</Text>
                <Text >Descrição: {item.idSituacao}</Text>
                <Text >IdUsuario: {item.descricao}</Text>
            </View>
        </View>
    );

};