import React, { Component } from "react";

import {
    StyleSheet,
    View,
    Text,
    Image,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    AsyncStorage,
    SafeAreaView
} from "react-native";

import api from "../../services/api";

class Login extends Component {
    static navigationOptions = {
        header: null
        //tabBarVisible: false
    };

    constructor(props) {
        super(props);
        this.state = { email: "", senha: "" };
    }

    _realizarLogin = async () => {
        // console.warn(this.state.email + this.state.senha);

        const resposta = await api.post("/login", {
            email: this.state.email,
            senha: this.state.senha
        });

        const token = resposta.data.token;
        await AsyncStorage.setItem("userToken", token);
        this.props.navigation.navigate("Esperar");
    };

    render() {
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <View
                    style={StyleSheet.absoluteFillObject}
                >
                    <View style={styles.formularioLogin} >
                        <Image style={styles.formularioLogin__imagem}
                            source={require("../../assets/img/icon-login-with-letters.png")}
                        />
                        <TextInput
                            style={[styles.formularioLogin__input, styles.italic]}
                            placeholder="Email"
                            TextInput="#A09891"
                            underlineColorAndroid="#7DAD8C"
                            // fontFamily='Segoe UI'
                            onChangeText={email => this.setState({ email })}
                        />

                        <TextInput
                            style={[styles.formularioLogin__input, styles.italic]}
                            placeholder="Senha"
                            TextInput="#A09891"
                            password="true"
                            underlineColorAndroid="#7DAD8C"
                            secureTextEntry={true}
                            onChangeText={senha => this.setState({ senha })}
                        />

                        <TouchableOpacity
                            style={styles.formularioLogin__botao}
                            onPress={this._realizarLogin}
                        >
                            <Text style={styles.formularioLogin__texto} >Login</Text>
                        </TouchableOpacity>
                        <View style={styles.rodapeLogin}>
                            <Text style={[styles.rodapeLogin__texto, styles.italic]} >SPMedicalGroup</Text>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    // overlay: {
    //     ...StyleSheet.absoluteFillObject,
    //     backgroundColor: 'rgba(234,202,169,0.45)',
    //     color:'rgba(234,202,169,0.45)'
    // },
    safeAreaView:{
        flex: 1, 
        backgroundColor: 'rgba(234,202,169,0.45)' 
    },
    formularioLogin:{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },
    formularioLogin__imagem: {
        width: 150,
        height: 150,
        marginTop: "10%",
        marginBottom: "10%",
        resizeMode: "contain"
    },
    formularioLogin__input: {
        fontSize: 20,
        marginBottom: '7%',
        width: 350
        //textAlign: 'center'

    },
    formularioLogin__botao: {
        width: 150,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        marginTop:"5%",
        marginBottom: "20%",
        backgroundColor: 'rgba(120,128,159,0.28)'
    },
    formularioLogin__texto: {
        textAlign: "center",
        fontSize: 28
    },
    rodapeLogin: {
    },
    rodapeLogin__texto: {
        marginTop: "10%",
        textAlign: "center",
        fontSize: 18,
        color: 'rgba(112,112,112,0.47)'
    },
    bold: { fontWeight: 'bold' },
    italic: { fontStyle: 'italic' }
});

export default Login;