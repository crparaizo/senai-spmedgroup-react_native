import { createBottomTabNavigator, createAppContainer, createStackNavigator, createSwitchNavigator } from "react-navigation";
import Login from "./pages/Login/login";
import ListaClinicas from "./pages/Clinicas/listaClinicas";
import ListaConsultas from "./pages/Consultas/listaConsultas";
import ListaEspecialidades from "./pages/Especialidades/listaEspecialidades";
import ListaMedicos from "./pages/Medicos/listaMedicos";
import ListaProntuarios from "./pages/Prontuarios/listaProntuarios";
import ListaUsuarios from "./pages/Usuarios/listaUsuarios";
import EsperarAuth from "./pages/Espera/espera";
import Sair from "./pages/Sair/sair";

const AuthStack = createStackNavigator({ Login });

const Saida = createStackNavigator({ Sair });

const MainNavigator = createBottomTabNavigator(
    {
        ListaClinicas,
        ListaConsultas,
        ListaEspecialidades,
        ListaMedicos,
        ListaProntuarios,
        ListaUsuarios
    },
    {
        initialRouteName: "ListaUsuarios",
        swipeEnabled: true,
        tabBarOptions: {
            showLabel: true,
            showIcon: false,
            inactiveBackgroundColor: "black",
            activeBackgroundColor: "lightblue",
            activeTintColor: "white",
            inactiveTintColor: "white",
            //allowFontScaling: false,
            style: {
                height: 50
            },
            labelStyle: {
                fontSize: 13,
                justifyContent: 'center'
            },
            tabStyle: {
                //width: 100,
            }
        }
    }
);

const Esperar = createStackNavigator({ EsperarAuth });

const MedNavigator = createBottomTabNavigator(
    {
        ListaClinicas,
        ListaConsultas,
        ListaEspecialidades,
        ListaMedicos,
        ListaProntuarios
    }
);

const PacNavigator = createBottomTabNavigator(
    {
        ListaClinicas,
        ListaConsultas,
        ListaEspecialidades
    }
);

export default createAppContainer(
    createSwitchNavigator(
        {
            MainNavigator,
            AuthStack,
            PacNavigator,
            MedNavigator,
            Esperar,
            Saida
        },
        {
            //initialRouteName: "AuthStack"
            initialRouteName: "MainNavigator"
        }
    )
);