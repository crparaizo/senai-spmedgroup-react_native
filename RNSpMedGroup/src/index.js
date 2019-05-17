import { createBottomTabNavigator, createAppContainer, createStackNavigator, createSwitchNavigator } from "react-navigation";
import Login from "./pages/Login/login";
import ListaClinicas from "./pages/Clinicas/listaClinicas";
import ListaConsultas from "./pages/Consultas/listaConsultas";
import ListaEspecialidades from "./pages/Especialidades/listaEspecialidades";
import ListaMedicos from "./pages/Medicos/listaMedicos";
import ListaProntuarios from "./pages/Prontuarios/listaProntuarios";
import ListaUsuarios from "./pages/Usuarios/listaUsuarios";
import Espera from "./pages/Espera/Espera";

const AuthStack = createStackNavigator({ Login});

const MainNavigator = createBottomTabNavigator(
    {
        ListaClinicas,
        ListaConsultas,
        ListaEspecialidades,
        ListaMedicos,
        ListaProntuarios,
        ListaUsuarios
        //Colocar um Navigator para cada Tipo de Usuário
    },
    {
        initialRouteName: "ListaConsultas",
        swipeEnabled: true,
        tabBarOptions: {
            showLabel: true,
            showIcon: false,
            inactiveBackgroundColor: "pink",
            activeBackgroundColor: "purple",
            activeTintColor: "blue",
            inactiveTintColor: "green",
            style: {
                height: 50
            }
        }
    }
);

const Esperar = createStackNavigator({ Espera});

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
            Esperar
        },
        {
            initialRouteName: "AuthStack"
        }
    )
);