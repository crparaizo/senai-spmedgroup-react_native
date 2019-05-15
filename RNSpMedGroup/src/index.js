import { createBottomTabNavigator, createAppContainer, createStackNavigator, createSwitchNavigator } from "react-navigation";
import Login from "./pages/Login/login";
import ListaClinicas from "./pages/Clinicas/listaClinicas";
import ListaConsultas from "./pages/Consultas/listaConsultas";
import ListaEspecialidades from "./pages/Especialidades/listaEspecialidades";
import ListaMedicos from "./pages/Medicos/listaMedicos";
import ListaProntuarios from "./pages/Prontuarios/listaProntuarios";
import ListaUsuarios from "./pages/Usuarios/listaUsuarios";

const AuthStack = createStackNavigator({ Login });

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
        initialRouteName: "ListaConsultas",
        swipeEnabled: false,
        tabBarOptions: {
            showLabel: false,
            showIcon: false,
            inactiveBackgroundColor: "none",
            activeBackgroundColor: "none",
            activeTintColor: "none",
            inactiveTintColor: "none",
            style: {
                height: 50
            }
        }
    }
);

export default createAppContainer(
    createSwitchNavigator(
        {
            MainNavigator,
            AuthStack
        },
        {
            initialRouteName: "AuthStack"
        }
    )
);