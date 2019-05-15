import React, { Component } from "react";

import {
    StyleSheet,
    View,
    Text,
    Image,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    AsyncStorage
} from "react-native";

import Api from "../../services/Api";

class Login extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = { email: "", senha: "" };
    }

    _realizarLogin = async () => {
        // console.warn(this.state.email + this.state.senha);

        const resposta = await Api.post("/login", {
            email: this.state.email,
            senha: this.state.senha
        });

        const token = resposta.data.token;
        await AsyncStorage.setItem("userToken", token);
        this.props.navigation.navigate("MainNavigator");

    };

    render() {
        return (
            <ImageBackground
                // source={require("../../assets/img/ion-login.png")}
                style={StyleSheet.absoluteFillObject}
            >
                <View >
                    {/* <Image style={{ width: 150, height: 150, marginLeft: "30%", marginTop: "10%", marginBottom: "10%" }}
                        source={require("../../assets/img/icon-login.png")}
                    /> */}
                    <Text style={{ textAlign: "center", fontSize: 35 }} >LOGIN</Text>
                    <TextInput
                        placeholder="email"
                        TextInput="black"
                        underlineColorAndroid="black"
                        onChangeText={email => this.setState({ email })}
                    />

                    <TextInput
                        placeholder="senha"
                        TextInput="#blue"
                        password="true"
                        underlineColorAndroid="blue"
                        onChangeText={senha => this.setState({ senha })}
                    />
                    <TouchableOpacity
                        onPress={this._realizarLogin}
                    >
                        <Text style={{ textAlign: "center", fontSize: 35 }}>Logar</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        );
    }
}

export default Login;